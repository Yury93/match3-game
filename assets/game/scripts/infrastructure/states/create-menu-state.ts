import type { IRoadmap } from "../../menu/roadmap/roadmap";
import { RoadmapController } from "../../menu/roadmap/roadmap-controller";
import type { IMenuFactory } from "../services/factories/menu-factory";
import type { ILevelService } from "../services/levels/level-service";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class CreateMenuState implements IState {
  private _stateMachine: IStateMachine;
  private _menuFactory: IMenuFactory;
  private _levelService: ILevelService;
  constructor(params: {
    stateMachine: IStateMachine;
    menuFactory: IMenuFactory;
    levelService: ILevelService;
  }) {
    const { stateMachine, menuFactory, levelService } = params;
    this._stateMachine = stateMachine;
    this._menuFactory = menuFactory;
    this._levelService = levelService;
  }
  async run() {
    cc.log("run create menu content state");

    await this._menuFactory.loadAssets();

    this.createContent();

    this._stateMachine.run(StateNames.MenuState);
  }
  createContent() {
    const roadmap: IRoadmap = this._menuFactory.createRoadmap();
    new RoadmapController({
      roadmap,
      levelService: this._levelService,
      stateMachine: this._stateMachine,
    });
  }
  async stop() {
    await this._menuFactory.loadAssets();
  }
}
