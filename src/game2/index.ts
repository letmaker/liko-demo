import { App, type INodeData, Rectangle, register } from "liko";
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

  register.regScript("Enemy1", Enemy1);
  register.regScript("Enemy2", Enemy2);
  register.regScript("Boss1", Boss1);
  register.regScript("EnemyBullet", EnemyBullet);

  register.regScript("Hero", Hero);
  register.regScript("HeroBullet", HeroBullet);

  register.regScript("Scene1", Scene1);
  register.regScript("GameOver", GameOver);

  app.stage.createScene(scene1Data as INodeData);
}
game();
