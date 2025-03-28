import { Ease, loader, Point, RigidBody, ScriptBlock, Sprite, SpriteAnimation, Tween, Node, ICollision } from 'liko';

export class Hero extends ScriptBlock {
  hp = 20;
  head?: Node;
  body?: SpriteAnimation;
  gun?: SpriteAnimation;
  rotation = 0;
  bulletPos = new Point();
  rigidBody?: RigidBody;

  onAwake(): void {
    this.head = this.target.getChild('head');
    this.body = this.target.getChild('body') as SpriteAnimation;
    this.gun = this.target.getChild('gun') as SpriteAnimation;
    this.rigidBody = this.target.getScript(RigidBody);

    if (this.gun) {
      this.gun.play();
      setInterval(() => {
        this._createBullet();
      }, 200);
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.destroyed) return;
    if (!this.rigidBody || !this.body) return;

    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.rigidBody.linearVelocity = { x: 2, y: 0 };
      this.target.scale.x = Math.abs(this.target.scale.x);
      this.body.play();
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.rigidBody.linearVelocity = { x: -2, y: 0 };
      this.target.scale.x = Math.abs(this.target.scale.x) * -1;
      this.body.play();
    }
  }

  onKeyUp(e: KeyboardEvent): void {
    if (this.destroyed) return;
    if (!this.rigidBody || !this.body) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'd') {
      this.rigidBody.linearVelocity = { x: 0, y: 0 };
      this.body.stop();
      this.body.frame = 0;
    }
  }

  private async _createBullet() {
    if (this.destroyed) return;

    const pos = this.gun!.toWorldPoint(this.bulletPos.set(50, 10), this.bulletPos, this.scene);
    const texture = await loader.load('game1/assets/hero/bullet.png');

    const bullet = new Sprite();
    bullet.label = 'bullet';
    bullet.texture = texture;
    bullet.pivot.set(0, texture.height / 2);
    bullet.pos.set(pos.x, pos.y + texture.height / 2);
    this.scene!.addChild(bullet);

    const boxRigid = new RigidBody();
    boxRigid.label = bullet.label;
    boxRigid.rigidType = 'dynamic';
    boxRigid.gravityScale = 0;
    boxRigid.category = '子弹';
    boxRigid.shapes = [{ shapeType: 'box', isSensor: true }];
    boxRigid.setVelocity(Math.sign(this.target.scale.x) * 10, 0);
    bullet.addScript(boxRigid);

    setTimeout(() => {
      bullet.destroy();
    }, 500);
  }

  async onCollisionStart(e: ICollision): Promise<void> {
    const bullet = e.other.target as Node;
    if (bullet.label !== 'bullet') return;
    bullet.destroy();

    this.target.alpha = 1;
    await Tween.to({
      target: this.target,
      props: { alpha: 0.9 },
      duration: 0.1,
      ease: Ease.QuartOut,
    }).play();
    this.target.alpha = 1;

    this.hp--;
    console.log('hero hp', this.hp);

    if (this.hp <= 0) {
      this.target.destroy();
      console.log('game over');
    }
  }
}
