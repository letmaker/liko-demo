// 使用liko测试物理系统能力

import { App, Sprite, Scene, RigidBody, Canvas, Text, type MouseEvent, Rectangle } from "liko";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({
    width: 800,
    height: 800,
    bgColor: 0x333333,
    physics: { enabled: true, debug: true, boundaryArea: new Rectangle(0, 0, 800, 800).pad(200) },
  });

  const scene = new Scene();
  app.stage.addChild(scene);

  // 创建标题
  const title = new Text();
  title.text = "物理引擎测试";
  title.pos.set(400, 30);
  title.anchor.set(0.5, 0.5);
  title.fontSize = 24;
  title.fillColor = "#ffffff";
  scene.addChild(title);

  // 创建说明文本
  const instructions = new Text();
  instructions.text = "点击按钮添加不同物体，点击场景施加力";
  instructions.pos.set(400, 60);
  instructions.anchor.set(0.5, 0.5);
  instructions.fontSize = 16;
  instructions.fillColor = "#cccccc";
  scene.addChild(instructions);

  // 创建地面
  createGround(scene, 400, 750, 700, 20, 0);

  // 创建斜坡
  createGround(scene, 600, 600, 300, 20, -15);
  createGround(scene, 200, 600, 300, 20, 15);

  // 创建墙壁
  createGround(scene, 50, 400, 20, 600, 0);
  createGround(scene, 750, 400, 20, 600, 0);

  // 创建一个平台
  createGround(scene, 400, 400, 200, 20, 0);

  // 添加控制按钮
  createButton(scene, "添加球", 50, 120, () => {
    createBall(scene, Math.random() * 700 + 50, 200);
  });

  createButton(scene, "添加方块", 170, 120, () => {
    createBox(scene, Math.random() * 700 + 50, 200);
  });

  createButton(scene, "添加多边形", 290, 120, () => {
    createPolygon(scene, Math.random() * 700 + 50, 200);
  });

  createButton(scene, "添加链条", 410, 120, () => {
    createChain(scene, 200, 300);
  });

  createButton(scene, "重力反转", 530, 120, () => {
    // 获取所有动态刚体
    const bodies = scene.children.filter((child) => {
      const rb = child.getScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 反转重力
    for (const body of bodies) {
      const rb = body.getScript<RigidBody>({ Class: RigidBody });
      if (rb) {
        rb.gravityScale = -rb.gravityScale;
      }
    }
  });

  createButton(scene, "清除物体", 650, 120, () => {
    // 获取所有动态刚体
    const bodies = scene.children.filter((child) => {
      const rb = child.getScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 销毁它们
    for (const body of bodies) {
      body.destroy();
    }
  });

  // 点击场景施加力
  scene.on("click", (e: MouseEvent) => {
    const pos = { x: e.mouse.x, y: e.mouse.y };

    // 获取所有动态刚体
    const bodies = scene.children.filter((child) => {
      const rb = child.getScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 对每个刚体施加力
    for (const body of bodies) {
      const rb = body.getScript<RigidBody>({ Class: RigidBody });
      if (rb) {
        const bodyPos = body.pos;
        const direction = {
          x: bodyPos.x - pos.x,
          y: bodyPos.y - pos.y,
        };

        // 计算距离
        const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (distance > 0) {
          // 归一化并缩放力的大小
          const force = {
            x: (direction.x / distance) * 100,
            y: (direction.y / distance) * 500,
          };

          rb.applyForceToCenter(force);
        }
      }
    }
  });

  // 初始添加一些物体
  createBall(scene, 300, 200);
  createBox(scene, 400, 200);
  createPolygon(scene, 500, 200);
}

// 创建地面或平台
function createGround(scene: Scene, x: number, y: number, width: number, height: number, angle: number) {
  const ground = new Canvas();
  ground.pos.set(x, y);
  ground.anchor.set(0.5, 0.5);
  ground.rect(0, 0, width, height);
  ground.angle = angle;
  ground.fill({ color: "#8a8a8a" });
  scene.addChild(ground);

  const rigidBody = new RigidBody({
    rigidType: "static",
    friction: 0.5,
    restitution: 0.2,
  });
  ground.addScript(rigidBody);
}

// 创建球体
function createBall(scene: Scene, x: number, y: number) {
  const ball = new Sprite();
  ball.url = "assets/ball.png";
  ball.pos.set(x, y);
  ball.width = 40;
  ball.height = 40;
  scene.addChild(ball);

  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    friction: 0.5,
    restitution: 0.7,
    shapes: [
      {
        shapeType: "circle",
        radius: 20,
      },
    ],
  });
  ball.addScript(rigidBody);
}

// 创建方块
function createBox(scene: Scene, x: number, y: number) {
  const box = new Canvas();
  box.pos.set(x, y);
  box.rect(0, 0, 40, 40);
  box.fill({ color: "#ff8800" });
  scene.addChild(box);

  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    friction: 0.3,
    restitution: 0.4,
    shapes: [
      {
        shapeType: "box",
        width: 40,
        height: 40,
      },
    ],
  });
  box.addScript(rigidBody);
}

// 创建多边形
function createPolygon(scene: Scene, x: number, y: number) {
  const polygon = new Canvas();
  polygon.pos.set(x, y);

  // 绘制三角形
  polygon.beginPath();
  polygon.moveTo(0, -25);
  polygon.lineTo(25, 25);
  polygon.lineTo(-25, 25);
  polygon.closePath();
  polygon.fill({ color: "#00cc88" });
  scene.addChild(polygon);

  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    friction: 0.2,
    restitution: 0.5,
    shapes: [
      {
        shapeType: "polygon",
        points: [
          { x: 0, y: -25 },
          { x: 25, y: 25 },
          { x: -25, y: 25 },
        ],
      },
    ],
  });
  polygon.addScript(rigidBody);
}

// 创建链条
function createChain(scene: Scene, x: number, y: number) {
  const chain = new Canvas();
  chain.pos.set(x, y);

  // 绘制线条
  chain.beginPath();
  chain.moveTo(-100, 0);
  chain.lineTo(100, 50);
  chain.lineTo(200, 40);
  chain.stroke({ color: "#ffffff", width: 3 });
  scene.addChild(chain);

  const rigidBody = new RigidBody({
    rigidType: "static",
    shapes: [
      {
        shapeType: "chain",
        points: [
          { x: -100, y: 0 },
          { x: 100, y: 50 },
          { x: 200, y: 40 },
        ],
      },
    ],
  });
  chain.addScript(rigidBody);
}

// 创建按钮
function createButton(scene: Scene, text: string, x: number, y: number, onClick: () => void) {
  const button = new Text();
  button.pos.set(x, y);
  button.text = text;
  button.fontSize = 20;
  button.mouseEnable = true;
  button.on("click", onClick);
  scene.addChild(button);
}

test();
