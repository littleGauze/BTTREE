import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"

export class WalkAction extends BTAction {
  onUpdate(): NodeStatus {
    console.log('Walk action')
    return NodeStatus.Success
  }
}