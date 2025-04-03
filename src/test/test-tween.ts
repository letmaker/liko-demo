// 使用liko测试缓动动画能力

import { App, Sprite, Tween, EventType, Timer } from "../../../liko/src";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建苹果精灵
  const apple = new Sprite();
  apple.url = "assets/apple.png"; // 设置苹果图片路径
  apple.scale.set(0.5); // 将苹果缩放为原来的一半大小
  apple.pos.set(500, 100); // 设置苹果位置为(300,300)
  app.stage.addChild(apple); // 将苹果添加到舞台

  const tween = Tween.from({ target: apple, props: { alpha: 0, pos: { x: 100, y: 100 } } })
    .to({
      target: apple,
      delay: 1,
      duration: 2,
      props: { alpha: 1, pos: { x: 500, y: 500 } },
    })
    .to({
      target: apple,
      delay: 1,
      duration: 2,
      props: { alpha: 1, pos: { x: 500, y: 100 } },
    });
  tween.play();

  app.stage.on("click", () => {
    if (tween.paused) {
      tween.resume();
    } else {
      tween.pause();
    }
  });

  // 创建草莓精灵
  const strawberry = new Sprite();
  strawberry.url = "assets/strawberry.png"; // 设置草莓图片路径
  strawberry.scale.set(0.5); // 将草莓缩放为原来的一半大小
  strawberry.pos.set(100, 500); // 设置草莓位置为(300,500)
  app.stage.addChild(strawberry); // 将草莓添加到舞台

  Tween.to({
    target: strawberry,
    props: {
      alpha: 0,
      pos: { x: "+500", y: 500 },
      scale: { x: "*2", y: "*2" },
    },
    repeat: 4,
    duration: 2,
    yoyo: true,
  }).play();

  // 创建男孩精灵，使用构造函数参数直接设置属性
  const boy = new Sprite({
    url: "assets/boy.png",
    pos: { x: 400, y: 400 },
    pivot: { x: 66 / 2, y: 92 / 2 },
  });
  app.stage.addChild(boy); // 将男孩添加到舞台

  boy.on(EventType.click, () => {
    if (Timer.system.paused) {
      Timer.system.resume();
    } else {
      Timer.system.pause();
    }
  });

  Tween.to({
    target: boy,
    props: { angle: 360 },
    repeat: 0,
    duration: 2,
  }).play();
}
test();
