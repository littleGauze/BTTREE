import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"

const game = {
  get totalTime() {
    return Date.now()
  }
}

export class AwaitAction extends BTAction {
  duration: number = 0
  timer: number = 0

  constructor(duration: number) {
    super()
    this.duration = duration
  }

  onStart(): void {
    super.onStart()
    this.timer = game.totalTime
  }

  onUpdate(): NodeStatus {
    if (game.totalTime - this.timer < this.duration) {
      return NodeStatus.Running
    }
    return NodeStatus.Success
  }
}