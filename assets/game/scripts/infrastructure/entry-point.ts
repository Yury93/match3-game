import { GAME_CONFIG, PREFABS, TABLE, TILE_MODELS } from "../configs/configs";

import { Game } from "./game";
import { ServiceLocator } from "./services/serviceLocator";

const { ccclass } = cc._decorator;

@ccclass
export class EntryPoint extends cc.Component {
  private _game: Game;

  protected onLoad(): void {
    this._game = new Game({
      serviceLocator: ServiceLocator.container(),
      tileModelConfig: TILE_MODELS,
      prefabsConfig: PREFABS,
      gameConfig: GAME_CONFIG,
      tableConfig: TABLE,
      tilesModelConfig: TILE_MODELS,
    });
  }
}
