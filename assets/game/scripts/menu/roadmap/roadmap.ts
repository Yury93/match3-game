export interface IRoadmap {}

const { ccclass, property } = cc._decorator;

@ccclass
export class Roadmap extends cc.Component implements IRoadmap {
  @property(cc.Label)
  label: cc.Label = null;

  @property
  text: string = "hello";

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
