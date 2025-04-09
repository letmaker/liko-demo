// 使用liko引擎，在屏幕上绘制精灵
import { App, Sprite, Texture } from "liko";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建背景精灵
  const bg = new Sprite();
  bg.url = "assets/bg2.webp"; // 设置背景图片路径
  bg.scale.set(0.5); // 将背景缩放为原来的一半大小
  app.stage.addChild(bg); // 将背景添加到舞台

  // 创建苹果精灵
  const apple = new Sprite();
  apple.url = "assets/apple.png"; // 设置苹果图片路径
  apple.scale.set(0.5); // 将苹果缩放为原来的一半大小
  apple.pos.set(300); // 设置苹果位置为(300,300)
  app.stage.addChild(apple); // 将苹果添加到舞台

  // 创建草莓精灵
  const strawberry = new Sprite();
  strawberry.url = "assets/strawberry.png"; // 设置草莓图片路径
  strawberry.pos.x = 500; // 设置草莓的x坐标为500
  strawberry.pos.y = 300; // 设置草莓的y坐标为300
  strawberry.width = 200; // 设置草莓宽度为200
  strawberry.height = 200; // 设置草莓高度为200
  strawberry.tint = 0xff00ff; // 设置草莓的色调为紫色
  app.stage.addChild(strawberry); // 将草莓添加到舞台

  // 创建砖块精灵
  const brick = new Sprite();
  brick.load("assets/brick.png"); // 使用load方法加载砖块图片
  brick.pos.set(300, 500); // 设置砖块位置为(300,500)
  brick.alpha = 0.5; // 设置砖块透明度为0.5
  brick.angle = 45; // 设置砖块旋转角度为45度
  app.stage.addChild(brick); // 将砖块添加到舞台

  // 创建男孩精灵，使用构造函数参数直接设置属性
  new Sprite({
    url: "assets/boy.png",
    pos: { x: 500, y: 600 },
    parent: app.stage,
  });

  // 创建女孩精灵，使用Texture.from方法先加载纹理
  const texture = await Texture.from("assets/girl.png");
  if (!texture) return;

  const girl = new Sprite();
  girl.texture = texture; // 设置女孩精灵的纹理
  girl.pos.set(600, 600); // 设置女孩位置为(600,600)
  app.stage.addChild(girl); // 将女孩添加到舞台
}

test(); // 执行测试函数
