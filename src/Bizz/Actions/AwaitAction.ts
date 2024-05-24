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
    this.timer = game.totalTime
  }

  onUpdate(): NodeStatus {
    if (game.totalTime - this.timer < this.duration) {
      console.log("AwaitAction running")
      return NodeStatus.Running
    }
    console.log("AwaitAction success")
    return NodeStatus.Success
  }
}