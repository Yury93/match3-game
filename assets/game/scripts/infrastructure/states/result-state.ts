import { ResultLevelController } from "../../logic/result-level-controller";
import { ITableController } from "../../logic/table/table-controller";
import { IGameFactory } from "../services/gameFactory/game-factory";
import { IProgressService } from "../services/levels/progress-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class ResultState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory,
    private _progressServer: IProgressService
  ) {}
  async run(payload: {
    result: string;
    message: string;
    tableController: ITableController;
  }): Promise<void> {
    const resultController = new ResultLevelController(
      this._progressServer,
      payload.tableController
    );

    if (payload.result === "win") {
      const curtain = this._gameFactory.createCurtain();
      curtain.win(payload.message);
      curtain.onContinue = () => {
        () => resultController.clearLevel();
        this._stateMachine.run(StateNames.CreateContent);
      };
    } else {
      const curtain = this._gameFactory.createCurtain();
      curtain.lose(payload.message);
      curtain.onRestart = () => {
        () => resultController.clearLevel();
        this._stateMachine.run(StateNames.CreateContent);
      };
    }
  }
  stop(): void {}
}
