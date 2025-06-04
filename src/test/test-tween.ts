// 这个示例展示了如何使用 liko 引擎来制作动画效果

import { App, Sprite, Tween, EventType, Timer } from "liko";

async function test() {
  // 创建一个新的游戏应用实例
  const app = new App();
  // 初始化游戏窗口：设置窗口大小为 800x800 像素，背景色设为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建第一个精灵：苹果
  const apple = new Sprite();
  apple.url = "assets/apple.png"; // 设置精灵要显示的图片
  apple.scale.set(0.5); // 将图片缩小到原始大小的一半
  apple.position.set(500, 100); // 设置苹果的初始位置，坐标为(500,100)
  app.stage.addChild(apple); // 将苹果添加到游戏场景中

  // 创建一个复杂的动画序列：苹果的移动和透明度变化
  const tween = Tween.from({ target: apple, props: { alpha: 0, position: { x: 100, y: 100 } } }) // 设置动画起始状态：完全透明，位置在(100,100)
    .to({
      // 第一段动画：移动到中间位置并变为完全不透明
      target: apple,
      delay: 1, // 等待1秒后开始
      duration: 2, // 动画持续2秒
      props: { alpha: 1, position: { x: 500, y: 500 } },
    })
    .to({
      // 第二段动画：移动回顶部
      target: apple,
      delay: 1, // 等待1秒后开始
      duration: 2, // 动画持续2秒
      props: { alpha: 1, position: { x: 500, y: 100 } },
    });
  tween.play(); // 开始播放动画

  // 点击场景时切换苹果动画的播放状态：暂停/继续
  app.stage.on("click", () => {
    if (tween.paused) {
      tween.resume(); // 如果动画暂停中，则继续播放
    } else {
      tween.pause(); // 如果动画播放中，则暂停
    }
  });

  // 创建第二个精灵：草莓
  const strawberry = new Sprite();
  strawberry.url = "assets/strawberry.png"; // 设置草莓图片
  strawberry.scale.set(0.5); // 将图片缩小到原始大小的一半
  strawberry.position.set(100, 500); // 设置草莓的初始位置
  app.stage.addChild(strawberry); // 将草莓添加到游戏场景中

  // 创建草莓的动画：水平移动、缩放和透明度变化
  Tween.to({
    target: strawberry,
    props: {
      alpha: 0, // 透明度变为0
      position: { x: "+500", y: 500 }, // 向右移动500像素
      scale: { x: "*2", y: "*2" }, // 尺寸放大到2倍
    },
    repeat: 4, // 重复4次
    duration: 2, // 每次动画持续2秒
    yoyo: true, // 启用来回播放效果
  }).play(); // 开始播放动画

  // 创建第三个精灵：男孩，使用更简洁的构造函数方式
  const boy = new Sprite({
    url: "assets/boy.png", // 设置男孩图片
    position: { x: 400, y: 400 }, // 设置位置在场景中心
    anchor: { x: 0.5, y: 0.5 }, // 设置旋转中心点为图片中心
    parent: app.stage, // 直接指定父容器为游戏场景
  });

  // 点击男孩时切换整个游戏的时间系统：暂停/继续
  boy.on(EventType.click, () => {
    if (Timer.system.paused) {
      Timer.system.resume(); // 如果时间系统暂停中，则继续
    } else {
      Timer.system.pause(); // 如果时间系统运行中，则暂停
    }
  });

  // 创建男孩的旋转动画
  Tween.to({
    target: boy,
    props: { angle: 360 }, // 顺时针旋转一圈（360度）
    repeat: 0, // 无限重复
    duration: 2, // 动画持续2秒
  }).play(); // 开始播放动画
}

// 运行测试函数
test();
