import type { IConstantsConfig } from "../../configs/config-types";
import { BoosterHandler } from "../../logic/game-mechanic/booster-handler";
import { MechanicController } from "../../logic/game-mechanic/mechanic-controller";
import { ProgressController } from "../../logic/progress-controller";
import type { TableCell } from "../../logic/table-cell";
import type { ITableController } from "../../logic/table/table-controller";
import type { ITableModel } from "../../logic/table/table-model";
import type { ITableView } from "../../logic/table/table-view";
import type { ITile } from "../../logic/tile";
import type { IUIPanelView } from "../../ui/ui-panel";
import { UIPanelController } from "../../ui/ui-panel-controller";
import type { IGameFactory } from "../services/gameFactory/game-factory";
import type { ITileFactory } from "../services/gameFactory/tile-factory";
import type { IVfxFactory } from "../services/gameFactory/vfx-factory";
import type { LevelService } from "../services/levels/level-service";
import type { IProgressService } from "../services/levels/progress-service";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class CreateContentState implements IState {
  private _tableView: ITableView = null;
  private _uiPanelView: IUIPanelView = null;
  private _isLoadAssets: boolean = false;

  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory,
    private _tilesFactory: ITileFactory,
    private _vfxFactory: IVfxFactory,
    private _progressService: IProgressService,
    private _levelService: LevelService,
    private _constantsConfig: IConstantsConfig,
  ) {}
  async run(): Promise<void> {
    cc.log("run create content state");
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
    this.createViews();
    const tableCells = this.createTableCells();
    const tiles = this.createTiles(tableCells);
    const tableModel = this.createTableModel(tableCells, tiles);
    const tableController = this.createTableController(tableModel);
    const mechanicController = this.createMechanicController(
      tableController,
      tableModel,
    );

    tableController.setMechanicController(mechanicController);

    const boosterHandler = this.createBoosterHandler();
    const progressController = this.createProgressController();
    const uiPanelController = this.createUIPanelController(
      mechanicController,
      boosterHandler,
      progressController,
    );

    this.startGameLoopState(
      tableModel,
      tableController,
      boosterHandler,
      progressController,
      uiPanelController,
    );
  }

  private createViews() {
    this._tableView = this._gameFactory.createTableView();
    this._uiPanelView = this._gameFactory.createUiPanelView();
  }

  private createTableCells(): TableCell[][] {
    const content = this._tableView.getContent();
    return this._gameFactory.createTableCells(content);
  }

  private createTiles(tableCells: TableCell[][]): ITile[][] {
    return this._tilesFactory.createTiles(tableCells);
  }

  private createTableModel(
    tableCells: TableCell[][],
    tiles: ITile[][],
  ): ITableModel {
    return this._gameFactory.createTableModel(tableCells, tiles);
  }

  private createTableController(tableModel: ITableModel): ITableController {
    return this._gameFactory.createTableController(
      this._tableView,
      tableModel,
      this._vfxFactory,
    );
  }

  private createMechanicController(
    tableController: ITableController,
    tableModel: ITableModel,
  ): MechanicController {
    return new MechanicController(
      this._tilesFactory,
      tableController,
      tableModel,
      this._constantsConfig,
    );
  }

  private createBoosterHandler(): BoosterHandler {
    return new BoosterHandler(
      this._constantsConfig.bombTrials,
      this._constantsConfig.teleportTrials,
    );
  }

  private createProgressController(): ProgressController {
    return new ProgressController(this._progressService, this._levelService);
  }

  private createUIPanelController(
    mechanicController: MechanicController,
    boosterHandler: BoosterHandler,
    progressController: ProgressController,
  ): UIPanelController {
    return new UIPanelController(
      progressController,
      this._progressService,
      this._uiPanelView,
      mechanicController,
      boosterHandler,
    );
  }

  private startGameLoopState(
    tableModel: ITableModel,
    tableController: ITableController,
    boosterHandler: BoosterHandler,
    progressController: ProgressController,
    uiPanelController: UIPanelController,
  ) {
    this._stateMachine.run(StateNames.GameLoop, {
      tableModel,
      tableController,
      uiPanelView: this._uiPanelView,
      uiPanelController,
      boosterHandler,
      progressController,
    });
  }

  stop(): void {
    cc.log("stop create content state");
  }
}
