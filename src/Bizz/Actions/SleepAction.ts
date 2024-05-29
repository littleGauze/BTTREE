import { BTAction } from "@/Base/BTAction"
import { NodeStatus } from "@/Common/Enum"
import { AwaitAction } from "./AwaitAction"

export class SleepAction extends AwaitAction {
  onUpdate(): NodeStatus {
    console.log('Sleep action')
    return super.onUpdate()
  }
}