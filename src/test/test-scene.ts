import { App, register, Script, Scene } from "liko";

async function test() {
  const app = new App();
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  register.regScript("TestScript", TestScript);

  const scene = new Scene();
  app.stage.addChild(scene);
  scene.load("scenes/test-scene.json");
}
test();

/**
 * 这是一个自定义的游戏脚本类
 * 通过继承 Script 基类，我们可以为游戏对象添加自定义的行为
 * 比如这个脚本会让游戏对象不断旋转
 */
class TestScript extends Script {
  onAwake(): void {
    console.log("awake"); // 在控制台打印消息，表示对象已经被创建
  }

  onUpdate(): void {
    this.target.angle++; // this.target 表示当前脚本所附加的游戏对象
  }
}
