import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"

export class LogAction extends BTAction {
  constructor(private message: string) {
    super()
  }

  onUpdate(): NodeStatus {
    console.log(this.message)
    return NodeStatus.Success
  }
}