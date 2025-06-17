import { AssetProvider } from "../services/gameFactory/asset-provider";
import { GameFactory } from "../services/gameFactory/game-factory";
import { MechanicService } from "../services/mechanic-service";
import { ScoreService } from "../services/score-service";
import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { CreateContentState } from "./create-content-state";

export class InitializeState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _serviceLocator: ServiceLocator
  ) {
    console.log("run RegisterDependecies");
    const assetProvider = new AssetProvider();
    const gameFactory = new GameFactory(assetProvider);
    const scoreService = new ScoreService(_stateMachine);
    const mechanicService = new MechanicService(gameFactory);
    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(gameFactory);
    this._serviceLocator.registerSingle(scoreService);
    this._serviceLocator.registerSingle(mechanicService);
  }
  run(): void {
    this._stateMachine.run(CreateContentState.name);
  }

  stop(): void {
    console.log("Stopping RegisterDependecies");
  }
}
