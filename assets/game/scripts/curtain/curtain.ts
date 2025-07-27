const { ccclass, property } = cc._decorator;

interface ICurtainView {
  showCurtain(): Promise<void>;
  hideCurtain(): Promise<void>;
}
@ccclass
export class Curtain extends cc.Component implements ICurtainView {
  @property(cc.Sprite)
  fadeSprite: cc.Sprite = null;
  @property(cc.Sprite)
  curtainSprite: cc.Sprite = null;

  private _startPosCurtain: cc.Vec3 = null;
  protected onLoad(): void {
    if (this.curtainSprite && this.curtainSprite.node) {
      this._startPosCurtain = this.curtainSprite.node.position;
    }
  }
  async showCurtain(): Promise<void> {
    cc.Tween.stopAllByTarget(this.curtainSprite.node);
    this.showFade(true);
    const promiceShow = new Promise<void>((resolve) => {
      cc.tween(this.curtainSprite.node)
        .to(0.3, { x: 0 }, { easing: "quadOut" })
        .delay(0.3)
        .call(() => {
          resolve();
        })
        .start();
    });
    return promiceShow;
  }
  async hideCurtain(): Promise<void> {
    cc.Tween.stopAllByTarget(this.curtainSprite.node);
    this.showFade(false);
    const promiseHide = new Promise<void>((resolve) => {
      cc.tween(this.curtainSprite.node)
        .to(0.6, { x: this._startPosCurtain.x }, { easing: "quadOut" })

        .call(() => {
          resolve();
          this.node.destroy();
        })
        .start();
    });
    return promiseHide;
  }
  private showFade(fade: boolean) {
    if (fade) {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 200 }).start();
    } else {
      cc.tween(this.fadeSprite.node).to(0.3, { opacity: 0 }).start();
    }
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
