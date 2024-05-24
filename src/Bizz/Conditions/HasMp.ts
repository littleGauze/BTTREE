import { BTCondition } from "@/Base/BTCondition"
import { Blackboard } from "@/Blackboard"
import { NodeStatus } from "@/Common/Enum"

export class HasMp extends BTCondition {
  onUpdate(): NodeStatus {
    if (Blackboard.Instance.mp > 0) {
      return NodeStatus.Success
    }
    return NodeStatus.Failed
  }
}