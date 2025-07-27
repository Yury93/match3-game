import type { IPrefabsConfig } from "../../../configs/config-types";
import type { ITile } from "../../../game-logic/tile";
import type { IAssetProvider } from "../asset-provider";
import type { IService } from "../serviceLocator";

export interface IVfxFactory extends IService {
  createVfxMessage(node: cc.Node, text: string): cc.Node;
  createVfxBomb(tile: ITile);
}
export class VfxFactory implements IVfxFactory {
  constructor(
    private _assetProvider: IAssetProvider,
    private _prefabsConfig: IPrefabsConfig,
  ) {}
  createVfxMessage(node: cc.Node, text: string): cc.Node {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const label = this._assetProvider
        .instantiateAsset(this._prefabsConfig.labelPrefab)
        .getComponent(cc.Label);

      const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
      const localPos = director.convertToNodeSpaceAR(worldPos);

      label.node.setParent(director);
      label.node.setPosition(localPos);

      label.string = text;
      return label.node;
    } catch (error) {
      throw new Error("Failed to create vfx message: " + error);
    }
  }
  createVfxBomb(tile: ITile) {
    this.createBombEffect(tile.sprite.node);
  }

  private createBombEffect(node: cc.Node) {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");

      const bombEffectNode = this._assetProvider.instantiateAsset(
        this._prefabsConfig.bombEffectPrefab,
      );
      if (!bombEffectNode) {
        cc.error("Failed to instantiate prefab");
        return null;
      }

      const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
      const localPos = director.convertToNodeSpaceAR(worldPos);

      bombEffectNode.parent = director;
      bombEffectNode.setPosition(localPos);

      return bombEffectNode.getComponent(cc.Component) || bombEffectNode;
    } catch (error) {
      cc.error("Failed to create bomb effect:", error);
      return null;
    }
  }
}
