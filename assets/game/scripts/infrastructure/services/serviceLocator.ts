export class ServiceLocator {
  private static _instance: ServiceLocator = null;
  private services: Map<Function, any> = new Map();

  private constructor() {}

  public static Container(): ServiceLocator {
    if (this._instance == null) {
      this._instance = new ServiceLocator();
    }
    return this._instance;
  }

  public registerSingle<TService extends IService>(service: TService): void {
    console.log("register service ", service);
    const serviceType = (service as any).constructor;
    this.services.set(serviceType, service);
  }

  public single<TService extends IService>(
    type?: new (...args: any[]) => TService
  ): TService {
    const serviceType = type || this.getType<TService>();
    console.log("get service ", serviceType);

    const service = this.services.get(serviceType);

    if (!service) {
      throw new Error(`Service ${serviceType.name} not registered`);
    }
    return service as TService;
  }

  private getType<T>(): Function {
    return class Dummy {
      static get type(): Function {
        return null as any as Function;
      }
    }.type;
  }
}

export interface IService {}
