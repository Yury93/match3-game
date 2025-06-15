
export interface IStateMachine {
  currentState: IState | null;

  run(stateName: string): void;
}

export interface IState {
  run(): void;
  stop(): void;
}
