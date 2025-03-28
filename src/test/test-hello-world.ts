// 使用liko引擎绘制文本并显示"Hello World"
import { App, Text } from 'liko';

/**
 * 测试函数 - 初始化应用并显示文本
 */
async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置画布大小为800x800
  await app.init({ width: 800, height: 800 });

  // 创建文本对象
  const text = new Text({
    text: 'Hello World', // 文本内容
    fillColor: '#ff0000', // 文本颜色（红色）
    fontSize: 30, // 字体大小
    pos: { x: 100, y: 100 }, // 文本位置
  });

  // 将文本添加到舞台上显示
  app.stage.addChild(text);
}

// 执行测试函数
test();
