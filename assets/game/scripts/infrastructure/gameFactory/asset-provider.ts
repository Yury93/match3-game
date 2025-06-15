import { IService } from "../services/serviceLocator";

export interface IAssetProvider extends IService {
  loadAsset(assetName: string): Promise<any>;
  instantiateAsset(assetName: string): any;
  unloadAsset(assetName: string): void;
  getAsset(assetName: string);
}
export class AssetProvider implements IAssetProvider {
  private assets: Record<string, any> = {};

  async loadAsset(path: string): Promise<any> {
    console.log(`Loading asset: ${path}`);
    if (this.assets[path]) {
      return this.assets[path];
    }

    return new Promise((resolve, reject) => {
      cc.resources.load(path, (err, prefab) => {
        if (err) {
          console.error(`Failed to load asset: ${path}`, err);
          reject(err);
          return;
        }
        this.assets[path] = prefab;
        console.log(`Asset loaded: ${path}`);
        resolve(prefab);
      });
    });
  }
  getAsset(assetName: string): any {
    return this.assets[assetName];
  }
  instantiateAsset(assetName: string): any {
    if (this.assets[assetName]) {
      const asset = cc.instantiate(this.assets[assetName]);
      return asset;
    } else {
      console.error(`Asset not found: ${assetName}`);
      return null;
    }
  }

  unloadAsset(assetName: string): void {
    console.log(`Unloading asset: ${assetName}`);
    cc.resources.release(this.assets[assetName]);
    delete this.assets[assetName];
  }
}
