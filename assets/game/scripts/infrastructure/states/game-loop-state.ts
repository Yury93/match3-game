import { TableController } from "../../logic/table/table-controller";
import { UIPanelController } from "../../ui/ui-panel-controller";
import UiPanelView from "../../ui/ui-panel";
import { IProgressService } from "../services/progress-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { LoseState } from "./lose-state";
import { WinState } from "./win-state";
import { IMechanicService } from "../services/mechanic-service";
import { IGameFactory } from "../services/gameFactory/game-factory";
import { TableModel } from "../../logic/table/table-model";
import { StateNames } from "../state-machine/state-names";

export class GameLoopState implements IState {
  private _stateMachine: IStateMachine;
  private _progressService: IProgressService;
  private _mechanicService: IMechanicService;
  private _gameFactory: IGameFactory;

  private _isResultShown = false;
  constructor(
    stateMachine: IStateMachine,
    progressService: IProgressService,
    mechanicService: IMechanicService,
    gameFactory: IGameFactory
  ) {
    this._stateMachine = stateMachine;
    this._progressService = progressService;
    this._mechanicService = mechanicService;
    this._gameFactory = gameFactory;
  }
  run(payload: {
    tableModel: TableModel;
    tableController: TableController;
    uiPanelView: UiPanelView;
  }): void {
    this._isResultShown = false;

    this.resolveImpossibleMoves(payload.tableModel, payload.tableController);
    const uiPanelController = new UIPanelController(
      this._progressService,
      payload.uiPanelView,
      this._mechanicService,
      this._gameFactory
    );

    payload.tableController.onBurn = (groupSize: number) => {
      this._progressService.nextStep(groupSize);
      uiPanelController.updateScore();
      if (!this._isResultShown) {
        this.resolveImpossibleMoves(
          payload.tableModel,
          payload.tableController
        );
      }
    };

    this._progressService.onWin = () => {
      this.handleGameEnd(StateNames.Win, payload.tableController);
    };
    this._progressService.onLose = () => {
      this.handleGameEnd(StateNames.Lose, payload.tableController);
    };
  }
  private resolveImpossibleMoves(
    tableModel: TableModel,
    tableController: TableController
  ) {
    if (!this.hasPossibleMoves(tableModel)) {
      console.log("tails count after result ", tableModel.getTiles().length);
      this.handleGameEnd(StateNames.Lose, tableController);
    }
  }
  private handleGameEnd(stateName: string, tableController: TableController) {
    this._isResultShown = true;
    this._progressService.resetResults();
    this._progressService.resetSteps();
    tableController.clearTable();
    this._stateMachine.run(stateName);
    console.log("GAME END ", stateName);
  }
  stop(): void {}
  private hasPossibleMoves(model: TableModel): boolean {
    const tiles = model.getTiles();
    const columns = tiles.length;
    const rows = tiles[0].length;

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const tile = tiles[col][row];
        if (!tile) continue;

        // Проверка соседей
        const neighbors = [
          { x: col + 1, y: row },
          { x: col, y: row + 1 },
          { x: col - 1, y: row },
          { x: col, y: row - 1 },
        ];

        for (const neighbor of neighbors) {
          if (this.isValidPosition(neighbor.x, neighbor.y, columns, rows)) {
            const neighborTile = tiles[neighbor.x][neighbor.y];
            if (neighborTile && neighborTile.tileType === tile.tileType) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
  private isValidPosition(
    col: number,
    row: number,
    maxCol: number,
    maxRow: number
  ): boolean {
    return col >= 0 && col < maxCol && row >= 0 && row < maxRow;
  }
}
