import type { ServiceLocator } from "../services/serviceLocator";
import { InitializeState } from "../states/initialize-state";
import { CreateLevelContentState } from "../states/create-level-content-state";
import { GameFactory } from "../services/factories/game-factory";
import { TileFactory } from "../services/factories/tile-factory";
import { VfxFactory } from "../services/factories/vfx-factory";
import { ProgressGameService } from "../services/levels/progress-service";
import { LevelService } from "../services/levels/level-service";
import { GameLoopState } from "../states/game-loop-state";
import { MovePlayerValidator } from "../services/move-validator";
import { ResultState } from "../states/result-state";
import type {
  IConstantsConfig,
  IGlobalGameConfig,
  IPersistentPrefabsConfig,
  IPrefabsConfig,
  IPrefabsMenuConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../configs/config-types";
import { CreateMenuState } from "../states/create-menu-state";
import { MenuState } from "../states/menu-state";
import { MenuFactory } from "../services/factories/menu-factory";

import type {
  IGameStates,
  IStateMachine,
  IStateRegister,
} from "./state-interfaces";
import { LoadSceneState } from "../states/load-scene-state";

export class GameStateRegister implements IStateRegister {
  private _tileModelConfig: ITileModelsConfig[];
  private _prefabsConfig: IPrefabsConfig;
  private _gameConfig: IGlobalGameConfig;
  private _tableConfig: ITableConfig[];
  private _constantsConfig: IConstantsConfig;
  private _prefabsMenuConfig: IPrefabsMenuConfig;
  private _persistentsPrefabsConfig: IPersistentPrefabsConfig;
  constructor(params: {
    tilesModelConfig: ITileModelsConfig[];
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
    constantsConfig: IConstantsConfig;
    prefabsMenuConfig: IPrefabsMenuConfig;
    persistentsPrefabsConfig: IPersistentPrefabsConfig;
  }) {
    const {
      tilesModelConfig,
      prefabsConfig,
      gameConfig,
      tableConfig,
      constantsConfig,
      prefabsMenuConfig,
      persistentsPrefabsConfig,
    } = params;
    this._gameConfig = gameConfig;
    this._tileModelConfig = tilesModelConfig;
    this._prefabsConfig = prefabsConfig;
    this._tableConfig = tableConfig;
    this._constantsConfig = constantsConfig;
    this._prefabsMenuConfig = prefabsMenuConfig;
    this._persistentsPrefabsConfig = persistentsPrefabsConfig;
  }
  registerStates(params: {
    serviceLocator: ServiceLocator;
    stateMachine: IStateMachine;
  }): IGameStates {
    const { serviceLocator, stateMachine } = params;
    const states: IGameStates = {
      InitializeState: new InitializeState({
        stateMachine,
        serviceLocator,
        tileModelsConfig: this._tileModelConfig,
        prefabsConfig: this._prefabsConfig,
        gameConfig: this._gameConfig,
        tableConfig: this._tableConfig,
        tilesModelConfig: this._tileModelConfig,
        prefabsMenuConfig: this._prefabsMenuConfig,
        persistentsPrefabsConfig: this._persistentsPrefabsConfig,
      }),
      CreateMenuState: new CreateMenuState({
        stateMachine,
        menuFactory: serviceLocator.single(MenuFactory),
        levelService: serviceLocator.single(LevelService),
      }),
      MenuState: new MenuState({ stateMachine }),
      CreateLevelContentState: new CreateLevelContentState({
        stateMachine,
        gameFactory: serviceLocator.single(GameFactory),
        tilesFactory: serviceLocator.single(TileFactory),
        vfxFactory: serviceLocator.single(VfxFactory),
        progressService: serviceLocator.single(ProgressGameService),
        levelService: serviceLocator.single(LevelService),
        constantsConfig: this._constantsConfig,
      }),
      GameLoopState: new GameLoopState(
        stateMachine,
        serviceLocator.single(ProgressGameService),
        serviceLocator.single(MovePlayerValidator),
      ),
      ResultState: new ResultState(
        stateMachine,
        serviceLocator.single(GameFactory),
      ),
      LoadSceneState: new LoadSceneState({
        gameFactory: serviceLocator.single(GameFactory),
        stateMachine,
      }),
    };

    cc.log("States registered:", Object.keys(states));
    return states;
  }
}
