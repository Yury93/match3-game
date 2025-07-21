import type { IAssetProvider } from "../asset-provider";

export abstract class AbstractFactory {
  constructor(protected _assetProvider: IAssetProvider) {}
  protected instantiateOnCanvas<T extends cc.Component>(prefabPath: string): T {
    const director = cc.director.getScene().getChildByName("Canvas");
    const node = this._assetProvider.instantiateAsset<cc.Node>(prefabPath);

    node.setParent(director);
    node.setPosition(0, 0);

    const instance = node.getComponent<T>(node.constructor);
    if (!instance) {
      throw new Error("instantiateOnCanvas: Component not found");
    }

    return instance;
  }
  protected async handleAssets(
    path: string[],
    action: (path: string) => Promise<cc.Asset> | void,
  ): Promise<void> {
    await Promise.all(path.map((path) => action(path)));
  }
}
