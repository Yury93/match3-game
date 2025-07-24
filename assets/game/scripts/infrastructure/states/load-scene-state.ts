import { IGameFactory } from "../services/factories/game-factory";
import { IState } from "../state-machine/state-interfaces";

export class LoadSceneState implements IState {
  private _gameFactory: IGameFactory;
  constructor(params: { gameFactory: IGameFactory }) {
    this._gameFactory = params.gameFactory;
  }
  async run(payload?: string) {
    await cc.director.loadScene(payload);
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
}
