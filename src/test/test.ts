import { App, Sprite, Shape } from "../../../liko/src";

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  new Sprite({
    label: "apple",
    // 白色图片
    url: "assets/blank.png",
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 400, y: 400 },
    parent: app.stage,
    tintColor: "#ffff00",
  });

  new Shape({
    label: "circle",
    drawCircle: {
      x: 100,
      y: 100,
      radius: 50,
      fill: "#ffff00",
    },
    position: { x: 200, y: 100 },
    parent: app.stage,
  });

  new Shape({
    label: "circle",
    drawCircle: {
      x: 100,
      y: 100,
      radius: 50,
      fill: "#ff0000",
    },
    position: { x: 400, y: 100 },
    parent: app.stage,
  });
}

test();
