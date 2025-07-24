const { ccclass, property } = cc._decorator;

export interface IResultLevelView {
  win(message: string): Promise<void>;
  lose(message: string): Promise<void>;
  waitForClickContinue(): Promise<void>;
  waitForClickRestart(): Promise<void>;
}
@ccclass
export class ResultLevelView extends cc.Component implements IResultLevelView {
  @property(cc.Label)
  resultLabel: cc.Label = null;
  @property(cc.Button)
  restartButton: cc.Button = null;
  @property(cc.Button)
  continueButton: cc.Button = null;
  @property(cc.Sprite)
  fadeSprite: cc.Sprite = null;

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
    return this._restartPromise;
  }

  async waitForClickContinue(): Promise<void> {
    return this._continuePromise;
  }
  private async showResult(button: cc.Button, message: string): Promise<void> {
    this.subscribeButtonEvents();
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
    await new Promise<void>((resolve) => {
      this.scheduleOnce(() => {
        resolve();
      }, 0.5);
    });
    this.showFade(false);
    this.resultLabel.node.active = false;
    buttonToDeactivate.active = false;
  }
  private showFade(fade: boolean) {
    if (fade) {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 200 }).start();
    } else {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 0 }).start();
    }
  }
  private subscribeButtonEvents() {
    this.restartButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickRestart,
      this,
    );
    this.continueButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickContinue,
      this,
    );
  }
  private unsubscribeButtonEvents() {
    this.restartButton.node.off(
      cc.Node.EventType.TOUCH_END,
      this.clickRestart,
      this,
    );
    this.continueButton.node.off(
      cc.Node.EventType.TOUCH_END,
      this.clickContinue,
      this,
    );
  }

  destroyGo(): void {
    if (this.fadeSprite && this.fadeSprite.node) {
      cc.Tween.stopAllByTarget(this.fadeSprite.node);
    }

    this.destroy();
  }
}
