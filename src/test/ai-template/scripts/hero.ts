import { type LikoNode, Point, register, RigidBody, Script, sound } from "liko";

export class Hero extends Script {
  private _fireTime = 0;
  private _rigidBody?: RigidBody;

  // 公有属性
  bulletLabel = "bullet";
  fireRate = 3;
  hp = 10;
  // 子弹速度，不要太快
  bulletSpeed = 10;
  attackRange = 200;

  onAwake(): void {
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      isSensor: true,
      category: "hero",
    });
    this.target.addScript(this._rigidBody);
  }

  onUpdate(delta: number): void {
    this._tryFire(delta);
  }

  private _tryFire(delta: number): void {
    this._fireTime += delta;
    if (this._fireTime > 1 / this.fireRate) {
      this._fireTime = 0;
      const monster = this._findMonster();
      if (monster) {
        this._fireBullet(monster);
      }
    }
  }

  private _fireBullet(target: LikoNode): void {
    const bulletClone = this.scene?.cloneNode({ label: this.bulletLabel });
    if (!bulletClone) return;

    bulletClone.position.set(this.target.position.x, this.target.position.y);
    const speed = Point.TEMP.copyFrom(target.position).sub(bulletClone.position).normalize().multiply(this.bulletSpeed);

    bulletClone.addScript(
      new RigidBody({
        rigidType: "kinematic",
        isSensor: true,
        category: "heroBullet",
        categoryAccepted: ["enemy"],
        linearVelocity: speed,
        onCollisionStart: () => {
          bulletClone?.destroy();
        },
      }),
    );
    this.scene?.addChild(bulletClone);
  }

  private _findMonster(): LikoNode | undefined {
    const children = this.scene?.children;
    if (!children) return undefined;

    for (const child of children) {
      if (child.label === "monster") {
        const distance = Point.TEMP.copyFrom(child.position).distance(this.target.position);
        if (distance < this.attackRange) {
          return child;
        }
      }
    }
    return undefined;
  }

  onSignal(signal: string, data: { tx: number; ty: number }): void {
    if (signal === "joystickMove") {
      this._rigidBody?.setLinearVelocity(data.tx, data.ty);
    }
  }

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this._die();
    }
  }

  private _die(): void {
    this.signal("heroDead", { dead: true });
    this.target.destroy();
    sound.play("game2/声音/失败.mp3");
  }
}

register.regScript("scripts/hero.ts", Hero);
