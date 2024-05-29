import { BTComposite } from "@/Base/BTComposite"
import { NodeStatus } from "@/Common/Enum"

export class Parallel extends BTComposite {

  executionStatus: Array<NodeStatus> = []

  get status() {
    let isComplete = true
    for (const status of this.executionStatus) {
      if (status === NodeStatus.Failed) return NodeStatus.Failed
      else if (status === NodeStatus.Running) {
        isComplete = false
      }
    }
    return isComplete ? NodeStatus.Success : NodeStatus.Running
  }

  set status(value: NodeStatus) {}

  onStart(): void {
    super.onStart()
    this.index = 0
    this.executionStatus = new Array(this.children.length).fill(NodeStatus.Inactive)
  }

  canExecute(): boolean {
    return this.index < this.children.length && this.status !== NodeStatus.Failed
  }

  get canRunParallel() {
    return true
  }

  onChildStarted() {
    this.executionStatus[this.index] = NodeStatus.Running
    this.index++
  }

  onChildExecuted(status: NodeStatus, index: number): NodeStatus {
    this.executionStatus[index] = status
    return status
  }

  onConditionAbort(index: number): void {
      this.index = 0
      this.executionStatus.fill(NodeStatus.Inactive)
  }

  // onUpdate(): NodeStatus {
  //   if (this.status === NodeStatus.Failed) return NodeStatus.Failed
  //   if (this.index >= this.children.length) {
  //     this.status = NodeStatus.Success
  //     return NodeStatus.Success
  //   }

  //   const child = this.children[this.index]
  //   const ret = child.run()
  //   if (ret === NodeStatus.Failed) {
  //     this.status = NodeStatus.Failed
  //     return NodeStatus.Failed
  //   }

  //   if (ret === NodeStatus.Success) {
  //     this.index += 1
  //   }

  //   return NodeStatus.Running
  // }
}