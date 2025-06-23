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
  ParticleSystem,
  type Texture,
  type LikoPointerEvent,
  type LikoNode,
} from "liko";

async function likoEngineOverview() {
  // 1. 应用程序初始化
  const app = new App();
  await app.init({
    width: 1200, // 增加窗口宽度以容纳更好的布局
    height: 960, // 增加窗口高度以容纳动画示例
    bgColor: 0x2c3e50, // 设置背景颜色（深蓝灰色）
    container: "gameContainer", // 游戏容器节点或者名称
    physics: {
      // 物理引擎配置(如果需要再开启，不需要无需配置)
      enabled: true, // 启用物理系统
      debug: false, // 关闭调试显示
      boundaryArea: new Rectangle(0, 0, 1200, 950).pad(50), // 设置物理边界，超出边界后，物理对象会被销毁
    },
  });

  // 2. 场景管理
  const mainScene = new Scene({ width: 1200, height: 950, parent: app.stage });

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
    position: { x: 50, y: 120 },
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
  strokeText.position.set(450, 120);
  mainScene.addChild(strokeText);

  // 动态更改文本
  const timerText = new Text({
    text: "运行时间: 0秒",
    fontSize: 16,
    textColor: "red",
    parent: mainScene,
    position: { x: 650, y: 125 },
  });

  const startTime = Date.now();
  app.stage.timer.setInterval(1, () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerText.text = `运行时间: ${elapsed}秒`;
  });

  // 区域标题
  new Text({
    text: "精灵系统与动画",
    textColor: "#f1c40f",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 180 },
    parent: mainScene,
  });

  // 4. 精灵(Sprite)系统
  // 静态精灵
  new Sprite({
    url: "assets/bg2.webp",
    width: 150,
    height: 100,
    alpha: 0.8,
    position: { x: 50, y: 210 },
    parent: mainScene,
  });

  // 可交互精灵
  const interactiveSprite = new Sprite();
  interactiveSprite.url = "assets/apple.png";
  interactiveSprite.scale.set(0.4);
  interactiveSprite.anchor = { x: 0.5, y: 0.5 };
  interactiveSprite.position.set(300, 240);
  mainScene.addChild(interactiveSprite);

  // 添加交互事件
  interactiveSprite.on(EventType.pointerOver, () => {
    interactiveSprite.scale.set(0.45);
    interactiveSprite.tintColor = 0xff6b6b;
  });
  interactiveSprite.on(EventType.pointerOut, () => {
    interactiveSprite.scale.set(0.4);
    interactiveSprite.tintColor = 0xffffff;
  });

  interactiveSprite.on(EventType.click, () => {
    // 播放音效
    sound.play("assets/sound/bullet.mp3", 0.5);

    // 创建点击动画
    Tween.to({
      target: interactiveSprite,
      props: {
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
    position: { x: 450, y: 240 },
    parent: mainScene,
  });

  // 7. 动画系统(Tween) - 连续旋转动画
  Tween.to({
    target: rotatingSprite,
    props: { angle: 360 },
    duration: 3,
    repeat: 0, // 无限重复
    onUpdate: (progress: number) => {
      // 计算当前旋转角度
      rotatingSprite.angle = progress * 360;
    },
  }).play();

  // 浮动动画精灵
  const floatingSprite = new Sprite({
    url: "assets/girl.png",
    width: 56,
    height: 78,
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 600, y: 240 },
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
    position: { x: 750, y: 240 },
    scale: { x: 0.8, y: 0.8 },
    parent: mainScene,
  });

  let frameIndex = 0;
  switchableSprite.on(EventType.click, async () => {
    // 切换到下一个纹理
    frameIndex = frameIndex === 1 ? 0 : 1;
    if (girlTexture && boyTexture) {
      switchableSprite.texture = switchableSprite.texture === boyTexture ? girlTexture : boyTexture;
      // 添加切换动画效果
      Tween.to({
        target: switchableSprite,
        props: { scale: { x: 1.0, y: 1.0 } },
        duration: 0.2,
        yoyo: true,
        repeat: 2,
      }).play();
    }
  });

  // 动画精灵区域标题
  new Text({
    text: "动画精灵(AnimatedSprite)系统",
    textColor: "#e67e22",
    fontSize: 18,
    fontWeight: "bold",
    position: { x: 50, y: 320 },
    parent: mainScene,
  });

  // Atlas 动画精灵 - Fliggy
  new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas",
    parent: mainScene,
    position: { x: 50, y: 380 },
    scale: { x: 0.8, y: 0.8 },
  }).play();

  // Atlas 动画精灵 - Zombie
  new AnimatedSprite({
    url: "assets/sheet/zombie.atlas",
    parent: mainScene,
    position: { x: 180, y: 350 },
    scale: { x: 0.4, y: 0.4 },
    frameRate: 8,
  }).play();

  // Atlas Sheet动画精灵 - Fire
  new AnimatedSprite({
    url: "assets/sheet/fire-rotated.atlas",
    parent: mainScene,
    position: { x: 310, y: 350 },
    scale: { x: 0.6, y: 0.6 },
    frameRate: 15,
  }).play();

  // 可交互动画精灵 - Girl (加载纹理数组)
  const jumpTextures = await loader.load<Texture[]>("assets/sheet/girl-jump.atlas", "sheet");
  const runTextures = await loader.load<Texture[]>("assets/sheet/girl-run.atlas", "sheet");

  if (runTextures && jumpTextures) {
    const interactiveGirl = new AnimatedSprite({
      textures: runTextures,
      parent: mainScene,
      position: { x: 440, y: 350 },
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
  }

  // 区域标题
  new Text({
    text: "拖动系统",
    textColor: "#e67e22",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 900, y: 180 },
    parent: mainScene,
  });

  // 可拖动精灵
  const draggableSprite = new Sprite({
    url: "assets/strawberry.png",
    width: 50,
    height: 50,
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 950, y: 250 },
    parent: mainScene,
  });

  // 可拖动Shape
  const draggableShape = new Shape({
    label: "draggableShape",
    drawRect: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: 3,
    },
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 1050, y: 250 },
    parent: mainScene,
  });

  // 可拖动的带物理的对象
  const draggablePhysicsSprite = new Sprite({
    url: "assets/apple.png",
    width: 40,
    height: 46,
    anchor: { x: 0.5, y: 0.5 },
    position: { x: 1000, y: 300 },
    parent: mainScene,
    scripts: [
      new RigidBody({
        rigidType: "dynamic",
        friction: 0.8,
        restitution: 0.3,
        allowRotation: false, // 禁用旋转使拖动更平滑
      }),
    ],
  });

  // 拖动功能实现
  function makeDraggable(target: LikoNode, isPhysics = false) {
    let isDragging = false;
    const dragOffset = { x: 0, y: 0 };
    let rigidBody: RigidBody | null = null;

    if (isPhysics) {
      rigidBody = target.findScript({ Class: RigidBody }) as RigidBody;
    }

    // 开始拖动
    target.on(EventType.pointerDown, (event: LikoPointerEvent) => {
      isDragging = true;
      dragOffset.x = event.pointer.x - target.position.x;
      dragOffset.y = event.pointer.y - target.position.y;

      // 视觉反馈
      target.scale.set(1.1);
      if (target.tintColor !== undefined) {
        target.tintColor = 0xffff99;
      }

      // 如果是物理对象，暂时设为kinematic类型以便拖动
      if (rigidBody) {
        rigidBody.rigidType = "kinematic";
      }

      // 播放拖动开始音效
      sound.play("assets/sound/bullet.mp3", 0.2);
    });

    // 拖动中
    app.stage.on(EventType.pointerMove, (event: LikoPointerEvent) => {
      if (isDragging) {
        const newX = event.pointer.x - dragOffset.x;
        const newY = event.pointer.y - dragOffset.y;

        // 限制在场景范围内
        const clampedX = Math.max(25, Math.min(1175, newX));
        const clampedY = Math.max(25, Math.min(925, newY));

        if (rigidBody) {
          // 物理对象使用刚体移动
          rigidBody.setPosition(clampedX, clampedY);
        } else {
          // 普通对象直接设置位置
          target.position.set(clampedX, clampedY);
        }
      }
    });

    // 结束拖动
    app.stage.on(EventType.pointerUp, () => {
      if (isDragging) {
        isDragging = false;

        // 恢复视觉效果
        target.scale.set(1.0);
        if (target.tintColor !== undefined) {
          target.tintColor = 0xffffff;
        }

        // 如果是物理对象，恢复为dynamic类型
        if (rigidBody) {
          rigidBody.rigidType = "dynamic";
        }

        // 播放拖动结束音效
        sound.play("assets/sound/bullet.mp3", 0.3);
      }
    });
  }

  // 启用拖动功能
  makeDraggable(draggableSprite);
  makeDraggable(draggableShape);
  makeDraggable(draggablePhysicsSprite, true);

  // 5. 物理系统
  // 动态物理方块
  const physicsBox = new Sprite({
    url: "assets/box.png",
    width: 50,
    height: 50,
    anchor: { x: 0.5, y: 0.5 },
    parent: mainScene,
    position: { x: 850, y: 120 },
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
  physicsBox.on(EventType.click, () => {
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
  physicsBall.position.set(950, 120);
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
  physicsBall.on(EventType.click, () => {
    const rigidBody = physicsBall.findScript<RigidBody>({ Class: RigidBody });
    if (rigidBody) {
      // 直接设置向上的线性速度
      rigidBody.linearVelocity = { x: 0, y: -15 };
      // 播放音效
      sound.play("assets/sound/bullet.mp3", 0.7);
    }
  });

  // 区域标题
  new Text({
    text: "Canvas绘图系统",
    textColor: "#9b59b6",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 460 },
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

  customCanvas.position.set(50, 490);
  mainScene.addChild(customCanvas);

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

  strokeCanvas.position.set(310, 490);
  mainScene.addChild(strokeCanvas);

  // 复杂路径绘制 - 绘制五角星
  const pathCanvas = new Canvas();
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

  // 绘制贝塞尔曲线 - 椭圆形
  pathCanvas.beginPath();
  pathCanvas.moveTo(100, 15);
  pathCanvas.quadraticCurveTo(140, 0, 180, 15);
  pathCanvas.quadraticCurveTo(220, 35, 180, 55);
  pathCanvas.quadraticCurveTo(140, 70, 100, 55);
  pathCanvas.quadraticCurveTo(60, 35, 100, 15);
  pathCanvas.fill({ color: "#3498db" });

  pathCanvas.position.set(570, 490);
  mainScene.addChild(pathCanvas);

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

  gradientCanvas.position.set(830, 490);
  mainScene.addChild(gradientCanvas);

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

  interactiveCanvas.on(EventType.pointerOver, () => {
    drawInteractiveShape("#2ecc71");
  });

  interactiveCanvas.on(EventType.pointerOut, () => {
    drawInteractiveShape("#e74c3c");
  });

  interactiveCanvas.position.set(1020, 490);
  mainScene.addChild(interactiveCanvas);

  // 区域标题
  new Text({
    text: "Shape几何图形系统",
    textColor: "#1abc9c",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 580 },
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
    position: { x: 50, y: 620 },
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
    position: { x: 140, y: 620 },
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
    position: { x: 230, y: 620 },
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
    position: { x: 330, y: 620 },
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
    position: { x: 430, y: 610 },
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
    position: { x: 530, y: 610 },
    parent: mainScene,
  });

  // 动态Shape - 鼠标交互改变形状
  new Shape({
    label: "interactiveShape",
    position: { x: 650, y: 610 },
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
    interactiveShape.on(EventType.pointerOver, () => {
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
    interactiveShape.on(EventType.pointerOut, () => {
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

  // 区域标题
  new Text({
    text: "粒子系统(ParticleSystem)",
    textColor: "#e67e22",
    fontSize: 20,
    fontWeight: "bold",
    position: { x: 50, y: 700 },
    parent: mainScene,
  });

  // 粒子示例1: 使用plist配置的火焰效果
  const fireParticle = new ParticleSystem({
    url: "assets/particle/fire.plist",
    parent: mainScene,
    position: { x: 120, y: 750 },
    autoPlay: true,
  });

  // 火焰控制按钮
  const fireControlButton = new Text({
    text: "⏸️ 暂停",
    fontSize: 14,
    textColor: "#e74c3c",
    position: { x: 180, y: 750 },
    parent: mainScene,
  });

  fireControlButton.on(EventType.click, () => {
    if (fireParticle.isPlaying && !fireParticle.isPaused) {
      fireParticle.pause();
      fireControlButton.text = "▶️ 播放";
    } else if (fireParticle.isPaused) {
      fireParticle.resume();
      fireControlButton.text = "⏸️ 暂停";
    } else {
      fireParticle.play();
      fireControlButton.text = "⏸️ 暂停";
    }
    sound.play("assets/sound/bullet.mp3", 0.3);
  });

  // 粒子示例2: 动态配置的交互粒子系统
  const interactiveParticle = new ParticleSystem({
    parent: mainScene,
    position: { x: 350, y: 750 },
    autoPlay: true,
    config: {
      // 重力设置：影响粒子的加速度
      gravityX: 0, // 水平重力为0，粒子不会左右偏移
      gravityY: 150, // 垂直重力150，粒子会加速向下落

      // 发射角度设置
      angle: 270, // 270度表示向下发射（0度为右，90度为下，180度为左，270度为上）
      angleVariance: 15, // 角度随机变化范围±15度，增加自然感

      // 颜色设置：RGBA格式，值范围0-1
      startColor: { r: 0.3, g: 0.6, b: 1.0, a: 1.0 }, // 开始时的蓝色（模拟水）
      finishColor: { r: 1, g: 0.3, b: 0.8, a: 0.0 }, // 结束时的粉色并逐渐透明

      // 粒子大小设置
      startParticleSize: 8, // 粒子初始大小
      finishParticleSize: 12, // 粒子结束时的大小（比初始大小大，模拟水滴扩散）

      // 发射速率：每秒发射的粒子数量
      emissionRate: 50,

      // 粒子生命周期设置
      particleLifespan: 2.0, // 每个粒子存活3秒
      particleLifespanVariance: 0.5, // 生命周期随机变化±0.5秒

      // 初始速度：粒子发射时的速度
      speed: 100, // 初始速度100像素/秒
    },
  });

  // 动态修改粒子属性
  let particleColorIndex = 0;
  const particleColors = [
    { start: { r: 0.2, g: 0.8, b: 1.0, a: 1.0 }, end: { r: 1.0, g: 0.2, b: 0.8, a: 0.0 } }, // 青到粉
    { start: { r: 1.0, g: 0.3, b: 0.1, a: 1.0 }, end: { r: 1.0, g: 0.8, b: 0.0, a: 0.0 } }, // 红到黄
    { start: { r: 0.1, g: 1.0, b: 0.3, a: 1.0 }, end: { r: 0.8, g: 1.0, b: 0.1, a: 0.0 } }, // 绿到浅绿
    { start: { r: 0.8, g: 0.2, b: 1.0, a: 1.0 }, end: { r: 1.0, g: 0.6, b: 0.8, a: 0.0 } }, // 紫到粉
  ];

  // 每3秒自动切换颜色
  app.stage.timer.setInterval(3, () => {
    const colorSet = particleColors[particleColorIndex % particleColors.length];
    interactiveParticle.setStartColor(colorSet.start);
    interactiveParticle.setEndColor(colorSet.end);
    particleColorIndex++;
  });

  // 鼠标悬停改变发射方向
  interactiveParticle.on(EventType.pointerOver, () => {
    interactiveParticle.setAngle(90, 30); // 向上发射
    interactiveParticle.setEmissionRate(80); // 增加发射速率
  });

  interactiveParticle.on(EventType.pointerOut, () => {
    interactiveParticle.setAngle(270, 45); // 向下发射
    interactiveParticle.setEmissionRate(50); // 恢复发射速率
  });

  // 点击创建爆炸效果
  interactiveParticle.on(EventType.click, () => {
    // 临时创建爆炸粒子
    const burstParticle = new ParticleSystem({
      parent: mainScene,
      position: { x: interactiveParticle.position.x, y: interactiveParticle.position.y },
    });

    // 设置爆炸效果
    burstParticle.setStartColor({ r: 1.0, g: 0.8, b: 0.0, a: 1.0 }); // 金黄色
    burstParticle.setEndColor({ r: 1.0, g: 0.2, b: 0.0, a: 0.0 }); // 透明红色
    burstParticle.setParticleSize(15, 5); // 从大到小
    burstParticle.setEmissionRate(200); // 高发射速率
    burstParticle.setParticleLifespan(1.0); // 较短生命周期
    burstParticle.setAngle(0, 360); // 全方向发射
    burstParticle.play();

    // 播放爆炸音效
    sound.play("assets/sound/bullet.mp3", 0.8);

    // 1.5秒后清理爆炸粒子
    setTimeout(() => {
      burstParticle.stop();
      mainScene.removeChild(burstParticle);
    }, 1500);
  });

  // 粒子系统状态显示
  const particleStatusText = new Text({
    text: "粒子状态: 火焰: 0, 交互: 0, 鼠标: 0",
    textColor: "#95a5a6",
    fontSize: 12,
    position: { x: 400, y: 750 },
    parent: mainScene,
  });

  // 每2秒更新粒子状态
  app.stage.timer.setInterval(2, () => {
    particleStatusText.text = `粒子状态: 火焰: ${fireParticle.particleCount}, 交互: ${interactiveParticle.particleCount}, 鼠标: ${mouseTrailParticle.particleCount}`;
  });

  // 粒子示例3: 跟随鼠标的粒子系统
  const mouseTrailParticle = new ParticleSystem({
    parent: mainScene,
    position: { x: 600, y: 400 }, // 初始位置
    autoPlay: true,
  });

  // 设置跟随鼠标的粒子属性
  mouseTrailParticle.setStartColor({ r: 0.8, g: 0.2, b: 0.8, a: 1.0 }); // 紫色
  mouseTrailParticle.setEndColor({ r: 0.2, g: 0.8, b: 0.8, a: 0.0 }); // 透明青色
  mouseTrailParticle.setParticleSize(6, 2); // 大小从6到2
  mouseTrailParticle.setEmissionRate(30); // 发射速率
  mouseTrailParticle.setParticleLifespan(1.5, 0.3); // 生命周期
  mouseTrailParticle.setGravity(0, 20); // 轻微向下的重力
  mouseTrailParticle.setAngle(90, 60); // 向上发射，角度有变化
  mouseTrailParticle.play();

  // 监听鼠标移动事件，让粒子跟随鼠标
  app.stage.on(EventType.pointerMove, (event: LikoPointerEvent) => {
    if (event.pointer) {
      mouseTrailParticle.position.set(event.pointer.x, event.pointer.y);
    }
  });

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

  musicButton.on(EventType.click, () => {
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

  stopMusicButton.on(EventType.click, () => {
    music.stopAll();
    musicButton.text = "🎵 播放背景音乐";
  });

  // 10. 全局事件处理

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
}

// 启动示例
likoEngineOverview();
