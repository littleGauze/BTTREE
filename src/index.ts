import BehaviorManger from './BehaviorManager'


const behaviorManager = new BehaviorManger()

behaviorManager.start()


setInterval(() => {
  behaviorManager.tick()
}, 1000)
