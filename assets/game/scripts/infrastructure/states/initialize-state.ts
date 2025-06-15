import { AssetProvider } from "../gameFactory/asset-provider";
import { GameFactory } from "../gameFactory/game-factory";
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
    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(new GameFactory(assetProvider));
  }
  run(): void {
    this._stateMachine.run(CreateContentState.name);
  }

  stop(): void {
    console.log("Stopping RegisterDependecies");
  }
}
