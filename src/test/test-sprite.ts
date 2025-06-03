import { App, Canvas, EventType, Sprite, Texture, Tween } from "../../../liko/src";

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  new Sprite({
    label: "bg",
    url: "assets/bg2.webp",
    scale: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });

  new Sprite({
    label: "apple",
    url: "assets/apple.png",
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 400, y: 400 },
    parent: app.stage,
  });

  new Sprite({
    label: "apple",
    url: "assets/apple.png",
    position: { x: 400, y: 400 },
    width: 100,
    height: 100,
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });

  const strawberry = new Sprite({
    url: "assets/strawberry.png",
    position: { x: 550, y: 350 },
    width: 100,
    height: 100,
    tintColor: 0xff00ff,
    parent: app.stage,
  });
  setInterval(() => {
    const color = Math.floor(Math.random() * 0xffffff);
    strawberry.tintColor = color;
  }, 100);

  const ball = new Sprite({
    url: "assets/ball.png",
    position: { x: 300, y: 600 },
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });
  ball.on("pointerover", () => {
    ball.scale.set(2);
  });
  ball.on("pointerout", () => {
    ball.scale.set(1.0);
  });

  const frames = ["assets/boy.png", "assets/girl.png"];
  const switchableSprite = new Sprite({
    url: "assets/boy.png",
    position: { x: 500, y: 600 },
    anchor: { x: 0.5, y: 0.5 },
    parent: app.stage,
  });
  let frameIndex = 1;
  setInterval(async () => {
    frameIndex = frameIndex === 1 ? 0 : 1;
    const newTexture = await Texture.createFromUrl(frames[frameIndex]);
    if (newTexture) {
      switchableSprite.texture = newTexture;
    }
  }, 1000);

  const texture = await Texture.createFromUrl("assets/girl.png");
  if (texture) {
    const girl = new Sprite({
      label: "girl",
      texture: texture,
      position: { x: 600, y: 600 },
      anchor: { x: 0.5, y: 0.5 },
      parent: app.stage,
      onClick: () => {
        girl.angle++;
      },
    });

    Tween.from({
      target: girl,
      props: {
        scale: { x: 0.5, y: 0.5 },
        angle: "+360",
        alpha: 0,
      },
      duration: 1,
      repeat: 0,
      repeatDelay: 1,
      yoyo: true,
    }).play();
  }
  showBounds(app);
}

test();

function showBounds(app: App) {
  const bounds = new Canvas();

  for (const child of app.stage.children) {
    child.on(EventType.pointerover, () => {
      const lb = child.getLocalBounds();
      const wb = child.getWorldBounds();
      console.log("local bounds", lb);
      console.log("world bounds", wb);

      bounds.clear();
      bounds.rect(wb.x, wb.y, wb.width, wb.height);
      bounds.stroke({ color: "#ff0000", width: 1 });
      app.stage.addChild(bounds);
    });

    child.on(EventType.pointerout, () => {
      app.stage.removeChild(bounds);
    });
  }
}
