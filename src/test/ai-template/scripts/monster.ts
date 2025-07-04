import { Point, register, RigidBody, Script, type Sprite } from "liko";

export class Monster extends Script {
  speed = 100;

  private _hero?: Sprite;
  private _rigidBody?: RigidBody;

  onAwake(): void {
    // 添加刚体
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      category: "enemy",
    });
    this.target.addScript(this._rigidBody);

    this._hero = this.scene?.findChild<Sprite>({ label: "hero" });
  }

  onUpdate(delta: number): void {
    // 朝着主角移动
    const hero = this._hero;
    if (hero) {
      const direction = Point.TEMP.copyFrom(hero.position).sub(this.target.position);
      const speed = direction.normalize().multiply(this.speed * delta);
      this._rigidBody?.setLinearVelocity(speed.x, speed.y);
    }
  }

  onCollisionStart(): void {
    this.target.destroy();
  }
}

register.regScript("scripts/monster.ts", Monster);
