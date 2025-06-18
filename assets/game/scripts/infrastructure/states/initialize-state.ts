import { AssetProvider } from "../services/gameFactory/asset-provider";
import { GameFactory } from "../services/gameFactory/game-factory";
import { MechanicService } from "../services/mechanic-service";
import { ProgressService } from "../services/progress-service";
import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";
import { CreateContentState } from "./create-content-state";

export class InitializeState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _serviceLocator: ServiceLocator
  ) {
    console.log("run RegisterDependecies");
    const assetProvider = new AssetProvider();
    const gameFactory = new GameFactory(assetProvider);
    const progressService = new ProgressService(_stateMachine);
    const mechanicService = new MechanicService(gameFactory);
    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(gameFactory);
    this._serviceLocator.registerSingle(progressService);
    this._serviceLocator.registerSingle(mechanicService);
  }
  run(): void {
    this._stateMachine.run(StateNames.CreateContent);
  }

  stop(): void {
    console.log("Stopping RegisterDependecies");
  }
}
