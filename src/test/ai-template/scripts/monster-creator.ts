import { register, Script } from "liko";

export class MonsterCreator extends Script {
  maxMonster = 10;
  createInterval = 0.5;

  private _createTime = 0;
  private _stop = false;

  onAwake(): void {
    console.log("MonsterCreator");
  }

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

  onSignal(signal: string, data?: Record<string, unknown>): void {
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
