import { BTCondition } from "@/Base/BTCondition"
import { Blackboard } from "@/Blackboard"
import { NodeStatus } from "@/Common/Enum"

export class HasHp extends BTCondition {
  onUpdate(): NodeStatus {
    console.log("DataManager.instance.hp", Blackboard.Instance.hp, `condition tell as ${Blackboard.Instance.hp > 0}`)
    if (Blackboard.Instance.hp > 0) {
      return NodeStatus.Success
    }
    return NodeStatus.Failed
  }
}