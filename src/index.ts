const tests = {
  sprite: () => import("./test/test-sprite"),
  text: () => import("./test/test-text"),
  canvas: () => import("./test/test-canvas"),
  scene: () => import("./test/test-scene"),
  sound: () => import("./test/test-sound"),
  tween: () => import("./test/test-tween"),
  mouse: () => import("./test/test-mouse"),
  physics: () => import("./test/test-physics"),
  "hello-world": () => import("./test/test-hello-world"),
};

const testNames = Object.keys(tests);

const getTestName = () => {
  const params = new URLSearchParams(window.location.search);
  const test = params.get("test") as keyof typeof tests;
  return test && tests[test] ? test : "text";
};

// 初始化
let currentIndex = testNames.indexOf(getTestName());

// 修改键盘事件处理
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + testNames.length) % testNames.length;
    window.location.href = `?test=${testNames[currentIndex]}`;
  } else if (e.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % testNames.length;
    window.location.href = `?test=${testNames[currentIndex]}`;
  }
});

// 加载测试
const loadTest = async (testName: keyof typeof tests) => {
  await tests[testName]();
};

loadTest(getTestName());
