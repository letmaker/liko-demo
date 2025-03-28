import { Ease, loader, Point, RigidBody, ScriptBlock, Sprite, SpriteAnimation, Tween, Node, ICollision } from 'liko';

/**
 * 英雄角色脚本
 * 实现玩家控制的角色移动、射击和受伤逻辑
 */
export class Hero extends ScriptBlock {
  /** 英雄生命值 */
  hp = 20;
  /** 英雄头部节点引用 */
  head?: Node;
  /** 英雄身体动画引用 */
  body?: SpriteAnimation;
  /** 英雄武器动画引用 */
  gun?: SpriteAnimation;
  /** 旋转角度 */
  rotation = 0;
  /** 子弹发射位置 */
  bulletPos = new Point();
  /** 刚体组件引用 */
  rigidBody?: RigidBody;

  /**
   * 脚本唤醒时调用
   * 初始化英雄组件引用并设置自动射击
   */
  onAwake(): void {
    // 获取各个子节点引用
    this.head = this.target.getChild('head');
    this.body = this.target.getChild('body') as SpriteAnimation;
    this.gun = this.target.getChild('gun') as SpriteAnimation;
    // 获取刚体组件
    this.rigidBody = this.target.getScript(RigidBody);

    if (this.gun) {
      // 播放武器动画
      this.gun.play();
      // 设置定时器，每200毫秒发射一次子弹
      setInterval(() => {
        this._createBullet();
      }, 200);
    }
  }

  /**
   * 键盘按下事件处理
   * 控制英雄移动
   * @param e 键盘事件
   */
  onKeyDown(e: KeyboardEvent): void {
    // 如果已销毁则忽略输入
    if (this.destroyed) return;
    if (!this.rigidBody || !this.body) return;

    // 向右移动
    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.rigidBody.linearVelocity = { x: 2, y: 0 };
      // 设置朝向为右
      this.target.scale.x = Math.abs(this.target.scale.x);
      // 播放行走动画
      this.body.play();
    }
    // 向左移动
    else if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.rigidBody.linearVelocity = { x: -2, y: 0 };
      // 设置朝向为左
      this.target.scale.x = Math.abs(this.target.scale.x) * -1;
      // 播放行走动画
      this.body.play();
    }
  }

  /**
   * 键盘释放事件处理
   * 停止英雄移动
   * @param e 键盘事件
   */
  onKeyUp(e: KeyboardEvent): void {
    // 如果已销毁则忽略输入
    if (this.destroyed) return;
    if (!this.rigidBody || !this.body) return;

    // 停止左右移动
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'd') {
      // 停止移动
      this.rigidBody.linearVelocity = { x: 0, y: 0 };
      // 停止行走动画并重置到第一帧
      this.body.stop();
      this.body.frame = 0;
    }
  }

  /**
   * 创建子弹
   * 生成子弹精灵并设置物理属性
   */
  private async _createBullet() {
    if (this.destroyed) return;

    // 计算子弹生成位置，从枪口发射
    const pos = this.gun!.toWorldPoint(this.bulletPos.set(50, 10), this.bulletPos, this.scene);
    // 加载子弹纹理
    const texture = await loader.load('game1/assets/hero/bullet.png');

    // 创建子弹精灵
    const bullet = new Sprite();
    bullet.label = 'bullet';
    bullet.texture = texture;
    bullet.pivot.set(0, texture.height / 2);
    bullet.pos.set(pos.x, pos.y + texture.height / 2);
    this.scene!.addChild(bullet);

    // 为子弹添加刚体组件
    const boxRigid = new RigidBody();
    boxRigid.label = bullet.label;
    boxRigid.rigidType = 'dynamic';
    boxRigid.gravityScale = 0;
    boxRigid.category = '子弹';
    boxRigid.shapes = [{ shapeType: 'box', isSensor: true }];
    // 根据角色朝向设置子弹飞行方向
    boxRigid.setVelocity(Math.sign(this.target.scale.x) * 10, 0);
    bullet.addScript(boxRigid);

    // 设置子弹自动销毁定时器
    setTimeout(() => {
      bullet.destroy();
    }, 500);
  }

  /**
   * 碰撞开始时的回调函数
   * 处理英雄被敌人子弹击中的逻辑
   * @param e 碰撞事件数据
   */
  async onCollisionStart(e: ICollision): Promise<void> {
    const bullet = e.other.target as Node;
    // 如果碰撞物体不是子弹，则忽略
    if (bullet.label !== 'bullet') return;
    // 销毁子弹
    bullet.destroy();

    // 英雄受击时闪烁效果
    this.target.alpha = 1;
    await Tween.to({
      target: this.target,
      props: { alpha: 0.9 },
      duration: 0.1,
      ease: Ease.QuartOut,
    }).play();
    this.target.alpha = 1;

    // 减少生命值
    this.hp--;
    console.log('hero hp', this.hp);

    // 如果生命值归零，销毁英雄并结束游戏
    if (this.hp <= 0) {
      this.target.destroy();
      console.log('game over');
    }
  }
}
