import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"

export class SleepAction extends BTAction {
  onUpdate(): NodeStatus {
    console.log('Sleep action')
    return NodeStatus.Success
  }
}