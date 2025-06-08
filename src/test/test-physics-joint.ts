import { App, Canvas, RigidBody, Scene, Shape, type IPoint } from "liko";

/**
 * 物理引擎关节演示
 * 本示例展示了不同类型的物理关节及其特性，包括：
 * - 旋转关节 (Revolute Joint): 允许两个刚体围绕一个点旋转
 * - 距离关节 (Distance Joint): 保持两个刚体之间的距离
 * - 固定关节 (Fixed Joint): 将两个刚体固定在一起
 * - 棱柱关节 (Prismatic Joint): 允许两个刚体沿着一个轴线滑动
 * - 绳索关节 (Rope Joint): 限制两个刚体之间的最大距离
 * - 轮子关节 (Wheel Joint): 模拟车轮运动
 * - 马达关节 (Motor Joint): 驱动刚体运动
 * - 滑轮关节 (Pulley Joint): 模拟滑轮系统
 */
async function test() {
  // 初始化应用程序
  const app = new App();
  await app.init({
    width: 800,
    height: 800,
    bgColor: 0x000000,
    physics: { enabled: true, debug: true }, // 启用物理引擎并显示调试信息
  });

  // 创建场景
  const scene = new Scene({
    parent: app.stage,
  });

  // 创建地面
  const ground = new Canvas();
  ground.rect(0, 0, 800, 50);
  ground.fill({ color: "#666666" });
  ground.position.set(0, 750);
  scene.addChild(ground);

  // 为地面添加静态刚体
  const grRigidBody = new RigidBody({ rigidType: "static" });
  ground.addScript(grRigidBody);

  // 创建各种类型的关节示例
  // 旋转关节示例：不同锚点位置的对比
  createRevoluteJoint(scene, grRigidBody, { x: 50, y: 50 }, { x: 0, y: 0 }, "#ff0000");
  createRevoluteJoint(scene, grRigidBody, { x: 150, y: 50 }, { x: 0.25, y: 0.5 }, "#ff00ff");

  // 距离关节示例：弹簧效果
  createDistanceJoint(scene, grRigidBody, { x: 300, y: 50 }, { x: 0, y: 0 }, "#ff0000");
  createDistanceJoint(scene, grRigidBody, { x: 400, y: 50 }, { x: 0.25, y: 0.5 }, "#ff00ff");

  // 固定关节示例：点击可解除固定
  createFixedJoint(scene, grRigidBody, { x: 550, y: 50 }, { x: 0, y: 0 }, "#ff0000");
  createFixedJoint(scene, grRigidBody, { x: 650, y: 50 }, { x: 0.25, y: 0.5 }, "#ff00ff");

  // 棱柱关节示例：垂直滑动
  createPrismaticJoint(scene, grRigidBody, { x: 50, y: 150 }, { x: 0, y: 0 }, "#ff0000");
  createPrismaticJoint(scene, grRigidBody, { x: 150, y: 150 }, { x: 0.25, y: 0.5 }, "#ff00ff");

  // 绳索关节示例：限制最大距离
  createRopeJoint(scene, grRigidBody, { x: 300, y: 150 }, { x: 0, y: 0 }, "#ff0000");
  createRopeJoint(scene, grRigidBody, { x: 400, y: 150 }, { x: 0.25, y: 0.5 }, "#ff00ff");

  // 轮子和马达关节示例
  createWheelJoint(scene, { x: 50, y: 700 }, "#ff0000");
  createMotorJoint(scene, grRigidBody, { x: 500, y: 730 }, { x: 0.5, y: 0.5 }, "#ff0000");

  // 滑轮关节示例
  createPulleyJoint(scene);
}

/**
 * 创建滑轮关节示例
 * 滑轮关节连接两个动态刚体，模拟滑轮系统的行为
 * 当一个物体上升时，另一个物体会下降
 */
