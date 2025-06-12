/**
 * 动画精灵(AnimatedSprite)功能测试
 * 演示如何使用Liko引擎创建和控制各种动画精灵
 */
import { AnimatedSprite, App, Ease, EventType, loader, Text, type Texture, Tween } from "liko";

async function test() {
  // 创建应用实例，设置画布大小和背景色
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 创建第一个动画精灵：使用atlas文件的飞行动画
  new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas", // 图集文件路径
    parent: app.stage,
    position: { x: 100, y: 100 },
  }).play(); // 立即开始播放动画

  // 创建第二个动画精灵：僵尸动画，设置缩放和帧率
  new AnimatedSprite({
    url: "assets/sheet/zombie.atlas",
    parent: app.stage,
    position: { x: 400, y: 100 },
    scale: { x: 0.5, y: 0.5 }, // 缩放到50%
    frameRate: 10, // 设置动画帧率为10帧/秒
  }).play();

  // 预加载女孩的跳跃和跑步动画纹理
  const jumpTextures = await loader.load<Texture[]>("assets/sheet/girl-jump.atlas", "sheet");
  const runTextures = await loader.load<Texture[]>("assets/sheet/girl-run.atlas", "sheet");
  if (!runTextures || !jumpTextures) {
    return; // 如果加载失败则退出
  }

  // 创建火焰动画精灵，使用旋转的图集
  new AnimatedSprite({
    url: "assets/sheet/fire-rotated.atlas",
    parent: app.stage,
    position: { x: 250, y: 290 },
    frameRate: 20, // 高帧率让火焰看起来更流畅
  }).play();

  // 创建可交互的女孩动画精灵
  const girl = new AnimatedSprite({
    textures: runTextures, // 使用预加载的跑步纹理
    parent: app.stage,
    position: { x: 100, y: 300 },
    scale: { x: 0.5, y: 0.5 },
    frameRate: 10,
  });
  girl.play(); // 开始播放跑步动画

  // 为女孩精灵添加点击事件：点击时执行跳跃动画
  girl.on(EventType.click, () => {
    if (girl.textures === jumpTextures) return; // 如果正在跳跃则忽略点击

    // 切换到跳跃动画纹理
    girl.textures = jumpTextures;

    // 创建跳跃的缓动动画
    Tween.to({
      target: girl,
      props: {
        position: { x: girl.position.x, y: "-100" }, // 向上移动100像素
      },
      ease: Ease.CubicOut, // 使用三次方缓出效果
      duration: 0.3, // 动画持续0.3秒
      yoyo: true, // 往返动画（上升后下降）
      repeat: 2, // 重复2次（总共执行2个完整的往返）
    })
      .onAllComplete(() => {
        // 动画完成后切换回跑步纹理
        girl.textures = runTextures;
      })
      .play();
  });

  // 添加提示文本
  new Text({
    text: "点击女孩跳跃",
    parent: app.stage,
    fontSize: 20,
    position: { x: 110, y: 436 },
  });
}

test();
