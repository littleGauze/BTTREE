import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"
import { AwaitAction } from "./AwaitAction"

export class WalkAction extends AwaitAction {
  onUpdate(): NodeStatus {
    console.log('Walk action')
    return super.onUpdate()
  }
}