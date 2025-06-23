import { RigidBody, Script, sound } from "liko";

// 敌人脚本，用于控制敌人的行为
export class Enemy1 extends Script {
  // 血量，会在属性面板中显示
  hp = 1;
  // 速度，会在属性面板中显示
  speed = 1;

  onAwake(): void {
    // 添加刚体组件，用于控制敌人的运动
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

  // 碰撞后减少血量
  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("scoreChanged", { score: 1 });
      this.target.destroy();
      sound.play("game2/声音/死亡1.mp3");
    }
  }
}
