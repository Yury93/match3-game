const { ccclass, property } = cc._decorator;

@ccclass
export class ParallaxEffect extends cc.Component {
  @property({
    type: [cc.Node],
    tooltip: "Слои для параллакс-эффекта (от заднего к переднему)",
  })
  layers: cc.Node[] = [];

  @property({
    type: [cc.Float],
    tooltip:
      "Множители скорости для каждого слоя (0.1-0.9 для фона, 1.0 для основного)",
  })
  speedFactors: number[] = [];

  private initialContentPosition: cc.Vec3 = cc.Vec3.ZERO;
  private initialLayersPositions: cc.Vec3[] = [];

  protected onLoad(): void {
    if (this.layers.length === 0) {
      cc.warn("No layers set for ParallaxEffect");
      return;
    }

    if (this.layers.length !== this.speedFactors.length) {
      cc.error("Количество слоёв и множителей скорости должно совпадать!");
      return;
    }

    // Сохраняем начальные позиции
    this.initialContentPosition = this.node.position.clone();

    this.initialLayersPositions = this.layers.map((layer) => {
      return layer.position.clone();
    });
  }

  protected update(): void {
    // Вычисляем смещение контента
    const contentOffset = this.node.position.sub(this.initialContentPosition);

    // Обновляем позиции для каждого слоя
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const speedFactor = this.speedFactors[i];
      const initialPos = this.initialLayersPositions[i];

      // Ключевое исправление: компенсируем базовое движение и добавляем параллакс
      const parallaxOffset = contentOffset.mul(speedFactor - 1);
      const newPos = initialPos.add(parallaxOffset);

      layer.setPosition(newPos);
    }
  }
}
