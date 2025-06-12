import {
  AnimatedSprite,
  App,
  EventType,
  type ICollision,
  Rectangle,
  RigidBody,
  Scene,
  Script,
  Sprite,
  Text,
} from "../../../liko/src";

/**
 * 相机跟随测试示例
 * 演示了相机跟随目标、查看目标、碰撞检测等功能
 */
async function test() {
  // 创建应用实例
  const app = new App();

  // 初始化应用配置
  await app.init({
    width: 800, // 窗口宽度
    height: 600, // 窗口高度
    bgColor: 0x333333, // 背景色
    physics: {
      enabled: true, // 启用物理引擎
      debug: true, // 显示物理调试信息
    },
  });

  // 创建游戏场景（比窗口更宽，用于演示相机跟随）
  const scene = new Scene({
    width: 1600, // 场景宽度
    height: 600, // 场景高度
    parent: app.stage,
  });

  // 创建背景精灵
  new Sprite({
    url: "assets/background.png",
    scale: { x: 2.2, y: 2.2 },
    repeat: true, // 重复平铺
    width: 750,
    height: 256,
    parent: scene,
  });

  // 创建地面精灵（静态刚体）
  const ground = new Sprite({
    url: "assets/ground.png",
    repeat: true,
    width: 1600,
    height: 64,
    position: { x: 0, y: 536 },
    parent: scene,
    scripts: [
      new RigidBody({
        label: "ground",
        rigidType: "static", // 静态刚体，不受物理力影响
      }),
    ],
  });

  // 创建蓝色方块障碍物
  new Sprite({
    url: "assets/block_blue.png",
    position: { x: 0, y: 450 },
    parent: scene,
    width: 64,
    height: 64,
    scripts: [
      new RigidBody({
        label: "block",
        rigidType: "static",
      }),
    ],
  });

  // 创建可点击的标志，用于演示相机切换视角
  const apple = new Sprite({
    url: "assets/sign_exit.png",
    position: { x: 350, y: 472 },
    parent: scene,
    onClick: () => {
      // 点击时暂时取消跟随，切换到目标位置
      if (scene.camera.followEnabled) {
        const pos = flag.localToWorld({ x: 0, y: 0 });
        scene.camera.followEnabled = false;
        scene.camera.lookAt(pos.x, pos.y);

        // 1秒后恢复跟随
        setTimeout(() => {
          scene.camera.followEnabled = true;
        }, 1000);
      }
    },
  });

  // 添加提示文本
  new Text({
    text: "点我查看目标",
    textColor: "red",
    position: { x: 32, y: -10 },
    anchor: { x: 0.5, y: 0.5 },
    parent: apple,
  });

  // 创建金币平台
  new Sprite({
    url: "assets/block_coin.png",
    position: { x: 500, y: 400 },
    parent: scene,
    width: 64,
    height: 64,
    scripts: [
      new RigidBody({
        label: "block",
        rigidType: "static",
      }),
    ],
  });

  // 创建可收集的金币（传感器碰撞体）
  new Sprite({
    url: "assets/coin_gold.png",
    position: { x: 514, y: 350 },
    parent: scene,
    width: 38,
    height: 40,
    scripts: [
      new RigidBody({
        label: "icon",
        rigidType: "static",
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
            isSensor: true, // 传感器，只检测碰撞不产生物理反应
          },
        ],
      }),
    ],
  });

  // 更多金币平台和金币
  new Sprite({
    url: "assets/block_coin.png",
    position: { x: 650, y: 300 },
    parent: scene,
    width: 64,
    height: 64,
    scripts: [
      new RigidBody({
        label: "block",
        rigidType: "static",
      }),
    ],
  });

  new Sprite({
    url: "assets/coin_gold.png",
    position: { x: 664, y: 250 },
    parent: scene,
    width: 38,
    height: 40,
    scripts: [
      new RigidBody({
        label: "icon",
        rigidType: "static",
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
            isSensor: true,
          },
        ],
      }),
    ],
  });

  // 创建危险的尖刺陷阱
  new Sprite({
    url: "assets/block_spikes.png",
    position: { x: 900, y: 450 },
    parent: scene,
    width: 64,
    height: 64,
    scripts: [
      new RigidBody({
        label: "spikes",
        rigidType: "static",
      }),
    ],
  });

  // 更多金币
  new Sprite({
    url: "assets/coin_gold.png",
    position: { x: 1000, y: 400 },
    parent: scene,
    width: 38,
    height: 40,
    scripts: [
      new RigidBody({
        label: "icon",
        rigidType: "static",
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
            isSensor: true,
          },
        ],
      }),
    ],
  });

  new Sprite({
    url: "assets/coin_gold.png",
    position: { x: 1200, y: 450 },
    parent: scene,
    width: 38,
    height: 40,
    scripts: [
      new RigidBody({
        label: "icon",
        rigidType: "static",
        shapes: [
          {
            shapeType: "circle",
            radius: 20,
            offset: { x: 0, y: 0 },
            isSensor: true,
          },
        ],
      }),
    ],
  });

  // 创建终点旗帜
  const flag = new Sprite({
    url: "assets/flag_green.png",
    position: { x: 1500, y: 472 },
    parent: scene,
    width: 64,
    height: 64,
    scripts: [
      new RigidBody({
        label: "flag",
        rigidType: "static",
      }),
    ],
  });

  // 创建装饰性NPC动画
  // new AnimatedSprite({
  //   url: "assets/sheet/fliggy.atlas",
  //   parent: scene,
  //   position: { x: 150, y: 528 },
  //   anchor: { x: 0.5, y: 1 },
  //   frameRate: 20,
  // }).play();

  // 创建玩家角色（可控制的动画精灵）
  const girl = new AnimatedSprite({
    url: "assets/boy/idle.atlas",
    parent: scene,
    position: { x: 264, y: 528 },
    anchor: { x: 0.5, y: 1 },
    frameRate: 10,
    width: 128,
    height: 128,
    scripts: [
      new RigidBody({
        rigidType: "dynamic", // 动态刚体，受物理力影响
        shapes: [
          {
            shapeType: "box",
            width: 40,
            height: 78,
            offset: { x: 44, y: 50 }, // 调整碰撞体位置
          },
        ],
      }),
      new Hero(), // 添加英雄控制脚本
    ],
  }).play();

  // const debug = new Canvas();
  // debug.rect(0, 0, 128, 128);
  // debug.fill({ color: "rgba(255,0,0,0.5)" });
  // debug.beginPath();
  // debug.rect(44, 50, 40, 78);
  // debug.fill({ color: "rgba(0,255,0,0.5)" });
  // girl.addChild(debug);

  // 设置相机边界和跟随目标
  scene.camera.worldBounds = new Rectangle(0, 0, ground.width, ground.height);
  scene.camera.followTarget(girl, { followX: true, followY: false }); // 只在X轴跟随
}

