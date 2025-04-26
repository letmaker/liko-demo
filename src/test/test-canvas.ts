import {
  App,
  Canvas,
  createLinearGradient,
  createPatternFromUrl,
  createRadialGradient,
  EventType,
  Texture,
} from "liko";

// 定义线条宽度常量
const lineWidth = 10;

// 主测试函数，展示各种绘图功能
async function test() {
  // 创建应用实例并初始化
  const app = new App();
  await app.init({ width: 800, height: 1000, bgColor: 0x333333 });

  // 绘制矩形
  const rect = new Canvas();
  rect.clear();
  rect.rect(0, 0, 100, 100);
  rect.stroke({ color: "#ff0000", width: lineWidth });
  rect.pos.set(50, 50);
  app.stage.addChild(rect);

  // 绘制圆角矩形
  const roundRect = new Canvas();
  roundRect.clear();
  roundRect.roundRect(0, 0, 100, 100, 10);
  roundRect.stroke({ color: "#ff0000", width: lineWidth });
  roundRect.pos.set(200, 50);
  app.stage.addChild(roundRect);

  // 绘制椭圆
  const ellipse = new Canvas();
  ellipse.clear();
  ellipse.rect(0, 0, 100, 100);
  ellipse.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  ellipse.ellipse(0, 0, 50, 30, 0, 2 * Math.PI);
  ellipse.stroke({ color: "#ff0000", width: lineWidth });
  ellipse.pos.set(350, 50);
  app.stage.addChild(ellipse);

  // 绘制折线
  const polyLine = new Canvas();
  polyLine.clear();
  polyLine.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  polyLine.moveTo(-50, -50).lineTo(0, 50).lineTo(100, 0).lineTo(50, 100);
  polyLine.stroke({ color: "#ff0000", width: lineWidth });
  polyLine.pos.set(500, 50);
  app.stage.addChild(polyLine);

  // 绘制水平直线
  const horizontalLine = new Canvas();
  horizontalLine.moveTo(0, 0);
  horizontalLine.lineTo(100, 0);
  horizontalLine.stroke({ width: 2, color: "#ff00ff" });
  horizontalLine.pos.set(650, 50);
  app.stage.addChild(horizontalLine);

  // 绘制垂直直线
  const verticalLine = new Canvas();
  verticalLine.moveTo(0, 0);
  verticalLine.lineTo(0, 100);
  verticalLine.stroke({ width: 2, color: "#ff00ff" });
  verticalLine.pos.set(650, 50);
  app.stage.addChild(verticalLine);

  // 绘制圆形
  const circle = new Canvas();
  circle.clear();
  circle.rect(0, 0, 100, 100);
  circle.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  circle.circle(0, 0, 50);
  circle.moveTo(50, 50).circle(50, 50, 50);
  circle.stroke({ color: "#ff0000", width: lineWidth });
  circle.pos.set(50, 250);
  app.stage.addChild(circle);

  // 绘制圆弧
  const arc = new Canvas();
  arc.clear();
  arc.rect(0, 0, 100, 100);
  arc.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  arc.arc(0, 0, 50, 0, Math.PI);
  arc.moveTo(50, 50).arc(50, 50, 50, 0, Math.PI);
  arc.stroke({ color: "#ff0000", width: lineWidth });
  arc.pos.set(200, 250);
  app.stage.addChild(arc);

  // 绘制圆弧路径
  const arcTo = new Canvas();
  arcTo.clear();
  arcTo.rect(0, 0, 100, 100);
  arcTo.rect(70, 10, 2, 2);
  arcTo.rect(20, 80, 2, 2);
  arcTo.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  arcTo.moveTo(0, 0).arcTo(70, 10, 20, 80, 50);
  arcTo.stroke({ color: "#ff0000", width: lineWidth });
  arcTo.pos.set(350, 250);
  app.stage.addChild(arcTo);

  // 绘制二次贝塞尔曲线
  const quadraticCurveTo = new Canvas();
  quadraticCurveTo.clear();
  quadraticCurveTo.rect(0, 0, 100, 100);
  quadraticCurveTo.rect(60, 10, 2, 2);
  quadraticCurveTo.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  quadraticCurveTo.moveTo(0, 0).quadraticCurveTo(60, 10, 100, 100);
  quadraticCurveTo.stroke({ color: "#ff0000", width: lineWidth });
  quadraticCurveTo.pos.set(500, 250);
  app.stage.addChild(quadraticCurveTo);

  // 绘制三次贝塞尔曲线
  const bezierCurveTo = new Canvas();
  bezierCurveTo.clear();
  bezierCurveTo.rect(0, 0, 100, 100);
  bezierCurveTo.rect(90, 10, 2, 2);
  bezierCurveTo.rect(20, 60, 2, 2);
  bezierCurveTo.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  bezierCurveTo.moveTo(0, 0).bezierCurveTo(90, 10, 20, 60, 100, 100);
  bezierCurveTo.stroke({ color: "#ff0000", width: lineWidth });
  bezierCurveTo.pos.set(650, 250);
  app.stage.addChild(bezierCurveTo);

  const polygon = new Canvas();
  polygon.clear();
  polygon.polygon([
    { x: 50, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ]);
  polygon.fill({ color: "#483D8B" });
  polygon.stroke({ color: "#008B8B", width: lineWidth });
  polygon.pos.set(50, 450);
  app.stage.addChild(polygon);

  // 绘制一个 6 边形
  const hexagon = new Canvas();
  hexagon.clear();
  hexagon.polygon([
    { x: 50, y: 0 },
    { x: 100, y: 50 },
    { x: 100, y: 100 },
    { x: 50, y: 100 },
    { x: 0, y: 50 },
    { x: 0, y: 0 },
  ]);
  hexagon.fill({ color: "#483D8B" });
  hexagon.stroke({ color: "#008B8B", width: lineWidth });
  hexagon.pos.set(200, 450);
  app.stage.addChild(hexagon);

  // 绘制一个 5 角星
  const star = new Canvas();
  star.clear();
  star.beginPath();
  // 五角星的外圆半径
  const outerRadius = 50;
  // 五角星的内圆半径（通常是外圆半径的0.382倍左右）
  const innerRadius = outerRadius * 0.382;
  // 五角星的中心点
  const centerX = 50;
  const centerY = 50;
  // 绘制五角星的十个点（五个外点和五个内点交替）
  for (let i = 0; i < 10; i++) {
    // 计算当前点的角度（从顶部开始，顺时针旋转）
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    // 确定当前点是外点还是内点
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    // 计算点的坐标
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // 第一个点移动到，其余点连线到
    if (i === 0) {
      star.moveTo(x, y);
    } else {
      star.lineTo(x, y);
    }
  }
  star.closePath();
  star.fill({ color: "#483D8B" });
  star.stroke({ color: "#008B8B", width: lineWidth, cap: "round", join: "round" });
  star.pos.set(350, 450);
  app.stage.addChild(star);

  // 绘制虚线
  const dash = new Canvas();
  dash.clear();
  dash.rect(0, 0, 100, 100);
  dash.moveTo(50, 50).circle(50, 50, 40);
  dash.stroke({ color: "#ff0000", width: lineWidth, dash: [10, 5] });
  dash.pos.set(50, 650);
  app.stage.addChild(dash);

  // 填充示例
  const filledShape = new Canvas();
  filledShape.clear();
  filledShape.rect(0, 0, 100, 100);
  filledShape.stroke({ color: "#ff0000", width: lineWidth, dash: [10, 5] });
  filledShape.fill({ color: "#483D8B" });
  filledShape.pos.set(200, 650);
  app.stage.addChild(filledShape);

  // 加载并绘制图片
  const texture = await Texture.createFromUrl("assets/bg2.webp");
  if (!texture) return;

  // 绘制图片
  const image = new Canvas();
  image.clear();
  image.drawImage(texture, 0, 0, 100, 50);
  image.drawImage(texture, 0, 50, 100, 50);
  image.pos.set(350, 650);
  app.stage.addChild(image);

  // 使用裁剪蒙版
  const clippedImage = new Canvas();
  clippedImage.clear();
  clippedImage.beginPath();
  clippedImage.circle(50, 50, 50).clip();
  clippedImage.drawImage(texture, 0, 0, 200, 100);
  clippedImage.pos.set(500, 650);
  app.stage.addChild(clippedImage);

  // 绘制SVG路径
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.1C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="red"/>
    </svg>`;
  const svg = new Canvas();
  svg.clear();
  svg.drawSvg(svgData);
  svg.pos.set(650, 650);
  app.stage.addChild(svg);

  // 绘制线性渐变
  const linearGradient = new Canvas();
  linearGradient.clear();
  linearGradient.rect(0, 0, 100, 100);
  linearGradient.fill({
    color: createLinearGradient({ startX: 0, startY: 0, endX: 100, endY: 0 }, [
      { offset: 0, color: "red" },
      { offset: 1, color: "blue" },
    ]),
  });
  linearGradient.pos.set(50, 850);
  app.stage.addChild(linearGradient);

  // 绘制径向渐变
  const radialGradient = new Canvas();
  radialGradient.clear();
  radialGradient.circle(50, 50, 50);
  radialGradient.fill({
    color: createRadialGradient({ startX: 50, endX: 50, startRadius: 0, startY: 50, endY: 50, endRadius: 50 }, [
      { offset: 0, color: "black" },
      { offset: 0.5, color: "red" },
      { offset: 1, color: "yellow" },
    ]),
  });
  radialGradient.pos.set(200, 850);
  app.stage.addChild(radialGradient);

  // 创建并应用图案填充
  const pattern = new Canvas();
  const pat = await createPatternFromUrl("assets/apple2.png", "repeat");
  pattern.clear();
  pattern.rect(0, 0, 100, 100);
  pattern.fill({ color: pat });
  pattern.pos.set(350, 850);
  app.stage.addChild(pattern);

  // 创建鼠标交互示例：填充/描边切换
  const hoverStroke = new Canvas();
  hoverStroke.clear();
  hoverStroke.circle(50, 50, 50);
  hoverStroke.fill({ color: "#ff0000" });
  hoverStroke.pos.set(500, 850);
  app.stage.addChild(hoverStroke);
  // 添加鼠标悬停效果
  hoverStroke.on(EventType.pointerover, () => {
    hoverStroke.clear();
    hoverStroke.circle(50, 50, 50);
    hoverStroke.stroke({ color: "#ff0000", width: lineWidth });
  });
  hoverStroke.on(EventType.pointerout, () => {
    hoverStroke.clear();
    hoverStroke.circle(50, 50, 50);
    hoverStroke.fill({ color: "#ff0000" });
  });

  // 创建鼠标交互示例：形状切换
  const hoverChangeShape = new Canvas();
  hoverChangeShape.clear();
  hoverChangeShape.circle(50, 50, 50);
  hoverChangeShape.stroke({ color: "#ff0000", width: lineWidth });
  hoverChangeShape.pos.set(650, 850);
  app.stage.addChild(hoverChangeShape);
  // 添加鼠标悬停效果
  hoverChangeShape.on(EventType.pointerover, () => {
    hoverChangeShape.clear();
    hoverChangeShape.rect(0, 0, 100, 100);
    hoverChangeShape.stroke({ color: "#ff0000", width: lineWidth });
  });
  hoverChangeShape.on(EventType.pointerout, () => {
    hoverChangeShape.clear();
    hoverChangeShape.circle(50, 50, 50);
    hoverChangeShape.stroke({ color: "#ff0000", width: lineWidth });
  });

  // 启用边界框显示功能
  showBounds(app);
}

// 执行测试函数
test();

// 显示元素边界框的函数
// 当鼠标悬停在元素上时，显示该元素的边界
function showBounds(app: App) {
  // 创建一个用于绘制边界框的画布
  const bounds = new Canvas();

  // 遍历舞台上的所有子元素
  for (const child of app.stage.children) {
    // 当鼠标移入元素时
    child.on(EventType.pointerover, () => {
      // 获取元素在世界坐标系和本地坐标系中的边界
      const lb = child.getLocalBounds();
      const wb = child.getWorldBounds();
      console.log("local bounds", lb);
      console.log("world bounds", wb);

      // 清空边界框画布并重新绘制
      bounds.clear();
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      // 使用白色细线绘制边界框
      bounds.stroke({ color: "#ffffff", width: 1 });
      app.stage.addChild(bounds);
    });

    // 当鼠标移出元素时，移除边界框
    child.on(EventType.pointerout, () => {
      app.stage.removeChild(bounds);
    });
  }
}
