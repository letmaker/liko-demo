import { App } from "liko";
import { config } from "./config";

async function game() {
  // 创建游戏应用
  const app = new App();
  // 初始化游戏应用，并指定容器名称或者节点实例
  await app.init({ ...config.app, container: "gameContainer" });

  // 创建场景
  app.stage.createScene(config.scenes[0]);
}

game();
