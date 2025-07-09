import { GAME_CONFIG, PREFABS, TABLE, TILE_MODELS } from "../configs/configs";
import { Game } from "./game";
import { ServiceLocator } from "./services/serviceLocator";

const { ccclass } = cc._decorator;

@ccclass
export default class EntryPoint extends cc.Component {
  private _game: Game;

  protected onLoad(): void {
    console.log("start create game");

    this._game = new Game({
      serviceLocator: ServiceLocator.Container(),
      tileModelConfig: TILE_MODELS,
      prefabsConfig: PREFABS,
      gameConfig: GAME_CONFIG,
      tableConfig: TABLE,
    });
  }
}
