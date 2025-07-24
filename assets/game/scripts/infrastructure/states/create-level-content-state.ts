import type { IConstantsConfig } from "../../configs/config-types";
import { BoosterHandler } from "../../game-logic/game-mechanic/booster-handler";
import { MechanicController } from "../../game-logic/game-mechanic/mechanic-controller";
import { ProgressLevelController } from "../../game-logic/progress-level-controller";
import type { TableCell } from "../../game-logic/table-cell";
import type { ITableController } from "../../game-logic/table/table-controller";
import type { ITableModel } from "../../game-logic/table/table-model";
import type { ITableView } from "../../game-logic/table/table-view";
import type { ITile } from "../../game-logic/tile";
import type { IUIPanelView } from "../../game-logic/ui/ui-panel";
import { UIPanelController } from "../../game-logic/ui/ui-panel-controller";
import type { IGameFactory } from "../services/factories/game-factory";
import type { ITileFactory } from "../services/factories/tile-factory";
import type { IVfxFactory } from "../services/factories/vfx-factory";
import type { LevelService } from "../services/levels/level-service";
import type { IProgressService } from "../services/levels/progress-service";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class CreateLevelContentState implements IState {
  private _tableView: ITableView = null;
  private _uiPanelView: IUIPanelView = null;

  private _stateMachine: IStateMachine;
  private _gameFactory: IGameFactory;
  private _tilesFactory: ITileFactory = null;
  private _vfxFactory: IVfxFactory = null;
  private _progressService: IProgressService = null;
  private _levelService: LevelService = null;
  private _constantsConfig: IConstantsConfig = null;
  constructor(params: {
    stateMachine: IStateMachine;
    gameFactory: IGameFactory;
    tilesFactory: ITileFactory;
    vfxFactory: IVfxFactory;
    progressService: IProgressService;
    levelService: LevelService;
    constantsConfig: IConstantsConfig;
  }) {
    const {
      stateMachine,
      gameFactory,
      tilesFactory,
      vfxFactory,
      progressService,
      levelService,
      constantsConfig,
    } = params;
    this._stateMachine = stateMachine;
    this._gameFactory = gameFactory;
    this._tilesFactory = tilesFactory;
    this._vfxFactory = vfxFactory;
    this._progressService = progressService;
    this._levelService = levelService;
    this._constantsConfig = constantsConfig;
  }
  async run(): Promise<void> {
    cc.log("run create level content state");

    await this._gameFactory.loadAssets();

    this.createContent();
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

  private createProgressController(): ProgressLevelController {
    return new ProgressLevelController(
      this._progressService,
      this._levelService,
    );
  }

  private createUIPanelController(
    mechanicController: MechanicController,
    boosterHandler: BoosterHandler,
    progressController: ProgressLevelController,
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
    progressController: ProgressLevelController,
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
