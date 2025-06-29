import { IPayload } from "./payloads";

export interface IStateMachine {
  currentState: IState<IPayload>  | null;

  run<T extends IPayload>(stateName: string, payload?: T): void;
}

export interface IState<T = void> {
  run(payload?: T): void;
  stop(): void;
}