function createPulleyJoint(scene: Scene) {
  const radius = 20;

  // 创建两个固定锚点
  const anchor1 = createBall(2, { x: 0.5, y: 0.5 }, "#ff0000");
  anchor1.position = { x: 100, y: 350 };
  scene.addChild(anchor1);

  const anchor2 = createBall(2, { x: 0.5, y: 0.5 }, "#ff0000");
  anchor2.position = { x: 200, y: 350 };
  scene.addChild(anchor2);

  // 创建两个可移动的球体
  const ball1 = createBall(20, { x: 0.5, y: 0.5 }, "#ff0000");
  ball1.position = { x: 100, y: 500 };
  scene.addChild(ball1);

  const ball2 = createBall(30, { x: 0.5, y: 0.5 }, "#ff00ff");
  ball2.position = { x: 200, y: 500 };
  scene.addChild(ball2);

  // 点击第二个球体时创建滑轮系统
  ball2.once("pointerdown", () => {
    // 创建第二个球体的刚体
    const rigidBody2 = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      shapes: [{ shapeType: "circle", radius }],
    });
    ball2.addScript(rigidBody2);

    // 创建第一个球体的刚体并设置滑轮关节
    const rigidBody1 = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      shapes: [{ shapeType: "circle", radius }],
      joints: [
        {
          jointType: "pulley",
          targetBody: rigidBody2,
          localAnchorA: { x: 0, y: 0 }, // 第一个物体的连接点
          localAnchorB: { x: 0, y: 0 }, // 第二个物体的连接点
          groundAnchorA: anchor1.position, // 第一个固定锚点
          groundAnchorB: anchor2.position, // 第二个固定锚点
          lengthA: 150, // 第一根绳子的长度
          lengthB: 150, // 第二根绳子的长度
          ratio: 1, // 滑轮比率，影响两个物体的运动比例
        },
      ],
    });
    ball1.addScript(rigidBody1);
  });

  const debugLine = new Shape();
  debugLine.drawLine({
    points: [anchor1.position, anchor2.position],
    color: "#ffff00",
  });
  scene.addChild(debugLine);

  const debugLine1 = new Shape();
  scene.addChild(debugLine1);

  scene.on("update", () => {
    debugLine1.drawLine({
      points: [anchor1.position, ball1.position],
      color: "#ffff00",
    });
  });

  const debugLine2 = new Shape();
  scene.addChild(debugLine2);

  scene.on("update", () => {
    debugLine2.drawLine({
      points: [anchor2.position, ball2.position],
      color: "#ffff00",
    });
  });
}

/**
 * 创建马达关节示例
 * 马达关节可以驱动刚体进行线性运动和角度旋转
 */
function createMotorJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const radius = 20;

  const motorJoint = createBall(radius, anchor, color);
  motorJoint.position = position;
  scene.addChild(motorJoint);

  // TODO 这块不太符合预期
  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    shapes: [{ shapeType: "circle", radius }],
    joints: [
      {
        jointType: "motor",
        targetBody: grRigidBody,
        linearOffset: { x: 100, y: 0 }, // 设置目标位置偏移
        // angularOffset: Math.PI * 2, // 设置目标角度偏移
        // maxForce: 2, // 最大线性力
        // maxTorque: 1, // 最大扭矩
        correctionFactor: 0.3, // 位置校正因子
      },
    ],
  });
  motorJoint.addScript(rigidBody);
}

/**
 * 创建轮子关节示例
 * 轮子关节允许物体沿着指定轴线移动，并可以添加马达驱动
 */
