import { BTTree } from "./Base/BTTree"
import { Sequence } from "./Composite/Sequence"
import { RandomSelector } from "./Composite/RandomSelector"
import { HasMp } from "./Bizz/Conditions/HasMp"
import { AttackAction } from "./Bizz/Actions/AttackAction"
import { WalkAction } from "./Bizz/Actions/WalkAction"
import { RandomSequence } from "./Composite/RandomSequence"
import { Selector } from "./Composite/Selector"
import { SkillAction } from "./Bizz/Actions/SkillAction"
import { AwaitAction } from "./Bizz/Actions/AwaitAction"
import { SleepAction } from "./Bizz/Actions/SleepAction"
import { HasHp } from "./Bizz/Conditions/HasHp"

export class MyTree extends BTTree {
  constructor() {
    super()

    this.root = new Sequence([
      new Selector([
        new Sequence([
          new HasMp(),
          new Sequence([
            new AwaitAction(2000),
            new SkillAction()
          ])
        ]),
        new Sequence([
          new HasHp(),
          new AttackAction()
        ]),
        new RandomSequence([
          new WalkAction(),
          new SleepAction()
        ])
      ]),
    ])
  }
}
