import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "./state-interfaces";
import { InitializeState } from "../states/initialize-state";
import { CreateContentState } from "../states/create-content-state";
import { GameFactory } from "../services/gameFactory/game-factory";
import { GameLoopState } from "../states/game-loop-state";
import { ScoreService } from "../services/score-service";
import { WinState } from "../states/win-state";
import { LoseState } from "../states/lose-state";

export class StateMachine implements IStateMachine {
  private _states: Record<string, IState>;
  public currentState: IState | null = null;
  constructor(serviceLocator: ServiceLocator) {
    this.registerStates(serviceLocator);
  }

  registerStates(serviceLocator: ServiceLocator) {
    this._states = {
      InitializeState: new InitializeState(this, serviceLocator),
      CreateContentState: new CreateContentState(
        this,
        serviceLocator.single(GameFactory)
      ),
      GameLoopState: new GameLoopState(
        this,
        serviceLocator.single(ScoreService)
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
