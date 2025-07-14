import type { ServiceLocator } from "../services/serviceLocator";

import type { IState, IStateMachine, IStateRegister } from "./state-interfaces";

export class StateMachine implements IStateMachine {
  private _states: Record<string, IState>;
  public currentState: IState | null = null;
  constructor(params: {
    stateRegister: IStateRegister;
    serviceLocator: ServiceLocator;
  }) {
    const { stateRegister, serviceLocator } = params;
    this._states = stateRegister.registerStates({
      serviceLocator,
      stateMachine: this,
    });
  }
  run(stateName: string, payload?: any): void {
    const state = this._states[stateName];

    if (!state) {
      cc.error(
        "State not registered:",
        stateName,
        `/ all keys: ${Object.keys(this._states)}`,
      );
      return;
    }

    this.currentState?.stop();
    this.currentState = state;
    state.run(payload);
  }
}
