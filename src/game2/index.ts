import { App, type INodeData, Rectangle, regScript } from "liko";
import * as scene1Data from "./scene/scene1.json";
import { Boss1 } from "./scripts/boss1";
import { EnemyBullet } from "./scripts/enemy-bullet";
import { Enemy1 } from "./scripts/enemy1";
import { Enemy2 } from "./scripts/enemy2";
import { GameOver } from "./scripts/game-over";
import { Hero } from "./scripts/hero";
import { HeroBullet } from "./scripts/hero-bullet";
import { Scene1 } from "./scripts/scene1";

async function game() {
  const app = new App();
  await app.init({
    width: 480,
    height: 700,
    physics: {
      enabled: true,
      boundaryArea: new Rectangle(0, 0, 480, 700).pad(500),
      debug: true,
    },
  });

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
