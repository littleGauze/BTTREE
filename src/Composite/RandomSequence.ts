import { BTComposite } from "@/Base/BTComposite"
import { NodeStatus } from "@/Common/Enum"

export class RandomSequence extends BTComposite {
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
    return !!this.executionOrder.length && this.status !== NodeStatus.Failed
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    switch (status) {
      case NodeStatus.Failed:
        this.status = NodeStatus.Failed
        break
      case NodeStatus.Success:
        this.executionOrder.pop()
        if (!this.executionOrder.length) {
          this.status = NodeStatus.Success
        } else {
          this.status = NodeStatus.Running
        }
        break
      case NodeStatus.Running:
        this.status = NodeStatus.Running
      default:
        break
    }
    return this.status
  }
}