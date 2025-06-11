/**
 * Liko游戏引擎功能综合示例
 * 这个示例主要用于AI理解Liko引擎的能力和使用方式
 */
import {
  App,
  Scene,
  Text,
  Sprite,
  AnimatedSprite,
  Canvas,
  Shape,
  RigidBody,
  Tween,
  Timer,
  music,
  sound,
  utils,
  Rectangle,
  loader,
  Ease,
  EventType,
  type Texture,
  type LikoPointerEvent,
} from "liko";

async function likoEngineOverview() {
  // 1. 应用程序初始化
  const app = new App();
  await app.init({
    width: 1200, // 增加窗口宽度以容纳更好的布局
    height: 960, // 增加窗口高度以容纳动画示例
    bgColor: 0x2c3e50, // 设置背景颜色（深蓝灰色）
    physics: {
      // 物理引擎配置(如果需要再开启，不需要无需配置)
      enabled: true, // 启用物理系统
      debug: false, // 关闭调试显示
      boundaryArea: new Rectangle(0, 0, 1200, 950).pad(50), // 设置物理边界
    },
  });

  // 2. 场景管理
  const mainScene = new Scene({ width: 1200, height: 950, parent: app.stage });

  // ========== 顶部标题区域 (y: 0-80) ==========

  // 3. 文本渲染系统
  // 主标题 - 展示基本文本功能
  new Text({
    label: "title",
    text: "Liko引擎功能展示\nLiko Game Engine Features",
    textColor: "#ecf0f1",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    position: { x: 600, y: 40 },
    anchor: { x: 0.5, y: 0.5 },
    parent: mainScene,
  });

  // ========== 文本功能演示区域 (y: 80-140) ==========

  // 渐变文本 - 展示高级文本效果
  new Text({
    text: "支持渐变色文本效果",
    textColor: utils.createLinearGradient({ startX: 0, endX: 250, startY: 0, endY: 0 }, [
      { offset: 0, color: "#e74c3c" },
      { offset: 0.5, color: "#f39c12" },
      { offset: 1, color: "#2ecc71" },
    ]),
    fontSize: 22,
    fontWeight: "bold",
    position: { x: 50, y: 100 },
    parent: mainScene,
  });

  // 描边文本
  const strokeText = new Text();
  strokeText.label = "strokeText";
  strokeText.text = "描边文本效果";
  strokeText.textColor = "#3498db";
  strokeText.fontSize = 22;
  strokeText.fontWeight = "bold";
  strokeText.textStrokeWidth = 3;
  strokeText.textStrokeColor = "#ffffff";
  strokeText.position.set(400, 100);
  mainScene.addChild(strokeText);

  // 功能说明文本
  new Text({
    text: "文本渲染功能：支持渐变、描边、对齐等效果",
    textColor: "#bdc3c7",
    fontSize: 16,
    position: { x: 700, y: 100 },
    parent: mainScene,
  });

  // ========== 左侧精灵和交互演示区域 (y: 160-480) ==========

  // 区域标题
  new Text({
    text: "精灵系统与动画",
    textColor: "#f1c40f",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 160 },
    parent: mainScene,
  });

  // 4. 精灵(Sprite)系统
  // 静态精灵
  new Sprite({
    url: "assets/bg2.webp",
    width: 150,
    height: 100,
    alpha: 0.8,
    position: { x: 50, y: 190 },
    parent: mainScene,
  });

  new Text({
    text: "静态精灵",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 50, y: 300 },
    parent: mainScene,
  });

  // 可交互精灵
  const interactiveSprite = new Sprite();
  interactiveSprite.url = "assets/apple.png";
  interactiveSprite.scale.set(0.4);
  interactiveSprite.anchor = { x: 0.5, y: 0.5 };
  interactiveSprite.position.set(300, 220);
  mainScene.addChild(interactiveSprite);

  new Text({
    text: "可交互精灵\n(悬停和点击)",
    textColor: "#95a5a6",
    fontSize: 14,
    textAlign: "center",
    position: { x: 300, y: 300 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // 添加交互事件
  interactiveSprite.on("pointerover", () => {
    interactiveSprite.scale.set(0.5);
    interactiveSprite.tintColor = 0xff6b6b;
  });

  interactiveSprite.on("pointerout", () => {
    interactiveSprite.scale.set(0.4);
    interactiveSprite.tintColor = 0xffffff;
  });

  interactiveSprite.on("click", () => {
    // 播放音效
    sound.play("assets/sound/bullet.mp3", 0.5);

    // 创建点击动画
    Tween.to({
      target: interactiveSprite,
      props: {
        scale: { x: 0.6, y: 0.6 },
        angle: "+360",
      },
      duration: 0.5,
    }).play();
  });

  // 动画演示精灵
  const rotatingSprite = new Sprite({
    url: "assets/strawberry.png",
    scale: { x: 0.4, y: 0.4 },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 500, y: 240 },
    parent: mainScene,
  });

  new Text({
    text: "旋转动画精灵",
    textColor: "#95a5a6",
    fontSize: 14,
    textAlign: "center",
    position: { x: 500, y: 320 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // 7. 动画系统(Tween) - 连续旋转动画
  Tween.to({
    target: rotatingSprite,
    props: { angle: 360 },
    duration: 3,
    repeat: 0, // 无限重复
  }).play();

  // 浮动动画精灵
  const floatingSprite = new Sprite({
    url: "assets/girl.png",
    width: 56,
    height: 78,
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 650, y: 240 },
    parent: mainScene,
  });

  new Text({
    text: "浮动动画精灵",
    textColor: "#95a5a6",
    fontSize: 14,
    textAlign: "center",
    position: { x: 650, y: 320 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // 上下浮动动画
  Tween.to({
    target: floatingSprite,
    props: { position: { y: 180 } },
    duration: 2,
    repeat: 0,
    yoyo: true,
  }).play();

  // 点击切换纹理的精灵
  const boyTexture = await loader.load<Texture>("assets/boy.png");
  const girlTexture = await loader.load<Texture>("assets/girl.png");
  const switchableSprite = new Sprite({
    texture: boyTexture,
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 800, y: 240 },
    scale: { x: 0.8, y: 0.8 },
    parent: mainScene,
  });

  let frameIndex = 0;
  switchableSprite.on("click", async () => {
    // 切换到下一个纹理
    frameIndex = frameIndex === 1 ? 0 : 1;
    if (girlTexture && boyTexture) {
      switchableSprite.texture = switchableSprite.texture === boyTexture ? girlTexture : boyTexture;
      // 添加切换动画效果
      Tween.to({
        target: switchableSprite,
        props: {
          scale: { x: 1.0, y: 1.0 },
        },
        duration: 0.2,
        yoyo: true,
        repeat: 2,
      }).play();
    }
  });

  new Text({
    text: "切换纹理精灵\n(点击切换)",
    textColor: "#95a5a6",
    fontSize: 14,
    textAlign: "center",
    position: { x: 800, y: 320 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // ========== 动画精灵(AnimatedSprite)展示区域 (y: 350-480) ==========

  // 动画精灵区域标题
  new Text({
    text: "动画精灵(AnimatedSprite)系统",
    textColor: "#e67e22",
    fontSize: 18,
    fontWeight: "bold",
    position: { x: 50, y: 350 },
    parent: mainScene,
  });

  // Atlas动画精灵 - Fliggy
  new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas",
    parent: mainScene,
    position: { x: 50, y: 400 },
    scale: { x: 0.8, y: 0.8 },
  }).play();

  new Text({
    text: "Atlas动画\n(Fliggy)",
    textColor: "#95a5a6",
    fontSize: 12,
    textAlign: "center",
    position: { x: 80, y: 460 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // Atlas动画精灵 - Zombie
  new AnimatedSprite({
    url: "assets/sheet/zombie.atlas",
    parent: mainScene,
    position: { x: 170, y: 380 },
    scale: { x: 0.4, y: 0.4 },
    frameRate: 8,
  }).play();

  new Text({
    text: "Atlas动画\n(Zombie)",
    textColor: "#95a5a6",
    fontSize: 12,
    textAlign: "center",
    position: { x: 200, y: 460 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // JSON Sheet动画精灵 - Fire
  new AnimatedSprite({
    url: "assets/sheet/fire-rotated.atlas",
    parent: mainScene,
    position: { x: 280, y: 360 },
    scale: { x: 0.6, y: 0.6 },
    frameRate: 15,
  }).play();

  new Text({
    text: "JSON动画\n(Fire)",
    textColor: "#95a5a6",
    fontSize: 12,
    textAlign: "center",
    position: { x: 320, y: 460 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // 可交互动画精灵 - Girl (加载纹理数组)
  const jumpTextures = await loader.load<Texture[]>("assets/sheet/girl-jump.atlas", "sheet");
  const runTextures = await loader.load<Texture[]>("assets/sheet/girl-run.atlas", "sheet");

  if (runTextures && jumpTextures) {
    const interactiveGirl = new AnimatedSprite({
      textures: runTextures,
      parent: mainScene,
      position: { x: 380, y: 380 },
      scale: { x: 0.4, y: 0.4 },
      frameRate: 8,
    });
    interactiveGirl.play();

    // 点击切换动画
    interactiveGirl.on(EventType.click, () => {
      if (interactiveGirl.textures === jumpTextures) return;

      // 切换到跳跃动画
      interactiveGirl.textures = jumpTextures;

      // 跳跃动画
      Tween.to({
        target: interactiveGirl,
        props: {
          position: { x: interactiveGirl.position.x, y: interactiveGirl.position.y - 60 },
        },
        ease: Ease.CubicOut,
        duration: 0.4,
        yoyo: true,
        repeat: 2,
      })
        .onAllComplete(() => {
          // 动画完成后切换回跑步动画
          interactiveGirl.textures = runTextures;
        })
        .play();
    });

    new Text({
      text: "交互动画\n(点击跳跃)",
      textColor: "#95a5a6",
      fontSize: 12,
      textAlign: "center",
      position: { x: 440, y: 460 },
      anchor: { x: 0.5, y: 0 },
      parent: mainScene,
    });
  }

  // 动态帧率控制的动画精灵
  const frameRateSprite = new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas",
    parent: mainScene,
    position: { x: 530, y: 400 },
    scale: { x: 0.6, y: 0.6 },
    frameRate: 5, // 初始较慢帧率
  });
  frameRateSprite.play();

  // 创建帧率变化动画
  Tween.to({
    target: frameRateSprite,
    props: { frameRate: 20 },
    duration: 3,
    yoyo: true,
    repeat: 0,
  }).play();

  new Text({
    text: "动态帧率\n(5→20→5fps)",
    textColor: "#95a5a6",
    fontSize: 12,
    textAlign: "center",
    position: { x: 560, y: 460 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // ========== 右侧物理系统演示区域 (y: 160-480) ==========

  // 5. 物理系统
  // 动态物理方块
  const physicsBox = new Sprite({
    url: "assets/box.png",
    width: 50,
    height: 50,
    anchor: { x: 0.5, y: 0.5 },
    parent: mainScene,
    position: { x: 850, y: 80 },
    scripts: [
      new RigidBody({
        rigidType: "dynamic",
        friction: 0.7,
        restitution: 0.4,
        allowRotation: true,
      }),
    ],
  });

  // 为物理方块添加点击事件 - 施加向上的力
  physicsBox.on("click", () => {
    const rigidBody = physicsBox.findScript<RigidBody>({ Class: RigidBody });
    if (rigidBody) {
      // 施加向上的力
      rigidBody.applyForceToCenter({ x: 0, y: -800 });
      // 播放音效
      sound.play("assets/sound/bullet.mp3", 0.7);
    }
  });

  // 物理小球
  const physicsBall = new Sprite();
  physicsBall.url = "assets/ball.png";
  physicsBall.width = 35;
  physicsBall.height = 35;
  physicsBall.anchor = { x: 0.5, y: 0.5 };
  physicsBall.position.set(950, 80);
  physicsBall.scripts = [
    new RigidBody({
      rigidType: "dynamic",
      friction: 0.3,
      restitution: 0.8,
      shapes: [
        {
          shapeType: "circle",
          radius: 17.5,
        },
      ],
    }),
  ];
  mainScene.addChild(physicsBall);

  // 为物理小球添加点击事件 - 增加向上的速度
  physicsBall.on("click", () => {
    const rigidBody = physicsBall.findScript<RigidBody>({ Class: RigidBody });
    if (rigidBody) {
      // 直接设置向上的线性速度
      rigidBody.linearVelocity = { x: 0, y: -15 };
      // 播放音效
      sound.play("assets/sound/bullet.mp3", 0.7);
    }
  });

  new Text({
    text: "动态物理对象\n(点击方块施加力，点击小球设置速度)",
    textColor: "#95a5a6",
    fontSize: 14,
    textAlign: "center",
    position: { x: 900, y: 800 },
    anchor: { x: 0.5, y: 0 },
    parent: mainScene,
  });

  // 旋转的Shape
  const rotatingShape = new Shape({
    label: "rotatingShape",
    drawPolygon: {
      points: [
        { x: 0, y: -15 },
        { x: 12, y: 8 },
        { x: -12, y: 8 },
      ],
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: 2,
    },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 780, y: 695 },
    parent: mainScene,
  });

  Tween.to({
    target: rotatingShape,
    props: { angle: 360 },
    duration: 4,
    repeat: 0,
  }).play();

  new Text({
    text: "旋转Shape",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 750, y: 725 },
    parent: mainScene,
  });

  // ========== Canvas绘图功能展示区域 (y: 500-720) ==========

  // 区域标题
  new Text({
    text: "Canvas绘图系统",
    textColor: "#9b59b6",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 500 },
    parent: mainScene,
  });

  // 6. Canvas绘图系统
  // 基本几何图形绘制
  const customCanvas = new Canvas();
  // 绘制填充圆形
  customCanvas.beginPath();
  customCanvas.circle(40, 40, 25);
  customCanvas.fill({ color: "#e74c3c" });
  // 绘制填充矩形
  customCanvas.beginPath();
  customCanvas.rect(90, 20, 50, 35);
  customCanvas.fill({ color: "#3498db" });
  // 绘制三角形路径
  customCanvas.beginPath();
  customCanvas.moveTo(170, 20);
  customCanvas.lineTo(210, 20);
  customCanvas.lineTo(190, 60);
  customCanvas.closePath();
  customCanvas.fill({ color: "#2ecc71" });

  customCanvas.position.set(50, 530);
  mainScene.addChild(customCanvas);

  new Text({
    text: "基本图形",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 50, y: 620 },
    parent: mainScene,
  });

  // 高级Canvas绘图 - 描边图形
  const strokeCanvas = new Canvas();
  // 描边圆角矩形
  strokeCanvas.beginPath();
  strokeCanvas.roundRect(10, 10, 70, 50, 8);
  strokeCanvas.stroke({ color: "#9b59b6", width: 3 });
  // 描边椭圆
  strokeCanvas.beginPath();
  strokeCanvas.ellipse(130, 35, 35, 20, 0, 2 * Math.PI);
  strokeCanvas.stroke({ color: "#f39c12", width: 3 });
  // 虚线圆形
  strokeCanvas.beginPath();
  strokeCanvas.circle(210, 35, 25);
  strokeCanvas.stroke({ color: "#e74c3c", width: 2, dash: [5, 3] });

  strokeCanvas.position.set(300, 530);
  mainScene.addChild(strokeCanvas);

  new Text({
    text: "描边效果",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 300, y: 620 },
    parent: mainScene,
  });

  // 复杂路径绘制
  const pathCanvas = new Canvas();
  // 绘制五角星
  pathCanvas.beginPath();
  const outerRadius = 22;
  const innerRadius = outerRadius * 0.382;
  const centerX = 35;
  const centerY = 35;

  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    if (i === 0) {
      pathCanvas.moveTo(x, y);
    } else {
      pathCanvas.lineTo(x, y);
    }
  }
  pathCanvas.closePath();
  pathCanvas.fill({ color: "#f1c40f" });
  pathCanvas.stroke({ color: "#e67e22", width: 2 });

  // 绘制贝塞尔曲线
  pathCanvas.beginPath();
  pathCanvas.moveTo(100, 15);
  pathCanvas.quadraticCurveTo(140, 0, 180, 15);
  pathCanvas.quadraticCurveTo(220, 35, 180, 55);
  pathCanvas.quadraticCurveTo(140, 70, 100, 55);
  pathCanvas.quadraticCurveTo(60, 35, 100, 15);
  pathCanvas.fill({ color: "#3498db" });

  pathCanvas.position.set(580, 530);
  mainScene.addChild(pathCanvas);

  new Text({
    text: "复杂路径",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 580, y: 620 },
    parent: mainScene,
  });

  // 渐变和图案Canvas
  const gradientCanvas = new Canvas();
  // 线性渐变矩形
  gradientCanvas.beginPath();
  gradientCanvas.rect(10, 10, 80, 35);
  gradientCanvas.fill({
    color: utils.createLinearGradient({ startX: 10, startY: 10, endX: 90, endY: 10 }, [
      { offset: 0, color: "#ff6b6b" },
      { offset: 0.5, color: "#4ecdc4" },
      { offset: 1, color: "#ffffff" },
    ]),
  });

  // 径向渐变圆形
  gradientCanvas.beginPath();
  gradientCanvas.circle(130, 27, 22);
  gradientCanvas.fill({
    color: utils.createRadialGradient({ startX: 130, startY: 27, startRadius: 0, endX: 130, endY: 27, endRadius: 22 }, [
      { offset: 0, color: "#ffffff" },
      { offset: 0.7, color: "#ff6b6b" },
      { offset: 1, color: "#c44569" },
    ]),
  });

  gradientCanvas.position.set(830, 530);
  mainScene.addChild(gradientCanvas);

  new Text({
    text: "渐变效果",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 830, y: 620 },
    parent: mainScene,
  });

  // 交互式Canvas - 悬停改变颜色
  const interactiveCanvas = new Canvas();
  const drawInteractiveShape = (fillColor: string) => {
    interactiveCanvas.clear();
    interactiveCanvas.beginPath();
    // 绘制一个复杂的花朵形状
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = 40 + 25 * Math.cos(angle);
      const y = 40 + 25 * Math.sin(angle);
      interactiveCanvas.circle(x, y, 12);
    }
    interactiveCanvas.circle(40, 40, 18);
    interactiveCanvas.fill({ color: fillColor });
  };

  drawInteractiveShape("#e74c3c");

  interactiveCanvas.on("pointerover", () => {
    drawInteractiveShape("#2ecc71");
  });

  interactiveCanvas.on("pointerout", () => {
    drawInteractiveShape("#e74c3c");
  });

  interactiveCanvas.position.set(1020, 530);
  mainScene.addChild(interactiveCanvas);

  new Text({
    text: "交互Canvas",
    textColor: "#95a5a6",
    fontSize: 14,
    position: { x: 1020, y: 620 },
    parent: mainScene,
  });

  // ========== Shape几何图形展示区域 (y: 640-790) ==========

  // 区域标题
  new Text({
    text: "Shape几何图形系统",
    textColor: "#1abc9c",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 640 },
    parent: mainScene,
  });

  // 6.5 几何图形绘制系统(Shape)
  // 基础几何图形展示
  // 矩形
  new Shape({
    label: "basicRect",
    drawRect: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: 2,
    },
    position: { x: 50, y: 670 },
    parent: mainScene,
  });

  new Text({
    text: "矩形",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 50, y: 725 },
    parent: mainScene,
  });

  // 圆形
  new Shape({
    label: "basicCircle",
    drawCircle: {
      x: 25,
      y: 25,
      radius: 25,
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: 3,
    },
    position: { x: 150, y: 670 },
    parent: mainScene,
  });

  new Text({
    text: "圆形",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 150, y: 725 },
    parent: mainScene,
  });

  // 圆角矩形
  new Shape({
    label: "roundedRect",
    drawRoundedRect: {
      x: 0,
      y: 0,
      width: 60,
      height: 40,
      cornerRadius: 12,
      fill: "#2ecc71",
      stroke: "#27ae60",
      strokeWidth: 2,
    },
    position: { x: 250, y: 680 },
    parent: mainScene,
  });

  new Text({
    text: "圆角矩形",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 250, y: 725 },
    parent: mainScene,
  });

  // 椭圆形
  new Shape({
    label: "ellipse",
    drawEllipse: {
      x: 35,
      y: 25,
      radiusX: 35,
      radiusY: 20,
      fill: "#f39c12",
      stroke: "#e67e22",
      strokeWidth: 2,
    },
    position: { x: 350, y: 680 },
    parent: mainScene,
  });

  new Text({
    text: "椭圆",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 350, y: 725 },
    parent: mainScene,
  });

  // 多边形 - 三角形
  new Shape({
    label: "triangle",
    drawPolygon: {
      points: [
        { x: 30, y: 0 },
        { x: 60, y: 50 },
        { x: 0, y: 50 },
      ],
      fill: "#9b59b6",
      stroke: "#8e44ad",
      strokeWidth: 2,
    },
    position: { x: 450, y: 670 },
    parent: mainScene,
  });

  new Text({
    text: "多边形",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 450, y: 725 },
    parent: mainScene,
  });

  // 线条绘制
  new Shape({
    label: "polyline",
    drawLine: {
      points: [
        { x: 0, y: 40 },
        { x: 20, y: 0 },
        { x: 40, y: 25 },
        { x: 60, y: 10 },
        { x: 80, y: 35 },
      ],
      color: "#34495e",
      lineWidth: 4,
    },
    position: { x: 550, y: 670 },
    parent: mainScene,
  });

  new Text({
    text: "线条",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 550, y: 725 },
    parent: mainScene,
  });

  // 动态Shape - 鼠标交互改变形状
  new Shape({
    label: "interactiveShape",
    position: { x: 650, y: 670 },
    parent: mainScene,
  });

  // 获取动态Shape
  const interactiveShape = mainScene.findChild<Shape>({ label: "interactiveShape" });
  if (interactiveShape) {
    // 初始绘制一个矩形
    interactiveShape.drawCircle({
      x: 25,
      y: 25,
      radius: 25,
      fill: "#1abc9c",
      stroke: "#16a085",
      strokeWidth: 2,
    });

    // 鼠标悬停时变成圆形
    interactiveShape.on("pointerover", () => {
      interactiveShape.drawCircle({
        x: 25,
        y: 25,
        radius: 30,
        fill: "#e67e22",
        stroke: "#d35400",
        strokeWidth: 3,
      });
    });

    // 鼠标离开时恢复矩形
    interactiveShape.on("pointerout", () => {
      interactiveShape.drawCircle({
        x: 25,
        y: 25,
        radius: 25,
        fill: "#1abc9c",
        stroke: "#16a085",
        strokeWidth: 2,
      });
    });
  }

  new Text({
    text: "交互Shape",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 650, y: 725 },
    parent: mainScene,
  });

  // ========== 底部控制和状态区域 (y: 800-950) ==========

  // 静态地面（物理边界）
  const ground = new Canvas();
  ground.rect(0, 0, 1200, 30);
  ground.fill({ color: "#34495e" });
  ground.position.set(0, 920);
  mainScene.addChild(ground);
  ground.addScript(
    new RigidBody({
      rigidType: "static",
      category: "ground",
    }),
  );

  // 控制区域标题
  new Text({
    text: "控制面板",
    textColor: "#ecf0f1",
    fontSize: 18,
    fontWeight: "bold",
    position: { x: 50, y: 800 },
    parent: mainScene,
  });

  // 8. 音频系统
  const musicButton = new Text({
    text: "🎵 播放背景音乐",
    fontSize: 16,
    textColor: "#f39c12",
    parent: mainScene,
    position: { x: 50, y: 830 },
  });

  musicButton.on("click", () => {
    music.play("assets/sound/bg.mp3").fadeIn(2);
    musicButton.text = "🎵 音乐播放中...";
  });

  const stopMusicButton = new Text({
    text: "⏹️ 停止音乐",
    fontSize: 16,
    textColor: "#e74c3c",
    parent: mainScene,
    position: { x: 220, y: 830 },
  });

  stopMusicButton.on("click", () => {
    music.stopAll();
    musicButton.text = "🎵 播放背景音乐";
  });

  // 9. 计时器系统
  const timerText = new Text({
    text: "运行时间: 0秒",
    fontSize: 16,
    textColor: "#bdc3c7",
    parent: mainScene,
    position: { x: 50, y: 922 },
  });

  const startTime = Date.now();
  app.stage.timer.setInterval(1, () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerText.text = `运行时间: ${elapsed}秒`;
  });

  // 10. 全局事件处理
  // 点击场景添加粒子效果
  mainScene.on("click", (event: LikoPointerEvent) => {
    createParticleEffect(event.pointer.x, event.pointer.y);
    // 播放点击音效
    sound.play("assets/sound/bullet.mp3", 0.3);
  });

  // 键盘事件处理
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case " ": // 空格键暂停/恢复所有动画
        event.preventDefault();
        if (Timer.system.paused) {
          Timer.system.resume();
        } else {
          Timer.system.pause();
        }
        break;
    }
  });

  // 辅助函数
  function createParticleEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const particle = new Shape();
      particle.drawCircle({
        x: 0,
        y: 0,
        radius: Math.random() * 4 + 2,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
      });
      particle.position.set(x, y);
      mainScene.addChild(particle);

      // 粒子动画
      Tween.to({
        target: particle,
        props: {
          position: {
            x: x + (Math.random() - 0.5) * 150,
            y: y + (Math.random() - 0.5) * 150,
          },
          alpha: 0,
          scale: { x: 0, y: 0 },
        },
        duration: 1,
        onComplete: () => {
          mainScene.removeChild(particle);
        },
      }).play();
    }
  }
}

// 启动示例
likoEngineOverview();
