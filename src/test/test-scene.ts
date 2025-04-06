// 使用liko引擎加载场景 json，渲染显示场景内容
import { App, regScript, Script, Scene } from "../../../liko/src";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // 注册自定义脚本类，使场景JSON可以引用此脚本
  regScript("TestScript", TestScript);

  // 创建场景实例
  const scene = new Scene();
  // 将场景添加到应用舞台
  app.stage.addChild(scene);
  // 从JSON文件加载场景配置
  scene.load("scenes/test-scene.json");
}
test();

/**
 * 自定义脚本类 - 继承自ScriptBlock基类
 * 用于控制场景中对象的行为
 */
class TestScript extends Script {
  /**
   * 当对象被创建时调用
   */
  onAwake(): void {
    console.log("awake");
  }

  /**
   * 每帧更新时调用
   * 使目标对象不断旋转
   */
  onUpdate(): void {
    this.target.angle++; // 每帧增加目标对象的角度，实现旋转效果
  }
}
