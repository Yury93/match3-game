import type { ILevelService } from "../../infrastructure/services/levels/level-service";
import type { IStateMachine } from "../../infrastructure/state-machine/state-interfaces";
import { StateNames } from "../../infrastructure/state-machine/state-names";

import type { IRoadmap } from "./roadmap";

export interface IRoadmapController {}

export class RoadmapController implements IRoadmapController {
  private _roadmap: IRoadmap;
  private _levelService: ILevelService;
  private _stateMachine: IStateMachine;
  constructor(params: {
    roadmap: IRoadmap;
    levelService: ILevelService;
    stateMachine: IStateMachine;
  }) {
    const { roadmap, levelService, stateMachine } = params;
    this._roadmap = roadmap;
    this._levelService = levelService;
    this._stateMachine = stateMachine;
    roadmap.onClickPlay = () => this.onClickPlayButton();
  }
  onClickPlayButton() {
    cc.director.loadScene("game", () => {
      this._stateMachine.run(StateNames.CreateLevelContentState);
    });
  }
}
