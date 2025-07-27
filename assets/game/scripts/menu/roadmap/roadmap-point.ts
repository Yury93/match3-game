const { ccclass, property } = cc._decorator;

@ccclass
export class RoadmapPoint extends cc.Component {
  @property(cc.Integer)
  level: number = 0;
  @property(cc.Sprite)
  spritePoint: cc.Sprite = null;
  @property(cc.Label)
  levelLabel: cc.Label = null;
  private readonly _correctionToLevelId = -1;
  private _currentAnimation: cc.Action | null = null;
  private _currentLevel = false;

  showPointInfo(currentLevelId: number) {
    const pointLevel = this.level + this._correctionToLevelId;
    if (pointLevel < currentLevelId) {
      this.spritePoint.node.color = cc.Color.GREEN;
    } else if (pointLevel === currentLevelId) {
      this.spritePoint.node.color = cc.Color.YELLOW;
      this.startBounceAnimation();
    } else if (pointLevel > currentLevelId) {
      this.spritePoint.node.color = cc.Color.GRAY;
    }
    this.levelLabel.string = "уровень " + this.level.toString();
  }
  getCurrentLevelPoint(currentLevelId: number): RoadmapPoint | null {
    const pointLevel = this.level + this._correctionToLevelId;
    if (pointLevel === currentLevelId) return this;
    return null;
  }
  private startBounceAnimation() {
    const up = cc.moveBy(0.3, cc.v2(0, 15));
    const down = cc.moveBy(0.3, cc.v2(0, -15));

    up.easing(cc.easeOut(3.0));
    down.easing(cc.easeIn(3.0));

    const sequence = cc.sequence(up, down, cc.delayTime(0.4));

    this._currentAnimation = cc.repeatForever(sequence);
    this.node.runAction(this._currentAnimation);
  }
}
