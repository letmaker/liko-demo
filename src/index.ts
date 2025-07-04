/**
 * Liko 引擎演示项目主入口文件
 * 该文件创建了一个测试选择器，允许用户通过下拉菜单或键盘切换不同的演示案例
 */

const tests = {
  hello: () => import("./test/test-hello-world"), // Hello World 基础文本显示
  sprite: () => import("./test/test-sprite"), // 精灵(图片)显示和交互
  animatedSprite: () => import("./test/test-animated-sprite"), // 动画精灵
  text: () => import("./test/test-text"), // 文本渲染测试
  canvas: () => import("./test/test-canvas"), // 画布绘制功能
  shape: () => import("./test/test-shape"), // 形状绘制
  scene: () => import("./test/test-scene"), // 场景管理
  sound: () => import("./test/test-sound"), // 音频播放
  tween: () => import("./test/test-tween"), // 缓动动画
  pointer: () => import("./test/test-pointer"), // 鼠标/触摸交互
  physics1: () => import("./test/test-physics1"), // 物理引擎基础
  physics2: () => import("./test/test-physics2"), // 物理引擎进阶
  physicsJoint: () => import("./test/test-physics-joint"), // 物理关节
  game2: () => import("./game2"), // 游戏示例2
  test: () => import("./test/test"), // 内部测试
  ai: () => import("./test/test-ai-overview"), // AI功能概览
  camera: () => import("./test/test-camera"), // 摄像机功能
  particle: () => import("./test/test-particle"), // 粒子系统
  game: () => import("./test/ai-template/game"), // AI模板
};

// 过滤掉 'test' 项，获取所有测试案例名称
const testNames = Object.keys(tests).filter((key) => key !== "test");

/**
 * 从URL参数中获取当前要运行的测试名称
 * @returns 测试名称，默认为 'hello'
 */
const getTestName = () => {
  const params = new URLSearchParams(window.location.search);
  const test = params.get("test") as keyof typeof tests;
  return test && tests[test] ? test : "hello";
};

// 创建测试选择下拉菜单
const select = document.createElement("select");
select.style.cssText = "position: fixed; top: 10px; left: 650px; z-index: 1000; padding: 5px; font-size: 14px;";

// 填充下拉菜单选项
for (const name of testNames) {
  const option = document.createElement("option");
  option.value = name;
  option.text = name;
  option.selected = name === getTestName(); // 设置当前选中项
  select.appendChild(option);
}
document.body.appendChild(select);

// 监听下拉菜单切换事件
select.addEventListener("change", (e) => {
  const target = e.target as HTMLSelectElement;
  // 通过修改URL参数切换测试案例
  window.location.href = `?test=${target.value}`;
});

// 初始化当前测试索引
let currentIndex = testNames.indexOf(getTestName());

// 键盘事件处理：支持上下方向键切换测试案例
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    // 上箭头：切换到上一个测试案例（循环）
    currentIndex = (currentIndex - 1 + testNames.length) % testNames.length;
    window.location.href = `?test=${testNames[currentIndex]}`;
    select.value = testNames[currentIndex];
  } else if (e.key === "ArrowDown") {
    // 下箭头：切换到下一个测试案例（循环）
    currentIndex = (currentIndex + 1) % testNames.length;
    window.location.href = `?test=${testNames[currentIndex]}`;
    select.value = testNames[currentIndex];
  }
});

/**
 * 异步加载并执行指定的测试案例
 * @param testName 要加载的测试案例名称
 */
const loadTest = async (testName: keyof typeof tests) => {
  await tests[testName]();
};

// 启动应用：加载当前URL参数指定的测试案例
loadTest(getTestName());
