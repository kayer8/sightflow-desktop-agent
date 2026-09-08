import { clipboard } from 'electron'
import { AIClient } from '../ai-client'
import { AppType } from './types'
import { captureWechatWindow } from './screenshot-utils'
import { bboxToScreenCoords, parseBBoxes } from './vision-utils'
import { clickUnreadContactAction } from './input-utils'
import { getRobot, randomDelayIn } from './util'
import {
  AutoAddStep,
  getAutoAddStepRegion,
  selectAutoAddBBox
} from './auto-add-friend-logic'

const STEP_PROMPTS: Record<AutoAddStep, string> = {
  通讯录: '当前是企业微信消息页。找到左侧竖向导航栏靠近底部的“通讯录”入口。不要选择中间列表或右侧内容。只输出一个 <bbox>x1,y1,x2,y2</bbox>。',
  新的联系人: '当前已进入企业微信通讯录页。找到左侧第二栏第一项、文字为“新的联系人”的列表项。不要选择右上角“添加”。只输出一个 <bbox>x1,y1,x2,y2</bbox>。',
  顶部添加: '当前页面标题是“新的联系人”。找到窗口右上角、与页面标题同一行的“添加”按钮。不要选择左侧列表或弹窗按钮。只输出一个 <bbox>x1,y1,x2,y2</bbox>。',
  搜索结果添加: '当前“添加新联系人”弹窗已显示手机号搜索结果。只找弹窗内第一条搜索结果这一行最右侧的蓝色“添加”按钮，按钮必须与结果头像和昵称在同一行。严禁选择页面右上角的“添加”。只输出一个 <bbox>x1,y1,x2,y2</bbox>。',
  发送: '当前已打开好友申请页面。找到申请弹窗底部右侧的“发送”按钮。不要选择关闭按钮或页面右上角“添加”。只输出一个 <bbox>x1,y1,x2,y2</bbox>。'
}

async function locateStep(aiClient: AIClient, appType: AppType, step: AutoAddStep): Promise<[number, number]> {
  let lastError = `${step}：未找到目标控件`

  for (let attempt = 1; attempt <= 3; attempt++) {
    const screenshot = await captureWechatWindow(appType)
    if (!screenshot.success || !screenshot.screenshotBase64 || !screenshot.bounds) {
      lastError = `${step}：截图失败`
      continue
    }

    // Use bounds and scaleFactor belonging to this exact screenshot. A second
    // window lookup can describe a different position after the user moves it.
    const bounds = screenshot.bounds
    const scaleFactor = screenshot.display?.scaleFactor || 1
    const response = await aiClient.detectVision(
      `你是企业微信桌面端 UI 定位助手。只返回要求的 bbox，不要解释。\n` +
        `所有坐标必须是当前截图范围内的 0-1000 归一化坐标。\n` +
        `目标中心必须位于候选区域 ${getAutoAddStepRegion(step).join(',')} 内。` +
        `如果当前页面没有目标控件，只输出 <not_found/>，不要猜测。\n` +
        STEP_PROMPTS[step],
      screenshot.screenshotBase64
    )
    const bboxes = parseBBoxes(response)
    const bbox = selectAutoAddBBox(step, bboxes)
    console.log('[AutoAddFriend] VLM 定位结果', {
      step,
      attempt,
      response: response.slice(0, 500),
      bboxes,
      selected: bbox,
      bounds,
      scaleFactor
    })

    if (bbox) {
      return bboxToScreenCoords(bbox, bounds, scaleFactor)
    }
    lastError = bboxes.length > 0 ? `${step}：bbox 不在目标区域` : `${step}：未找到目标控件`
    await randomDelayIn(250, 450)
  }

  throw new Error(lastError)
}

async function clickStep(aiClient: AIClient, appType: AppType, step: AutoAddStep): Promise<void> {
  const [x, y] = await locateStep(aiClient, appType, step)
  await clickUnreadContactAction([x, y])
  await randomDelayIn(500, 900)
}

export async function addWeWorkFriend(aiClient: AIClient, phone: string): Promise<void> {
  const appType: AppType = 'wework'
  await clickStep(aiClient, appType, '通讯录')
  await clickStep(aiClient, appType, '新的联系人')
  await clickStep(aiClient, appType, '顶部添加')

  // 企业微信打开“添加新联系人”弹窗时，手机号输入框会自动获得焦点。
  // Avoiding an extra VLM lookup here removes a common modal-input false positive.
  clipboard.writeText(phone)
  await randomDelayIn(100, 200)
  const robot = getRobot()
  if (!robot) throw new Error('手机号输入：RobotJS 不可用')
  robot.keyTap(process.platform === 'darwin' ? 'v' : 'v', [process.platform === 'darwin' ? 'command' : 'control'])
  await randomDelayIn(300, 600)
  robot.keyTap('enter')
  await randomDelayIn(700, 1200)

  await clickStep(aiClient, appType, '搜索结果添加')
  await clickStep(aiClient, appType, '发送')
}
