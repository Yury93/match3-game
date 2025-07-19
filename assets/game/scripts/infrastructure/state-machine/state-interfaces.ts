import type { ServiceLocator } from "../services/serviceLocator";

export interface IStateMachine {
  currentState: IState | null;

  run(stateName: string, payload?: unknown): void;
}

export interface IState {
  run(payload?: unknown): void;
  stop(): void;
}
export interface IGameStates {
  [stateName: string]: IState;
}
export interface IStateRegister {
  registerStates(params: {
    serviceLocator: ServiceLocator;
    stateMachine: IStateMachine;
  }): IGameStates;
}
