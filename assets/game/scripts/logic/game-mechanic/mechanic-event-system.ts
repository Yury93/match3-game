import { IGameMechanic } from "./game-mechanic";
import { MechanicType } from "./mechanic-types";

export enum MechanicEventType {
  MECHANIC_USED = "MECHANIC_USED",
}

export interface IMechanicEvent {
  type: MechanicEventType;
  mechanic: IGameMechanic;
  mechanicType: MechanicType;
}

export interface IMechanicObserver {
  onMechanicEvent(event: IMechanicEvent): void;
}

export class MechanicEventSystem {
  private static observers: IMechanicObserver[] = [];

  static subscribe(observer: IMechanicObserver) {
    this.observers.push(observer);
  }

  static unsubscribe(observer: IMechanicObserver) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  static dispatch(event: IMechanicEvent) {
    for (const observer of this.observers) {
      observer.onMechanicEvent(event);
    }
  }
}
