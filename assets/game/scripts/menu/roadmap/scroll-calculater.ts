export function calculateScrollPosition(
  currentPoint: cc.Node,
  content: cc.Node,
  scrollViewSize: cc.Size,
): cc.Vec2 {
  // Получаем позицию точки в мировых координатах
  const pointWorldPos = currentPoint.convertToWorldSpaceAR(cc.Vec2.ZERO);

  // Получаем позицию content в мировых координатах
  const contentWorldPos = content.convertToWorldSpaceAR(cc.Vec2.ZERO);

  // Вычисляем позицию точки относительно content
  const pointInContent = cc.v2(
    pointWorldPos.x - contentWorldPos.x,
    pointWorldPos.y - contentWorldPos.y,
  );

  // Учитываем anchor point content (переводим в локальные координаты)
  const anchorOffsetX = content.anchorX * content.width;
  const localPointX = pointInContent.x + anchorOffsetX;

  // Цель: центрировать точку посередине scrollView
  const targetScrollX = localPointX - scrollViewSize.width / 2;

  // Ограничиваем значения в пределах возможной прокрутки
  const maxScrollX = Math.max(0, content.width - scrollViewSize.width);
  const clampedScrollX = cc.misc.clampf(targetScrollX, 0, maxScrollX);

  return cc.v2(clampedScrollX, 0);
}
