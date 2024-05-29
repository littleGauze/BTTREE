import { BTComposite } from "./Base/BTComposite"
import { BTCondition } from "./Base/BTCondition"
import { BTNode } from "./Base/BTNode"
import { BTParent } from "./Base/BTParent"
import { BTTree } from "./Base/BTTree"
import { AbortType, NodeStatus } from "./Common/Enum"
import { MyTree } from "./MyTree"

export default class BehaviorManager {
  restartWhenComplete: boolean = false

  tree: BTTree | null = null

  nodeList: Array<BTNode> = []
  activeStack: Array<Array<number>> = []
  parentIndex: Array<number> = []
  childrenIndex: Array<Array<number>> = []

  relativeChildIndex: Array<number> = []
  parentCompositeIndex: Array<number> = []
  childConditionIndex: Array<Array<number>> = []

  conditionReevaluate: Array<ConditionReevaluate> = []
  conditionReevaluateMap: Map<number, ConditionReevaluate> = new Map()

  start() {
    this.enableBehavior()
  }

  restart() {
    console.log('Restart behavior')
    this.removeChildConditionReevaluate(-1)
    this.pushNode(0, 0)
  }

  enableBehavior() {
    this.tree = new MyTree()
    this.activeStack.push([])
    this.parentIndex.push(-1)
    this.relativeChildIndex.push(-1)
    this.parentCompositeIndex.push(-1)
    this.addToNodeList(this.tree.root!, { parentCompositeInndex: -1 })
    this.pushNode(0, 0)
  }

  addToNodeList(node: BTNode, data: { parentCompositeInndex: number }) {
    this.nodeList.push(node)
    const index = this.nodeList.length - 1
    if (node instanceof BTParent) {
      this.childrenIndex.push([])
      this.childConditionIndex.push([])
      for (let i = 0; i < node.children.length; i++) {
        this.parentIndex.push(index)
        this.relativeChildIndex.push(i)
        this.childrenIndex[index].push(this.nodeList.length)
        if (node instanceof BTComposite) {
          data.parentCompositeInndex = index
        }
        this.parentCompositeIndex.push(data.parentCompositeInndex)
        this.addToNodeList(node.children[i], data)
      }
    } else {
      this.childrenIndex.push([])
      this.childConditionIndex.push([])
      if (node instanceof BTCondition) {
        const parentCompositeIndex = this.parentCompositeIndex[index]
        if (parentCompositeIndex !== -1) {
          this.childConditionIndex[parentCompositeIndex].push(index)
        }
      }
    }
  }

  tick() {
    this.reevaluateConditionNode()
    for (let i = this.activeStack.length - 1; i >= 0; i--) {
      let prevIndex = -1
      let prevStatus = NodeStatus.Inactive
      const stack = this.activeStack[i]
      while (prevStatus !== NodeStatus.Running && i < this.activeStack.length && stack.length) {
        const curIndex = stack[stack.length - 1]
        if (prevIndex === curIndex) break
        prevIndex = curIndex
        prevStatus = this.runNode(curIndex, prevStatus, i)
      }
    }
  }

  runNode(index: number, prevStatus: NodeStatus, stackIndex: number) {
    this.pushNode(index, stackIndex)
    const node = this.nodeList[index]
    let status = prevStatus
    if (node instanceof BTParent) {
      status = this.runParentNode(index, status, stackIndex)
      if (node.canRunParallel) {
        status = node.status
      }
    } else {
      status = node.onUpdate()
    }

    if (status !== NodeStatus.Running) {
      status = this.popNode(index, status, stackIndex)
    }

    return status
  }

  runParentNode(index: number, status: NodeStatus, stackIndex: number): NodeStatus {
    const node = this.nodeList[index] as BTParent

    if (!node.canRunParallel || node.status !== NodeStatus.Running) {
      let childStatus = NodeStatus.Inactive
      while (node.canExecute() && (childStatus !== NodeStatus.Running || node.canRunParallel)) {
        const childIndex = node.index
        if (node.canRunParallel) {
          this.activeStack.push([])
          stackIndex = this.activeStack.length - 1
          node.onChildStarted()
        }

        childStatus = status = this.runNode(
          this.childrenIndex[index][childIndex],
          status,
          stackIndex
        )
      }
    }

    return status
  }

  pushNode(index: number, stackIndex: number) {
    const stack = this.activeStack[stackIndex]
    if (
      stack.length === 0 ||
      stack[stack.length - 1] !== index
    ) {
      stack.push(index)
      const node = this.nodeList[index]
      node.onStart()
      // console.log('Push node', node)
    }
  }

