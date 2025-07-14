import type {
  IMechanicEvent,
  IMechanicObserver,
} from "./mechanic-event-system";
import {
  MechanicEventSystem,
  MechanicEventType,
} from "./mechanic-event-system";
import { MechanicType } from "./mechanic-types";

type UpdateCallback = () => void;

export class BoosterHandler implements IMechanicObserver {
  private _bombTrials: number;
  private _teleportTrials: number;
  private updateCallbacks: UpdateCallback[] = [];

  constructor(bombTrials: number, teleportTrial: number) {
    this._bombTrials = bombTrials;
    this._teleportTrials = teleportTrial;
    MechanicEventSystem.subscribe(this);
  }

  onMechanicEvent(event: IMechanicEvent): void {
    if (event.type !== MechanicEventType.MECHANIC_USED) return;

    if (event.mechanicType === MechanicType.BombBoster) {
      this.consumeBomb();
    } else if (event.mechanicType === MechanicType.TeleportBoster) {
      this.consumeTeleport();
    }
  }

  consumeBomb(): void {
    if (this._bombTrials > 0) {
      this._bombTrials--;
      this.notifyUpdate();
    }
  }

  consumeTeleport(): void {
    if (this._teleportTrials > 0) {
      this._teleportTrials--;
      this.notifyUpdate();
    }
  }

  onUpdate(callback: UpdateCallback): void {
    this.updateCallbacks.push(callback);
  }

  private notifyUpdate(): void {
    this.updateCallbacks.forEach((callback) => callback());
  }

  getBombTrials(): number {
    return this._bombTrials;
  }

  getTeleportTrials(): number {
    return this._teleportTrials;
  }

  destroy() {
    MechanicEventSystem.unsubscribe(this);
    this.updateCallbacks = [];
  }
}
