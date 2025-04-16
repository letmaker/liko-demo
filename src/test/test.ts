// 使用liko引擎，在屏幕上绘制精灵
import { App, Scene } from "liko";

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
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0xff0000 });

  const scene = new Scene();
  scene.fromJson(json);
  app.stage.addChild(scene);
}

test(); // 执行测试函数
