import { BTCondition } from "@/Base/BTCondition"
import { Blackboard } from "@/Blackboard"
import { NodeStatus } from "@/Common/Enum"

export class HasMp extends BTCondition {
  onUpdate(): NodeStatus {
    console.log("DataManager.instance.mp", Blackboard.Instance.mp, `condition tell as ${Blackboard.Instance.mp > 0}`)
    if (Blackboard.Instance.mp > 0) {
      return NodeStatus.Success
    }
    return NodeStatus.Failed
  }
}