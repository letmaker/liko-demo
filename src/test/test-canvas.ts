// 使用liko引擎加载场景 json，渲染显示场景内容
import { App, Canvas, EventType, Texture, createLinearGradient, createPatternByUrl } from "liko";

const lineWidth = 10;

function showBounds(app: App) {
  const bounds = new Canvas();
  for (const child of app.stage.children) {
    child.on(EventType.mouseover, () => {
      const wb = child.getWorldBounds();
      const lb = child.getLocalBounds();
      console.log("local bounds", lb);
      console.log("world bounds", wb);
      bounds.clear();
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      bounds.stroke({ color: "#ffffff", width: 1 });
      app.stage.addChild(bounds);
    });

    child.on(EventType.mouseout, () => {
      app.stage.removeChild(bounds);
    });
  }
}

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  const rect = new Canvas();
  rect.clear();
  rect.rect(0, 0, 100, 100);
  rect.stroke({ color: "#ff0000", width: lineWidth });
  rect.pos.set(50, 50);
  app.stage.addChild(rect);

  const roundRect = new Canvas();
  roundRect.clear();
  roundRect.roundRect(0, 0, 100, 100, 10);
  roundRect.stroke({ color: "#ff0000", width: lineWidth });
  roundRect.pos.set(200, 50);
  app.stage.addChild(roundRect);

  const ellipse = new Canvas();
  ellipse.clear();
  ellipse.rect(0, 0, 100, 100);
  ellipse.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  ellipse.ellipse(0, 0, 50, 30, 0, 2 * Math.PI);
  ellipse.stroke({ color: "#ff0000", width: lineWidth });
  ellipse.pos.set(350, 50);
  app.stage.addChild(ellipse);

  const line = new Canvas();
  line.clear();
  line.rect(0, 0, 100, 100);
  line.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  line.moveTo(-50, -50).lineTo(0, 50).lineTo(100, 0).lineTo(50, 100);
  line.stroke({ color: "#ff0000", width: lineWidth });
  line.pos.set(500, 50);
  app.stage.addChild(line);

  const circle = new Canvas();
  circle.clear();
  circle.rect(0, 0, 100, 100);
  circle.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  circle.circle(0, 0, 50);
  circle.moveTo(50, 50).circle(50, 50, 50);
  circle.stroke({ color: "#ff0000", width: lineWidth });
  circle.pos.set(50, 250);
  app.stage.addChild(circle);

  const arc = new Canvas();
  arc.clear();
  arc.rect(0, 0, 100, 100);
  arc.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  arc.arc(0, 0, 50, 0, Math.PI);
  arc.moveTo(50, 50).arc(50, 50, 50, 0, Math.PI);
  arc.stroke({ color: "#ff0000", width: lineWidth });
  arc.pos.set(200, 250);
  app.stage.addChild(arc);

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

  const quadraticCurveTo = new Canvas();
  quadraticCurveTo.clear();
  quadraticCurveTo.rect(0, 0, 100, 100);
  quadraticCurveTo.rect(60, 10, 2, 2);
  quadraticCurveTo.stroke({ color: "#008B8B", width: lineWidth }).beginPath();
  quadraticCurveTo.moveTo(0, 0).quadraticCurveTo(60, 10, 100, 100);
  quadraticCurveTo.stroke({ color: "#ff0000", width: lineWidth });
  quadraticCurveTo.pos.set(500, 250);
  app.stage.addChild(quadraticCurveTo);

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

  const dash = new Canvas();
  dash.clear();
  dash.rect(0, 0, 100, 100);
  dash.moveTo(50, 50).circle(50, 50, 40);
  dash.stroke({ color: "#ff0000", width: lineWidth, dash: [10, 5] });
  dash.pos.set(50, 450);
  app.stage.addChild(dash);

  const fill = new Canvas();
  fill.clear();
  fill.rect(0, 0, 100, 100);
  fill.stroke({ color: "#ff0000", width: lineWidth, dash: [10, 5] });
  fill.fill({ color: "#483D8B" });
  fill.pos.set(200, 450);
  app.stage.addChild(fill);

  const texture = await Texture.from("assets/bg2.webp");
  if (!texture) return;

  const image = new Canvas();
  image.clear();
  image.image(texture, 0, 0, 100, 50);
  image.image(texture, 0, 50, 100, 50);
  image.pos.set(350, 450);
  app.stage.addChild(image);

  const clip = new Canvas();
  clip.clear();
  clip.beginPath();
  clip.circle(50, 50, 50).clip();
  clip.image(texture, 0, 0, 200, 100);
  clip.pos.set(500, 450);
  app.stage.addChild(clip);

  const svgPath = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.1C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="red"/>
    </svg>`;
  const svg = new Canvas();
  svg.clear();
  svg.svg(svgPath);
  svg.pos.set(50, 650);
  app.stage.addChild(svg);

  const grd = createLinearGradient({ startX: 0, endX: 200, startY: 0, endY: 0 }, [
    { rate: 0, color: "red" },
    { rate: 1, color: "white" },
  ]);

  const gradient = new Canvas();
  gradient.clear();
  gradient.circle(50, 50, 50);
  gradient.fill({ color: grd });
  gradient.pos.set(200, 650);
  app.stage.addChild(gradient);

  const pat = await createPatternByUrl("assets/apple2.png", "repeat");
  const pattern = new Canvas();
  pattern.clear();
  pattern.rect(0, 0, 100, 100);
  pattern.fill({ color: pat });
  pattern.pos.set(350, 650);
  app.stage.addChild(pattern);

  const mouse = new Canvas();
  mouse.clear();
  mouse.circle(50, 50, 50);
  mouse.fill({ color: "#ff0000" });
  mouse.pos.set(500, 650);
  app.stage.addChild(mouse);

  mouse.on(EventType.mouseover, () => {
    mouse.clear();
    mouse.circle(50, 50, 50);
    mouse.stroke({ color: "#ff0000", width: lineWidth });
    mouse.stroke({ color: "#ff0000", width: lineWidth });
  });
  mouse.on(EventType.mouseout, () => {
    mouse.clear();
    mouse.circle(50, 50, 50);
    mouse.fill({ color: "#ff0000" });
  });

  const mouse2 = new Canvas();
  mouse2.clear();
  mouse2.circle(50, 50, 50);
  mouse2.stroke({ color: "#ff0000", width: lineWidth });
  mouse2.pos.set(650, 650);
  app.stage.addChild(mouse2);

  mouse2.on(EventType.mouseover, () => {
    mouse2.clear();
    mouse2.rect(0, 0, 100, 100);
    mouse2.stroke({ color: "#ff0000", width: lineWidth });
  });
  mouse2.on(EventType.mouseout, () => {
    mouse2.clear();
    mouse2.circle(50, 50, 50);
    mouse2.stroke({ color: "#ff0000", width: lineWidth });
  });

  showBounds(app);

  // TODO scale 后的清晰度
}

test();
