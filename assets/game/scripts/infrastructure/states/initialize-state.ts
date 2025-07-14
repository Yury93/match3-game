import type {
  IGlobalGameConfig,
  IPrefabsConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../configs/config-types";
import { AssetProvider } from "../services/gameFactory/asset-provider";
import { GameFactory } from "../services/gameFactory/game-factory";
import { TileFactory } from "../services/gameFactory/tile-factory";
import { VfxFactory } from "../services/gameFactory/vfx-factory";
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
    } = params;

    this._serviceLocator = serviceLocator;
    this._stateMachine = stateMachine;
    cc.log("InitializeState params ", tileModelsConfig);
    const assetProvider = new AssetProvider();
    const gameFactory = new GameFactory({
      assetProvider,
      prefabsConfig,
      tableConfig,
      tilesModelConfig,
    });
    const tileFactory = new TileFactory({
      assetProvider,
      tileModelsConfig,
      prefabsConfig,
    });
    const vfxFactory = new VfxFactory(assetProvider);
    const levelConfigService = new LevelConfigService(gameConfig);
    const levelService = new LevelService(levelConfigService);
    const progressService = new ProgressService(
      levelService,
      levelConfigService.getScoreFormula(),
    );
    const movePlayerValidator = new MovePlayerValidator();

    this._serviceLocator.registerSingle(assetProvider);
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
    this._stateMachine.run(StateNames.CreateContent);
  }

  stop(): void {
    cc.log("Stopping RegisterDependecies");
  }
}
