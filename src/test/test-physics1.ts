import { App, Canvas, Rectangle, RigidBody, Scene, Sprite } from "liko";

async function test() {
  const app = new App();
  await app.init({
    width: 800,
    height: 800,
    bgColor: 0x333333,
    physics: { enabled: true, debug: true, boundaryArea: new Rectangle(0, 0, 800, 800).pad(100) },
  });

  const scene = new Scene({
    width: 800,
    height: 800,
    parent: app.stage,
    onClick: () => {
      new Sprite({
        url: "assets/ball.png", // 图片的路径
        width: 40, // 图片的宽度
        height: 40, // 图片的高度
        pos: { x: Math.random() * 700 + 50, y: 0 }, // 图片在游戏画面中的位置
        parent: scene, // 图片的父对象，这里是游戏的舞台
        scripts: [
          new RigidBody({
            rigidType: "dynamic", // 静态物体，不会移动
            friction: 0.5, // 摩擦系数
            restitution: 0.2, // 弹性系数
            allowRotation: true,
            shapes: [
              {
                shapeType: "circle",
                radius: 20,
                offset: { x: 0, y: 0 },
              },
            ],
          }),
        ],
      });
    },
  });

  new Sprite({
    url: "assets/box.png",
    width: 64,
    height: 64,
    pos: { x: 140, y: 200 },
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    parent: scene,
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 静态物体，不会移动
        friction: 0.5, // 摩擦系数
        restitution: 0.2, // 弹性系数
        category: "box1",
        categoryAccepted: ["block", "ground"],
        allowRotation: true,
      }),
    ],
  });

  new Sprite({
    url: "assets/box.png",
    width: 64,
    height: 64,
    pos: { x: 400, y: 200 },
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    angle: 45,
    parent: scene,
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 静态物体，不会移动
        friction: 0.5, // 摩擦系数
        restitution: 0.2, // 弹性系数
      }),
    ],
  });

  new Sprite({
    url: "assets/box.png",
    width: 64,
    height: 64,
    pos: { x: 500, y: 200 },
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    parent: scene,
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 静态物体，不会移动
        friction: 0.5, // 摩擦系数
        restitution: 0.2, // 弹性系数
      }),
    ],
  });

  new Sprite({
    url: "assets/ball.png", // 图片的路径
    width: 40, // 图片的宽度
    height: 40, // 图片的高度
    pos: { x: 80, y: 0 }, // 图片在游戏画面中的位置
    anchor: { x: 0.5, y: 0.5 }, // 图片的锚点，用于旋转和缩放
    parent: scene, // 图片的父对象，这里是游戏的舞台
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 静态物体，不会移动
        categoryAccepted: ["ground", "triangle"],
        friction: 0.5, // 摩擦系数
        restitution: 0.2, // 弹性系数
        allowRotation: true,
        angularVelocity: -Math.PI,
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
          },
        ],
      }),
    ],
  });

  const triangle = new Canvas();
  triangle.beginPath();
  triangle.moveTo(25, 0);
  triangle.lineTo(50, 50);
  triangle.lineTo(0, 50);
  triangle.closePath();
  triangle.fill({ color: "#ff00ff" });
  triangle.pos.set(600, 300);
  triangle.angle = 5;
  scene.addChild(triangle);

  triangle.addScript(
    new RigidBody({
      rigidType: "dynamic",
      friction: 0.5,
      restitution: 0.2,
      category: "triangle",
      shapes: [
        {
          shapeType: "polygon",
          vertices: [
            { x: 25, y: 0 },
            { x: 50, y: 50 },
            { x: 0, y: 50 },
          ],
        },
      ],
    }),
  );

  new Sprite({
    url: "assets/brick.png",
    width: 128,
    height: 128,
    pos: { x: 100, y: 450 },
    scale: { x: 0.5, y: 0.5 },
    anchor: { x: 0.5, y: 0.5 },
    parent: scene,
    scripts: [
      new RigidBody({
        rigidType: "static",
        category: "block",
      }),
    ],
  });

  const ground = new Canvas();
  ground.rect(0, 0, 700, 40);
  ground.fill({ color: "#ff8800" });
  ground.pos.set(0, 500);
  ground.angle = 5;
  scene.addChild(ground);

  const rigidBodyGround = new RigidBody({
    rigidType: "static",
    category: "ground",
    friction: 0.5,
    restitution: 0.2,
  });
  ground.addScript(rigidBodyGround);

  new Sprite({
    url: "assets/ball.png", // 图片的路径
    width: 40, // 图片的宽度
    height: 40, // 图片的高度
    pos: { x: 50, y: 50 }, // 图片在游戏画面中的位置
    parent: scene, // 图片的父对象，这里是游戏的舞台
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 静态物体，不会移动
        categoryAccepted: ["chain", "ground", "triangle"],
        friction: 0.5, // 摩擦系数
        restitution: 0.2, // 弹性系数
        allowRotation: true,
        angularVelocity: -Math.PI,
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
          },
        ],
      }),
    ],
  });

  const chain = new Canvas();
  chain.moveTo(0, 0).lineTo(100, 10).lineTo(200, 50).lineTo(400, 0);
  chain.stroke({ color: "#ff8800", width: 2 });
  chain.pos.set(0, 100);
  chain.angle = 5;
  scene.addChild(chain);

  const rigidBodyChain = new RigidBody({
    rigidType: "static",
    category: "chain",
    friction: 0.5,
    restitution: 0.2,
    shapes: [
      {
        shapeType: "chain",
        vertices: [
          { x: 0, y: 0 },
          { x: 100, y: 10 },
          { x: 200, y: 50 },
          { x: 400, y: 0 },
        ],
      },
    ],
  });
  chain.addScript(rigidBodyChain);
}

test();
