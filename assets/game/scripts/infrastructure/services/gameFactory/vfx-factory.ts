import { PREFABS } from "../../../configs/configs";
import { ITile } from "../../../logic/tile";
import { IService } from "../serviceLocator";
import { IAssetProvider } from "./asset-provider";

export interface IVfxFactory extends IService {
  createVfxMessage(node: cc.Node, text: string): cc.Node;
  createVfxBomb(tile: ITile);
}
export class VfxFactory implements IVfxFactory {
  constructor(private _assetProvider: IAssetProvider) {}
  createVfxMessage(node: cc.Node, text: string): cc.Node {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const label = this._assetProvider
        .instantiateAsset(PREFABS.LabelPrefab)
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
    const explosion = this.createBombEffect(tile.sprite.node).getComponent(
      cc.Sprite
    );
    explosion.node.active = true;
    explosion.node.opacity = 0;
    cc.tween(explosion.node)
      .to(0.3, { opacity: 255 }, { easing: cc.easing.sineOut })
      .delay(1)
      .to(0.3, { opacity: 0 }, { easing: cc.easing.sineIn })
      .delay(0.3)
      .call(() => {
        explosion.node.destroy();
      })
      .start();
  }
  private createBombEffect(node: cc.Node) {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const bombEffect = this._assetProvider.instantiateAsset(
        PREFABS.BombEffectPrefab
      );

      const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
      const localPos = director.convertToNodeSpaceAR(worldPos);

      bombEffect.setParent(director);
      bombEffect.setPosition(localPos);
      return bombEffect;
    } catch (error) {
      console.error("Failed to create bomb:", error);
    }
  }
}
