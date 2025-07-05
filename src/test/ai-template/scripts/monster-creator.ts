import { register, Script } from "liko";

export class MonsterCreator extends Script {
  private _createTime = 0;
  private _stop = false;

  // 最大怪物数量，会被场景 Json 内配置覆盖
  maxMonster = 10;
  // 怪物创建间隔，会被场景 Json 内配置覆盖
  createInterval = 0.5;

  onUpdate(delta: number): void {
    if (this._stop) return;

    this._createTime += delta;
    if (this._createTime > this.createInterval) {
      this._createTime = 0;
      if (this.scene?.children.length && this.scene.children.length < this.maxMonster) {
        this.createMonster();
      }
    }
  }

  onSignal(signal: string, data?: Record<string, any>): void {
    if (signal === "heroDead") {
      this._stop = data?.dead === true;
    }
  }

  createMonster(): void {
    const monster = this.scene?.cloneNode({ label: "monster" });
    const scene = this.scene;
    if (monster && scene) {
      monster.position.set(Math.random() * scene.width, Math.random() * scene.height);
      scene?.addChild(monster);
    }
  }
}

register.regScript("scripts/monster-creator.ts", MonsterCreator);
