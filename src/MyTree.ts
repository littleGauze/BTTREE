import { BTTree } from "./Base/BTTree";
import { Sequence } from "./Composite/Sequence";
import { RandomSelector } from "./Composite/RandomSelector";
import { HasMp } from "./Bizz/Conditions/HasMp";
import { AttackAction } from "./Bizz/Actions/AttackAction";
import { WalkAction } from "./Bizz/Actions/WalkAction";
import { RandomSequence } from "./Composite/RandomSequence";
import { Selector } from "./Composite/Selector";
import { SkillAction } from "./Bizz/Actions/SkillAction";
import { AwaitAction } from "./Bizz/Actions/AwaitAction";
import { SleepAction } from "./Bizz/Actions/SleepAction";
import { HasHp } from "./Bizz/Conditions/HasHp";
import { InvertDecorator } from "./Decorators/InvertDecorator";
import { LogAction } from "./Bizz/Actions/LogAction";
import { AbortType } from "./Common/Enum";
import { Parallel } from "./Composite/Parallel";
import { RepeatDecorator } from "./Decorators/RepeatDecorator";

export class MyTree extends BTTree {
  constructor() {
    super();

    // this.root = new Sequence([
    //   // new InvertDecorator([new InvertDecorator([new LogAction("haha")])]),
    //   // new LogAction("hehe"),

    //   new Selector([
    //     new Sequence([
    //       new HasMp(),
    //       new Sequence([
    //         new AwaitAction(4000),
    //         new SkillAction()
    //       ])
    //     ], AbortType.Self),
    //     new Sequence([
    //       new HasHp(),
    //       new AttackAction()
    //     ]),
    //     new RandomSequence([
    //       new Sequence([
    //         new AwaitAction(5000),
    //         new SleepAction()
    //       ]),
    //       new Sequence([
    //         new AwaitAction(5000),
    //         new WalkAction(),
    //       ])
    //     ])
    //   ]),
    // ]);

    this.root = new Selector([
      new RepeatDecorator([
        new HasMp(),
      ], 3, true)
      // new Parallel([
      //   new Selector([
      //     new HasMp(),
      //     new InvertDecorator([new WalkAction(1000)]),
      //   ], AbortType.LowerPriority),
      //   new Selector([
      //     new HasHp(),
      //     new SleepAction(1000),
      //   ], AbortType.Self),
      // ], AbortType.LowerPriority),
      // new WalkAction(8000),
    ])
  }
}
