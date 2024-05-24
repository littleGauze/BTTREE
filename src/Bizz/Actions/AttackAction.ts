import { BTAction } from "@/Base/BTAction"
import { Blackboard } from "@/Blackboard"
import { NodeStatus } from "@/Common/Enum"

export class AttackAction extends BTAction {
  onUpdate(): NodeStatus {
    console.log('Attack action')
    Blackboard.Instance.hp -= 10

    console.log('HP:', Blackboard.Instance.hp)
    console.log('MP:', Blackboard.Instance.mp)
    
    return NodeStatus.Success
  }
}