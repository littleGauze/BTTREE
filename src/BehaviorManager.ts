import { BTComposite } from "./Base/BTComposite";
import { BTCondition } from "./Base/BTCondition";
import { BTNode } from "./Base/BTNode";
import { BTParent } from "./Base/BTParent";
import { BTTree } from "./Base/BTTree";
import { NodeStatus } from "./Common/Enum";
import { MyTree } from "./MyTree";

export default class BehaviorManager {
  restartWhenComplete: boolean = false;

  tree: BTTree | null = null;

  nodeList: Array<BTNode> = [];
  activeStack: Array<number> = [];
  parentIndex: Array<number> = [];
  childrenIndex: Array<Array<number>> = [];

  relativeChildIndex: Array<number> = [];
  parentCompositeIndex: Array<number> = [];
  childConditionIndex: Array<Array<number>> = [];

  start() {
    this.enableBehavior();
  }

  restart() {
    this.pushNode(0);
  }

  enableBehavior() {
    this.tree = new MyTree();
    this.parentIndex.push(-1);
    this.relativeChildIndex.push(-1);
    this.parentCompositeIndex.push(-1);
    this.addToNodeList(this.tree.root!, { parentCompositeInndex: -1 });
    this.pushNode(0);
  }

  addToNodeList(node: BTNode, data: { parentCompositeInndex: number }) {
    this.nodeList.push(node);
    const index = this.nodeList.length - 1;
    if (node instanceof BTParent) {
      this.childrenIndex.push([]);
      this.childConditionIndex.push([]);
      for (let i = 0; i < node.children.length; i++) {
        this.parentIndex.push(index);
        this.relativeChildIndex.push(i);
        this.childrenIndex[index].push(this.nodeList.length);
        if (node instanceof BTComposite) {
          data.parentCompositeInndex = index;
        }
        this.parentCompositeIndex.push(data.parentCompositeInndex);
        this.addToNodeList(node.children[i], data);
      }
    } else {
      this.childrenIndex.push([]);
      this.childConditionIndex.push([]);
      if (node instanceof BTCondition) {
        const parentCompositeIndex = this.parentCompositeIndex[index];
        if (parentCompositeIndex !== -1) {
          this.childConditionIndex[parentCompositeIndex].push(index);
        }
      }
    }
  }

  tick() {
    let prevIndex = -1;
    let prevStatus = NodeStatus.Inactive;
    while (this.activeStack.length) {
      const curIndex = this.activeStack[this.activeStack.length - 1];
      if (prevIndex === curIndex) break;
      prevIndex = curIndex;
      prevStatus = this.runNode(curIndex, prevStatus);
    }
  }

  runNode(index: number, prevStatus: NodeStatus) {
    this.pushNode(index);
    const node = this.nodeList[index];
    let status = prevStatus;
    if (node instanceof BTParent) {
      status = this.runParentNode(index, status);
    } else {
      status = node.onUpdate();
    }

    if (status !== NodeStatus.Running) {
      status = this.popNode(index, status);
    }

    return status;
  }

  runParentNode(index: number, status: NodeStatus): NodeStatus {
    const node = this.nodeList[index] as BTParent;
    let childStatus = NodeStatus.Inactive;
    while (node.canExecute() && childStatus !== NodeStatus.Running) {
      childStatus = status = this.runNode(
        this.childrenIndex[index][node.index],
        status
      );
    }
    return status;
  }

  pushNode(index: number) {
    if (
      this.activeStack.length === 0 ||
      this.activeStack[this.activeStack.length - 1] !== index
    ) {
      this.activeStack.push(index);
      const node = this.nodeList[index];
      node.onStart();
      // console.log('Push node', node)
    }
  }

  popNode(index: number, status: NodeStatus) {
    this.activeStack.pop();
    const node = this.nodeList[index];
    node.onEnd();
    // console.log('Pop node', node)

    const parentIndex = this.parentIndex[index];
    if (parentIndex !== -1) {
      const parentNode = this.nodeList[parentIndex] as BTParent;
      status = parentNode.onChildExecuted(status);
    }

    if (!this.activeStack.length && this.restartWhenComplete) {
      this.restart();
    }

    return status;
  }
}
