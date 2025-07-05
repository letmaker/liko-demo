import { type LikoNode, Point, register, RigidBody, Script, sound, Sprite } from "liko";

export class BulletSkill extends Script {
  private _lastFireTime = 0;

  // 子弹配置
  bulletImageUrl = "game3/images/bullet.png";
  bulletWidth = 10;
  bulletHeight = 10;

  // 射击配置
  bulletSpeed = 10;
  shotsPerSecond = 3;
  maxShootingDistance = 300;

  onUpdate(delta: number): void {
    this.updateShooting(delta);
  }

  updateShooting(delta: number): void {
    this._lastFireTime += delta;
    const fireInterval = 1 / this.shotsPerSecond;

    if (this._lastFireTime >= fireInterval) {
      const nearestEnemy = this.findNearestEnemy();
      if (nearestEnemy) {
        this._lastFireTime = 0;
        this.createAndFireBullet(nearestEnemy);
        sound.play("game3/sounds/bullet.mp3");
      }
    }
  }

  createAndFireBullet(target: LikoNode): void {
    const bullet = new Sprite({
      url: this.bulletImageUrl,
      width: this.bulletWidth,
      height: this.bulletHeight,
      position: this.target.position,
      parent: this.scene,
    });

    // 计算朝向目标的方向向量
    const directionToTarget = Point.TEMP.copyFrom(target.position).sub(bullet.position).normalize();

    const bulletPhysics = new RigidBody({
      label: "bullet",
      rigidType: "kinematic",
      isSensor: true,
      category: "heroBullet",
      categoryAccepted: ["enemy"],
      linearVelocity: directionToTarget.multiply(this.bulletSpeed),
      onCollisionStart: () => {
        bullet.destroy();
      },
    });

    bullet.addScript(bulletPhysics);
  }

  findNearestEnemy(): LikoNode | undefined {
    const sceneChildren = this.scene?.children;
    if (!sceneChildren) return undefined;

    let nearestEnemy: LikoNode | undefined;
    let shortestDistance = Number.POSITIVE_INFINITY;

    for (const child of sceneChildren) {
      if (child.label === "monster") {
        const distanceToEnemy = Point.TEMP.copyFrom(child.position).distance(this.target.position);
        if (distanceToEnemy < this.maxShootingDistance && distanceToEnemy < shortestDistance) {
          nearestEnemy = child;
          shortestDistance = distanceToEnemy;
        }
      }
    }
    return nearestEnemy;
  }
}

register.regScript("scripts/bullet-skill.ts", BulletSkill);
