import {
  AnimatedSprite,
  App,
  Canvas,
  EventType,
  type ICollision,
  Rectangle,
  RigidBody,
  Scene,
  Script,
  Sprite,
} from "../../../liko/src";

async function test() {
  const app = new App();
  await app.init({
    width: 800,
    height: 800,
    bgColor: 0x333333,
    physics: {
      enabled: true,
      debug: true,
    },
  });

  const scene = new Scene({
    width: 1600,
    height: 800,
    parent: app.stage,
  });

  new Sprite({
    url: "assets/background.png",
    scale: { x: 3, y: 3 },
    repeat: true,
    width: 533,
    height: 256,
    parent: scene,
  });

  const ground = new Sprite({
    url: "assets/ground.png",
    repeat: true,
    width: 1600,
    height: 64,
    position: { x: 0, y: 736 },
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
    position: { x: 0, y: 650 },
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
    url: "assets/block_coin.png",
    position: { x: 400, y: 600 },
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
    position: { x: 414, y: 550 },
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
    position: { x: 550, y: 500 },
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
    position: { x: 564, y: 450 },
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
    position: { x: 750, y: 650 },
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

  const flag = new Sprite({
    url: "assets/flag_green.png",
    position: { x: 1500, y: 672 },
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

  const girl = new AnimatedSprite({
    url: "assets/boy/idle.json",
    parent: scene,
    position: { x: 264, y: 728 },
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

  const debug = new Canvas();
  debug.rect(0, 0, 128, 128);
  debug.fill({ color: "rgba(255,0,0,0.5)" });
  debug.beginPath();
  debug.rect(44, 50, 40, 78);
  debug.fill({ color: "rgba(0,255,0,0.5)" });
  girl.addChild(debug);

  scene.camera.worldBounds = new Rectangle(0, 0, ground.width, ground.height);
  scene.camera.followTarget(girl, { followX: true, followY: false });

  const apple = new Sprite({
    url: "assets/apple2.png",
    position: { x: 300, y: 500 },
    parent: scene,
  });

  apple.on(EventType.click, () => {
    if (scene.camera.followEnabled) {
      const pos = flag.localToWorld({ x: 0, y: 0 });
      scene.camera.followEnabled = false;
      scene.camera.lookAt(pos.x, pos.y);
      console.log("look at", pos.x, pos.y);

      setTimeout(() => {
        scene.camera.followEnabled = true;
      }, 1000);
    }
  });
}

test();

class Hero extends Script {
  private _jumping = false;
  private _dead = false;

  onKeyDown(e: KeyboardEvent): void {
    if (this._dead) return;

    if (e.key === "w" && !this._jumping) {
      this._jumping = true;
      const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });
      rigidBody?.applyLinearImpulse({ x: 0, y: -18 });
      (this.target as AnimatedSprite).url = "assets/boy/jump.json";
    }
  }

  onUpdate(): void {
    if (this._dead) return;

    const stage = this.target?.stage;
    const rigidBody = this.target.findScript<RigidBody>({ Class: RigidBody });
    if (stage?.keyboard.hasKeydown("a")) {
      this.target.scale.x = -1;
      rigidBody?.setLinearVelocity(-2);
      (this.target as AnimatedSprite).url = "assets/boy/run.json";
    } else if (stage?.keyboard.hasKeydown("d")) {
      this.target.scale.x = 1;
      rigidBody?.setLinearVelocity(2);
      (this.target as AnimatedSprite).url = "assets/boy/run.json";
    } else {
      rigidBody?.setLinearVelocity(0);
      if (!this._jumping) {
        (this.target as AnimatedSprite).url = "assets/boy/idle.json";
      }
    }
  }

  onCollisionStart(e: ICollision): void {
    if (this._dead) return;

    if (e.other.label === "ground" || e.other.label === "block") {
      this._jumping = false;
      (this.target as AnimatedSprite).url = "assets/boy/idle.json";
    } else if (e.other.label === "icon") {
      e.other.target.destroy();
    } else if (e.other.label === "spikes") {
      this._dead = true;
      (this.target as AnimatedSprite).url = "assets/boy/dead.json";
      this.target.on(EventType.ended, () => {
        (this.target as AnimatedSprite).stop();
      });
      console.log("game over");
    }
  }
}
