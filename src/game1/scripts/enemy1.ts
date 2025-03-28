import {
  Ease,
  EventType,
  loader,
  RigidBody,
  ScriptBlock,
  Sprite,
  SpriteAnimation,
  Tween,
  Node,
  ICollision,
} from 'liko';

export class Enemy1 extends ScriptBlock {
  private _nextAttackTime = 0;
  private _rigidBody?: RigidBody;
  hero?: Node;
  hp = 50;
  attackInterval = 1;
  speed = -1;

  onAwake(): void {
    if (this.target instanceof SpriteAnimation) {
      this.target.play();
    }
    this.hero = this.scene?.getChild('hero');
    this._rigidBody = this.target.getScript(RigidBody);
    this.speed = this._rigidBody?.linearVelocity.x ?? -1;
  }

  onUpdate(time: number): void {
    if (this.hero && !this.hero.destroyed) {
      const distance = this.target.pos.x - this.hero.pos.x;
      if (distance > 0 && distance < 100) {
        this._rigidBody?.setVelocity(0, 0);
        if (time > this._nextAttackTime) {
          this._nextAttackTime = time + this.attackInterval;
          this._createBullet();
        }
      } else {
        this._rigidBody?.setVelocity(this.speed, 0);
      }
    }
  }

  private async _createBullet() {
    const pos = { x: 0, y: this.target.height / 3 };
    this.target.toWorldPoint(pos, pos, this.scene);
    const texture = await loader.load('game1/assets/hero/bullet.png');

    const bullet = new Sprite();
    bullet.label = 'bullet';
    bullet.texture = texture;
    bullet.pivot.set(texture.width / 2, texture.height / 2);
    bullet.pos.set(pos.x, pos.y);
    bullet.scale.x = -1;
    this.scene!.addChild(bullet);

    const boxRigid = new RigidBody();
    boxRigid.label = bullet.label;
    boxRigid.rigidType = 'dynamic';
    boxRigid.gravityScale = 0;
    boxRigid.category = '敌人子弹';
    boxRigid.shapes = [{ shapeType: 'box', isSensor: true }];
    boxRigid.setVelocity(-5, 0);
    bullet.addScript(boxRigid);

    setTimeout(() => {
      bullet.destroy();
    }, 500);
  }

  async onCollisionStart(e: ICollision): Promise<void> {
    const bullet = e.other.target as Node;
    if (bullet.label !== 'bullet') return;
    bullet.destroy();

    this._createHitBoom(this.scene!, bullet.pos.x + 20, bullet.pos.y - 30);

    await Tween.to({
      target: this.target,
      props: { tint: 0xff0000 },
      duration: 0.1,
      ease: Ease.QuartOut,
    }).play();
    this.target.tint = 0xffffff;

    this.hp--;

    if (this.hp <= 0) {
      this._createDieBoom(this.scene!, this.target.pos.x, this.target.pos.y);
      this.target.destroy();
    }
  }

  private async _createDieBoom(parent: Node, x: number, y: number) {
    const textures = await loader.load('game1/assets/hero/boom_green.atlas');

    const sheet = new SpriteAnimation(textures);
    sheet.label = 'boom_green';
    sheet.pos.set(x, y);
    parent.addChild(sheet);
    sheet.play();
    sheet.on(EventType.ended, () => {
      sheet.destroy();
    });
  }

  private async _createHitBoom(parent: Node, x: number, y: number) {
    const textures = await loader.load('game1/assets/hero/boom_bullet.atlas');
    if (!this.target || this.target.destroyed) return;

    const sheet = new SpriteAnimation(textures);
    sheet.label = 'boom_bullet';
    sheet.pos.set(x, y);
    parent.addChild(sheet);
    sheet.play();
    sheet.on(EventType.ended, () => {
      sheet.destroy();
    });
  }
}
