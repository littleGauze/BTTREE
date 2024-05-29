import { BTComposite } from "@/Base/BTComposite"
import { NodeStatus } from "@/Common/Enum"

export class RandomSelector extends BTComposite {
  executionOrder: number[] = []

  get index(): number {
    return this.executionOrder[this.executionOrder.length - 1]
  }

  onStart(): void {
    super.onStart()
    this.shuffle()
  }

  shuffle() {
    const length = this.children.length
    this.executionOrder = Array.from({ length }, (_: any, i: number) => i)
    for (let i = 0 ; i < length ; i++) {
      const j = Math.floor(Math.random() * length)
      const temp = this.executionOrder[i]
      this.executionOrder[i] = this.executionOrder[j]
      this.executionOrder[j] = temp
    }
  }

  canExecute(): boolean {
    return !!this.executionOrder.length && this.status !== NodeStatus.Success
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    switch (status) {
      case NodeStatus.Success:
        this.status = NodeStatus.Success
        break
      case NodeStatus.Failed:
        this.executionOrder.pop()
        if (!this.executionOrder.length) {
          this.status = NodeStatus.Failed
        } else {
          this.status = NodeStatus.Running
        }
        break
      case NodeStatus.Running:
        this.status = NodeStatus.Running
      default:
        break
    }
    return status
  }

  onConditionAbort(index: number): void {
    this.status = NodeStatus.Inactive
    this.shuffle()
  }
}