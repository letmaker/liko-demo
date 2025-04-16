import { type ICollision, type MouseEvent, RigidBody, Script, sound } from "liko";

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
      const bulletClone = this.scene?.clone({ id: this.bulletId });
      if (bulletClone) {
        bulletClone.pos.set(this.target.pos.x + this.target.width / 2, this.target.pos.y - 20);
        this.scene?.addChild(bulletClone);
      }
    }
  }

  onMouseDown(e: MouseEvent): void {
    this._selected = true;
  }

  onStageMouseMove(e: MouseEvent): void {
    if (!this._selected) return;
    this._rigidBody?.setPosition(e.mouse.x - this.target.width / 2, e.mouse.y - this.target.height / 2);
  }

  onStageMouseUp(e: MouseEvent): void {
    this._selected = false;
  }

  onCollisionStart(e: ICollision): void {
    this.hp--;
    if (this.hp <= 0) {
      this.signal("heroDead");
      this.target.destroy();
      sound.play("game2/声音/失败.mp3");
    }
  }
}
