const { ccclass, property } = cc._decorator;

@ccclass
export class FlyText extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property
  moveDistance: number = 100;

  @property
  duration: number = 1.5;

  start() {
    const startPos = this.node.position.clone();

    // Начальные значения
    this.node.scale = 0;
    this.node.opacity = 0;
    this.node.position = cc.v3(startPos.x, startPos.y - 20, startPos.z);

    cc.tween(this.node)
      // Небольшая задержка перед началом
      .delay(0.1)
      // Появление снизу
      .parallel(
        cc.tween().to(0.3, { scale: 1.2 }, { easing: "backOut" }),
        cc.tween().to(0.3, { opacity: 255 }),
        cc
          .tween()
          .to(
            0.3,
            { position: cc.v3(startPos.x, startPos.y + 10, startPos.z) },
            { easing: "backOut" },
          ),
      )
      // Стабилизация
      .to(0.1, {
        scale: 1,
        position: cc.v3(startPos.x, startPos.y, startPos.z),
      })
      // Плавное движение вверх с легким ускорением
      .parallel(
        cc.tween().to(
          this.duration,
          {
            position: cc.v3(
              startPos.x,
              startPos.y + this.moveDistance,
              startPos.z,
            ),
          },
          { easing: "circOut" },
        ),
        // Исчезновение с паузой в середине
        cc
          .tween()
          .delay(this.duration * 0.3)
          .to(this.duration * 0.7, { opacity: 0 }, { easing: "fade" }),
      )
      .call(() => {
        this.node.destroy();
      })
      .start();
  }
}
