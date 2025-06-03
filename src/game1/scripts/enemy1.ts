import {
  Ease,
  EventType,
  loader,
  RigidBody,
  Sprite,
  AnimatedSprite,
  Tween,
  type Texture,
  type LikoNode,
  type ICollision,
  Script,
} from "liko";

/**
 * 敌人类型1脚本
 * 实现敌人的移动、攻击、受伤和死亡逻辑
 */
export class Enemy1 extends Script {
  /** 下一次攻击的时间戳 */
  private _nextAttackTime = 0;
  /** 敌人的刚体组件引用 */
  private _rigidBody?: RigidBody;
  /** 英雄角色的引用 */
  hero?: LikoNode;
  /** 敌人生命值 */
  hp = 50;
  /** 攻击间隔(秒) */
  attackInterval = 1;
  /** 移动速度 */
  speed = -1;

  /**
   * 脚本唤醒时调用
   * 初始化敌人状态、获取必要引用
   */
  onAwake(): void {
    // 如果目标是动画精灵，开始播放动画
    if (this.target instanceof AnimatedSprite) {
      this.target.play();
    }
    // 获取场景中的英雄角色
    this.hero = this.scene?.findChild({ label: "hero" });
    // 获取刚体组件
    this._rigidBody = this.target.findScript({ Class: RigidBody });
    // 初始化移动速度
    this.speed = this._rigidBody?.linearVelocity.x ?? -1;
  }

  /**
   * 每帧更新时调用
   * 处理敌人的移动和攻击逻辑
   * @param time 当前时间戳
   */
  onUpdate(time: number): void {
    if (this.hero && !this.hero.destroyed) {
      // 计算与英雄的距离
      const distance = this.target.position.x - this.hero.position.x;
      // 当距离适中时停止移动并攻击
      if (distance > 0 && distance < 100) {
        // 停止移动
        this._rigidBody?.setLinearVelocity(0, 0);
        // 检查是否可以攻击
        if (time > this._nextAttackTime) {
          // 设置下次攻击时间
          this._nextAttackTime = time + this.attackInterval;
          // 创建子弹进行攻击
          this._createBullet();
        }
      } else {
        // 继续向左移动
        this._rigidBody?.setLinearVelocity(this.speed, 0);
      }
    }
  }

  /**
   * 创建敌人子弹
   * 生成子弹精灵并设置物理属性
   */
  private async _createBullet() {
    // 计算子弹生成位置
    const position = { x: 0, y: this.target.height / 3 };
    this.target.localToWorld(position, position, this.scene);
    // 加载子弹纹理
    const texture = await loader.load<Texture>("game1/assets/hero/bullet.png");
    if (!texture) return;

    // 创建子弹精灵
    const bullet = new Sprite();
    bullet.label = "bullet";
    bullet.texture = texture;
    bullet.anchor.set(0.5, 0.5);
    bullet.position.set(position.x, position.y);

    // 水平翻转子弹，使其朝向左侧
    bullet.scale.x = -1;
    this.scene!.addChild(bullet);

    // 为子弹添加刚体组件
    const boxRigid = new RigidBody();
    boxRigid.label = bullet.label;
    boxRigid.rigidType = "dynamic";
    boxRigid.gravityScale = 0;
    boxRigid.category = "敌人子弹";
    boxRigid.shapes = [{ shapeType: "box", isSensor: true }];

    // 设置子弹向左飞行
    boxRigid.setLinearVelocity(-5, 0);
    bullet.addScript(boxRigid);

    // 设置子弹自动销毁定时器
    setTimeout(() => {
      bullet.destroy();
    }, 500);
  }

  /**
   * 碰撞开始时的回调函数
   * 处理敌人被子弹击中的逻辑
   * @param e 碰撞事件数据
   */
  async onCollisionStart(e: ICollision): Promise<void> {
    const bullet = e.other.target as LikoNode;
    // 如果碰撞物体不是子弹，则忽略
    if (bullet.label !== "bullet") return;
    // 销毁子弹
    bullet.destroy();

    // 在子弹位置创建命中特效
    this._createHitBoom(this.scene!, bullet.position.x + 20, bullet.position.y - 30);

    // 敌人受击时闪红色
    await Tween.to({
      target: this.target,
      props: { tintColor: 0xff0000 },
      duration: 0.1,
      ease: Ease.QuartOut,
    }).play();
    // 恢复正常颜色
    this.target.tintColor = 0xffffff;

    // 减少生命值
    this.hp--;

    // 如果生命值归零，创建死亡爆炸特效并销毁敌人
    if (this.hp <= 0) {
      this._createDieBoom(this.scene!, this.target.position.x, this.target.position.y);
      this.target.destroy();
    }
  }

  /**
   * 创建死亡爆炸特效
   * @param parent 特效的父节点
   * @param x 特效的X坐标
   * @param y 特效的Y坐标
   */
  private async _createDieBoom(parent: LikoNode, x: number, y: number) {
    // 加载绿色爆炸动画资源
    const textures = await loader.load("game1/assets/hero/boom_green.atlas");
    if (!textures) return;

    // 创建爆炸动画
    const sheet = new AnimatedSprite(textures);
    sheet.label = "boom_green";
    sheet.position.set(x, y);
    parent.addChild(sheet);
    // 播放爆炸动画
    sheet.play();
    // 动画播放完毕后销毁
    sheet.on(EventType.ended, () => {
      sheet.destroy();
    });
  }

  /**
   * 创建子弹命中特效
   * @param parent 特效的父节点
   * @param x 特效的X坐标
   * @param y 特效的Y坐标
   */
  private async _createHitBoom(parent: LikoNode, x: number, y: number) {
    // 加载子弹爆炸动画资源
    const textures = await loader.load("game1/assets/hero/boom_bullet.atlas");
    // 如果目标已被销毁，则不创建特效
    if (!this.target || this.target.destroyed || !textures) return;

    // 创建爆炸动画
    const sheet = new AnimatedSprite(textures);
    sheet.label = "boom_bullet";
    sheet.position.set(x, y);
    parent.addChild(sheet);
    // 播放爆炸动画
    sheet.play();
    // 动画播放完毕后销毁
    sheet.on(EventType.ended, () => {
      sheet.destroy();
    });
  }
}
