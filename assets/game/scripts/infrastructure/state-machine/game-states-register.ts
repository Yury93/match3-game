import {
  IGlobalGameConfig,
  IPrefabsConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../configs/config-types";
import { GameFactory } from "../services/gameFactory/game-factory";
import { TileFactory } from "../services/gameFactory/tile-factory";
import { VfxFactory } from "../services/gameFactory/vfx-factory";
import { LevelService } from "../services/levels/level-service";
import { ProgressService } from "../services/levels/progress-service";
import { MovePlayerValidator } from "../services/move-validator";
import { ServiceLocator } from "../services/serviceLocator";
import { CreateContentState } from "../states/create-content-state";
import { GameLoopState } from "../states/game-loop-state";
import { InitializeState } from "../states/initialize-state";
import { ResultState } from "../states/result-state";
import { IGameStates, IStateMachine, IStateRegister } from "./state-interfaces";

export class GameStateRegister implements IStateRegister {
  private _tileModelConfig: ITileModelsConfig[];
  private _prefabsConfig: IPrefabsConfig;
  private _gameConfig: IGlobalGameConfig;
  private _tableConfig: ITableConfig[];
  constructor(params: {
    tileModelConfig: ITileModelsConfig[];
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
  }) {
    const { tileModelConfig, prefabsConfig, gameConfig, tableConfig } = params;
    this._gameConfig = gameConfig;
    this._tileModelConfig = tileModelConfig;
    this._prefabsConfig = prefabsConfig;
    this._tableConfig = tableConfig;
  }
  registerStates(params: {
    serviceLocator: ServiceLocator;
    stateMachine: IStateMachine;
  }): IGameStates {
    const { serviceLocator, stateMachine } = params;
    const states: IGameStates = {
      InitializeState: new InitializeState({
        stateMachine: stateMachine,
        serviceLocator,
        tileModelsConfig: this._tileModelConfig,
        prefabsConfig: this._prefabsConfig,
        gameConfig: this._gameConfig,
        tableConfig: this._tableConfig,
      }),
      CreateContentState: new CreateContentState(
        stateMachine,
        serviceLocator.single(GameFactory),
        serviceLocator.single(TileFactory),
        serviceLocator.single(VfxFactory),
        serviceLocator.single(ProgressService),
        serviceLocator.single(LevelService)
      ),
      GameLoopState: new GameLoopState(
        stateMachine,
        serviceLocator.single(ProgressService),
        serviceLocator.single(MovePlayerValidator)
      ),
      ResultState: new ResultState(
        stateMachine,
        serviceLocator.single(GameFactory),
        serviceLocator.single(ProgressService)
      ),
    };

    console.log("States registered:", Object.keys(states));
    return states;
  }
}
