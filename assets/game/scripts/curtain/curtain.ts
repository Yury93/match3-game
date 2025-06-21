const { ccclass, property } = cc._decorator;

@ccclass
export default class Curtain extends cc.Component {
  @property(cc.Label)
  resultLabel: cc.Label = null;
  @property(cc.Button)
  restartButton: cc.Button = null;
  @property(cc.Button)
  continueButton: cc.Button = null;
  @property(cc.Sprite)
  fadeSprite: cc.Sprite = null;
  @property(cc.Sprite)
  curtainSprite: cc.Sprite = null;

  private _startPosCurtain: cc.Vec3 = null;

  onContinue: () => void;
  onRestart: () => void;

  win() {
    this.showResult(this.continueButton, `Успех!`);
  }

  lose() {
    this.showResult(this.restartButton, `Неудача!`);
  }
  private showResult(button: cc.Button, message: string) {
    this.subscribeButtonEvents();
    this._startPosCurtain = this.curtainSprite.node.position;
    this.resultLabel.string = "";
    this.showFade(true);
    this.showCurtain(() => {
      button.node.active = true;
      this.resultLabel.string = message;
    }).start();
  }

  private clickRestart() {
    this.handleGameAction(this.restartButton.node, this.onRestart);
  }
  private clickContinue() {
    this.handleGameAction(this.continueButton.node, this.onContinue);
  }
  private handleGameAction(
    buttonToDeactivate: cc.Node,
    finalCallback?: () => void
  ) {
    this.unsubscribeButtonEvents();
    this.showCurtain(() => {
      this.showFade(false);
      this.resultLabel.node.active = false;
      buttonToDeactivate.active = false;
    })
      .call(() => {
        this.node.destroy();

        if (finalCallback) {
          finalCallback();
        }
      })
      .start();
  }
  private showFade(fade: boolean) {
    if (fade) {
      cc.tween(this.fadeSprite.node).to(0.5, { opacity: 170 }).start();
    } else {
      cc.tween(this.fadeSprite.node).to(0.5, { opacity: 0 }).start();
    }
  }
  private showCurtain(onComplete?: () => void): cc.Tween<cc.Node> {
    cc.Tween.stopAllByTarget(this.curtainSprite.node);
    return cc
      .tween(this.curtainSprite.node)
      .to(0.3, { x: 0 }, { easing: "quadOut" })
      .call(() => {
        if (onComplete) onComplete();
      })
      .delay(1)
      .to(0.3, { x: this._startPosCurtain.x }, { easing: "quadOut" });
  }
  private subscribeButtonEvents() {
    this.restartButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickRestart,
      this
    );
    this.continueButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickContinue,
      this
    );
  }
  private unsubscribeButtonEvents() {
    this.restartButton.node.off(
      cc.Node.EventType.TOUCH_END,
      this.clickRestart,
      this
    );
    this.continueButton.node.off(
      cc.Node.EventType.TOUCH_END,
      this.clickContinue,
      this
    );
  }

  protected onDestroy(): void {
    if (this.curtainSprite && this.curtainSprite.node) {
      cc.Tween.stopAllByTarget(this.curtainSprite.node);
    }
    if (this.fadeSprite && this.fadeSprite.node) {
      cc.Tween.stopAllByTarget(this.fadeSprite.node);
    }
  }
}
