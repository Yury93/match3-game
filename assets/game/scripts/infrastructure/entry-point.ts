import { CONFIGS } from "../configs/configs";

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
      prefabsConfig: CONFIGS.PREFABS,
      gameConfig: CONFIGS.GAME_CONFIG,
      tableConfig: CONFIGS.TABLE,
      tilesModelConfig: CONFIGS.TILE_MODELS,
      constantsConfig: CONFIGS.CONSTANTS,
      prefabsMenuConfig: CONFIGS.PREFABS_MENU,
      persistentsPrefabsConfig: CONFIGS.PERSISTENTS_PREFABS,
    });
  }
  private dontDestroyOnLoad() {
    if (!cc.game.isPersistRootNode(this.node)) {
      this.node.parent = null;
      cc.game.addPersistRootNode(this.node);
    }
  }
}