  popNode(index: number, status: NodeStatus, stackIndex: number, popChildren = true) {
    const stack = this.activeStack[stackIndex]
    stack.pop()
    const node = this.nodeList[index]
    node.onEnd()
    // console.log('Pop node', node)

    const parentIndex = this.parentIndex[index]
    if (parentIndex !== -1) {
      if (node instanceof BTCondition) {
        const parentCompositeIndex = this.parentCompositeIndex[index]
        if (parentCompositeIndex !== -1) {
          const compositeNode = this.nodeList[parentCompositeIndex] as BTComposite
          if (compositeNode.abortType !== AbortType.None) {
            if (this.conditionReevaluateMap.has(index)) {
              const conditionReevaluate = this.conditionReevaluateMap.get(index)!
              conditionReevaluate.compositeIndex = -1
              conditionReevaluate.status = status
            } else {
              const conditionReevaluate = new ConditionReevaluate(index, status, compositeNode.abortType === AbortType.LowerPriority ? -1 : parentCompositeIndex)
              this.conditionReevaluate.push(conditionReevaluate)
              this.conditionReevaluateMap.set(index, conditionReevaluate)
              console.log('Add condition reevaluate', conditionReevaluate)
            }
          }
        }
      }

      const parentNode = this.nodeList[parentIndex] as BTParent
      status = parentNode.onChildExecuted(status, this.relativeChildIndex[index])
    }

    if (node instanceof BTComposite) {
      if (node.abortType === AbortType.Self || node.abortType === AbortType.None || !stack.length) {
        this.removeChildConditionReevaluate(index)
      } else if (node.abortType === AbortType.LowerPriority || node.abortType === AbortType.Both) {
        for (let i = 0; i < this.childrenIndex[index].length; i++) {
          const childConditionIndex = this.childrenIndex[index][i]
          if (this.conditionReevaluateMap.has(childConditionIndex)) {
            const conditionReevaluate = this.conditionReevaluateMap.get(childConditionIndex)!
            conditionReevaluate.compositeIndex = this.parentCompositeIndex[index]
          }
        }

        for (let i = 0; i < this.conditionReevaluate.length; i++) {
          if (this.conditionReevaluate[i].compositeIndex === index) {
            this.conditionReevaluate[i].compositeIndex = this.parentCompositeIndex[index]
          }
        }
      }
    }

    if (popChildren) {
      for (let i = this.activeStack.length - 1; i > stackIndex; i--) {
        const childStack = this.activeStack[i]
        if (childStack.length >= 0 && this.isParentNode(index, childStack[childStack.length - 1])) {
          for (let j = childStack.length - 1; j >= 0; j--) {
            this.popNode(childStack[j], NodeStatus.Failed, i, false)
          }
        }
      }
    }

    if (stack.length === 0) {
      if (stackIndex === 0) {
        if (this.restartWhenComplete) {
          this.restart()
        }
      } else {
        this.activeStack.splice(stackIndex, 1)
      }
    }

    return status
  }

  reevaluateConditionNode() {
    for (let i = this.conditionReevaluate.length - 1; i >= 0; i--) {
      const { index, status: prevStatus, compositeIndex } = this.conditionReevaluate[i]
      if (compositeIndex === -1) continue
      const status = this.nodeList[index].onUpdate()
      if (status === prevStatus) continue

      for (let j = this.activeStack.length - 1; j >= 0; j--) {
        const stack = this.activeStack[j]
        let curNodeIndex = stack[stack.length - 1]
        const commonParentIndex = this.findCommonParentIndex(curNodeIndex, index)

        // Remove the node between the common parent and the current node
        if (this.isParentNode(compositeIndex, commonParentIndex)) {
          const stackLen = this.activeStack.length
          while (curNodeIndex !== -1 && commonParentIndex !== curNodeIndex && stackLen === this.activeStack.length) {
            this.popNode(curNodeIndex, NodeStatus.Failed, j, false)
            curNodeIndex = this.parentIndex[curNodeIndex]
          }
        }
      }

      // Remove the right reevaluate condition of current node
      for (let j = this.conditionReevaluate.length - 1; j >= i; j--) {
        const conditionReevaluate = this.conditionReevaluate[j]
        if (this.isParentNode(compositeIndex, conditionReevaluate.index)) {
          this.conditionReevaluateMap.delete(conditionReevaluate.index)
          this.conditionReevaluate.splice(j, 1)
        }
      }

      // Stop the condition evaluate execution that has the same parent composite withe current node
      const compositeNode = this.nodeList[this.parentCompositeIndex[index]] as BTComposite
      for (let j = i - 1; j >= 0; j--) {
        const conditionReevaluate = this.conditionReevaluate[j]
        if (this.parentCompositeIndex[conditionReevaluate.index] === this.parentCompositeIndex[index]) {
          if (compositeNode.abortType === AbortType.LowerPriority) {
            conditionReevaluate.compositeIndex = -1
          }
        }
      }

      // Collect all parent index of the current node to common parent
      const conditionParentIndex = []
      for (let j = this.parentIndex[index]; j !== compositeIndex; j = this.parentIndex[j]) {
        conditionParentIndex.push(j)
      }
      conditionParentIndex.push(compositeIndex)

      // Execute the onConditionAbort function of these parent nodes
      for (let j = conditionParentIndex.length - 1; j >= 0; j--) {
        const node = this.nodeList[conditionParentIndex[j]] as BTParent
        if (j === 0) {
          node.onConditionAbort(index)
        } else {
          node.onConditionAbort(this.relativeChildIndex[conditionParentIndex[j - 1]])
        }
      }
    }
  }

  removeChildConditionReevaluate(index: number) {
    for (let i = this.conditionReevaluate.length - 1; i >= 0; i--) {
      const conditionReevaluate = this.conditionReevaluate[i]
      if (conditionReevaluate.compositeIndex === index) {
        this.conditionReevaluateMap.delete(conditionReevaluate.index)
        this.conditionReevaluate.splice(i, 1)
        console.log('Remove condition reevaluate', conditionReevaluate)
      }
    }
  }

  findCommonParentIndex(index1: number, index2: number) {
    const set = new Set()
    let num = index1
    while (num !== -1) {
      set.add(num)
      num = this.parentIndex[num]
    }

    num = index2
    while (!set.has(num)) {
      num = this.parentIndex[num]
    }

    return num
  }

  isParentNode(parentIndex: number, childIndex: number) {
    for (let i = childIndex; i !== -1; i = this.parentIndex[i]) {
      if (i === parentIndex) return true
    }
    return false
  }
}

class ConditionReevaluate {
  constructor(public index: number, public status: NodeStatus, public compositeIndex: number) { }
}