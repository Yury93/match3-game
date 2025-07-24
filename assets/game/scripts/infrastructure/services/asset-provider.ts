import type { IService } from "./serviceLocator";

export interface IAssetLoader {
  loadAssets(): Promise<void>;
  cleanUp();
  handleAssets(
    path: string[],
    action: (path: string) => Promise<cc.Asset> | void,
  ): Promise<void>;
}
export interface IAssetProvider extends IService {
  loadAsset(assetName: string): Promise<cc.Asset>;
  instantiateAsset(assetName: string);
  unloadAsset(assetName: string): void;
  getAsset(assetName: string);
}
export class AssetProvider implements IAssetProvider {
  private _assets: Record<string, cc.Asset> = {};

  async loadAsset(path: string): Promise<cc.Asset> {
    if (this._assets[path]) {
      return this._assets[path];
    }

    return new Promise((resolve, reject) => {
      cc.resources.load(path, (err, prefab) => {
        if (err) {
          cc.error(`Failed to load asset: ${path}`, err);
          reject(err);
          return;
        }
        this._assets[path] = prefab;
        resolve(prefab);
      });
    });
  }
  getAsset(assetName: string) {
    return this._assets[assetName];
  }
  instantiateAsset(assetName: string) {
    if (this._assets[assetName]) {
      const asset = cc.instantiate(this._assets[assetName]);
      return asset;
    } else {
      cc.error(`Asset not found: ${assetName}`);
      return null;
    }
  }

  unloadAsset(assetName: string): void {
    if (this._assets[assetName]) {
      cc.resources.release(assetName);
      delete this._assets[assetName];
    }
  }
}
