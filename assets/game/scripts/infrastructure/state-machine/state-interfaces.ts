export interface IStateMachine {
  currentState: IState | null;

  run(stateName: string, payload?: any): void;
}

export interface IState {
  run(payload?: any): void;
  stop(): void;
}
