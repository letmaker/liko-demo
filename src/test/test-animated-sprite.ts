import { AnimatedSprite, App, Ease, EventType, loader, Text, type Texture, Tween } from "liko";

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas",
    parent: app.stage,
    pos: { x: 100, y: 100 },
  }).play();

  new AnimatedSprite({
    url: "assets/sheet/zombie.atlas",
    parent: app.stage,
    pos: { x: 400, y: 100 },
    scale: { x: 0.5, y: 0.5 },
    frameRate: 10,
  }).play();

  const jumpTextures = await loader.load<Texture[]>("assets/sheet/girl-jump.json", "sheet");
  const runTextures = await loader.load<Texture[]>("assets/sheet/girl-run.json", "sheet");
  if (!runTextures || !jumpTextures) {
    return;
  }

  new AnimatedSprite({
    url: "assets/sheet/fire-rotated.json",
    parent: app.stage,
    pos: { x: 250, y: 290 },
    frameRate: 20,
  }).play();

  const girl = new AnimatedSprite({
    textures: runTextures,
    parent: app.stage,
    pos: { x: 100, y: 300 },
    scale: { x: 0.5, y: 0.5 },
    frameRate: 10,
  });
  girl.play();

  girl.on(EventType.click, () => {
    if (girl.textures === jumpTextures) return;
    girl.textures = jumpTextures;
    Tween.to({
      target: girl,
      props: {
        pos: { x: girl.pos.x, y: "-100" },
      },
      ease: Ease.CubicOut,
      duration: 0.3,
      yoyo: true,
      repeat: 2,
    })
      .onAllComplete(() => {
        girl.textures = runTextures;
      })
      .play();
  });

  // 显示点击跳跃文本
  new Text({
    text: "点击女孩跳跃",
    parent: app.stage,
    fontSize: 20,
    pos: { x: 110, y: 436 },
  });
}

test();
