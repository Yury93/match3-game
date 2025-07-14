const { ccclass, property } = cc._decorator;
///TODO: надо будет мне отделить фейд с кнопками и шторку
interface ICurtainView {
  win(message: string): Promise<void>;
  lose(message: string): Promise<void>;
}
@ccclass
export default class Curtain extends cc.Component implements ICurtainView {
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
  private _restartPromise: Promise<void>;
  private _continuePromise: Promise<void>;
  private _onClickRestart: () => void = null;
  private _onClickContinue: () => void = null;

  protected onLoad(): void {
    this._continuePromise = new Promise<void>((resolve) => {
      this._onClickContinue = resolve;
    });
    this._restartPromise = new Promise<void>((resolve) => {
      this._onClickRestart = resolve;
    });
  }
  async win(message: string): Promise<void> {
    return await this.showResult(this.continueButton, message);
  }

  async lose(message: string): Promise<void> {
    return await this.showResult(this.restartButton, message);
  }
  async waitForClickRestart(): Promise<void> {
    console.log("calback restart = ", this._onClickContinue);
    return this._restartPromise;
  }

  async waitForClickContinue(): Promise<void> {
    console.log("callback continue = ", this._onClickContinue);
    return this._continuePromise;
  }
  private async showResult(button: cc.Button, message: string): Promise<void> {
    this.subscribeButtonEvents();
    this._startPosCurtain = this.curtainSprite.node.position;
    this.resultLabel.string = "";
    this.showFade(true);
    await this.scheduleOnce(() => {
      button.node.active = true;
      this.resultLabel.string = message;
    }, 0.5);
  }
  private async clickRestart(): Promise<void> {
    await this.handleGameAction(this.restartButton.node);
    this._onClickRestart();
  }
  private async clickContinue(): Promise<void> {
    await this.handleGameAction(this.continueButton.node);
    this._onClickContinue();
  }

  private async handleGameAction(buttonToDeactivate: cc.Node): Promise<void> {
    this.unsubscribeButtonEvents();
    await this.showCurtain();
    await new Promise<void>((resolve) => {
      this.scheduleOnce(() => {
        resolve();
      }, 0.5);
    });
    this.showFade(false);
    this.resultLabel.node.active = false;
    buttonToDeactivate.active = false;
    await this.hideCurtain();
  }
  private showFade(fade: boolean) {
    if (fade) {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 200 }).start();
    } else {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 0 }).start();
    }
  }
  private showCurtain(): Promise<void> {
    cc.Tween.stopAllByTarget(this.curtainSprite.node);

    const promiceShow = new Promise<void>((resolve) => {
      cc.tween(this.curtainSprite.node)
        .to(0.5, { x: 0 }, { easing: "quadOut" })
        .call(() => {
          resolve();
        })
        .start();
    });
    return promiceShow;
  }
  private hideCurtain(): Promise<void> {
    cc.Tween.stopAllByTarget(this.curtainSprite.node);

    const promiseHide = new Promise<void>((resolve) => {
      cc.tween(this.curtainSprite.node)
        .to(0.5, { x: this._startPosCurtain.x }, { easing: "quadOut" })
        .call(() => {
          resolve();
        })
        .start();
    });
    return promiseHide;
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
