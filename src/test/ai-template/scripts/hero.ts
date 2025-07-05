import { register, RigidBody, Script, sound } from "liko";

export class Hero extends Script {
  private _rigidBody?: RigidBody;

  // 公有属性，将来可以在编辑器内修改
  hp = 10;

  onAwake(): void {
    this._rigidBody = new RigidBody({
      label: "hero",
      rigidType: "dynamic",
      gravityScale: 0,
      isSensor: true,
      category: "hero",
      categoryAccepted: ["enemy"],
    });
    this.target.addScript(this._rigidBody);
  }

  onSignal(signal: string, data?: Record<string, any>): void {
    if (signal === "joystickMove") {
      this._rigidBody?.setLinearVelocity(data?.tx || 0, data?.ty || 0);
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
    sound.play("game3/sounds/fail.mp3");
    this.target.destroy();
  }
}

register.regScript("scripts/hero.ts", Hero);
