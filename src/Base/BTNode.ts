import { NodeStatus } from '@/Common/Enum'

export class BTNode {
  private _status = NodeStatus.Inactive

  get status() {
    return this._status
  }

  set status(value: NodeStatus) {
    this._status = value
  }

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
    console.log(`${this.constructor.name} onStart.`)
  }
  
  onUpdate(): NodeStatus {
    return NodeStatus.Success
  }
  
  onEnd(): void {
    this.status = NodeStatus.Inactive
    console.log(`${this.constructor.name} onEnd.`)
  }
}