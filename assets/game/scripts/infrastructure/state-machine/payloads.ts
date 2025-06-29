import { BoosterHandler } from "../../logic/game-mechanic/booster-handler";
import { ProgressController } from "../../logic/progress-controller";
import { ITableController } from "../../logic/table/table-controller";
import { ITableModel } from "../../logic/table/table-model";
import { IUIPanelView } from "../../ui/ui-panel";
import { UIPanelController } from "../../ui/ui-panel-controller";

export interface IGameLoopPayload extends IPayload {
  tableModel: ITableModel;
  tableController: ITableController;
  uiPanelView: IUIPanelView;
  uiPanelController: UIPanelController;
  boosterHandler: BoosterHandler;
  progressController: ProgressController;
}

export interface IResultStatePayload extends IPayload {
  result: string;
  message: string;
  tableController: ITableController;
}
export interface IPayload{

}