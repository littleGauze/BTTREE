import { BTNode } from "./Base/BTNode"
import { BTParent } from "./Base/BTParent"
import { BTTree } from "./Base/BTTree"
import { NodeStatus } from "./Common/Enum"
import { MyTree } from "./MyTree"

export default class BehaviorManager {
  restartWhenComplete: boolean = true

  tree: BTTree | null = null

  nodeList: Array<BTNode> = []
  activeStack: Array<number> = []
  parentIndex: Array<number> = []
  childrenIndex: Array<Array<number>> = []

  start() {
    this.enableBehavior()
  }

  restart() {
    this.pushNode(0)
  }

  enableBehavior() {
    this.tree = new MyTree()
    this.parentIndex.push(-1)
    this.addToNodeList(this.tree.root!)
    this.pushNode(0)
  }

  addToNodeList(node: BTNode) {
    this.nodeList.push(node)
    const index = this.nodeList.length - 1
    if (node instanceof BTParent) {
      this.childrenIndex.push([])
      for (let i = 0; i < node.children.length; i++) {
        this.parentIndex.push(index)
        this.childrenIndex[index].push(this.nodeList.length)
        this.addToNodeList(node.children[i])
      }
    } else {
      this.childrenIndex.push([])
    }
  }

  tick() {
    let prevIndex = -1
    let prevStatus = NodeStatus.Inactive
    while (this.activeStack.length) {
      const curIndex = this.activeStack[this.activeStack.length - 1]
      if (prevIndex === curIndex) break
      prevIndex = curIndex
      prevStatus = this.runNode(curIndex, prevStatus)
    }
  }

  runNode(index: number, prevStatus: NodeStatus) {
    this.pushNode(index)
    const node = this.nodeList[index]
    let status = prevStatus
    if (node instanceof BTParent) {
      status = this.runParentNode(index, status)
    } else {
      status = node.onUpdate()
    }

    if (status !== NodeStatus.Running) {
      this.popNode(index, status)
    }

    return status
  }

  runParentNode(index: number, status: NodeStatus): NodeStatus {
    const node = this.nodeList[index] as BTParent
    let childStatus = NodeStatus.Inactive
    while (node.canExecute() && childStatus !== NodeStatus.Running) {
      childStatus = status = this.runNode(this.childrenIndex[index][node.index], status)
    }
    return status
  }

  pushNode(index: number) {
    if (this.activeStack.length === 0 || this.activeStack[this.activeStack.length - 1] !== index) {
      this.activeStack.push(index)
      const node = this.nodeList[index]
      node.onStart()
      // console.log('push node', node)
    }
  }

  popNode(index: number, status: NodeStatus) {
    this.activeStack.pop()
    const node = this.nodeList[index]
    node.onEnd()
    // console.log('pop node', node)

    const parentIndex = this.parentIndex[index]
    if (parentIndex !== -1) {
      const parentNode = this.nodeList[parentIndex] as BTParent
      status = parentNode.onChildExecuted(status)
    }

    if (!this.activeStack.length && this.restartWhenComplete) {
      this.restart()
    }

    return status
  }

}