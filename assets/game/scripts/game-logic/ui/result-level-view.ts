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
  @property(cc.Node)
  gameOverEffect: cc.Node = null;
  @property(cc.Node)
  popupResult: cc.Node = null;

  @property(cc.Node)
  emptyStars: cc.Node[] = [];
  @property(cc.Node)
  stars: cc.Node[] = [];

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
    return await this.showResult(this.continueButton, message, true);
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
  private async showResult(
    button: cc.Button,
    message: string,
    isWin: boolean = false,
  ): Promise<void> {
    this.subscribeButtonEvents();
    this.resultLabel.string = "";
    await this.showGameOver();
    await this.showPopup();
    await this.showEmptyStars();
    if (isWin) await this.showStars();
    this.showFade(true);
    await this.scheduleOnce(() => {
      button.node.active = true;
      this.resultLabel.string = message;
    }, 0.5);
  }

  private async showEmptyStars() {
    if (!this.emptyStars || this.emptyStars.length === 0) return;

    this.emptyStars.forEach((star) => {
      if (star) {
        star.scale = 0;
        star.active = true;
        star.opacity = 0;
      }
    });

    const promises: Promise<void>[] = [];

    for (let i = 0; i < this.emptyStars.length; i++) {
      const star = this.emptyStars[i];
      if (star) {
        const promise = new Promise<void>((resolve) => {
          cc.tween(star)
            .delay(i * 0.15)
            .parallel(
              cc.tween().to(0.3, { scale: 1 }, { easing: "elasticOut" }),
              cc.tween().to(0.2, { opacity: 255 }, { easing: "fade" }),
            )
            .to(0.1, { scale: 1.1 }, { easing: "quadOut" })
            .to(0.1, { scale: 1 }, { easing: "quadIn" })
            .call(() => resolve())
            .start();
        });

        promises.push(promise);
      }
    }

    await Promise.all(promises);
  }
  private async showStars() {
    if (!this.stars || this.stars.length === 0) return;

    this.stars.forEach((star) => {
      if (star) {
        star.scale = 0;
        star.active = true;
        star.opacity = 0;
        star.angle = 0;
      }
    });

    const promises: Promise<void>[] = [];

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      if (star) {
        const promise = new Promise<void>((resolve) => {
          cc.tween(star)
            .delay(i * 0.1)
            .parallel(
              cc.tween().to(
                0.6,
                {
                  scale: 1,
                  x: 0,
                  y: 0,
                },
                { easing: "elasticOut" },
              ),
              cc.tween().to(0.3, { opacity: 255 }, { easing: "fade" }),
              cc.tween().to(0.4, { angle: 360 }, { easing: "quadOut" }),
            )
            .to(0.2, { scale: 1.3 }, { easing: "backOut" })
            .to(0.2, { scale: 1 }, { easing: "backIn" })
            .to(0.3, { angle: 360 }, { easing: "quadInOut" })
            .call(() => resolve())
            .start();
        });

        promises.push(promise);
      }
    }

    await Promise.all(promises);
  }

  private async showPopup() {
    if (!this.popupResult) return;

    this.popupResult.scale = 0;
    this.popupResult.active = true;
    this.popupResult.opacity = 255;

    await new Promise<void>((resolve) => {
      cc.tween(this.popupResult)
        .to(0.2, { scale: 1.2 }, { easing: "backOut" })
        .to(0.1, { scale: 1 }, { easing: "backIn" })
        .delay(0.3)
        .to(0.2, { scale: 1.1 }, { easing: "quadOut" })
        .to(0.1, { scale: 1 }, { easing: "quadIn" })
        .call(() => {
          resolve();
        })
        .start();
    });
  }
  private async showGameOver(): Promise<void> {
    if (!this.gameOverEffect) return;

    this.gameOverEffect.scale = 0;
    this.gameOverEffect.active = true;
    this.gameOverEffect.opacity = 255;

    await new Promise<void>((resolve) => {
      cc.tween(this.gameOverEffect)
        .to(0.3, { scale: 1.2 }, { easing: "backOut" })
        .to(0.2, { scale: 1 }, { easing: "backIn" })
        .delay(1)
        .to(0.5, { opacity: 0 }, { easing: "quadOut" })
        .call(() => {
          this.gameOverEffect.active = false;
          resolve();
        })
        .start();
    });
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
