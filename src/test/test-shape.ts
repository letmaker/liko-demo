import { App, Canvas, EventType, Sprite, Shape } from "liko";

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  new Shape({
    label: "line",
    drawLine: {
      points: [
        { x: 50, y: 50 },
        { x: 150, y: 150 },
        { x: 150, y: 50 },
        { x: 50, y: 150 },
      ],
      color: "#ff0000",
      lineWidth: 5,
    },
    position: { x: 0, y: 0 },
    parent: app.stage,
  });

  new Shape({
    label: "rect",
    drawRect: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 2,
    },
    position: { x: 200, y: 0 },
    parent: app.stage,
  });

  new Shape({
    label: "roundedRect",
    drawRoundedRect: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      cornerRadius: 10,
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 2,
    },
    position: { x: 400, y: 0 },
    parent: app.stage,
  });

  new Sprite({
    label: "apple",
    url: "assets/apple2.png",
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 400, y: 400 },
    parent: app.stage,
  });

  new Shape({
    label: "circle",
    drawCircle: {
      x: 50,
      y: 50,
      radius: 50,
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 2,
    },
    position: { x: 50, y: 300 },
    parent: app.stage,
  });

  new Shape({
    label: "polygon",
    drawPolygon: {
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 },
      ],
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 2,
    },
    position: { x: 250, y: 300 },
    parent: app.stage,
  });

  new Shape({
    label: "ellipse",
    drawEllipse: {
      x: 100,
      y: 50,
      radiusX: 100,
      radiusY: 50,
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 2,
    },
    position: { x: 450, y: 300 },
    parent: app.stage,
  });

  const shape = new Shape({
    label: "custom",
    position: { x: 50, y: 500 },
    parent: app.stage,
  });

  shape.drawCircle({
    x: 50,
    y: 50,
    radius: 50,
    fill: "#ffff00",
    stroke: "#0000ff",
  });

  shape.drawPolygon({
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 100 },
    ],
    fill: "#00ff00",
    stroke: "#0000ff",
    strokeWidth: 2,
  });

  const mouseShape = new Shape({
    label: "mouseShape",
    position: { x: 250, y: 500 },
    parent: app.stage,
  });

  mouseShape.drawCircle({
    x: 50,
    y: 50,
    radius: 50,
    fill: "#ffff00",
    stroke: "#0000ff",
  });

  mouseShape.on(EventType.pointerover, () => {
    mouseShape.drawCircle({
      x: 50,
      y: 50,
      radius: 100,
      fill: "#ff00ff",
      stroke: "#0000ff",
      strokeWidth: 2,
    });
  });

  mouseShape.on(EventType.pointerout, () => {
    mouseShape.drawCircle({
      x: 50,
      y: 50,
      radius: 50,
      fill: "#ffff00",
      stroke: "#0000ff",
    });
  });

  new Shape({
    label: "rect",
    drawRect: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: "#00ff00",
      stroke: "#0000ff",
      strokeWidth: 1,
    },
    angle: 45,
    position: { x: 500, y: 500 },
    parent: app.stage,
  });

  showBounds(app);
}

test();

function showBounds(app: App) {
  const bounds = new Canvas();

  for (const child of app.stage.children) {
    child.on(EventType.pointerover, () => {
      const lb = child.getLocalBounds();
      const wb = child.getWorldBounds();
      console.log("local bounds", lb);
      console.log("world bounds", wb);

      bounds.clear();
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      bounds.stroke({ color: "#ff0000", width: 1 });
      app.stage.addChild(bounds);
    });

    child.on(EventType.pointerout, () => {
      app.stage.removeChild(bounds);
    });
  }
}
