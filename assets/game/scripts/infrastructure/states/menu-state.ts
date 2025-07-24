import type { IState, IStateMachine } from "../state-machine/state-interfaces";
// import { StateNames } from "../state-machine/state-names";

export class MenuState implements IState {
  private _stateMachine: IStateMachine;
  constructor(params: { stateMachine: IStateMachine }) {
    const { stateMachine } = params;
    this._stateMachine = stateMachine;
  }
  run(): void {
    // this._stateMachine.run(StateNames.CreateContent);
  }
  stop(): void {}
}
