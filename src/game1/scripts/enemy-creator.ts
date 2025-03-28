import { Ease, EventType, loader, RigidBody, ScriptBlock, SpriteAnimation, Tween, Node, ICollision } from 'liko';

export class EnemyCreator extends ScriptBlock {
  hp = 100;
  onAwake(): void {
    setInterval(() => this._createEnemy(), 2000);
  }

  private _createEnemy() {
    const enemy = this.scene?.clone('1710672389604283');
    if (enemy) {
      enemy.pos.x = this.target.pos.x;
      const rigidBody = enemy.getScript(RigidBody);
      if (rigidBody) rigidBody.linearVelocity.x = -0.5 * Math.random() - 0.5;
      this.scene?.addChild(enemy);
    }
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
