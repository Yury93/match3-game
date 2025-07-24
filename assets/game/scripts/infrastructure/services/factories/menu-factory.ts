import type { IPrefabsMenuConfig } from "../../../configs/config-types";
import type { IRoadmap } from "../../../menu/roadmap/roadmap";
import { Roadmap } from "../../../menu/roadmap/roadmap";
import type { IAssetProvider } from "../asset-provider";
import type { LevelService } from "../levels/level-service";
import type { IService } from "../serviceLocator";

import { AbstractFactory } from "./abstract-factory";

export interface IMenuFactory extends IService {
  loadAssets();
  cleanUp();
  createRoadmap(): IRoadmap;
}

export class MenuFactory extends AbstractFactory implements IMenuFactory {
  private _prefabsMenuConfig: IPrefabsMenuConfig;
  private _levelService: LevelService;
  private _pathMap: string;
  constructor(params: {
    assetProvider: IAssetProvider;
    prefabsMenuConfig: IPrefabsMenuConfig;
    levelService: LevelService;
  }) {
    super(params.assetProvider);
    const { assetProvider, prefabsMenuConfig, levelService } = params;
    this._assetProvider = assetProvider;
    this._prefabsMenuConfig = prefabsMenuConfig;
    this._levelService = levelService;
    const mapId = this._levelService.getCurrentMapId();
    this._pathMap = this._prefabsMenuConfig.getRoadmapPrefabById(mapId);
  }
  async loadAssets() {
    await this.handleAssets([this._pathMap], (path) =>
      this._assetProvider.loadAsset(path),
    );
  }
  createRoadmap(): IRoadmap {
    const roadmap = this.instantiateOnCanvas<Roadmap>(this._pathMap, Roadmap);
    return roadmap;
  }

  async cleanUp() {
    await this.handleAssets([this._pathMap], (path) =>
      this._assetProvider.unloadAsset(path),
    );
  }
}
