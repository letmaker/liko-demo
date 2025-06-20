import { RigidBody, Script, sound } from "liko";

export class HeroBullet extends Script {
  onAwake(): void {
    const rigidBody = new RigidBody({
      rigidType: "kinematic",
      linearVelocity: { x: 0, y: -6 },
      category: "heroBullet",
      categoryAccepted: ["enemy"],
    });
    this.target.addScript(rigidBody);
    sound.play("game2/声音/子弹.mp3");
  }

  onCollisionStart(): void {
    this.target.destroy();
  }
}
