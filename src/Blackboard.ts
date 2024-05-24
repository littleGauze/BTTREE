import Singleton from "./Base/Singleton"

export interface Position {
  x: number
  y: number
}

export class Blackboard extends Singleton {
  _pos: Position = { x: 0, y: 0 }
  _hp: number = 100
  _mp: number = 100

  static get Instance() {
    return this.GetInstance<Blackboard>()
  }

  get pos() {
    return this._pos
  }

  set pos(pos: Position) {
    this._pos = pos
  }

  get hp() {
    return this._hp
  }

  set hp(hp: number) {
    this._hp = hp
  }

  get mp() {
    return this._mp
  }

  set mp(mp: number) {
    this._mp = mp
  }
}