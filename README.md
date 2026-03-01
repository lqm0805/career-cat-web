# 职业猫网页版（合照启动版）

目录：`d:\刘琦萌\Coding\career-cat-web`

## 当前实现
- 启动页：显示 `assets/cats/cats.png` 合照，点击开始游戏。
- 职业选择：点击一次选中，点击同一职业第二次确认。
- 猫咪主页：等级/经验/情感值在猫咪上方小字显示。
- 猫咪对话：通过猫咪气泡显示。
- 按钮：使用“去打工”进入任务。
- 任务页：猫咪大图居中偏上，约半屏占比。
- 时间轴：支持折叠。
- 调试：可选择任意天数查看（`DEBUG_MODE=true`）。
- 事件系统：工作中随机触发突发事件，影响情感/经验/奖励系数。

## 你给的图片接入
已接入：
- `assets/cats/cats.png`（启动页）
- `assets/cats/smile1.png`（普通）
- `assets/cats/sad1.png`（沮丧）
- `assets/cats/excited1.png`（兴奋）

## 后续替换 GIF 的位置
在 `app.js` 中修改 `YELLOW_CAT`：
- `normal`
- `sad`
- `excited`

例如改成：
- `assets/cats/xxx-normal.gif`
- `assets/cats/xxx-sad.gif`
- `assets/cats/xxx-excited.gif`

## 运行方式
直接浏览器打开 `index.html`。
