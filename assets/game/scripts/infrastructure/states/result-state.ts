import { ResultLevelController } from "../../game-logic/result-level-controller";
import type { ITableController } from "../../game-logic/table/table-controller";
import type { IGameFactory } from "../services/factories/game-factory";
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
    /// TODO: создавать фейд с кнопкой а не шторку
    const resultView = this._gameFactory.createUIResultView();
    /// TODO: по клику переходить в состояние загрузки сцены, где должна вызываться шторка
    if (payload.result === "win") {
      await resultView.win(payload.message);
      await resultView.waitForClickContinue();
    } else {
      await resultView.lose(payload.message);
      await resultView.waitForClickRestart();
    }

    resultController.clearLevel();
    /// TODO: после загрузки сцены переходить в новое состояние и затем скрывать шторку
    await cc.director.loadScene("menu", async () => {
      await this._stateMachine.run(StateNames.CreateMenuState);

      // await curtain.hideCurtain();
      // curtain.destroyGo();
    });
  }
  stop() {}
}
