import type { IGameFactory } from "../services/factories/game-factory";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import type { StateNames } from "../state-machine/state-names";

export class LoadSceneState implements IState {
  private _gameFactory: IGameFactory;
  private _stateMachine: IStateMachine;
  constructor(params: {
    gameFactory: IGameFactory;
    stateMachine: IStateMachine;
  }) {
    this._gameFactory = params.gameFactory;
    this._stateMachine = params.stateMachine;
  }
  async run(payload: { sceneName: string; stateName: StateNames }) {
    const { sceneName, stateName } = payload;
    const curtain = this._gameFactory.createCurtain();
    await curtain.showCurtain();
    await cc.director.loadScene(sceneName, async () => {
      await this._stateMachine.run(stateName);
      await curtain.hideCurtain();
    });
  }
  stop(): void {}
}
