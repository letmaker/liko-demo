import { App, regScript, Scene, type INodeData, physics, Rectangle } from "../../../liko/src";
import { Enemy1 } from "./scripts/enemy1";
import { Hero } from "./scripts/hero";
import { HeroBullet } from "./scripts/hero-bullet";
import * as scene1Data from "./scene/scene1.json";
import { Scene1 } from "./scripts/scene1";
import { Boss1 } from "./scripts/boss1";
import { Enemy2 } from "./scripts/enemy2";
import { EnemyBullet } from "./scripts/enemy-bullet";
import { GameOver } from "./scripts/game-over";

async function game() {
  const app = new App();
  await app.init({ width: 480, height: 700 });

  physics.enable();
  physics.setBoundaryArea(new Rectangle(0, 0, 480, 700).pad(500));
  physics.debug();

  regScript("Enemy1", Enemy1);
  regScript("Enemy2", Enemy2);
  regScript("Boss1", Boss1);
  regScript("EnemyBullet", EnemyBullet);

  regScript("Hero", Hero);
  regScript("HeroBullet", HeroBullet);

  regScript("Scene1", Scene1);
  regScript("GameOver", GameOver);

  app.stage.createScene(scene1Data as INodeData);
}
game();
