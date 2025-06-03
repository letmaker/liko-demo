import { type LikoPointerEvent, RigidBody, Script, sound } from "liko";

export class Hero extends Script {
  private _selected = false;
  private _fireTime = 0;
  private _rigidBody?: RigidBody;

  bulletId = "100";
  fireRate = 3;
  hp = 1;

  onAwake(): void {
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      isSensor: true,
      category: "hero",
      categoryAccepted: ["enemy", "enemyBullet"],
    });
    this.target.addScript(this._rigidBody);
  }

  onUpdate(delta: number): void {
    this._fireTime += delta;
    if (this._fireTime > 1 / this.fireRate) {
      this._fireTime = 0;
      const bulletClone = this.scene?.cloneNode({ id: this.bulletId });
      if (bulletClone) {
        bulletClone.position.set(this.target.position.x, this.target.position.y - 80);
        this.scene?.addChild(bulletClone);
      }
    }
  }

  onPointerDown(): void {
    this._selected = true;
  }

  onStagePointerMove(e: LikoPointerEvent): void {
    if (!this._selected) return;
    this._rigidBody?.setPosition(e.pointer.x - this.target.width / 2, e.pointer.y - this.target.height / 2);
  }

  onStagePointerUp(): void {
    this._selected = false;
  }

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("heroDead");
      this.target.destroy();
      sound.play("game2/声音/失败.mp3");
    }
  }
}
