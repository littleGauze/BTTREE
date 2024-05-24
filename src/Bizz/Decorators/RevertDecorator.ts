import { BTDecorator } from "@/Base/BTDecorator"
import { NodeStatus } from "@/Common/Enum"

export class RevertDecorator extends BTDecorator {
  canExecute(): boolean {
    return true
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    return this.decorate(status)
  }

  decorate(status: NodeStatus): NodeStatus {
    if (status === NodeStatus.Success) return NodeStatus.Failed
    if (status === NodeStatus.Failed) return NodeStatus.Success
    return status
  }
}