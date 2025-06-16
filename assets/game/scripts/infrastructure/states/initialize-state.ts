import { AssetProvider } from "../services/gameFactory/asset-provider";
import { GameFactory } from "../services/gameFactory/game-factory";
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
    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(gameFactory);
    this._serviceLocator.registerSingle(scoreService);
  }
  run(): void {
    this._stateMachine.run(CreateContentState.name);
  }

  stop(): void {
    console.log("Stopping RegisterDependecies");
  }
}