function createWheelJoint(scene: Scene, position: IPoint, color: string) {
  // 创建一个汽车
  const car = createBox(50, 20, { x: 0, y: 0 }, color);
  car.position = position;
  scene.addChild(car);

  const carBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    shapes: [{ shapeType: "box", width: 50, height: 20 }],
  });
  car.addScript(carBody);

  const radius = 10;
  const speed = 2;

  const wheel1 = createBall(radius, { x: 0.5, y: 0.5 }, "#ff00ff");
  wheel1.position = { x: position.x + radius, y: position.y + radius + 10 };
  wheel1.moveTo(radius, radius);
  wheel1.lineTo(0, 0);
  wheel1.stroke({ color: "#ffff00", width: 1 });
  scene.addChild(wheel1);

  // car 和 轮子，通过旋转关节固定
  const wheelBody1 = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    shapes: [{ shapeType: "circle", radius }],
    joints: [
      {
        jointType: "wheel",
        targetBody: carBody,
        localAnchor: { x: 0, y: 0 },
        localAxis: { x: 1, y: 0 }, // 设置轮子的移动轴为水平方向
        enableMotor: true, // 启用马达
        maxMotorTorque: 100, // 马达最大扭矩
        motorSpeed: speed, // 马达速度
        frequency: 10.0, // 弹簧频率，影响悬挂系统的振动
        dampingRatio: 0.7, // 阻尼比，影响振动的衰减
      },
    ],
  });
  wheel1.addScript(wheelBody1);

  const wheel2 = createBall(radius, { x: 0.5, y: 0.5 }, "#ff00ff");
  wheel2.position = { x: position.x + 40, y: position.y + radius + 10 };
  wheel2.moveTo(radius, radius);
  wheel2.lineTo(0, 0);
  wheel2.stroke({ color: "#ffff00", width: 1 });
  scene.addChild(wheel2);

  const wheelBody2 = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    shapes: [{ shapeType: "circle", radius }],
    joints: [
      {
        jointType: "wheel",
        targetBody: carBody,
        localAnchor: { x: 0, y: 0 },
        localAxis: { x: 1, y: 0 }, // 设置轮子的移动轴为水平方向
        enableMotor: true, // 启用马达
        maxMotorTorque: 100, // 马达最大扭矩
        motorSpeed: speed, // 马达速度
        frequency: 10.0, // 弹簧频率，影响悬挂系统的振动
        dampingRatio: 0.7, // 阻尼比，影响振动的衰减
      },
    ],
  });
  wheel2.addScript(wheelBody2);
}

/**
 * 创建绳索关节示例
 * 绳索关节限制两个物体之间的最大距离，模拟绳子的行为
 */
function createRopeJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const width = 100;
  const height = 50;

  const ropeJoint = createBox(width, height, anchor, color);
  ropeJoint.position = position;
  scene.addChild(ropeJoint);

  ropeJoint.once("pointerdown", () => {
    const rigidBody = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      isSensor: true,
      joints: [
        {
          jointType: "rope",
          targetBody: grRigidBody,
          localAnchor: { x: 0, y: 0 },
          maxLength: 100, // 绳索的最大长度
        },
      ],
    });
    ropeJoint.addScript(rigidBody);
  });

  const start = ropeJoint.position.clone();
  const debugLine = new Shape();
  scene.addChild(debugLine);

  scene.on("update", () => {
    debugLine.drawLine({
      points: [start, ropeJoint.position],
      color: "#ffff00",
    });
  });
}

/**
 * 创建棱柱关节示例
 * 棱柱关节允许物体沿着指定轴线移动，可以添加马达和限制移动范围
 */
function createPrismaticJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const width = 100;
  const height = 50;

  const prismaticJoint = createBox(width, height, anchor, color);
  prismaticJoint.position = position;
  scene.addChild(prismaticJoint);

  prismaticJoint.once("pointerdown", () => {
    const rigidBody = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      isSensor: true,
      joints: [
        {
          jointType: "prismatic",
          targetBody: grRigidBody,
          localAnchor: { x: 0, y: 0 },
          localAxis: { x: 1, y: 1 }, // 设置移动轴为垂直方向
          enableMotor: true, // 启用马达
          maxMotorForce: 1000, // 马达最大力
          motorSpeed: 1, // 马达速度
          enableLimit: true, // 启用限位
          upperTranslation: 100, // 上限位置
        },
      ],
    });
    prismaticJoint.addScript(rigidBody);
  });
}

/**
 * 创建固定关节示例
 * 固定关节将两个物体固定在一起，可以通过点击解除固定
 */
function createFixedJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const width = 100;
  const height = 50;

  const fixedJoint = createBox(width, height, anchor, color);
  fixedJoint.position = position;
  scene.addChild(fixedJoint);

  const label = `fixed${Math.random()}`;
  const rigidBody = new RigidBody({
    rigidType: "dynamic",
    allowRotation: true,
    isSensor: true,
    joints: [
      {
        jointType: "fixed",
        label, // 关节标签，用于后续解除固定
        targetBody: grRigidBody,
        localAnchor: { x: 0, y: 0 },
      },
    ],
  });
  fixedJoint.addScript(rigidBody);

  // 点击时解除固定
  fixedJoint.once("pointerdown", () => {
    rigidBody.destroyJoint(label);
  });
}

/**
 * 创建距离关节示例
 * 距离关节保持两个物体之间的距离，可以添加弹簧效果
 */
function createDistanceJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const width = 100;
  const height = 50;

  const distanceJoint = createBox(width, height, anchor, color);
  distanceJoint.position = position;
  scene.addChild(distanceJoint);

  distanceJoint.once("pointerdown", () => {
    const rigidBody = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      isSensor: true,
      joints: [
        {
          jointType: "distance",
          targetBody: grRigidBody,
          localAnchor: { x: 0, y: 0 },
          length: 50, // 两个物体之间的距离
          frequency: 0.8, // 弹簧频率
          dampingRatio: 0.2, // 阻尼比
        },
      ],
    });
    distanceJoint.addScript(rigidBody);
  });

  const start = distanceJoint.position.clone();
  const debugLine = new Shape();
  scene.addChild(debugLine);

  scene.on("update", () => {
    debugLine.drawLine({
      points: [start, distanceJoint.position],
      color: "#ffff00",
    });
  });
}

/**
 * 创建旋转关节示例
 * 旋转关节允许两个物体围绕一个点旋转
 */
function createRevoluteJoint(scene: Scene, grRigidBody: RigidBody, position: IPoint, anchor: IPoint, color: string) {
  const width = 100;
  const height = 50;

  const revoluteJoint = createBox(width, height, anchor, color);
  revoluteJoint.position = position;
  scene.addChild(revoluteJoint);

  revoluteJoint.once("pointerdown", () => {
    const rigidBody = new RigidBody({
      rigidType: "dynamic",
      allowRotation: true,
      isSensor: true,
      joints: [
        {
          jointType: "revolute",
          targetBody: grRigidBody,
          localAnchor: { x: 0, y: 0 }, // 旋转点位置
        },
      ],
    });
    revoluteJoint.addScript(rigidBody);
  });
}

/**
 * 创建矩形对象
 * @param width 宽度
 * @param height 高度
 * @param anchor 锚点
 * @param color 颜色
 */
function createBox(width: number, height: number, anchor: IPoint, color: string) {
  const box = new Canvas();
  box.rect(0, 0, width, height);
  box.anchor = anchor;
  box.fill({ color });

  // 添加锚点可视化
  const anchorDebugPoint = new Canvas();
  anchorDebugPoint.circle(0, 0, 2);
  anchorDebugPoint.fill({ color: "#ffff00" });
  anchorDebugPoint.position.set(anchor.x * width, anchor.y * height);
  box.addChild(anchorDebugPoint);
  return box;
}

/**
 * 创建圆形对象
 * @param radius 半径
 * @param anchor 锚点
 * @param color 颜色
 */
function createBall(radius: number, anchor: IPoint, color: string) {
  const box = new Canvas();
  box.circle(radius, radius, radius);
  box.anchor = anchor;
  box.fill({ color });

  // 添加锚点可视化
  const anchorDebugPoint = new Canvas();
  anchorDebugPoint.circle(0, 0, 2);
  anchorDebugPoint.fill({ color: "#ffff00" });
  anchorDebugPoint.position.set(anchor.x * radius * 2, anchor.y * radius * 2);
  box.addChild(anchorDebugPoint);
  return box;
}

test();
