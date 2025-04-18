import { type INodeData, Script, type Text } from "liko";
import * as gameOverData from "../scene/game-over.json";

export class Scene1 extends Script {
  enemyCreateInterval = 2;
  enemyCreateTime = 0;

  bossCreateInterval = 15;
  bossCreateTime = 0;
  bossState = false;

  private _scoreText?: Text;
  private _score = 0;

  onAwake(): void {
    this._scoreText = this.target.getChild<Text>({ label: "score", deep: true });
  }

  onUpdate(delta: number): void {
    if (this.bossState === true) return;

    this.bossCreateTime += delta;
    if (this.bossCreateTime > this.bossCreateInterval) {
      this.bossState = true;
      this.bossCreateTime = 0;
      this.createBoss();
    }

    this.enemyCreateTime += delta;
    if (this.enemyCreateTime > this.enemyCreateInterval) {
      this.enemyCreateTime = 0;
      this.createEnemy();
    }
  }

  createEnemy() {
    const enemy = this.scene?.clone({ label: Math.random() > 0.35 ? "Enemy1" : "Enemy2" });
    if (enemy) {
      enemy.pos.set(Math.random() * (this.stage!.width - enemy.width), -enemy.height);
      this.scene?.addChild(enemy);
    }
  }

  createBoss() {
    const boss = this.scene?.clone({ label: "Boss1" });
    if (boss) {
      boss.pos.set((this.stage!.width - boss.width) / 2, 50);
      this.scene?.addChild(boss);
    }
  }

  onSignal(type: string, params?: Record<string, any>): void {
    if (type === "bossDead") {
      this.bossState = false;
    } else if (type === "heroDead") {
      this.stage?.store.set("score", this._score);
      this.stage?.createScene(gameOverData as INodeData);
    } else if (type === "scoreChanged") {
      this._score = this._score + (params?.score ?? 0);
      this._scoreText?.setText(`Score: ${this._score}`);
    }
  }
}
