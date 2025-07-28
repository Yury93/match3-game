export interface ISheduler {
  schedule(
    callback: Function,
    interval?: number,
    repeat?: number,
    delay?: number,
  ): void;
}
