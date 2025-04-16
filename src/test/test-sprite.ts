// 这是一个示例程序，展示如何使用liko游戏引擎在屏幕上显示各种图片（精灵）
import { App, Sprite, Texture } from "liko";

async function test() {
  // 第一步：创建一个新的应用程序
  const app = new App();
  // 设置应用程序的基本属性：创建一个800x800像素的游戏窗口，并设置背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建一个背景图片
  const bg = new Sprite();
  bg.url = "assets/bg2.webp"; // 指定背景图片的文件位置
  bg.scale.set(0.5); // 将背景图片缩小到原来的一半大小
  app.stage.addChild(bg); // 将背景图片放到游戏画面中

  // 创建一个苹果图片
  const apple = new Sprite();
  apple.url = "assets/apple.png"; // 指定苹果图片的文件位置
  apple.scale.set(0.5); // 将苹果图片缩小到原来的一半大小
  apple.pos.set(300); // 将苹果放在坐标(300,300)的位置
  app.stage.addChild(apple); // 将苹果图片放到游戏画面中

  // 创建一个草莓图片，并展示更多图片属性的设置方法
  const strawberry = new Sprite();
  strawberry.url = "assets/strawberry.png"; // 指定草莓图片的文件位置
  strawberry.pos.x = 500; // 设置草莓在水平方向上的位置（距离左边500像素）
  strawberry.pos.y = 300; // 设置草莓在垂直方向上的位置（距离顶部300像素）
  strawberry.width = 200; // 直接设置草莓图片的宽度为200像素
  strawberry.height = 200; // 直接设置草莓图片的高度为200像素
  strawberry.tint = 0xff00ff; // 给草莓图片添加紫色滤镜效果
  app.stage.addChild(strawberry); // 将草莓图片放到游戏画面中

  // 创建一个砖块图片，展示不同的图片加载方式和特效
  const brick = new Sprite();
  brick.load("assets/brick.png"); // 使用load方法加载图片，这是另一种加载图片的方式
  brick.pos.set(300, 500); // 将砖块放在坐标(300,500)的位置
  brick.alpha = 0.5; // 设置砖块的透明度为50%
  brick.angle = 45; // 将砖块旋转45度
  app.stage.addChild(brick); // 将砖块图片放到游戏画面中

  // 创建一个男孩图片，展示如何在创建精灵时直接设置多个属性
  new Sprite({
    url: "assets/boy.png", // 指定男孩图片的文件位置
    pos: { x: 500, y: 600 }, // 将男孩放在坐标(500,600)的位置
    parent: app.stage, // 直接指定父容器，这样就不需要再调用addChild方法
  });

  // 创建一个女孩图片，展示如何预先加载图片资源
  const texture = await Texture.from("assets/girl.png"); // 先将图片加载为纹理资源
  if (!texture) return; // 如果加载失败，就退出程序

  const girl = new Sprite();
  girl.texture = texture; // 将预加载的纹理资源设置给精灵
  girl.pos.set(600, 600); // 将女孩放在坐标(600,600)的位置
  app.stage.addChild(girl); // 将女孩图片放到游戏画面中
}

test(); // 运行上面定义的测试函数，开始展示所有图片
