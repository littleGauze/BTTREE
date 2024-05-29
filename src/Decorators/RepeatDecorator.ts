import { BTDecorator } from "@/Base/BTDecorator"
import { BTNode } from "@/Base/BTNode"
import { NodeStatus } from "@/Common/Enum"

export class RepeatDecorator extends BTDecorator {
  private repeatCount: number = Infinity
  private curCount: number = 0
  private endOnFailure: boolean = false

  constructor(childrens: BTNode[], repeatCount = Infinity, endOnFailure = false) {
    super(childrens)
    this.repeatCount = repeatCount
    this.endOnFailure = endOnFailure
  }

  onStart(): void {
      super.onStart()
      this.curCount = 0
  }

  canExecute(): boolean {
    return this.curCount < this.repeatCount && (!this.endOnFailure || (this.endOnFailure && this.status!== NodeStatus.Failed))
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    this.curCount += 1
    return this.decorate(status)
  }

  decorate(status: NodeStatus): NodeStatus {
    this.status = status
    return status
  }
}