import Table from "../../game-logic/table/table";
import { TableCell } from "../../game-logic/table/table-cell";
import { TableModel } from "../../game-logic/table/table-model";
import Tile from "../../game-logic/tiles/tile";
import { IAssetProvider } from "../gameFactory/asset-provider";
import { IGameFactory } from "../gameFactory/game-factory";
import { IState } from "../state-machine/state-interfaces";

export class CreateContentState implements IState {
  private _gameFactory: IGameFactory;

  constructor(gameFactory: IGameFactory) {
    this._gameFactory = gameFactory;
  }
  async run(): Promise<void> {
    console.log("run create content state");
    await this._gameFactory.loadAssets();
    this.createContent();
  }
  private createContent() {
    const table: Table = this._gameFactory.createTable();
    const content = table.getContent();

    const tableCells: TableCell[][] =
      this._gameFactory.createTableCells(content);
    const tiles: Tile[][] = this._gameFactory.createTiles(tableCells, content);
    const tableModel: TableModel = this._gameFactory.createTableModel(
      tableCells,
      tiles
    );

    table.Init(tableModel);
  }
  stop(): void {
    console.log("stop create content state");
  }
}
