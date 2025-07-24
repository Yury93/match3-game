import type { IAssetLoader, IAssetProvider } from "../asset-provider";

export abstract class AbstractFactory implements IAssetLoader {
  constructor(protected _assetProvider: IAssetProvider) {}
  async handleAssets(
    path: string[],
    action: (path: string) => Promise<cc.Asset> | void,
  ): Promise<void> {
    await Promise.all(path.map((path) => action(path)));
  }

  protected instantiateOnCanvas<T>(
    prefabPath: string,
    component: { new (...args: unknown[]): cc.Component },
  ): T {
    const director = cc.director.getScene().getChildByName("Canvas");
    const node = this._assetProvider.instantiateAsset(prefabPath);

    node.setParent(director);
    node.setPosition(0, 0);

    const instance: T = node.getComponent(component);
    if (!instance) {
      throw new Error("instantiateOnCanvas: Component not found");
    }

    return instance;
  }

  loadAssets(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  cleanUp() {
    throw new Error("Method not implemented.");
  }
}
