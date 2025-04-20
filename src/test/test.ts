import { App, Scene } from "../../../liko/src";

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
        pos: { x: 100, y: 100 },
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
}

test();
