import { TableController } from "../../logic/table/table-controller";
import { UIPanelController } from "../../ui/ui-panel-controller";
import UiPanelView from "../../ui/ui-panel";
import { IScoreService } from "../services/score-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { LoseState } from "./lose-state";
import { WinState } from "./win-state";
import { IMechanicService } from "../services/mechanic-service";
import { IGameFactory } from "../services/gameFactory/game-factory";
import { TableModel } from "../../logic/table/table-model";

export class GameLoopState implements IState {
  private _stateMachine: IStateMachine;
  private _scoreService: IScoreService;
  private _mechanicService: IMechanicService;
  private _gameFactory: IGameFactory;
  constructor(
    stateMachine: IStateMachine,
    scoreService: IScoreService,
    mechanicService: IMechanicService,
    gameFactory: IGameFactory
  ) {
    this._stateMachine = stateMachine;
    this._scoreService = scoreService;
    this._mechanicService = mechanicService;
    this._gameFactory = gameFactory;
  }
  run(payload: {
    tableModel: TableModel;
    tableController: TableController;
    uiPanelView: UiPanelView;
  }): void {
    const scoreController = new UIPanelController(
      this._scoreService,
      payload.uiPanelView,
      this._mechanicService,
      this._gameFactory
    );

    payload.tableController.onBurn = (groupSize: number) => {
      this._scoreService.nextStep(groupSize);
      scoreController.updateScore();
      if (!this.hasPossibleMoves(payload.tableModel)) {
        this.handleGameEnd(LoseState.name, payload.tableController);
      }
    };

    this._scoreService.onWin = () => {
      this.handleGameEnd(WinState.name, payload.tableController);
    };
    this._scoreService.onLose = () => {
      this.handleGameEnd(LoseState.name, payload.tableController);
    };
  }
  private handleGameEnd(stateName: string, tableController: TableController) {
    this._scoreService.resetResults();
    this._scoreService.resetSteps();
    tableController.clearTable();
    this._stateMachine.run(stateName);
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
