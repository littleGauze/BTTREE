import { AbortType } from "@/Common/Enum"
import { BTParent } from "./BTParent"
import { BTNode } from "./BTNode"

export abstract class BTComposite extends BTParent {
  abortType: AbortType = AbortType.None

  constructor(childrens: BTNode[], abortType: AbortType = AbortType.None) {
    super(childrens)
    this.abortType = abortType
  }
}