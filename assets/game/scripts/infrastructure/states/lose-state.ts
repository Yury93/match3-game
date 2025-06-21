import { IGameFactory } from "../services/gameFactory/game-factory";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class LoseState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory
  ) {}
  run(): void {
    const curtain = this._gameFactory.createCurtain();
    curtain.lose();
    curtain.onRestart = () => {
      this._stateMachine.run(StateNames.CreateContent);
    };
  }
  stop(): void {}
}
