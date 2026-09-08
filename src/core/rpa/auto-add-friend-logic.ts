import { BBox } from './vision-utils'

export type AutoAddStep =
  | '通讯录'
  | '新的联系人'
  | '顶部添加'
  | '搜索结果添加'
  | '发送'

type NormalizedRegion = [number, number, number, number]

// Regions are deliberately broad. They reject obvious false positives while
// allowing the modal to move with the window and different display sizes.
const STEP_REGIONS: Record<AutoAddStep, NormalizedRegion> = {
  通讯录: [0, 350, 90, 950],
  新的联系人: [35, 35, 210, 180],
  顶部添加: [850, 0, 1000, 120],
  搜索结果添加: [650, 430, 900, 800],
  发送: [400, 350, 1000, 1000]
}

function centerOf(bbox: BBox): [number, number] {
  return [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]
}

function isFiniteBBox(bbox: BBox): boolean {
  return bbox.length === 4 && bbox.every((value) => Number.isFinite(value))
}

function isInsideRegion(point: [number, number], region: NormalizedRegion): boolean {
  return (
    point[0] >= region[0] &&
    point[0] <= region[2] &&
    point[1] >= region[1] &&
    point[1] <= region[3]
  )
}

export function isBBoxValidForAutoAddStep(step: AutoAddStep, bbox: BBox): boolean {
  if (!isFiniteBBox(bbox)) return false
  const [x1, y1, x2, y2] = bbox
  if (x1 < 0 || y1 < 0 || x2 > 1000 || y2 > 1000 || x2 <= x1 || y2 <= y1) return false
  if (x2 - x1 < 3 || y2 - y1 < 3) return false
  return isInsideRegion(centerOf(bbox), STEP_REGIONS[step])
}

export function selectAutoAddBBox(step: AutoAddStep, bboxes: BBox[]): BBox | null {
  return bboxes.find((bbox) => isBBoxValidForAutoAddStep(step, bbox)) || null
}

export function getAutoAddStepRegion(step: AutoAddStep): NormalizedRegion {
  return STEP_REGIONS[step]
}

export function getAutoAddStepSequence(): AutoAddStep[] {
  return ['通讯录', '新的联系人', '顶部添加', '搜索结果添加', '发送']
}
