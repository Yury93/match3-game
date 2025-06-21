const { ccclass, property } = cc._decorator;

export interface IUIPanelView {
  nodeView: cc.Node;
  onClickBomb: () => void;
  init(winScoreThreshold: number, maxStep: number);
  updateScore(currentScore: number);
  updateStep(remainingSteps: number);
  showBombCount(count: number);
  bombButtonActive(isActive);
}

@ccclass
export class UiPanelView extends cc.Component implements IUIPanelView {
  @property(cc.Label)
  stepsLabel: cc.Label = null;
  @property(cc.Label)
  scoreLabel: cc.Label = null;
  @property(cc.Label)
  countBombLabel: cc.Label = null;
  @property(cc.Button)
  bombButton: cc.Button = null;
  nodeView: cc.Node;
  onClickBomb: () => void;

  private _winScore: number;
  protected onLoad(): void {
    this.nodeView = this.node;
  }
  init(winScoreThreshold: number, maxStep: number) {
    this._winScore = winScoreThreshold;
    this.stepsLabel.string = maxStep.toString();
    this.scoreLabel.string = `${0}/${winScoreThreshold}`;

    this.bombButton.node.on(cc.Node.EventType.TOUCH_END, this.clickBomb, this);
    this.bombButtonActive(true);
  }
  updateScore(currentScore: number) {
    this.scoreLabel.string = `${currentScore}/${this._winScore}`;
    this.animateLabel(this.scoreLabel, 0.3);
  }
  updateStep(remainingSteps: number) {
    this.stepsLabel.string = remainingSteps.toString();
    this.animateLabel(this.stepsLabel, 0.5);
  }
  showBombCount(count: number) {
    this.countBombLabel.string = count.toString();
    this.animateLabel(this.countBombLabel, 0.5);
  }
  bombButtonActive(isActive) {
    const node = this.bombButton.node;
    cc.Tween.stopAllByTarget(node);
    this.animateButton(node, isActive);
  }

  private clickBomb() {
    if (this.onClickBomb) this.onClickBomb();
  }
  private animateButton(node: cc.Node, isActive) {
    if (isActive) {
      node.active = true;
      node.opacity = 255;
      node.scale = 1;
      node.color = cc.Color.WHITE;
      cc.tween(node)
        .to(0.15, { scale: 1.18 }, { easing: "backOut" })
        .to(0.12, { scale: 1.0 }, { easing: "backIn" })
        .start();
    } else {
      cc.tween(node)
        .to(0.25, { scale: 0.92 }, { easing: "quadIn" })
        .call(() => {
          node.color = new cc.Color(180, 180, 180);
        })
        .start();
    }
  }
  private animateLabel(label: cc.Label, duration: number) {
    if (label && label.node) {
      cc.tween(label.node)
        .to(duration, { scale: 1.2 }, { easing: "quadOut" })
        .to(0.1, { scale: 1.0 }, { easing: "quadIn" })
        .start();
    }
  }
  protected onDestroy() {
    this.bombButton?.node?.off(
      cc.Node.EventType.TOUCH_END,
      this.clickBomb,
      this
    );
  }
}
