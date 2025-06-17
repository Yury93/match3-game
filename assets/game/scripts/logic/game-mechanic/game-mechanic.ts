import { ITile } from "../tile";

export interface IGameMechanic {
  onTurnEnd(): void;
  onTileClick(tile: ITile, tableController): boolean;
}
