import { BTComposite } from "@/Base/BTComposite"
import { NodeStatus } from "@/Common/Enum"

export class Sequence extends BTComposite {
  onStart(): void {
    super.onStart()
    this.index = 0
  }

  canExecute(): boolean {
    return this.index < this.children.length && this.status !== NodeStatus.Failed
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    switch (status) {
      case NodeStatus.Failed:
        this.status = NodeStatus.Failed
        break
      case NodeStatus.Success:
        this.index += 1
        if (this.index >= this.children.length) {
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