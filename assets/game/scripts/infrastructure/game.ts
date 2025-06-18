import { ServiceLocator } from "./services/serviceLocator";
import { StateMachine } from "./state-machine/game-state-machine";
import { IStateMachine } from "./state-machine/state-interfaces";
import { StateNames } from "./state-machine/state-names";
import { InitializeState } from "./states/initialize-state";

export class Game {
  public stateMachine: IStateMachine;

  constructor(serviceLocator: ServiceLocator) {
    console.log("start create state machine");
    this.stateMachine = new StateMachine(serviceLocator);
    console.log(
      "this.stateMachine.run(StateNames.Initialize);  / StateArgument:",
      StateNames.Initialize
    );
    this.stateMachine.run(StateNames.Initialize);
  }
}
