import {
  CONSTANTS,
  GAME_CONFIG,
  PREFABS,
  PREFABS_MENU,
  TABLE,
  TILE_MODELS,
} from "../configs/configs";

import { Game } from "./game";
import { ServiceLocator } from "./services/serviceLocator";

const { ccclass } = cc._decorator;

@ccclass
export class EntryPoint extends cc.Component {
  private _game: Game;

  protected onLoad(): void {
    this.dontDestroyOnLoad();
    this._game = new Game({
      serviceLocator: ServiceLocator.container(),
      prefabsConfig: PREFABS,
      gameConfig: GAME_CONFIG,
      tableConfig: TABLE,
      tilesModelConfig: TILE_MODELS,
      constantsConfig: CONSTANTS,
      prefabsMenuConfig: PREFABS_MENU,
    });
  }
  private dontDestroyOnLoad() {
    if (cc.game.isPersistRootNode(this.node)) {
      this.node.parent = null;
      cc.game.addPersistRootNode(this.node);
    }
  }
}
