import { BTComposite } from "@/Base/BTComposite"
import { NodeStatus } from "@/Common/Enum"

export class Selector extends BTComposite {
  onStart(): void {
    super.onStart()
    this.index = 0
  }

  canExecute(): boolean {
    return this.index < this.children.length && this.status !== NodeStatus.Success
  }

  onChildExecuted(status: NodeStatus): NodeStatus {
    switch (status) {
      case NodeStatus.Success:
        this.status = NodeStatus.Success
        break
      case NodeStatus.Failed:
        this.index += 1
        if (this.index >= this.children.length) {
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

  // onUpdate(): NodeStatus {
  //   if (this.status === NodeStatus.Success) return NodeStatus.Success
  //   if (this.index >= this.children.length) {
  //     this.status = NodeStatus.Failed
  //     return NodeStatus.Failed
  //   }

  //   const child = this.children[this.index]
  //   const ret = child.run()
  //   if (ret === NodeStatus.Success) {
  //     this.status = NodeStatus.Success
  //     return NodeStatus.Success
  //   }

  //   if (ret === NodeStatus.Failed) {
  //     this.index += 1
  //   }

  //   return NodeStatus.Running
  // }
}