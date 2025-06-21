import { AssetProvider } from "../services/gameFactory/asset-provider";
import { GameFactory } from "../services/gameFactory/game-factory";
import { TileFactory } from "../services/gameFactory/tile-factory";
import { VfxFactory } from "../services/gameFactory/vfx-factory";
import { ProgressService } from "../services/progress-service";
import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class InitializeState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _serviceLocator: ServiceLocator
  ) {
    console.log("run RegisterDependecies");
    const assetProvider = new AssetProvider();
    const gameFactory = new GameFactory(assetProvider);
    const tileFactory = new TileFactory(assetProvider);
    const vfxFactory = new VfxFactory(assetProvider);
    const progressService = new ProgressService(_stateMachine);

    this._serviceLocator.registerSingle(assetProvider);
    this._serviceLocator.registerSingle(gameFactory);
    this._serviceLocator.registerSingle(tileFactory);
    this._serviceLocator.registerSingle(vfxFactory);
    this._serviceLocator.registerSingle(progressService);
  }
  run(): void {
    this._stateMachine.run(StateNames.CreateContent);
  }

  stop(): void {
    console.log("Stopping RegisterDependecies");
  }
}
