import { RigidBody, Script, sound } from "liko";

export class Enemy1 extends Script {
  hp = 1;
  speed = 1;

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

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("scoreChanged", { score: 1 });
      this.target.destroy();
      sound.play("game2/声音/死亡1.mp3");
    }
  }
}
