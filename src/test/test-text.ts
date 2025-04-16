import { App, Canvas, EventType, Text, createLinearGradient, createPatternByUrl } from "liko";

// 设置文字默认大小为30像素，便于统一管理和后续修改
const FONT_SIZE = 30;

// 这个函数用于显示每个元素的边界框，帮助开发者直观地看到元素的大小和位置
function showBounds(app: App) {
  // 创建一个新的画布，专门用来绘制边界框
  const bounds = new Canvas();

  // 遍历舞台上的所有元素
  for (const child of app.stage.children) {
    // 当鼠标移动到元素上方时触发
    child.on(EventType.mouseover, () => {
      // 获取元素在自身坐标系中的边界信息（不考虑位置和旋转等变换）
      const lb = child.getLocalBounds();
      // 获取元素在舞台坐标系中的实际边界信息（考虑了位置、旋转等变换）
      const wb = child.getWorldBounds();
      // 在浏览器控制台打印边界信息，方便调试
      console.log("local bounds", lb);
      console.log("world bounds", wb);

      // 清除画布上之前绘制的边界框
      bounds.clear();
      // 根据元素的实际边界绘制一个矩形框
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      // 设置边界框的样式：白色、1像素宽的线条
      bounds.stroke({ color: "#ffffff", width: 1 });
      // 将边界框添加到舞台上显示
      app.stage.addChild(bounds);
    });

    // 当鼠标离开元素时，移除边界框
    child.on(EventType.mouseout, () => {
      app.stage.removeChild(bounds);
    });
  }
}

// 主测试函数，用于展示文本组件的各种功能和效果
async function test() {
  // 创建一个新的应用实例
  const app = new App();
  // 初始化应用：设置800x800的画布大小，深灰色背景
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建一个基础的左对齐文本（默认左对齐）
  new Text({
    text: "this is a\n居左", // \n 表示换行
    fillColor: "#ff0000", // 文字颜色设为红色
    fontSize: FONT_SIZE, // 使用预定义的字体大小
    parent: app.stage, // 将文本添加到舞台上
  });

  // 创建一个居中对齐的文本
  new Text({
    text: "this is a\n居中",
    fillColor: "#ff0000",
    align: "center", // 设置文本水平居中对齐
    pos: { x: 200, y: 0 }, // 设置文本位置，x=200, y=0
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个右对齐的文本
  new Text({
    text: "this is a\n居右",
    fillColor: "#ff0000",
    align: "right", // 设置文本右对齐
    pos: { x: 400, y: 0 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个粗体文本
  new Text({
    text: "this is a\n粗体",
    fillColor: "#ff0000",
    fontWeight: "bold", // 设置文字为粗体
    pos: { x: 0, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个带有描边的粗体文本
  new Text({
    text: "this is a\n粗体描边",
    fillColor: "#ff0000",
    fontWeight: "bold",
    strokeWidth: 7, // 设置描边宽度为7像素
    strokeColor: "#efefef", // 设置描边颜色为浅灰色
    pos: { x: 200, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个只有描边没有填充色的文本
  new Text({
    text: "this is a\n纯描边",
    fillColor: "", // 不设置填充色
    fontWeight: "bold",
    strokeWidth: 1, // 细描边
    strokeColor: "#efefef",
    pos: { x: 450, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个斜体文本
  new Text({
    text: "this is a\n斜体",
    fillColor: "#ff0000",
    fontWeight: "bold",
    italic: true, // 设置文字为斜体
    pos: { x: 0, y: 300 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个居中的斜体文本，带有粗描边
  new Text({
    text: "this is\n斜体居中",
    fillColor: "#ff0000",
    fontWeight: "bold",
    italic: true,
    strokeWidth: 16, // 粗描边
    align: "center",
    strokeColor: "#efefef",
    pos: { x: 200, y: 300 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个右对齐的斜体文本，带有粗描边
  new Text({
    text: "this is\n斜体居右",
    fillColor: "#ff0000",
    fontWeight: "bold",
    italic: true,
    strokeWidth: 16,
    align: "right",
    strokeColor: "#efefef",
    pos: { x: 450, y: 300 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个使用渐变色填充的文本
  new Text({
    text: "this is a\n渐变",
    // 创建一个从左到右的线性渐变，从红色渐变到白色
    fillColor: createLinearGradient({ startX: 0, endX: 200, startY: 0, endY: 0 }, [
      { rate: 0, color: "red" }, // 起始颜色为红色
      { rate: 1, color: "white" }, // 结束颜色为白色
    ]),
    fontWeight: "bold",
    italic: true,
    pos: { x: 0, y: 450 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个使用图案填充的文本
  const pat = await createPatternByUrl("assets/bg1.webp", "repeat"); // 加载并创建一个重复平铺的图案
  new Text({
    text: "this is\n图案填充",
    fillColor: pat, // 使用图案作为填充
    fontWeight: "bold",
    italic: true,
    pos: { x: 200, y: 450 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 创建一个综合了多种效果的文本
  new Text({
    text: "组合效果",
    // 创建一个三色渐变
    fillColor: createLinearGradient({ startX: 0, endX: 200, startY: 0, endY: 200 }, [
      { rate: 0, color: "#ff0000" }, // 开始为红色
      { rate: 0.5, color: "#00ff00" }, // 中间为绿色
      { rate: 1, color: "#0000ff" }, // 结束为蓝色
    ]),
    fontWeight: "bold", // 粗体
    italic: true, // 斜体
    strokeWidth: 4, // 描边宽度
    strokeColor: "#ffffff", // 白色描边
    align: "center", // 居中对齐
    pos: { x: 450, y: 450 },
    fontSize: FONT_SIZE * 2, // 字体大小是标准大小的两倍
    parent: app.stage,
  });

  // 创建一个用于测试文本锚点的区域
  const canvas = new Canvas({ pos: { x: 0, y: 600 }, parent: app.stage });
  canvas.rect(0, 0, 200, 200).fill({ color: "#333333" }); // 绘制一个深灰色矩形作为背景

  // 创建锚点在左上角(0,0)的文本
  new Text({
    text: "锚点0-0",
    fillColor: "#ff8800", // 橙色文字
    fontSize: 12,
    pos: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 }, // 锚点在文本的左上角
    parent: canvas,
  });

  // 创建锚点在中心点(0.5,0.5)的文本
  new Text({
    text: "锚点0.5-0.5",
    fillColor: "#ff8800",
    fontSize: 12,
    pos: { x: 100, y: 100 },
    anchor: { x: 0.5, y: 0.5 }, // 锚点在文本的中心
    parent: canvas,
  });

  // 创建锚点在右下角(1,1)的文本
  new Text({
    text: "锚点1-1",
    fillColor: "#ff8800",
    fontSize: 12,
    pos: { x: 200, y: 200 },
    anchor: { x: 1, y: 1 }, // 锚点在文本的右下角
    parent: canvas,
  });

  // 创建一个可以点击的文本，演示动态属性变更
  const dynamicText = new Text({
    text: "点击我",
    fillColor: "#ffffff",
    pos: { x: 300, y: 600 },
    fontSize: FONT_SIZE,
    parent: app.stage,
    onClick: () => {
      // 点击文本时触发
      dynamicText.setText("属性已变更"); // 改变文本内容
      dynamicText.fillColor = "#ffff00"; // 改变文字颜色为黄色
    },
  });

  // 启用边界框显示功能，方便查看每个元素的边界
  showBounds(app);
}

// 执行测试函数
test();
