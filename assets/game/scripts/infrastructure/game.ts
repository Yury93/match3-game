import { ServiceLocator } from "./services/serviceLocator";
import { StateMachine } from "./state-machine/game-state-machine";
import { IStateMachine } from "./state-machine/state-interfaces";
import { InitializeState } from "./states/initialize-state";

export class Game {
  public stateMachine: IStateMachine;

  constructor(serviceLocator: ServiceLocator) {
    this.stateMachine = new StateMachine(serviceLocator);

    this.stateMachine.run(InitializeState.name);
  }
}
