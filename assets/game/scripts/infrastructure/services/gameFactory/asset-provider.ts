import type { IService } from "../serviceLocator";

export interface IAssetProvider extends IService {
  loadAsset(assetName: string): Promise<any>;
  instantiateAsset(assetName: string): any;
  unloadAsset(assetName: string): void;
  getAsset(assetName: string);
}
export class AssetProvider implements IAssetProvider {
  private _assets: Record<string, any> = {};

  async loadAsset(path: string): Promise<any> {
    // console.log(`Loading asset: ${path}`);
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
  getAsset(assetName: string): any {
    return this._assets[assetName];
  }
  instantiateAsset(assetName: string): any {
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
      cc.resources.release(this._assets[assetName]);
      delete this._assets[assetName];
    }
  }
}
