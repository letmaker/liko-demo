import { App, physics, regScript, Scene } from "liko";
import { Camera } from "./scripts/camera";
import { EnemyCreator } from "./scripts/enemy-creator";
import { Enemy1 } from "./scripts/enemy1";
import { Hero } from "./scripts/hero";
import { Scroller } from "./scripts/scroller";

/**
 * Liko+scene+Script+Physics，来实现一个简单的射击游戏
 * 游戏中包含一个英雄角色、多个敌人、滚动背景和相机控制等元素
 * 玩家通过控制英雄角色移动和射击来消灭敌人，同时避免被敌人击中
 * 游戏中还包含计分系统和游戏结束判定等功能
 */
async function game() {
  // 创建游戏应用实例
  const app = new App();
  // 初始化应用，设置画布尺寸和背景颜色
  await app.init({ width: 720, height: 500, bgColor: 0x333333 });

  // 注册游戏中使用的脚本组件
  regScript("Hero", Hero); // 注册英雄角色脚本
  regScript("Enemy1", Enemy1); // 注册敌人类型1脚本
  regScript("Scroller", Scroller); // 注册滚动背景脚本
  regScript("EnemyCreator", EnemyCreator); // 注册敌人生成器脚本
  regScript("Camera", Camera); // 注册相机控制脚本

  // 启用物理引擎
  physics.enable();
  // 开启物理引擎调试模式，显示碰撞边界等信息
  physics.debug();

  // 创建游戏场景
  const scene = new Scene();
  // 加载场景文件，第二个参数为true表示是否加载完资源后再渲染场景
  scene.load("game1/scene/scene1.scene", true);
  // 将场景添加到应用舞台
  app.stage.addChild(scene);
}

// 执行测试函数，启动游戏
game();
