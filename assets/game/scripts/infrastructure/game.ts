import type {
  IConstantsConfig,
  IGlobalGameConfig,
  IPersistentPrefabsConfig,
  IPrefabsConfig,
  IPrefabsMenuConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../configs/config-types";

import type { ServiceLocator } from "./services/serviceLocator";
import { StateMachine } from "./state-machine/game-state-machine";
import { GameStateRegister as GameStatesRegister } from "./state-machine/game-states-register";
import { StateNames } from "./state-machine/state-names";

export class Game {
  private _stateMachine: StateMachine;

  constructor(params: {
    serviceLocator: ServiceLocator;
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
    tilesModelConfig: ITileModelsConfig[];
    constantsConfig: IConstantsConfig;
    prefabsMenuConfig: IPrefabsMenuConfig;
    persistentsPrefabsConfig: IPersistentPrefabsConfig;
  }) {
    const { serviceLocator, ...configs } = params;
    this._stateMachine = new StateMachine({
      serviceLocator,
      stateRegister: new GameStatesRegister(configs),
    });
    this._stateMachine.run(StateNames.Initialize);
  }
}
