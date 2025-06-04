// 使用liko引擎绘制文本并显示"Hello World"
import { App, Text } from "liko";

/**
 * 测试函数 - 初始化应用并显示文本
 */
async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置画布大小为800x800
  await app.init({ width: 800, height: 800 });

  // 创建文本对象
  new Text({
    text: "Hello World \n上下键盘切换 demo", // 文本内容
    textColor: "#ff0000", // 文本颜色（红色）
    fontSize: 30, // 字体大小
    position: { x: 400, y: 400 }, // 文本位置
    parent: app.stage, // 父节点为舞台
    anchor: { x: 0.5, y: 0.5 }, // 锚点位置
    lineHeight: 100,
    textAlign: "center",
  });
}

// 执行测试函数
test();
