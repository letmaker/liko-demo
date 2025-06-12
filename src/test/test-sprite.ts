/**
 * 精灵(Sprite)功能测试
 * 演示如何使用Liko引擎创建和操作各种精灵对象
 */
import { App, Canvas, EventType, Sprite, Texture, Tween } from "liko";

async function test() {
  // 创建应用实例，设置画布尺寸和背景色
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建背景精灵
  new Sprite({
    label: "bg", // 标签标识
    url: "assets/bg2.webp", // 图片资源路径
    scale: { x: 0.5, y: 0.5 }, // 缩放比例
    parent: app.stage, // 父节点为舞台
  });

  // 创建苹果精灵（使用缩放设置大小）
  new Sprite({
    label: "apple",
    url: "assets/apple.png",
    scale: { x: 0.5, y: 0.5 }, // 通过缩放控制大小
    anchor: { x: 0.5, y: 0.5 }, // 设置锚点为中心
    position: { x: 400, y: 400 }, // 位置坐标
    parent: app.stage,
  });

  // 创建另一个苹果精灵（使用宽高设置大小）
  new Sprite({
    label: "apple",
    url: "assets/apple.png",
    position: { x: 400, y: 400 },
    width: 100, // 直接设置宽度
    height: 100, // 直接设置高度
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });

  // 创建草莓精灵并添加颜色变化效果
  const strawberry = new Sprite({
    url: "assets/strawberry.png",
    position: { x: 550, y: 350 },
    width: 100,
    height: 100,
    tintColor: 0xff00ff, // 初始着色（洋红色）
    parent: app.stage,
  });

  // 每100毫秒随机改变草莓的颜色
  setInterval(() => {
    const color = Math.floor(Math.random() * 0xffffff); // 生成随机颜色
    strawberry.tintColor = color;
  }, 100);

  // 创建球精灵并添加鼠标悬停交互
  const ball = new Sprite({
    url: "assets/ball.png",
    position: { x: 300, y: 600 },
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });

  // 鼠标悬停时放大
  ball.on("pointerover", () => {
    ball.scale.set(2);
  });

  // 鼠标离开时恢复原大小
  ball.on("pointerout", () => {
    ball.scale.set(1.0);
  });

  // 创建可切换纹理的精灵（男孩/女孩切换）
  const frames = ["assets/boy.png", "assets/girl.png"]; // 纹理帧数组
  const switchableSprite = new Sprite({
    url: "assets/boy.png", // 初始纹理
    position: { x: 500, y: 600 },
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });

  let frameIndex = 1;
  // 每秒切换一次纹理
  setInterval(async () => {
    frameIndex = frameIndex === 1 ? 0 : 1; // 在0和1之间切换
    const newTexture = await Texture.createFromUrl(frames[frameIndex]);
    if (newTexture) {
      switchableSprite.texture = newTexture; // 更新精灵纹理
    }
  }, 1000);

  // 使用预加载纹理创建女孩精灵
  const texture = await Texture.createFromUrl("assets/girl.png");
  if (texture) {
    const girl = new Sprite({
      label: "girl",
      texture: texture, // 直接使用纹理对象
      position: { x: 600, y: 600 },
      anchor: { x: 0.5, y: 0.5 },
      parent: app.stage,
      onClick: () => {
        girl.angle++; // 点击时旋转1度
      },
    });

    // 为女孩精灵添加缓动动画效果
    Tween.from({
      target: girl, // 动画目标
      props: {
        scale: { x: 0.5, y: 0.5 }, // 从50%缩放开始
        angle: "+360", // 旋转360度
        alpha: 0, // 从透明开始
      },
      duration: 1, // 动画持续1秒
      repeat: 0, // 不重复
      repeatDelay: 1, // 重复延迟
      yoyo: true, // 往返动画
    }).play();
  }

  // 显示边界框辅助功能
  showBounds(app);
}

test();

/**
 * 显示精灵边界框的辅助函数
 * 当鼠标悬停在精灵上时显示其边界框
 * @param app 应用实例
 */
function showBounds(app: App) {
  const bounds = new Canvas(); // 创建画布用于绘制边界框

  // 为舞台上的每个子对象添加边界框显示功能
  for (const child of app.stage.children) {
    // 鼠标悬停时显示边界框
    child.on(EventType.pointerOver, () => {
      const lb = child.getLocalBounds(); // 获取本地边界
      const wb = child.getWorldBounds(); // 获取世界边界
      console.log("local bounds", lb);
      console.log("world bounds", wb);

      // 清除之前的绘制并绘制新的边界框
      bounds.clear();
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      bounds.stroke({ color: "#ff0000", width: 1 }); // 红色边框
      app.stage.addChild(bounds);
    });

    // 鼠标离开时隐藏边界框
    child.on(EventType.pointerOut, () => {
      app.stage.removeChild(bounds);
    });
  }
}
