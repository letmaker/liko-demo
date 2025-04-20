import {
  Ease,
  EventType,
  loader,
  RigidBody,
  SpriteAnimation,
  Tween,
  type LikoNode,
  type ICollision,
  Script,
} from "liko";

/**
 * 敌人生成器脚本
 * 负责定时创建敌人、处理碰撞逻辑和生成特效
 */
export class EnemyCreator extends Script {
  /** 敌人生成器的生命值 */
  hp = 100;

  /**
   * 脚本唤醒时调用
   * 设置定时器，每2秒创建一个敌人
   */
  onAwake(): void {
    setInterval(() => this._createEnemy(), 2000);
  }

  /**
   * 创建敌人实例
   * 通过克隆预设的敌人模板并设置初始位置和速度
   */
  private _createEnemy() {
    // 克隆指定ID的敌人模板
    const enemy = this.scene?.clone({ id: "1710672389604283" });
    if (enemy) {
      // 设置敌人初始位置为生成器的位置
      enemy.pos.x = this.target.pos.x;
      // 获取敌人的刚体组件
      const rigidBody = enemy.findScript<RigidBody>({ Class: RigidBody });
      // 设置敌人向左移动的随机速度
      if (rigidBody) rigidBody.linearVelocity.x = -0.5 * Math.random() - 0.5;
      // 将敌人添加到场景中
      this.scene?.addChild(enemy);
    }
  }

  /**
   * 碰撞开始时的回调函数
   * 处理子弹碰撞敌人生成器的逻辑
   * @param e 碰撞事件数据
   */
  async onCollisionStart(e: ICollision): Promise<void> {
    const bullet = e.other.target as LikoNode;
    // 如果碰撞物体不是子弹，则忽略
    if (bullet.label !== "bullet") return;
    // 销毁子弹
    bullet.destroy();

    // 在子弹位置创建命中特效
    this._createHitBoom(this.scene!, bullet.pos.x + 20, bullet.pos.y - 30);

    // 敌人生成器受击时闪红色
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

    // 如果生命值归零，创建死亡爆炸特效并销毁生成器
    if (this.hp <= 0) {
      this._createDieBoom(this.scene!, this.target.pos.x, this.target.pos.y);
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
    const sheet = new SpriteAnimation(textures);
    sheet.label = "boom_green";
    sheet.pos.set(x, y);
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
    const sheet = new SpriteAnimation(textures);
    sheet.label = "boom_bullet";
    sheet.pos.set(x, y);
    parent.addChild(sheet);

    // 播放爆炸动画
    sheet.play();

    // 动画播放完毕后销毁
    sheet.on(EventType.ended, () => {
      sheet.destroy();
    });
  }
}
