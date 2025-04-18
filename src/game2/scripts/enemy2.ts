import { RigidBody, Script, sound } from "liko";
import { EnemyBullet } from "./enemy-bullet";

export class Enemy2 extends Script {
  hp = 2;
  speed = 1;

  bulletTimer = 0;
  bulletFireRate = 0.5;
  bulletSpeed = 2;

  onAwake(): void {
    const rigidBody = new RigidBody({
      rigidType: "dynamic",
      linearVelocity: { x: 0, y: this.speed },
      category: "enemy",
      categoryAccepted: ["heroBullet"],
      gravityScale: 0,
      isSensor: true,
    });
    this.target.addScript(rigidBody);
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
    const bullet = this.scene?.clone({ label: "EnemyBullet" });
    if (bullet) {
      bullet.pos.set(this.target.pos.x + this.target.width / 2, this.target.pos.y + this.target.height);
      this.scene?.addChild(bullet);
      const enemyBullet = bullet.getScript<EnemyBullet>({ Class: EnemyBullet });
      if (enemyBullet) {
        enemyBullet.linearVelocity = { x: 0, y: this.bulletSpeed };
      }
    }
  }

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("scoreChanged", { score: 2 });
      this.target.destroy();
      sound.play("game2/声音/死亡2.mp3");
    }
  }
}
