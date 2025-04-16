import { App, Canvas, EventType, Text, createLinearGradient, createPatternByUrl } from "liko";

const FONT_SIZE = 30;

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

  new Text({
    text: "this is a\n居左",
    fillColor: "#ff0000",
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n居中",
    fillColor: "#ff0000",
    align: "center",
    pos: { x: 200, y: 0 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n居右",
    fillColor: "#ff0000",
    align: "right",
    pos: { x: 400, y: 0 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n粗体",
    fillColor: "#ff0000",
    fontWeight: "bold",
    pos: { x: 0, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n粗体描边",
    fillColor: "#ff0000",
    fontWeight: "bold",
    strokeWidth: 7,
    strokeColor: "#efefef",
    pos: { x: 200, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n纯描边",
    fillColor: "",
    fontWeight: "bold",
    strokeWidth: 1,
    strokeColor: "#efefef",
    pos: { x: 450, y: 150 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is a\n斜体",
    fillColor: "#ff0000",
    fontWeight: "bold",
    italic: true,
    pos: { x: 0, y: 300 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  new Text({
    text: "this is\n斜体居中",
    fillColor: "#ff0000",
    fontWeight: "bold",
    italic: true,
    strokeWidth: 16,
    align: "center",
    strokeColor: "#efefef",
    pos: { x: 200, y: 300 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

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

  new Text({
    text: "this is a\n渐变",
    fillColor: createLinearGradient({ startX: 0, endX: 200, startY: 0, endY: 0 }, [
      { rate: 0, color: "red" },
      { rate: 1, color: "white" },
    ]),
    fontWeight: "bold",
    italic: true,
    pos: { x: 0, y: 450 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  const pat = await createPatternByUrl("assets/bg1.webp", "repeat");
  new Text({
    text: "this is\n图案填充",
    fillColor: pat,
    fontWeight: "bold",
    italic: true,
    pos: { x: 200, y: 450 },
    fontSize: FONT_SIZE,
    parent: app.stage,
  });

  // 组合属性测试
  new Text({
    text: "组合效果",
    fillColor: createLinearGradient({ startX: 0, endX: 200, startY: 0, endY: 200 }, [
      { rate: 0, color: "#ff0000" },
      { rate: 0.5, color: "#00ff00" },
      { rate: 1, color: "#0000ff" },
    ]),
    fontWeight: "bold",
    italic: true,
    strokeWidth: 4,
    strokeColor: "#ffffff",
    align: "center",
    pos: { x: 450, y: 450 },
    fontSize: FONT_SIZE * 2,
    parent: app.stage,
  });

  // 锚点测试
  const canvas = new Canvas({ pos: { x: 0, y: 600 }, parent: app.stage });
  canvas.rect(0, 0, 200, 200).fill({ color: "#333333" });
  new Text({
    text: "锚点0-0",
    fillColor: "#ff8800",
    fontSize: 12,
    pos: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    parent: canvas,
  });

  new Text({
    text: "锚点0.5-0.5",
    fillColor: "#ff8800",
    fontSize: 12,
    pos: { x: 100, y: 100 },
    anchor: { x: 0.5, y: 0.5 },
    parent: canvas,
  });

  new Text({
    text: "锚点1-1",
    fillColor: "#ff8800",
    fontSize: 12,
    pos: { x: 200, y: 200 },
    anchor: { x: 1, y: 1 },
    parent: canvas,
  });

  // 动态属性变更测试
  const dynamicText = new Text({
    text: "点击我",
    fillColor: "#ffffff",
    pos: { x: 300, y: 600 },
    fontSize: FONT_SIZE,
    parent: app.stage,
    onClick: () => {
      dynamicText.setText("属性已变更");
      dynamicText.fillColor = "#ffff00";
    },
  });

  showBounds(app);
}

test();
