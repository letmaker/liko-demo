import { App, music, sound, Text } from "liko";

/**
 * 这是一个测试声音功能的示例程序
 * 通过点击不同的文字按钮，可以体验游戏引擎提供的音效和背景音乐功能
 */
async function test() {
  // 创建一个新的游戏应用实例
  const app = new App();
  // 初始化游戏窗口：设置窗口大小为800x800像素，背景色为深灰色(十六进制颜色值)
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  // ====== 音效测试部分 ======
  // 创建第一个可点击的文本，点击后播放普通音量的音效
  const soundText1 = new Text({
    text: "点击播放音效", // 显示的文字内容
    textColor: "#ff0000", // 文字颜色设置为红色
    fontSize: 20, // 文字大小为20像素
    pos: { x: 50, y: 100 }, // 文字在屏幕上的位置：距左50像素，距上100像素
    parent: app.stage, // 将文字添加到游戏的主舞台上
  });
  // 当点击文字时，播放子弹音效
  soundText1.on("click", () => {
    sound.play("assets/sound/bullet.mp3");
  });

  // 创建第二个可点击的文本，点击后播放低音量的音效
  const soundText2 = new Text({
    text: "音效低音量",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 250, y: 100 },
    parent: app.stage,
  });
  // 当点击文字时，以0.3的音量播放子弹音效（1.0为最大音量）
  soundText2.on("click", () => {
    sound.play("assets/sound/bullet.mp3", 0.3);
  });

  // ====== 背景音乐测试部分 ======
  // 创建播放背景音乐的按钮，点击后音乐会在3秒内渐入
  const musicText1 = new Text({
    text: "点击播放背景音乐",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 50, y: 200 },
    parent: app.stage,
  });
  // 点击后播放背景音乐，并在3秒内逐渐增大音量
  musicText1.on("click", () => {
    music.play("assets/sound/bg.mp3").fadeIn(3);
  });

  // 创建暂停按钮，点击后暂停背景音乐（可以之后恢复）
  const musicText2 = new Text({
    text: "暂停",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 250, y: 200 },
    parent: app.stage,
  });
  // 点击后暂停指定的背景音乐
  musicText2.on("click", () => {
    music.pause("assets/sound/bg.mp3");
  });

  // 创建恢复播放按钮，点击后继续播放之前暂停的音乐
  const musicText3 = new Text({
    text: "恢复",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 350, y: 200 },
    parent: app.stage,
  });
  // 点击后恢复播放之前暂停的背景音乐
  musicText3.on("click", () => {
    music.resume("assets/sound/bg.mp3");
  });

  // 创建停止按钮，点击后停止所有正在播放的背景音乐
  const musicText4 = new Text({
    text: "停止",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 450, y: 200 },
    parent: app.stage,
  });
  // 点击后停止所有正在播放的背景音乐
  musicText4.on("click", () => {
    music.stopAll();
  });

  // 创建销毁按钮，点击后清除所有音乐资源（释放内存）
  const musicText5 = new Text({
    text: "销毁",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 550, y: 200 },
    parent: app.stage,
  });
  // 点击后销毁所有音乐资源，释放内存
  musicText5.on("click", () => {
    music.destroyAll();
  });

  // ====== 音乐参数控制部分 ======
  // 创建降低音量按钮，点击后将背景音乐音量降至一半
  const musicText6 = new Text({
    text: "音量-",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 250, y: 250 },
    parent: app.stage,
  });
  // 点击后将指定背景音乐的音量设置为0.5（一半音量）
  musicText6.on("click", () => {
    music.setVolume("assets/sound/bg.mp3", 0.5);
  });

  // 创建加快播放速度按钮，点击后将背景音乐速度加快一倍
  const musicText7 = new Text({
    text: "速率+",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 350, y: 250 },
    parent: app.stage,
  });
  // 点击后将指定背景音乐的播放速率设置为2（双倍速）
  musicText7.on("click", () => {
    music.setPlaybackRate("assets/sound/bg.mp3", 2);
  });

  // 创建取消循环按钮，点击后背景音乐只播放一次
  const musicText8 = new Text({
    text: "不循环",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 450, y: 250 },
    parent: app.stage,
  });
  // 点击后设置指定背景音乐为不循环播放
  musicText8.on("click", () => {
    music.setLoop("assets/sound/bg.mp3", false);
  });

  // 创建重置按钮，点击后将所有音乐参数恢复默认值
  const musicText9 = new Text({
    text: "重置参数",
    textColor: "#ff0000",
    fontSize: 20,
    pos: { x: 550, y: 250 },
    parent: app.stage,
  });
  // 点击后重置所有背景音乐的参数：
  // - 音量恢复到最大（1.0）
  // - 播放速度恢复正常（1.0）
  // - 重新开启循环播放
  musicText9.on("click", () => {
    music.setVolumeAll(1);
    music.setPlaybackRateAll(1);
    music.setLoopAll(true);
  });
}
// 运行测试程序
test();
