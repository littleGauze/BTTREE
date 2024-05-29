import BehaviorManger from './BehaviorManager'
import { Blackboard } from './Blackboard'


const behaviorManager = new BehaviorManger()

behaviorManager.start()

let i = 0
setInterval(() => {
  console.log(`-------------- tick ${++i} --------------`)
  behaviorManager.tick()
}, 1000)

setTimeout(() => {
  Blackboard.Instance.mp = 100
}, 4000)
