import type {
  IPersistentPrefabsConfig,
  IPrefabsMenuConfig,
} from "../../../configs/config-types";
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
  private _persistentPrefabsConfig: IPersistentPrefabsConfig;
  constructor(params: {
    assetProvider: IAssetProvider;
    prefabsMenuConfig: IPrefabsMenuConfig;
    persistentsPrefabsConfig: IPersistentPrefabsConfig;
    levelService: LevelService;
  }) {
    super(params.assetProvider);
    const {
      assetProvider,
      prefabsMenuConfig,
      levelService,
      persistentsPrefabsConfig,
    } = params;
    this._assetProvider = assetProvider;
    this._prefabsMenuConfig = prefabsMenuConfig;
    this._levelService = levelService;
    this._persistentPrefabsConfig = persistentsPrefabsConfig;
    const mapId = this._levelService.getCurrentMapId();
    this._pathMap = this._prefabsMenuConfig.getRoadmapPrefabById(mapId);
  }
  async loadAssets() {
    const paths = [this._persistentPrefabsConfig.curtainPrefab, this._pathMap];
    await this.handleAssets(paths, (path) =>
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
