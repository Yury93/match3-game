export class ServiceLocator {
  private static _instance: ServiceLocator = null;
  private _services: Map<Function, any> = new Map();

  public static container(): ServiceLocator {
    if (this._instance == null) {
      console.log("start create sl instance");
      this._instance = new ServiceLocator();
    }
    return this._instance;
  }

  public registerSingle<TService extends IService>(service: TService): void {
    console.log("register service ", service);
    const serviceType = (service as any).constructor;
    this._services.set(serviceType, service);
  }

  public single<TService extends IService>(
    type?: new (...args: any[]) => TService,
  ): TService {
    const serviceType = type;
    console.log("get service ", serviceType);

    const service = this._services.get(serviceType);

    if (!service) {
      throw new Error(`Service ${serviceType.name} not registered`);
    }
    return service as TService;
  }
}

export interface IService {}
