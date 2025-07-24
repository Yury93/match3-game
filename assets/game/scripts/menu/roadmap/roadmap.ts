import type { IStateMachine } from "../../infrastructure/state-machine/state-interfaces";

export interface IRoadmap {
  onClickPlay: () => void;
}

const { ccclass, property } = cc._decorator;

@ccclass
export class Roadmap extends cc.Component implements IRoadmap {
  onClickPlay: () => void;
  @property(cc.Label)
  label: cc.Label = null;
  @property(cc.Button)
  gameButton: cc.Button = null;
  statMachine: IStateMachine;
  onLoad() {
    this.gameButton.node.on(
      cc.Node.EventType.TOUCH_END,
      this.clickGameButton,
      this,
    );
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
