import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "./state-interfaces";
import { CreateContentState } from "../states/create-content-state";
import { GameFactory } from "../services/gameFactory/game-factory";
import { GameLoopState } from "../states/game-loop-state";
import { ProgressService } from "../services/progress-service";
import { WinState } from "../states/win-state";
import { LoseState } from "../states/lose-state";
import { InitializeState } from "../states/initialize-state";
import { TileFactory } from "../services/gameFactory/tile-factory";
import { VfxFactory } from "../services/gameFactory/vfx-factory";

export class StateMachine implements IStateMachine {
  private _states: Record<string, IState>;
  public currentState: IState | null = null;
  constructor(serviceLocator: ServiceLocator) {
    console.log("start register process states in state machine");
    this.registerStates(serviceLocator);
    console.log("end register process");
  }

  registerStates(serviceLocator: ServiceLocator) {
    this._states = {
      InitializeState: new InitializeState(this, serviceLocator),
      CreateContentState: new CreateContentState(
        this,
        serviceLocator.single(GameFactory),
        serviceLocator.single(TileFactory),
        serviceLocator.single(VfxFactory)
      ),
      GameLoopState: new GameLoopState(
        this,
        serviceLocator.single(ProgressService)
      ),
      WinState: new WinState(this, serviceLocator.single(GameFactory)),
      LoseState: new LoseState(this, serviceLocator.single(GameFactory)),
    };

    console.log("States registered:", Object.keys(this._states));
  }

  run(stateName: string, payload?: any): void {
    const state = this._states[stateName];

    if (!state) {
      console.error(
        "State not registered:",
        stateName,
        `/ all keys: ${Object.keys(this._states)}`
      );
      return;
    }

    this.currentState?.stop();
    this.currentState = state;
    state.run(payload);
  }
}
