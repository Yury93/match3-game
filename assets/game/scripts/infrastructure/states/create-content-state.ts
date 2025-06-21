import { ITableView } from "../../logic/table/table-view";
import { TableCell } from "../../logic/table-cell";
import { ITableModel } from "../../logic/table/table-model";
import { ITile } from "../../logic/tile";
import { IGameFactory } from "../services/gameFactory/game-factory";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { ITableController } from "../../logic/table/table-controller";
import { StateNames } from "../state-machine/state-names";
import { ITileFactory } from "../services/gameFactory/tile-factory";
import { IUIPanelView } from "../../ui/ui-panel";
import { IVfxFactory } from "../services/gameFactory/vfx-factory";
import { MechanicController } from "../../logic/game-mechanic/mechanic-controller";

export class CreateContentState implements IState {
  private _gameFactory: IGameFactory;
  private _tilesFactory: ITileFactory;
  private _stateMachine: IStateMachine;
  private _tableView: ITableView = null;
  private _tableCell: TableCell[][] = null;
  private _uiPanelView: IUIPanelView = null;
  private _isLoadAssets: boolean = false;
  private _vfxFactory: IVfxFactory;
  constructor(
    stateMachine: IStateMachine,
    gameFactory: IGameFactory,
    tilesFctory: ITileFactory,
    vfxFactory: IVfxFactory
  ) {
    this._stateMachine = stateMachine;
    this._gameFactory = gameFactory;
    this._tilesFactory = tilesFctory;
    this._vfxFactory = vfxFactory;
  }
  async run(): Promise<void> {
    console.log("run create content state");
    if (!this._isLoadAssets) {
      await this._gameFactory.loadAssets();
      this._isLoadAssets = true;
    }
    this.destroyContent();
    this.createContent();
  }
  destroyContent() {
    if (this._tableView) {
      this._tableView.nodeView.destroy();
      this._tableView = null;
    }
    if (this._uiPanelView) {
      this._uiPanelView.nodeView.destroy();
      this._uiPanelView = null;
    }
  }

  private createContent() {
    this._tableView = this._gameFactory.createTableView();
    this._uiPanelView = this._gameFactory.createUiPanelView();
    const content = this._tableView.getContent();
    const uiPanelView: IUIPanelView = this._uiPanelView;

    this._tableCell = this._gameFactory.createTableCells(content);

    const tiles: ITile[][] = this._tilesFactory.createTiles(this._tableCell);

    const tableModel: ITableModel = this._gameFactory.createTableModel(
      this._tableCell,
      tiles
    );
    const tableController: ITableController =
      this._gameFactory.createTableController(
        this._tableView,
        tableModel,
        this._vfxFactory
      );
    const mechanicController = new MechanicController(
      this._tilesFactory,
      tableController,
      tableModel
    );

    tableController.setMechanicController(mechanicController);

    this._stateMachine.run(StateNames.GameLoop, {
      tableModel,
      tableController,
      uiPanelView,
      mechanicController: mechanicController,
    });
  }
  stop(): void {
    console.log("stop create content state");
  }
}
