import type { IMenuFactory } from "../services/factories/menu-factory";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class CreateMenuState implements IState {
  private _stateMachine: IStateMachine;
  private _menuFactory: IMenuFactory;
  constructor(params: {
    stateMachine: IStateMachine;
    menuFactory: IMenuFactory;
  }) {
    const { stateMachine, menuFactory } = params;
    this._stateMachine = stateMachine;
    this._menuFactory = menuFactory;
  }
  async run() {
    cc.log("run create menu content state");

    await this._menuFactory.loadAssets();

    this.createContent();

    this._stateMachine.run(StateNames.MenuState);
  }
  createContent() {
    this._menuFactory.createRoadmap();
  }
  async stop() {
    await this._menuFactory.loadAssets();
  }
}
