import { TableController } from "../../logic/table/table-controller";
import { UIPanelController } from "../../ui/ui-panel-controller";
import { IProgressService } from "../services/progress-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { IMechanicController } from "../../logic/game-mechanic/mechanic-controller";
import { TableModel } from "../../logic/table/table-model";
import { StateNames } from "../state-machine/state-names";
import { IUIPanelView } from "../../ui/ui-panel";

export class GameLoopState implements IState {
  private _stateMachine: IStateMachine;
  private _progressService: IProgressService;

  private _isResultShown = false;
  constructor(stateMachine: IStateMachine, progressService: IProgressService) {
    this._stateMachine = stateMachine;
    this._progressService = progressService;
  }
  run(payload: {
    tableModel: TableModel;
    tableController: TableController;
    uiPanelView: IUIPanelView;
    mechanicController: IMechanicController;
  }): void {
    this._isResultShown = false;

    this.resolveImpossibleMoves(payload.tableModel, payload.tableController);
    const uiPanelController = new UIPanelController(
      this._progressService,
      payload.uiPanelView,
      payload.mechanicController
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
      this.handleGameEnd(StateNames.Win, payload.tableModel);
    };
    this._progressService.onLose = () => {
      this.handleGameEnd(StateNames.Lose, payload.tableModel);
    };
  }
  private resolveImpossibleMoves(
    tableModel: TableModel,
    tableController: TableController
  ) {
    if (!this.hasPossibleMoves(tableModel)) {
      console.log("tails count after result ", tableModel.getTiles().length);
      this.handleGameEnd(StateNames.Lose, tableModel);
    }
  }
  private handleGameEnd(stateName: string, tableModel: TableModel) {
    this._isResultShown = true;
    this._progressService.resetResults();
    this._progressService.resetSteps();
    tableModel.clearTable();
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
