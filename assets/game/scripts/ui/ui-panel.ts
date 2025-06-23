const { ccclass, property } = cc._decorator;

export interface IUIPanelView {
  playTeleportActivationAnimation();
  setTeleportButtonActive(isActive: boolean);
  updateTeleportCount(teleportTrial: number);
  nodeView: cc.Node;
  onBombButtonClick: () => void;
  init(winScoreThreshold: number, maxStep: number);
  updateScore(currentScore: number);
  updateStep(remainingSteps: number);
  updateBombCount(count: number);
  setBombButtonActive(isActive: boolean);
  playBombSummonAnimation();
  onTeleportButtonClick: () => void;
  playBombActivationAnimation();
  removeListeners();
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
  @property(cc.Button)
  teleportButton: cc.Button = null;
  @property(cc.Label)
  countTeleportLabel: cc.Label = null;
  nodeView: cc.Node;
  onBombButtonClick: () => void;
  onTeleportButtonClick: () => void;

  private _winScore: number;
  protected onLoad(): void {
    this.nodeView = this.node;
  }
  init(winScoreThreshold: number, maxStep: number) {
    this._winScore = winScoreThreshold;
    this.stepsLabel.string = maxStep.toString();
    this.scoreLabel.string = `${0}/${winScoreThreshold}`;

    this.bombButton.node.on(cc.Node.EventType.TOUCH_END, this.clickBomb, this);
    this.teleportButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickTeleport,
      this
    );
    this.setBombButtonActive(true);
    this.setTeleportButtonActive(true);
    console.log("init ui panel view");
  }
  updateScore(currentScore: number) {
    this.scoreLabel.string = `${currentScore}/${this._winScore}`;
    this.animateLabel(this.scoreLabel, 0.3);
  }
  updateStep(remainingSteps: number) {
    this.stepsLabel.string = remainingSteps.toString();
    this.animateLabel(this.stepsLabel, 0.5);
  }
  updateBombCount(count: number) {
    console.log("update bomb count ", this.countBombLabel);
    this.countBombLabel.string = count.toString();
    this.animateLabel(this.countBombLabel, 0.5);
  }
  setBombButtonActive(isActive) {
    const node = this.bombButton.node;
    cc.Tween.stopAllByTarget(node);
    this.animateButton(node, isActive);
  }
  setTeleportButtonActive(isActive) {
    const node = this.teleportButton.node;
    cc.Tween.stopAllByTarget(node);
    this.animateButton(node, isActive);
  }
  updateTeleportCount(teleportTrial: number) {
    this.countTeleportLabel.string = teleportTrial.toString();
    this.animateLabel(this.countTeleportLabel, 0.5);
  }
  playBombActivationAnimation() {
    this.playButtonActiveAnimation(this.bombButton.node);
  }
  playTeleportActivationAnimation() {
    this.playButtonActiveAnimation(this.teleportButton.node);
  }
  playBombSummonAnimation() {
    cc.Tween.stopAllByTarget(this.bombButton.node);
    cc.tween(this.bombButton.node)
      .to(
        0.3,
        {
          scale: 1.25,
          color: cc.Color.RED,
        },
        { easing: "sineOut" }
      )
      .to(
        0.4,
        {
          scale: 1.0,
          color: cc.Color.WHITE,
        },
        { easing: "sineIn" }
      )
      .to(0.1, { angle: -5 })
      .to(0.1, { angle: 5 })
      .to(0.1, { angle: 0 })
      .repeat(10)
      .start();
  }
  removeListeners() {
    this.onTeleportButtonClick = null;
    this.onBombButtonClick = null;
  }
  private playButtonActiveAnimation(buttonNode: cc.Node) {
    cc.Tween.stopAllByTarget(buttonNode);
    buttonNode.scale = 1;
    buttonNode.color = cc.Color.WHITE;
    cc.tween(buttonNode)
      .to(
        0.3,
        {
          scale: 1.3,
          color: cc.Color.GREEN,
        },
        { easing: "sineOut" }
      )
      .to(0.1, { scale: 1.1 })
      .to(0.1, { scale: 1.3 })
      .to(0.1, { scale: 1.1 })
      .to(0.1, { scale: 1.3 })
      .to(0.1, { scale: 1.1 })
      .call(() => {
        cc.tween(buttonNode)
          .to(
            0.3,
            {
              scale: 1,
              color: cc.Color.WHITE,
            },
            { easing: "sineOut" }
          )
          .start();
      })
      .start();
  }
  private clickTeleport() {
    if (this.onTeleportButtonClick) this.onTeleportButtonClick();
  }
  private clickBomb() {
    if (this.onBombButtonClick) this.onBombButtonClick();
  }

  private animateButton(node: cc.Node, isActive) {
    cc.Tween.stopAllByTarget(this.node);
    if (isActive) {
      node.active = true;
      node.opacity = 255;
      node.scale = 1;
      node.color = cc.Color.WHITE;
      cc.tween(node)
        .to(0.3, { scale: 1.2 }, { easing: "sineOut" })
        .to(0.3, { scale: 1 }, { easing: "sineIn" })
        .start();
    } else {
      cc.tween(node)
        .to(0.25, { scale: 1 }, { easing: "sineIn" })
        .call(() => {
          node.color = new cc.Color(180, 180, 180);
        })
        .start();
    }
  }
  private animateLabel(label: cc.Label, duration: number) {
    if (label && label.node) {
      cc.tween(label.node)
        .to(duration, { scale: 1.2 }, { easing: "sineOut" })
        .to(0.1, { scale: 1.0 }, { easing: "sineIn" })
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
