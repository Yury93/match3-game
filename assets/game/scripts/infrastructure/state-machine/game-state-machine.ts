import { ServiceLocator } from "../services/serviceLocator";
import { IState, IStateMachine } from "./state-interfaces";
import { InitializeState } from "../states/initialize-state";
import { CreateContentState } from "../states/create-content-state";
import { GameFactory } from "../gameFactory/game-factory";

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
        serviceLocator.single(GameFactory)
      ),
    };

    console.log("States registered:", Object.keys(this._states));
  }

  run(stateName: string): void {
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
    state.run();
  }
}
