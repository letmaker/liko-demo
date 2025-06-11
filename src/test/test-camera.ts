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

async function test() {
  const app = new App();
  await app.init({
    width: 800,
    height: 600,
    bgColor: 0x333333,
    physics: {
      enabled: true,
      debug: true,
    },
  });

  const scene = new Scene({
    width: 1600,
    height: 600,
    parent: app.stage,
  });

  new Sprite({
    url: "assets/background.png",
    scale: { x: 2.2, y: 2.2 },
    repeat: true,
    width: 750,
    height: 256,
    parent: scene,
  });

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
        rigidType: "static",
      }),
    ],
  });

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

  const apple = new Sprite({
    url: "assets/sign_exit.png",
    position: { x: 350, y: 472 },
    parent: scene,
    onClick: () => {
      if (scene.camera.followEnabled) {
        const pos = flag.localToWorld({ x: 0, y: 0 });
        scene.camera.followEnabled = false;
        scene.camera.lookAt(pos.x, pos.y);

        setTimeout(() => {
          scene.camera.followEnabled = true;
        }, 1000);
      }
    },
  });
  new Text({
    text: "点我查看目标",
    textColor: "red",
    position: { x: 32, y: -10 },
    anchor: { x: 0.5, y: 0.5 },
    parent: apple,
  });

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
            isSensor: true,
          },
        ],
      }),
    ],
  });

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

  new AnimatedSprite({
    url: "assets/sheet/fliggy.atlas",
    parent: scene,
    position: { x: 300, y: 528 },
    anchor: { x: 0.5, y: 1 },
    frameRate: 20,
  }).play();

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
        rigidType: "dynamic",
        shapes: [
          {
            shapeType: "box",
            width: 40,
            height: 78,
            offset: { x: 44, y: 50 },
          },
        ],
      }),
      new Hero(),
    ],
  }).play();

  // const debug = new Canvas();
  // debug.rect(0, 0, 128, 128);
  // debug.fill({ color: "rgba(255,0,0,0.5)" });
  // debug.beginPath();
  // debug.rect(44, 50, 40, 78);
  // debug.fill({ color: "rgba(0,255,0,0.5)" });
  // girl.addChild(debug);

  scene.camera.worldBounds = new Rectangle(0, 0, ground.width, ground.height);
  scene.camera.followTarget(girl, { followX: true, followY: false });
}

test();

class Hero extends Script<AnimatedSprite> {
  private _jumping = false;
  private _dead = false;

  onKeyDown(e: KeyboardEvent): void {
    if (this._dead) return;

    if (e.key === "w" && !this._jumping) {
      this._jumping = true;
      const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });
      rigidBody?.applyLinearImpulse({ x: 0, y: -18 });
      this.target.url = "assets/boy/jump.atlas";
    } else if (e.key === "j") {
      this.target.url = "assets/boy/attack3.atlas";
      this.target.once(EventType.ended, () => {
        // TODO 这里好像无法看到最后一帧
        this.target.url = "assets/boy/idle.atlas";
      });
    }
  }

  onUpdate(): void {
    if (this._dead) return;

    const stage = this.target?.stage;
    const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });
    if (stage?.keyboard.hasKeydown("a")) {
      this.target.scale.x = -1;
      rigidBody?.setLinearVelocity(-3);
      this.target.url = "assets/boy/run.atlas";
    } else if (stage?.keyboard.hasKeydown("d")) {
      this.target.scale.x = 1;
      rigidBody?.setLinearVelocity(3);
      this.target.url = "assets/boy/run.atlas";
    } else {
      rigidBody?.setLinearVelocity(0);
      // if (!this._jumping) {
      //   this.target.url = "assets/boy/idle.atlas";
      // }
    }
  }

  onCollisionStart(e: ICollision): void {
    if (this._dead) return;

    if (e.other.label === "ground" || e.other.label === "block") {
      this._jumping = false;
      this.target.url = "assets/boy/idle.atlas";
    } else if (e.other.label === "icon") {
      e.other.target.destroy();
    } else if (e.other.label === "spikes") {
      this._dead = true;
      this.target.url = "assets/boy/dead.atlas";
      this.target.on(EventType.ended, () => {
        this.target.stop();
      });
      console.log("game over");
    }
  }
}
