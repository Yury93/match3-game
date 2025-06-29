import { GameLoopHandler, IGameLoopHandler } from "../../logic/game-loop-handler"; 
import { IProgressService } from "../services/levels/progress-service";
import { MovePlayerValidator } from "../services/move-validator";
import { IGameLoopPayload } from "../state-machine/payloads";
import { IState, IStateMachine } from "../state-machine/state-interfaces"; 

export class GameLoopState implements IState { 
  private _gameLoopHandler: IGameLoopHandler;
  constructor(
    private _stateMachine: IStateMachine,
    private _progressService: IProgressService,
    private _movePlayerValidator: MovePlayerValidator
  ) {}

  run<T>(payload:T & IGameLoopPayload): void {
   
  this._gameLoopHandler = new GameLoopHandler();
  this._gameLoopHandler.init(this._stateMachine,this._progressService,payload,this._movePlayerValidator);
 
  } 
  stop(): void {}
}
