// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UiPanelView extends cc.Component {
  @property(cc.Label)
  stepsLabel: cc.Label = null;
  @property(cc.Label)
  scoreLabel: cc.Label = null;
  private _winScore: number;
  init(winScoreThreshold: number, maxStep: number) {
    this._winScore = winScoreThreshold;
    this.stepsLabel.string = maxStep.toString();
    this.scoreLabel.string = `${0}/${winScoreThreshold}`;
  }
  updateScore(currentScore: number) {
    this.scoreLabel.string = `${currentScore}/${this._winScore}`;
  }
  updateStep(remainingSteps: number) {
    this.stepsLabel.string = remainingSteps.toString();
  }
}
