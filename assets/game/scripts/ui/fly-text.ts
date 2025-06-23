const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyText extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;
  @property
  moveDistance: number = 100;
  @property
  duration: number = 1.0;

  start() {
    const startPos = this.node.position.clone();
    const startSize = this.node.scale;
    this.label.node.scale = 0;
    cc.tween(this.node)
      .parallel(
        cc
          .tween()
          .to(0.4, { scale: startSize }, { easing: "backOut" })
          .to(this.duration, {
            position: cc.v3(
              startPos.x,
              startPos.y + this.moveDistance,
              startPos.z
            ),
          }),

        cc.tween().to(this.duration, { opacity: 0 }, { easing: "fade" })
      )

      .call(() => {
        this.node.destroy();
      })
      .start();
  }
}
