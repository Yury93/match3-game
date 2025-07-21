import type {
  IGlobalGameConfig,
  IPrefabsConfig,
  IPrefabsMenuConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../configs/config-types";
import { AssetProvider } from "../services/asset-provider";
import { GameFactory } from "../services/factories/game-factory";
import { MenuFactory } from "../services/factories/menu-factory";
import { TileFactory } from "../services/factories/tile-factory";
import { VfxFactory } from "../services/factories/vfx-factory";
import { LevelConfigService } from "../services/levels/level-config-service";
import { LevelService } from "../services/levels/level-service";
import { ProgressService } from "../services/levels/progress-service";
import { MovePlayerValidator } from "../services/move-validator";
import type { ServiceLocator } from "../services/serviceLocator";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class InitializeState implements IState {
  private _stateMachine: IStateMachine;
  private _serviceLocator: ServiceLocator;
  constructor(params: {
    stateMachine: IStateMachine;
    serviceLocator: ServiceLocator;
    tileModelsConfig: ITileModelsConfig[];
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
    tilesModelConfig: ITileModelsConfig[];
    prefabsMenuConfig: IPrefabsMenuConfig;
  }) {
    cc.log("run RegisterDependecies");
    const {
      stateMachine,
      serviceLocator,
      tileModelsConfig,
      prefabsConfig,
      gameConfig,
      tableConfig,
      tilesModelConfig,
      prefabsMenuConfig,
    } = params;

    this._serviceLocator = serviceLocator;
    this._stateMachine = stateMachine;
    const assetProvider = new AssetProvider();
    const gameFactory = new GameFactory({
      assetProvider,
      prefabsConfig,
      tableConfig,
      tilesModelConfig,
    });
    const menuFactory = new MenuFactory({
      assetProvider,
      prefabsMenuConfig,
    });
    cc.log("MenuFactory created ", tileModelsConfig);
    const tileFactory = new TileFactory({
      assetProvider,
      tileModelsConfig,
      prefabsConfig,
    });
    const vfxFactory = new VfxFactory(assetProvider, prefabsConfig);
    const levelConfigService = new LevelConfigService(gameConfig);
    const levelService = new LevelService(levelConfigService);
    const progressService = new ProgressService(
      levelService,
      levelConfigService.getScoreFormula(),
    );
    const movePlayerValidator = new MovePlayerValidator();

    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(menuFactory);
    cc.log("MenuFactory registered ", tileModelsConfig);
    this._serviceLocator.registerSingle(gameFactory);
    this._serviceLocator.registerSingle(tileFactory);
    this._serviceLocator.registerSingle(vfxFactory);
    this._serviceLocator.registerSingle(progressService);
    this._serviceLocator.registerSingle(movePlayerValidator);
    this._serviceLocator.registerSingle(levelConfigService);
    this._serviceLocator.registerSingle(levelService);
    this._serviceLocator.registerSingle(progressService);
  }
  run(): void {
    this._stateMachine.run(StateNames.CreateMenuState);
  }

  stop(): void {
    cc.log("Stopping RegisterDependecies");
  }
}
