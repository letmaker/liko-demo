import { type LikoNode, type LikoPointerEvent, Point, register, RigidBody, Script, sound } from "liko";

export class Hero extends Script {
  // 私有属性
  private _selected = false;
  private _fireTime = 0;
  private _rigidBody?: RigidBody;

  bulletLabel = "bullet";
  // 公有属性，将来可以在编辑器内修改
  fireRate = 3;
  hp = 1;
  bulletSpeed = 10;
  attackRange = 200;

  onAwake(): void {
    // 激活时添加刚体
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      isSensor: true,
      category: "hero",
    });
    this.target.addScript(this._rigidBody);
  }

  onUpdate(delta: number): void {
    // 发射子弹
    this._fireTime += delta;
    if (this._fireTime > 1 / this.fireRate) {
      this._fireTime = 0;
      const monster = this._findMonster();
      if (!monster) return;

      const bulletClone = this.scene?.cloneNode({ label: this.bulletLabel });
      if (bulletClone) {
        bulletClone.position.set(this.target.position.x, this.target.position.y);
        const speed = Point.TEMP.copyFrom(monster.position)
          .sub(bulletClone.position)
          .normalize()
          .multiply(this.bulletSpeed);
        bulletClone.addScript(
          new RigidBody({
            rigidType: "kinematic",
            isSensor: true,
            category: "heroBullet",
            categoryAccepted: ["enemy"],
            linearVelocity: speed,
            onCollisionStart: () => {
              bulletClone?.destroy();
            },
          }),
        );
        this.scene?.addChild(bulletClone);
      }
    }
  }

  private _findMonster(): LikoNode | undefined {
    const children = this.scene?.children;
    if (children) {
      for (const child of children) {
        if (child.label === "monster") {
          const distance = Point.TEMP.copyFrom(child.position).distance(this.target.position);
          if (distance < this.attackRange) {
            return child;
          }
        }
      }
    }
    return undefined;
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
    // 碰撞检测
    this.hp--;
    if (this.hp <= 0) {
      this._selected = false;
      // 发射英雄死亡信号，同一个场景下的所有脚本都能收到这个信号
      this.signal("heroDead", { dead: true });
      // 销毁英雄
      this.target.destroy();
      // 播放失败音效
      sound.play("game2/声音/失败.mp3");
    }
  }
}

// 注册英雄脚本
register.regScript("scripts/hero.ts", Hero);
