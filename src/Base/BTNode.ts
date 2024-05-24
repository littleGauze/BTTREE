import { NodeStatus } from '@/Common/Enum'

export class BTNode {
  status = NodeStatus.Inactive

  run() {
    if (this.status === NodeStatus.Inactive) {
      this.onStart()
    }

    const ret = this.onUpdate()
    if (this.status !== NodeStatus.Running) {
      this.onEnd()
    }

    return ret
  }
  
  onStart(): void {
    this.status = NodeStatus.Running
  }
  
  onUpdate(): NodeStatus {
    return NodeStatus.Success
  }
  
  onEnd(): void {
    this.status = NodeStatus.Inactive
  }
}