import { IProgressService } from "../infrastructure/services/levels/progress-service";
import { ITableController } from "./table/table-controller";

export class ResultLevelController {
  constructor(
    private _progressService: IProgressService,
    private _tableController: ITableController
  ) {}

  clearLevel() {
    this._progressService.resetLevel();
    this._tableController.resetTable();
  }
}
