import { App, Scene, Text, Canvas } from "liko";

const json = {
  id: "1",
  type: "Scene",
  props: {
    label: "scene1",
    width: 480,
    height: 700,
    description: "飞机射击游戏第一关",
  },
  children: [
    {
      id: "999",
      type: "Text",
      description: "显示积分",
      props: {
        label: "score",
        text: "积分：0",
        position: { x: 100, y: 100 },
        fontSize: 30,
        width: 100,
        height: 30,
      },
    },
  ],
};

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800 });

  const scene = new Scene();
  scene.fromJson(json);
  app.stage.addChild(scene);

  const text = new Text();
  // text.text = "";
  scene.addChild(text);

  const canvas = new Canvas();
  canvas.rect(0, 0, 100, 100);
  canvas.fill({ color: "red" });
  canvas.stroke({ color: "blue", width: 2 });

  canvas.beginPath();
  canvas.circle(100, 100, 50);
  canvas.fill({ color: "green" });
  canvas.stroke({ color: "yellow", width: 2 });
  scene.addChild(canvas);
}

test();
