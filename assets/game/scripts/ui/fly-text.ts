const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyText extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;
  @property({
    tooltip: "Дистанция перемещения в пикселях"
  })
  moveDistance: number = 150;
  @property({
    tooltip: "Общая длительность анимации в секундах",
    min: 0.1
  })
  duration: number = 0.4;
  @property({
    tooltip: "Интенсивность замедления в конце",
    range: [0, 10],
    step: 0.1
  })
  easingPower: number = 1.8;

  start() {
    const startPos = this.node.position.clone();
    const targetPos = cc.v3(
      startPos.x,
      startPos.y + this.moveDistance,
      startPos.z
    );
 
    this.node.scale = 0.7;
    this.node.opacity = 180;

    cc.tween(this.node) 
      .to(0.15, {
        scale: 1.0,
        opacity: 255
      }, { easing: "backOut" }) 
      .to(this.duration, {
        position: targetPos
      }, { 
        easing: "sineOut",
        onUpdate: (_, ratio: number) => { 
          this.node.opacity = 255 * (1 - Math.pow(ratio, this.easingPower));
        }
      }) 
      .call(() => this.node.destroy())
      .start();
  }
}