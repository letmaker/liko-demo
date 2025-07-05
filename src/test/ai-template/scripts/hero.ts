import { register, RigidBody, Script, sound, type Sprite, Texture } from "liko";

export class Hero extends Script<Sprite> {
  private _rigidBody?: RigidBody;
  private _walkTextures?: [Texture, Texture];
  private _walkAnimationInterval?: number;
  private _currentWalkFrame = 0;
  private _isMoving = false;

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

    // 预加载行走动画纹理
    this.loadWalkTextures();
  }

  private async loadWalkTextures(): Promise<void> {
    const textureA = await Texture.createFromUrl("game3/images/hero_walk_a.png");
    const textureB = await Texture.createFromUrl("game3/images/hero_walk_b.png");

    if (textureA && textureB) {
      this._walkTextures = [textureA, textureB];
    }
  }

  onSignal(signal: string, data?: Record<string, any>): void {
    if (signal === "joystickMove") {
      const velocityX = data?.velocityX || 0;
      const velocityY = data?.velocityY || 0;
      this._rigidBody?.setLinearVelocity(velocityX, velocityY);
    } else if (signal === "startMove") {
      this.startWalkAnimation();
    } else if (signal === "stopMove") {
      this.stopWalkAnimation();
    }
  }

  private startWalkAnimation(): void {
    if (!this._walkTextures || this._isMoving) return;

    this._isMoving = true;
    this._currentWalkFrame = 0;

    // 帧率为 8，即每 125ms 切换一次
    this._walkAnimationInterval = setInterval(() => {
      if (this._walkTextures && this.target) {
        const sprite = this.target;
        sprite.texture = this._walkTextures[this._currentWalkFrame];
        this._currentWalkFrame = (this._currentWalkFrame + 1) % 2;
      }
    }, 125); // 1000ms / 8fps = 125ms
  }

  private stopWalkAnimation(): void {
    if (!this._isMoving) return;

    this._isMoving = false;

    if (this._walkAnimationInterval) {
      clearInterval(this._walkAnimationInterval);
      this._walkAnimationInterval = undefined;
    }

    // 停止时恢复到第一帧
    if (this._walkTextures && this.target) {
      const sprite = this.target;
      sprite.texture = this._walkTextures[0];
    }
  }

  onCollisionStart(): void {
    this.hp--;
    if (this.hp <= 0) {
      this.handleDeath();
    } else {
      this.showHitEffect();
    }
  }

  showHitEffect(): void {
    this.target.tintColor = "rgba(255, 0, 0, 0.5)";
    setTimeout(() => {
      if (this.target) {
        this.target.tintColor = "white";
      }
    }, 100);
  }

  handleDeath(): void {
    this.stopWalkAnimation();
    this.signal("heroDead", { dead: true });
    sound.play("game3/sounds/fail.mp3");
    this.target.destroy();
  }

  onDestroy(): void {
    this.stopWalkAnimation();
  }
}

register.regScript("scripts/hero.ts", Hero);
