import { RigidBody, Script } from "liko";

export class EnemyBullet extends Script {
  linearVelocity = { x: 0, y: 0 };

  onAwake(): void {
    const rigidBody = new RigidBody({
      rigidType: "kinematic",
      linearVelocity: this.linearVelocity,
      category: "enemyBullet",
      categoryAccepted: ["hero"],
    });
    this.target.addScript(rigidBody);
  }

  onCollisionStart(): void {
    debugger;
    this.target.destroy();
  }
}
