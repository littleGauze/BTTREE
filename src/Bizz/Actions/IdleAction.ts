import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"

export class IdleAction extends BTAction {
  onUpdate(): NodeStatus {
    console.log('Idle action')
    return NodeStatus.Success
  }
}