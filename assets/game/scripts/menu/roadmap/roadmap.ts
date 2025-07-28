import type { IStateMachine } from "../../infrastructure/state-machine/state-interfaces";

import { RoadmapPoint } from "./roadmap-point";

export interface IRoadmap {
  onClickPlay: () => void;
  getRoadmapPoints(): RoadmapPoint[];
  scrollToPosition(position: cc.Vec2, duration: number): void;
  getScrollViewSize(): cc.Size;
  getContent(): cc.Node;
}

const { ccclass, property } = cc._decorator;

@ccclass
export class Roadmap extends cc.Component implements IRoadmap {
  onClickPlay: () => void;
  @property(cc.Label)
  label: cc.Label = null;
  @property(cc.Button)
  gameButton: cc.Button = null;
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(RoadmapPoint)
  roadmapPoints: RoadmapPoint[] = [];

  statMachine: IStateMachine;
  onLoad() {
    this.gameButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickGameButton,
      this,
    );
  }
  getRoadmapPoints(): RoadmapPoint[] {
    return this.roadmapPoints;
  }

  scrollToPosition(position: cc.Vec2, duration: number = 0.5): void {
    if (!this.scrollView) return;
    this.scrollView.scrollToOffset(position, duration, true);
  }

  getScrollViewSize(): cc.Size {
    return this.scrollView.node.getContentSize();
  }

  getContent(): cc.Node {
    return this.scrollView.content;
  }
  private clickGameButton() {
    if (this.onClickPlay) this.onClickPlay();
  }

  protected onDestroy(): void {
    this?.gameButton?.node?.off(
      cc.Node.EventType.TOUCH_END,
      this.clickGameButton,
      this,
    );
  }
}
