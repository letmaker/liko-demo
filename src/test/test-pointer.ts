// 使用liko引擎绘制文本并显示"Hello World"
import { App, Text, Canvas } from "liko";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置画布大小为800x800
  await app.init({ width: 800, height: 800 });

  const canvas = new Canvas();
  // canvas.position = { x: 350, y: 100 };
  canvas.rect(0, 0, 100, 100);
  canvas.fill({ color: "#ff0000" });
  app.stage.addChild(canvas);
  canvas.on("click", () => {
    canvas.clear();
    canvas.circle(50, 50, 50);
    canvas.fill({ color: "#00ffff" });
  });

  const canvas2 = new Canvas();
  canvas2.position = { x: 400, y: 400 };
  canvas2.rect(0, 0, 100, 100);
  canvas2.fill({ color: "#ff0000" });
  canvas2.anchor = { x: 0.5, y: 0.5 };
  app.stage.addChild(canvas2);
  canvas2.on("click", () => {
    canvas2.clear();
    canvas2.rect(0, 0, 200, 100);
    canvas2.stroke({ color: "#00ffff", width: 2 });
  });

  const text = new Text({
    label: "testText",
    text: "Hello World，这是一个很长文字",
    textColor: "#00ffff",
    fontSize: 30,
    position: { x: 400, y: 400 },
    parent: app.stage,
    anchor: { x: 0.5, y: 0.5 },
    onClick: () => {
      text.setText("clicked");
      text.textColor = "#00ff00";
    },
  });
}

// 执行测试函数
test();
