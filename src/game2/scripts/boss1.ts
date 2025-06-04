import { RigidBody, Script, Tween, sound } from "liko";
import { EnemyBullet } from "./enemy-bullet";

export class Boss1 extends Script {
  hp = 20;

  bulletTimer = 0;
  bulletFireRate = 1;
  bulletCount = 8;
  bulletSpeed = 2;

  onAwake(): void {
    Tween.from({ target: this.target, duration: 1, props: { alpha: 0, position: { x: "+0", y: -100 } } })
      .onAllComplete(() => {
        const rigidBody = new RigidBody({
          rigidType: "dynamic",
          category: "enemy",
          categoryAccepted: ["heroBullet"],
          gravityScale: 0,
          isSensor: true,
        });
        this.target.addScript(rigidBody);
      })
      .play();
  }

  onUpdate(deltaTime: number): void {
    this.bulletTimer += deltaTime;
    if (this.bulletTimer >= 1 / this.bulletFireRate) {
      this._fireBullets();
      this.bulletTimer = 0;
    }
  }

  // 添加发射子弹的方法
  private _fireBullets(): void {
    for (let i = 0; i < this.bulletCount; i++) {
      const rotation = (i / this.bulletCount) * Math.PI * 2;
      const velocityX = Math.cos(rotation) * this.bulletSpeed;
      const velocityY = Math.sin(rotation) * this.bulletSpeed;

      const bullet = this.scene?.cloneNode({ label: "EnemyBullet" });
      if (bullet) {
        bullet.rotation = rotation + Math.PI / 2;
        bullet.position.set(
          this.target.position.x + this.target.width / 2,
          this.target.position.y + this.target.height / 2,
        );
        this.scene?.addChild(bullet);
        const enemyBullet = bullet.findScript<EnemyBullet>({ Class: EnemyBullet });
        if (enemyBullet) {
          enemyBullet.linearVelocity = { x: velocityX, y: velocityY };
        }
      }
    }
  }

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("bossDead");
      this.signal("scoreChanged", { score: 10 });
      this.target.destroy();
      sound.play("game2/声音/爆炸.mp3");
    }
  }
}
