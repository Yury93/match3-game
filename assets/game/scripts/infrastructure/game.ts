import type {
  IGlobalGameConfig,
  IPrefabsConfig,
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
    tileModelConfig: ITileModelsConfig[];
    prefabsConfig: IPrefabsConfig;
    gameConfig: IGlobalGameConfig;
    tableConfig: ITableConfig[];
    tilesModelConfig: ITileModelsConfig[];
  }) {
    const { serviceLocator, ...configs } = params;
    this._stateMachine = new StateMachine({
      serviceLocator,
      stateRegister: new GameStatesRegister(configs),
    });
    this._stateMachine.run(StateNames.Initialize);
  }
}
