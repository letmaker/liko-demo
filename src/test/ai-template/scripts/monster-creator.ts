import { register, Script } from "liko";

export class MonsterCreator extends Script {
  private _elapsedTime = 0;
  private _isPaused = false;

  // 最大怪物数量，会被场景 Json 内配置覆盖
  maxMonsterCount = 10;
  // 怪物创建间隔（秒），会被场景 Json 内配置覆盖
  spawnInterval = 0.5;

  onUpdate(deltaTime: number): void {
    if (this._isPaused) return;

    this._elapsedTime += deltaTime;
    if (this._elapsedTime >= this.spawnInterval) {
      this._elapsedTime = 0;
      if (this.scene?.children.length && this.scene.children.length < this.maxMonsterCount) {
        this.spawnMonster();
      }
    }
  }

  onSignal(signal: string, data?: Record<string, any>): void {
    if (signal === "heroDead") {
      this._isPaused = data?.dead === true;
    }
  }

  spawnMonster(): void {
    const monster = this.scene?.cloneNode({ label: "monster" });
    const scene = this.scene;
    if (monster && scene) {
      monster.position.set(Math.random() * scene.width, Math.random() * scene.height);
      scene?.addChild(monster);
    }
  }
}

register.regScript("scripts/monster-creator.ts", MonsterCreator);
