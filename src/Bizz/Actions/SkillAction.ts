import { BTAction } from "@/Base/BTAction"
import { Blackboard } from "@/Blackboard"
import { NodeStatus } from "@/Common/Enum"

export class SkillAction extends BTAction {
  onUpdate(): NodeStatus {
    console.log('Skill action')
    Blackboard.Instance.mp -= 20

    console.log('HP:', Blackboard.Instance.hp)
    console.log('MP:', Blackboard.Instance.mp)
    
    return NodeStatus.Success
  }
}