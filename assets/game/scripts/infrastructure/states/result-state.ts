import { ResultLevelController } from "../../logic/result-level-controller";
import type { ITableController } from "../../logic/table/table-controller";
import type { IGameFactory } from "../services/gameFactory/game-factory";
import type { IProgressService } from "../services/levels/progress-service";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class ResultState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory,
    private _progressServer: IProgressService,
  ) {}
  async run(payload: {
    result: string;
    message: string;
    tableController: ITableController;
  }): Promise<void> {
    const resultController = new ResultLevelController(
      this._progressServer,
      payload.tableController,
    );

    const curtain = this._gameFactory.createCurtain();
    if (payload.result === "win") {
      await curtain.win(payload.message);
      await curtain.waitForClickContinue();
    } else {
      await curtain.lose(payload.message);
      await curtain.waitForClickRestart();
    }
    curtain.node.destroy();
    resultController.clearLevel();
    this._stateMachine.run(StateNames.CreateContent);
  }
  stop() {}
}
