import { type ICollision, RigidBody, Script } from "liko";

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

  onCollisionStart(e: ICollision): void {
    this.target.destroy();
  }
}
