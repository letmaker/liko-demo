import {
  Point,
  register,
  RigidBody,
  Script,
  ParticleSystem,
  type Sprite,
  type ICollision,
  loader,
  type Texture,
} from "liko";

export class Monster extends Script {
  private _hero?: Sprite;
  private _rigidBody?: RigidBody;
  private _explosionTexture?: Texture;

  moveSpeed = 100;
  hp = 2;

  hitEffectDuration = 100;
  explosionDuration = 300;

  onAwake() {
    this.setupRigidBody();
    this.findHero();
    this.loadExplosionTexture();
  }

  setupRigidBody(): void {
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      category: "enemy",
      categoryAccepted: ["heroBullet", "hero"],
    });
    this.target.addScript(this._rigidBody);
  }

  findHero(): void {
    this._hero = this.scene?.findChild<Sprite>({ label: "hero" });
  }

  async loadExplosionTexture(): Promise<void> {
    this._explosionTexture = await loader.load<Texture>("game3/images/fire.png");
  }

  onUpdate(delta: number): void {
    this.moveTowardsHero(delta);
  }

  moveTowardsHero(delta: number): void {
    if (!this._hero || !this._rigidBody) return;

    const direction = Point.TEMP.copyFrom(this._hero.position).sub(this.target.position);
    const velocity = direction.normalize().multiply(this.moveSpeed * delta);
    this._rigidBody.setLinearVelocity(velocity.x, velocity.y);
  }

  onCollisionStart(collision: ICollision): void {
    if (collision.other?.label === "bullet") {
      this.handleBulletHit();
    }
  }

  handleBulletHit(): void {
    this.hp--;
    this.showHitEffect();

    if (this.hp <= 0) {
      this.die();
    }
  }

  showHitEffect(): void {
    this.target.tintColor = "rgba(255, 0, 0, 0.5)";
    setTimeout(() => {
      if (this.target) {
        this.target.tintColor = "white";
      }
    }, this.hitEffectDuration);
  }

  die() {
    this.createExplosionEffect();
    this.target.destroy();
  }

  createExplosionEffect() {
    const explosionParticles = new ParticleSystem({
      parent: this.scene,
      position: { x: this.target.position.x, y: this.target.position.y },
      texture: this._explosionTexture, // 根据需要，可以指定粒子纹理，不指定默认为白色方块纹理
      config: {
        // 重力设置
        gravityX: 0,
        gravityY: 50,

        // 发射角度设置 - 全方向发射
        angle: 0,
        angleVariance: 360,

        // 颜色设置 - 从红色到橙色
        startColor: { r: 1.0, g: 0.2, b: 0.0, a: 1.0 },
        finishColor: { r: 1.0, g: 0.8, b: 0.0, a: 0.0 },

        // 粒子大小设置
        startParticleSize: 8,
        finishParticleSize: 2,

        // 发射速率
        emissionRate: 150,

        // 粒子生命周期设置
        particleLifespan: 1.0,
        particleLifespanVariance: 0.3,

        // 初始速度
        speed: 80,
        speedVariance: 40,
      },
    });

    explosionParticles.play();

    // 0.5秒后清理粒子系统
    setTimeout(() => {
      explosionParticles.stop();
      explosionParticles.removeSelf();
    }, this.explosionDuration);
  }
}

register.regScript("scripts/monster.ts", Monster);
