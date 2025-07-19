export class ServiceLocator {
  private static _instance: ServiceLocator = null;
  private _services: Map<Function, IService> = new Map();

  public static container(): ServiceLocator {
    if (this._instance === null) {
      this._instance = new ServiceLocator();
    }
    return this._instance;
  }

  public registerSingle<TService extends IService>(service: TService): void {
    cc.log("register service ", service);
    const serviceType = (service as TService).constructor;
    this._services.set(serviceType, service);
  }

  public single<TService extends IService>(
    type?: new (...args: unknown[]) => TService,
  ): TService {
    const serviceType = type;

    const service = this._services.get(serviceType);

    if (!service) {
      throw new Error(`Service ${serviceType.name} not registered`);
    }
    return service as TService;
  }
}

export interface IService {}