// 启动测试
test();

/**
 * 英雄角色控制脚本
 * 处理玩家输入、移动、跳跃、攻击和碰撞事件
 */
class Hero extends Script<AnimatedSprite> {
  private _jumping = false; // 是否正在跳跃
  private _dead = false; // 是否已死亡

  /**
   * 键盘按下事件处理
   */
  onKeyDown(e: KeyboardEvent): void {
    if (this._dead) return;

    // W键跳跃
    if (e.key === "w" && !this._jumping) {
      this._jumping = true;
      const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });
      rigidBody?.applyLinearImpulse({ x: 0, y: -18 }); // 施加向上的冲量
      this.target.url = "assets/boy/jump.atlas";
    }
    // J键攻击
    else if (e.key === "j") {
      this.target.url = "assets/boy/attack3.atlas";
      this.target.once(EventType.ended, () => {
        // 攻击动画结束后回到待机状态
        this.target.url = "assets/boy/idle.atlas";
      });
    }
  }

  /**
   * 每帧更新处理
   */
  onUpdate(): void {
    if (this._dead) return;

    const stage = this.target?.stage;
    const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });

    // A键左移
    if (stage?.keyboard.hasKeydown("a")) {
      this.target.scale.x = -1; // 翻转精灵方向
      rigidBody?.setLinearVelocity(-3);
      this.target.url = "assets/boy/run.atlas";
    }
    // D键右移
    else if (stage?.keyboard.hasKeydown("d")) {
      this.target.scale.x = 1;
      rigidBody?.setLinearVelocity(3);
      this.target.url = "assets/boy/run.atlas";
    }
    // 无按键时停止移动
    else {
      rigidBody?.setLinearVelocity(0);
      // if (!this._jumping) {
      //   this.target.url = "assets/boy/idle.atlas";
      // }
    }
  }

  /**
   * 碰撞开始事件处理
   */
  onCollisionStart(e: ICollision): void {
    if (this._dead) return;

    // 碰到地面或方块时结束跳跃状态
    if (e.other.label === "ground" || e.other.label === "block") {
      this._jumping = false;
      this.target.url = "assets/boy/idle.atlas";
    }
    // 收集金币
    else if (e.other.label === "icon") {
      e.other.target.destroy();
    }
    // 碰到尖刺时死亡
    else if (e.other.label === "spikes") {
      this._dead = true;
      this.target.url = "assets/boy/dead.atlas";
      this.target.on(EventType.ended, () => {
        this.target.stop(); // 停止动画
        this.showRestartButton(); // 显示重新开始按钮
      });
      console.log("game over");
    }
  }

  /**
   * 显示重新开始按钮
   */
  showRestartButton(): void {
    // 创建游戏结束文本
    new Text({
      text: "游戏结束\n\n按 R 键重新开始",
      textColor: "red",
      fontSize: 36,
      position: { x: 400, y: 300 },
      anchor: { x: 0.5, y: 0.5 },
      parent: this.target.stage,
    });

    // 监听键盘事件重新开始游戏
    this.target.stage?.on("keydown", (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        window.location.reload();
      }
    });
  }
}
