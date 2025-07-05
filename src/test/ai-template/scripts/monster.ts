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
  private _fireTexture?: Texture;

  speed = 100;
  hp = 2;

  async onAwake(): Promise<void> {
    // 添加刚体
    this._rigidBody = new RigidBody({
      rigidType: "dynamic",
      gravityScale: 0,
      category: "enemy",
      categoryAccepted: ["heroBullet", "hero"],
    });
    this.target.addScript(this._rigidBody);

    this._hero = this.scene?.findChild<Sprite>({ label: "hero" });
    // 预加载粒子纹理，避免在创建粒子系统时加载
    this._fireTexture = await loader.load<Texture>("game3/images/fire.png");
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

  onCollisionStart(e: ICollision): void {
    // 检查碰撞对象
    const other = e.other;
    if (other?.label === "bullet") {
      this.hp--;
      if (this.hp <= 0) {
        this.createDeathParticleEffect();
        this.target.destroy();
      }
    }
  }

  private async createDeathParticleEffect(): Promise<void> {
    // 创建爆炸粒子系统
    const deathParticle = new ParticleSystem({
      parent: this.scene,
      position: { x: this.target.position.x, y: this.target.position.y },
      texture: this._fireTexture, // 根据需要，可以指定粒子纹理，不指定默认为白色方块纹理
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

    deathParticle.play();

    // 0.5秒后清理粒子系统
    setTimeout(() => {
      deathParticle.stop();
      deathParticle.removeSelf();
    }, 300);
  }
}

register.regScript("scripts/monster.ts", Monster);
