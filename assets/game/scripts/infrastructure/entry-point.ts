import { Game } from "./game";
import { ServiceLocator } from "./services/serviceLocator";

const { ccclass } = cc._decorator;

@ccclass
export default class EntryPoint extends cc.Component {
  private _game: Game;

  protected onLoad(): void {
    this._game = new Game(ServiceLocator.Container());
  }
}
