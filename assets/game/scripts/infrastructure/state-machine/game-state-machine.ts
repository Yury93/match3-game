import { ServiceLocator } from "../services/serviceLocator";
import { GameStateRegister } from "./game-states-register";
import { IState, IStateMachine } from "./state-interfaces";

export class StateMachine implements IStateMachine {
  private _states: Record<string, IState>;
  public currentState: IState | null = null;
  constructor(params: {
    stateRegister: GameStateRegister;
    serviceLocator: ServiceLocator;
  }) {
    const { stateRegister, serviceLocator } = params;
    this._states = stateRegister.registerStates({
      serviceLocator: serviceLocator,
      stateMachine: this,
    });
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
