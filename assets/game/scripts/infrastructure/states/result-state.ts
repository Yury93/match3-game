import type { IGameFactory } from "../services/factories/game-factory";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class ResultState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory,
  ) {}
  async run(payload: { result: string; message: string }): Promise<void> {
    const resultView = this._gameFactory.createUIResultView();
    if (payload.result === "win") {
      await resultView.win(payload.message);
      await resultView.waitForClickContinue();
    } else {
      await resultView.lose(payload.message);
      await resultView.waitForClickRestart();
    }
    await this._stateMachine.run(StateNames.LoadSceneState, {
      sceneName: "menu",
      stateName: StateNames.CreateMenuState,
    });
  }
  stop() {}
}
