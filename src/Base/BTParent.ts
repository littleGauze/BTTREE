import { NodeStatus } from "@/Common/Enum"
import { BTNode } from "./BTNode"

export abstract class BTParent extends BTNode {
  children: BTNode[] = []

  private _index: number = 0

  constructor(nodes: BTNode[]) {
    super()
    this.children.push(...nodes)
  }

  get index() {
    return this._index
  }
  
  set index(value: number) {
    this._index = value
  }

  get canRunParallel() {
    return false
  }


  abstract canExecute(): boolean
  abstract onChildExecuted(status: NodeStatus, index?: number): NodeStatus

  onConditionAbort(index: number) {}

  onChildStarted() {}
}