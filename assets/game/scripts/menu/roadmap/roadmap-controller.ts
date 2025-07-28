import type { ILevelService } from "../../infrastructure/services/levels/level-service";
import type { IStateMachine } from "../../infrastructure/state-machine/state-interfaces";
import { StateNames } from "../../infrastructure/state-machine/state-names";

import type { IRoadmap } from "./roadmap";
import type { RoadmapPoint } from "./roadmap-point";
import { calculateScrollPosition } from "./scroll-calculater";

export interface IRoadmapController {}

export class RoadmapController implements IRoadmapController {
  private _roadmap: IRoadmap;
  private _levelService: ILevelService;
  private _stateMachine: IStateMachine;
  constructor(params: {
    roadmap: IRoadmap;
    levelService: ILevelService;
    stateMachine: IStateMachine;
  }) {
    const { roadmap, levelService, stateMachine } = params;
    this._roadmap = roadmap;
    this._levelService = levelService;
    this._stateMachine = stateMachine;
    roadmap.onClickPlay = () => this.onClickPlayButton();
    this.setRoadmapPointsInfo();
    this.scrollToCurrentPoint();
  }
  onClickPlayButton() {
    this._stateMachine.run(StateNames.LoadSceneState, {
      sceneName: "game",
      stateName: StateNames.CreateLevelContentState,
    });
  }
  setRoadmapPointsInfo() {
    const roadmapPoints = this._roadmap.getRoadmapPoints();
    if (roadmapPoints.length === 0) return;

    for (let i = 0; i < roadmapPoints.length; i++) {
      const point = roadmapPoints[i];
      if (!point) continue;

      point.showPointInfo(this._levelService.getCurrentLevel().id);
    }
  }

  scrollToCurrentPoint(): void {
    const currentLevelId = this._levelService.getCurrentLevel().id;
    const roadmapPoints = this._roadmap.getRoadmapPoints();

    if (roadmapPoints.length === 0) return;

    let currentPoint: RoadmapPoint | null = null;
    for (let i = 0; i < roadmapPoints.length; i++) {
      const point = roadmapPoints[i];
      if (point && point.getCurrentLevelPoint(currentLevelId)) {
        currentPoint = point;
        break;
      }
    }

    if (!currentPoint) return;

    const content = this._roadmap.getContent();
    const scrollViewSize = this._roadmap.getScrollViewSize();

    if (!content || scrollViewSize.equals(cc.Size.ZERO)) return;
    const scrollPosition = calculateScrollPosition(
      currentPoint.node,
      content,
      scrollViewSize,
    );

    this._roadmap.scrollToPosition(scrollPosition, 0.5);
  }
}
