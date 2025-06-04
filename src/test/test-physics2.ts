// 使用liko测试物理系统能力

import { App, Sprite, Scene, RigidBody, Canvas, Text, type LikoPointerEvent } from "liko";

// 主测试函数，使用 async 因为需要等待资源加载
async function test() {
  // 创建一个新的应用程序实例
  const app = new App();
  // 初始化应用程序，设置：
  // - 画布大小为 800x800 像素
  // - 背景色为深灰色
  // - 启用物理引擎
  // - 开启物理引擎调试视图
  // - 设置物理世界边界（比画布大200像素，物体碰到会立即消失）
  await app.init({
    width: 800,
    height: 800,
    bgColor: 0x333333,
    physics: { enabled: true, debug: true },
  });

  // 创建一个新的场景，用于组织和管理所有游戏对象
  const scene = new Scene();
  scene.width = 800;
  scene.height = 800;
  app.stage.addChild(scene);

  // 创建标题文本
  const title = new Text();
  title.text = "物理引擎测试";
  title.position.set(400, 30); // 设置位置在画面上方
  title.anchor.set(0.5, 0.5); // 设置文本锚点为中心
  title.fontSize = 24; // 设置字体大小
  title.textColor = "#ffffff"; // 设置文字颜色为白色
  scene.addChild(title);

  // 创建操作说明文本
  const instructions = new Text();
  instructions.text = "点击按钮添加不同物体，点击场景施加力";
  instructions.position.set(400, 60); // 位于标题下方
  instructions.anchor.set(0.5, 0.5);
  instructions.fontSize = 16;
  instructions.textColor = "#cccccc"; // 设置为浅灰色
  scene.addChild(instructions);

  // 创建物理世界的边界和平台：
  // 1. 底部地面
  createGround(scene, 400, 750, 700, 20, 0);

  // 2. 两个倾斜的斜坡
  createGround(scene, 600, 600, 300, 20, -15); // 右斜坡，向下倾斜15度
  createGround(scene, 200, 600, 300, 20, 15); // 左斜坡，向上倾斜15度

  // 3. 左右两侧的墙壁
  createGround(scene, 50, 400, 20, 600, 0); // 左墙
  createGround(scene, 750, 400, 20, 600, 0); // 右墙

  // 4. 中间的平台
  createGround(scene, 400, 400, 200, 20, 0);

  // 创建控制按钮：
  // 1. 添加球体按钮
  createButton(scene, "添加球", 50, 120, () => {
    // 在随机x位置添加一个球
    createBall(scene, Math.random() * 700 + 50, 200);
  });

  // 2. 添加方块按钮
  createButton(scene, "添加方块", 170, 120, () => {
    createBox(scene, Math.random() * 700 + 50, 200);
  });

  // 3. 添加多边形按钮
  createButton(scene, "添加多边形", 290, 120, () => {
    createPolygon(scene, Math.random() * 700 + 50, 200);
  });

  // 4. 添加链条按钮
  createButton(scene, "添加链条", 410, 120, () => {
    createChain(scene, 200, 300);
  });

  // 5. 重力反转按钮
  createButton(scene, "重力反转", 530, 120, () => {
    // 找到所有可移动的物理物体
    const bodies = scene.children.filter((child) => {
      const rb = child.findScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 将每个物体的重力方向反转
    for (const body of bodies) {
      const rb = body.findScript<RigidBody>({ Class: RigidBody });
      if (rb) {
        rb.gravityScale = -rb.gravityScale;
      }
    }
  });

  // 6. 清除物体按钮
  createButton(scene, "清除物体", 650, 120, () => {
    // 找到所有可移动的物理物体
    const bodies = scene.children.filter((child) => {
      const rb = child.findScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 删除找到的所有物体
    for (const body of bodies) {
      body.destroy();
    }
  });

  // 为场景添加点击事件处理
  scene.on("click", (e: LikoPointerEvent) => {
    // 获取点击位置坐标
    const position = { x: e.pointer.x, y: e.pointer.y };

    // 找到所有可移动的物理物体
    const bodies = scene.children.filter((child) => {
      const rb = child.findScript<RigidBody>({ Class: RigidBody });
      return rb && rb.rigidType === "dynamic";
    });

    // 对每个物体施加力
    for (const body of bodies) {
      const rb = body.findScript<RigidBody>({ Class: RigidBody });
      if (rb) {
        const bodyPos = body.position;
        // 计算力的方向（从点击点指向物体）
        const direction = {
          x: bodyPos.x - position.x,
          y: bodyPos.y - position.y,
        };

        // 计算点击点到物体的距离
        const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (distance > 0) {
          // 计算标准化后的力（水平方向较小，垂直方向较大）
          const force = {
            x: (direction.x / distance) * 100, // 水平力
            y: (direction.y / distance) * 500, // 垂直力
          };

          // 对物体施加力
          rb.applyForceToCenter(force);
        }
      }
    }
  });

  // 初始化场景，添加三个不同类型的物体
  createBall(scene, 300, 200);
  createBox(scene, 400, 200);
  createPolygon(scene, 500, 200);
}

// 创建静态地面或平台的函数
function createGround(scene: Scene, x: number, y: number, width: number, height: number, angle: number) {
  // 创建一个画布对象用于绘制地面
  const ground = new Canvas();
  ground.position.set(x, y); // 设置位置
  ground.anchor.set(0.5, 0.5); // 设置锚点为中心
  ground.rect(0, 0, width, height); // 绘制矩形
  ground.angle = angle; // 设置旋转角度
  ground.fill({ color: "#8a8a8a" }); // 填充颜色为灰色
  scene.addChild(ground);

  // 添加静态刚体物理属性
  const rigidBody = new RigidBody({
    rigidType: "static", // 静态物体，不会移动
    friction: 0.5, // 摩擦系数
    restitution: 0.2, // 弹性系数
  });
  ground.addScript(rigidBody);
}

// 创建球体的函数
function createBall(scene: Scene, x: number, y: number) {
  // 创建精灵对象并加载球的图片
  const ball = new Sprite();
  ball.url = "assets/ball.png";
  ball.position.set(x, y);
  ball.width = 40;
  ball.height = 40;
  scene.addChild(ball);

  // 添加动态刚体物理属性
  const rigidBody = new RigidBody({
    rigidType: "dynamic", // 动态物体，会受重力影响
    allowRotation: true, // 允许旋转
    friction: 0.5, // 摩擦系数
    restitution: 0.7, // 弹性系数
    shapes: [
      {
        shapeType: "circle", // 圆形碰撞体
        radius: 20, // 半径20像素
      },
    ],
  });
  ball.addScript(rigidBody);
}

// 创建方块的函数
function createBox(scene: Scene, x: number, y: number) {
  // 创建画布对象并绘制方块
  const box = new Canvas();
  box.position.set(x, y);
  box.rect(0, 0, 40, 40);
  box.fill({ color: "#ff8800" }); // 橙色
  scene.addChild(box);

  // 添加动态刚体物理属性
  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    friction: 0.3,
    restitution: 0.4,
    shapes: [
      {
        shapeType: "box", // 矩形碰撞体
        width: 40,
        height: 40,
      },
    ],
  });
  box.addScript(rigidBody);
}

// 创建三角形多边形的函数
function createPolygon(scene: Scene, x: number, y: number) {
  // 创建画布对象并绘制三角形
  const polygon = new Canvas();
  polygon.position.set(x, y);

  // 绘制等腰三角形
  polygon.beginPath();
  polygon.moveTo(0, -25); // 顶点
  polygon.lineTo(25, 25); // 右下角
  polygon.lineTo(-25, 25); // 左下角
  polygon.closePath();
  polygon.fill({ color: "#00cc88" }); // 绿色
  scene.addChild(polygon);

  // 添加动态刚体物理属性
  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    friction: 0.2,
    restitution: 0.5,
    shapes: [
      {
        shapeType: "polygon", // 多边形碰撞体
        vertices: [
          // 定义三角形的三个顶点
          { x: 0, y: -25 },
          { x: 25, y: 25 },
          { x: -25, y: 25 },
        ],
      },
    ],
  });
  polygon.addScript(rigidBody);
}

