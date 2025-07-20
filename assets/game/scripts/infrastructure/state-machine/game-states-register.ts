import type { ServiceLocator } from "../services/serviceLocator";
import { InitializeState } from "../states/initialize-state";
import { CreateContentState } from "../states/create-content-state";
import { GameFactory } from "../services/gameFactory/game-factory";
import { TileFactory } from "../services/gameFactory/tile-factory";
import { VfxFactory } from "../services/gameFactory/vfx-factory";
import { ProgressService } from "../services/levels/progress-service";
import { LevelService } from "../services/levels/level-service";
import { GameLoopState } from "../states/game-loop-state";
import { MovePlayerValidator } from "../services/move-validator";
import { ResultState } from "../states/result-state";
import type {
  IConstantsConfig,
  IGlobalGameConfig,
  IPrefabsConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../configs/config-types";

import type {
  IGameStates,
  IStateMachine,
  IStateRegister,
} from "./state-interfaces";

export class GameStateRegister implements IStateRegister {
  private _tileModelConfig: ITileModelsConfig[];
  private _prefabsConfig: IPrefabsConfig;
  private _gameConfig: IGlobalGameConfig;
  private _tableConfig: ITableConfig[];
  private _constantsConfig: IConstantsConfig;
  constructor(params: {
    tilesModelConfig: ITileModelsConfig[];
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
    constantsConfig: IConstantsConfig;
  }) {
    const {
      tilesModelConfig,
      prefabsConfig,
      gameConfig,
      tableConfig,
      constantsConfig: constantsConfig,
    } = params;
    this._gameConfig = gameConfig;
    this._tileModelConfig = tilesModelConfig;
    this._prefabsConfig = prefabsConfig;
    this._tableConfig = tableConfig;
    this._constantsConfig = constantsConfig;
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
      }),
      CreateContentState: new CreateContentState({
        stateMachine,
        gameFactory: serviceLocator.single(GameFactory),
        tilesFactory: serviceLocator.single(TileFactory),
        vfxFactory: serviceLocator.single(VfxFactory),
        progressService: serviceLocator.single(ProgressService),
        levelService: serviceLocator.single(LevelService),
        constantsConfig: this._constantsConfig,
      }),
      GameLoopState: new GameLoopState(
        stateMachine,
        serviceLocator.single(ProgressService),
        serviceLocator.single(MovePlayerValidator),
      ),
      ResultState: new ResultState(
        stateMachine,
        serviceLocator.single(GameFactory),
        serviceLocator.single(ProgressService),
      ),
    };

    cc.log("States registered:", Object.keys(states));
    return states;
  }
}
