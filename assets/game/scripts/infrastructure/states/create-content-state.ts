import TableView from "../../logic/table/table-view";
import { TableCell } from "../../logic/table-cell";
import { TableModel } from "../../logic/table/table-model";
import Tile from "../../logic/tile";
import { IGameFactory } from "../services/gameFactory/game-factory";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { GameLoopState } from "./game-loop-state";
import UiPanelView from "../../ui/ui-panel";
import { TableController } from "../../logic/table/table-controller";
import { IMechanicService } from "../services/mechanic-service";

export class CreateContentState implements IState {
  private _gameFactory: IGameFactory;
  private _stateMachine: IStateMachine;
  private _mechanicService: IMechanicService;
  private _tableView: TableView = null;
  private _tableCell: TableCell[][] = null;
  private _uiPanelView: UiPanelView = null;
  private _isLoadAssets: boolean = false;

  constructor(
    stateMachine: IStateMachine,
    gameFactory: IGameFactory,
    mechanicService: IMechanicService
  ) {
    this._stateMachine = stateMachine;
    this._gameFactory = gameFactory;
    this._mechanicService = mechanicService;
  }
  async run(): Promise<void> {
    console.log("run create content state");
    if (!this._isLoadAssets) {
      await this._gameFactory.loadAssets();
      this._isLoadAssets = true;
    }
    this.createContent();
  }

  private createContent() {
    if (this._tableView === null)
      this._tableView = this._gameFactory.createTableView();
    if (this._uiPanelView === null)
      this._uiPanelView = this._gameFactory.createUiPanelView();
    const content = this._tableView.getContent();
    this._tableCell = this._gameFactory.createTableCells(content);

    const tiles: Tile[][] = this._gameFactory.createTiles(
      this._tableCell,
      content
    );

    const tableModel: TableModel = this._gameFactory.createTableModel(
      this._tableCell,
      tiles
    );
    const tableController: TableController =
      this._gameFactory.createTableController(
        this._tableView,
        tableModel,
        this._mechanicService
      );

    const uiPanelView: UiPanelView = this._uiPanelView;
    this._stateMachine.run(GameLoopState.name, {
      tableModel,
      tableController,
      uiPanelView,
    });
  }
  stop(): void {
    console.log("stop create content state");
  }
}
