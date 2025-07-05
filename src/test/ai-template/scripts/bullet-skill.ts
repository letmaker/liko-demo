import { type LikoNode, Point, register, RigidBody, Script, sound, Sprite } from "liko";

export class BulletSkill extends Script {
  private _fireTime = 0;

  // 子弹图片
  url = "game3/images/bullet.png";
  width = 10;
  height = 10;

  // 子弹速度
  speed = 10;
  fireRate = 3;
  fireRange = 300;

  onUpdate(delta: number): void {
    this._tryFire(delta);
  }

  private _tryFire(delta: number): void {
    this._fireTime += delta;
    if (this._fireTime > 1 / this.fireRate) {
      const monster = this._findClosestMonster();
      if (monster) {
        this._fireTime = 0;
        this._fireBullet(monster);
        sound.play("game3/sounds/bullet.mp3");
      }
    }
  }

  private _fireBullet(target: LikoNode): void {
    const bullet = new Sprite({
      url: this.url,
      width: this.width,
      height: this.height,
      position: this.target.position,
      parent: this.scene,
    });

    // 计算子弹方向
    const direction = Point.TEMP.copyFrom(target.position).sub(bullet.position).normalize();

    const rigidBody = new RigidBody({
      label: "bullet",
      rigidType: "kinematic",
      isSensor: true,
      category: "heroBullet",
      categoryAccepted: ["enemy"],
      linearVelocity: direction.multiply(this.speed),
      onCollisionStart: () => {
        bullet.destroy();
      },
    });

    bullet.addScript(rigidBody);
  }

  private _findClosestMonster(): LikoNode | undefined {
    const children = this.scene?.children;
    if (!children) return undefined;

    let closestMonster: LikoNode | undefined;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const child of children) {
      if (child.label === "monster") {
        const distance = Point.TEMP.copyFrom(child.position).distance(this.target.position);
        if (distance < this.fireRange && distance < closestDistance) {
          closestMonster = child;
          closestDistance = distance;
        }
      }
    }
    return closestMonster;
  }
}

register.regScript("scripts/bullet-skill.ts", BulletSkill);
