import { NodeStatus } from "@/Common/Enum"
import { BTParent } from "./BTParent"

export abstract class BTDecorator extends BTParent {
  decorate(status: NodeStatus): NodeStatus {
    return status
  }
}