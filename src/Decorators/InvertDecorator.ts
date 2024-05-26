import { BTDecorator } from "@/Base/BTDecorator"
import { NodeStatus } from "@/Common/Enum"

export class InvertDecorator extends BTDecorator {
  canExecute(): boolean {
    return this.status == NodeStatus.Inactive || this.status == NodeStatus.Running
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    return this.decorate(status)
  }

  decorate(status: NodeStatus): NodeStatus {
    if (status === NodeStatus.Success) {
      this.status = NodeStatus.Failed
      return this.status
    } else if (status === NodeStatus.Failed) {
      this.status = NodeStatus.Success
      return this.status
    } else {
      return status
    }
  }
}