// 创建静态链条的函数
function createChain(scene: Scene, x: number, y: number) {
  // 创建画布对象并绘制链条
  const chain = new Canvas();
  chain.position.set(x, y);

  // 绘制三段连接的线条
  chain.beginPath();
  chain.moveTo(-100, 0);
  chain.lineTo(100, 50);
  chain.lineTo(200, 40);
  chain.stroke({ color: "#ffffff", width: 3 }); // 白色线条
  scene.addChild(chain);

  // 添加静态刚体物理属性
  const rigidBody = new RigidBody({
    rigidType: "static", // 静态链条
    shapes: [
      {
        shapeType: "chain", // 链条碰撞体
        vertices: [
          // 定义链条的路径点
          { x: -100, y: 0 },
          { x: 100, y: 50 },
          { x: 200, y: 40 },
        ],
      },
    ],
  });
  chain.addScript(rigidBody);
}

// 创建可点击按钮的函数
function createButton(scene: Scene, text: string, x: number, y: number, onClick: () => void) {
  // 创建文本按钮
  const button = new Text();
  button.position.set(x, y);
  button.text = text;
  button.fontSize = 20;
  button.on("click", (e) => {
    e.stopPropagation();
    onClick();
  }); // 添加点击事件处理
  scene.addChild(button);
}

// 启动测试程序
test();
