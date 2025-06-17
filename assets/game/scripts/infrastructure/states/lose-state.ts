import { IGameFactory } from "../services/gameFactory/game-factory";
import { IProgressService } from "../services/progress-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { CreateContentState } from "./create-content-state";

export class LoseState implements IState {
  constructor(
    private _stateMachine: IStateMachine,
    private _gameFactory: IGameFactory
  ) {}
  run(): void {
    const curtain = this._gameFactory.createCurtain();
    curtain.lose();
    curtain.onRestart = () => {
      this._stateMachine.run(CreateContentState.name);
    };
  }
  stop(): void {}
}
