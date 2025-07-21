import type { IPrefabsMenuConfig } from "../../../configs/config-types";
import type { IRoadmap, Roadmap } from "../../../menu/roadmap/roadmap";
import type { IAssetLoader, IAssetProvider } from "../asset-provider";
import type { IService } from "../serviceLocator";

import { AbstractFactory } from "./abstract-factory";

export interface IMenuFactory extends IService, IAssetLoader {
  createRoadmap(): IRoadmap;
}

export class MenuFactory extends AbstractFactory implements IMenuFactory {
  private _prefabsMenuConfig: IPrefabsMenuConfig;
  constructor(params: {
    assetProvider: IAssetProvider;
    prefabsMenuConfig: IPrefabsMenuConfig;
  }) {
    super(params.assetProvider);
    const { assetProvider, prefabsMenuConfig } = params;
    this._assetProvider = assetProvider;
    this._prefabsMenuConfig = prefabsMenuConfig;
  }
  async loadAssets() {
    const paths = this._prefabsMenuConfig.getAll();
    await this.handleAssets(paths, (path) =>
      this._assetProvider.loadAsset(path),
    );
  }
  createRoadmap(): IRoadmap {
    const roadmap = this.instantiateOnCanvas<Roadmap>(
      this._prefabsMenuConfig.roadmapPrefab,
    );
    return roadmap;
  }

  async cleanUp() {
    const paths = this._prefabsMenuConfig.getAll();
    await this.handleAssets(paths, (path) =>
      this._assetProvider.unloadAsset(path),
    );
  }
}
