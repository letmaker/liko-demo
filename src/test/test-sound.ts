// 使用 Liko 引擎播放声音
import { App, music, sound, Text } from "../../../liko/src";

async function test() {
  // 创建应用实例
  const app = new App();
  // 初始化应用，设置宽高为800x800，背景色为深灰色
  await app.init({ width: 800, height: 800, bgColor: 0x333333 });

  const soundText1 = new Text({
    text: "点击播放音效", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 50, y: 100 }, // 文本位置
  });
  app.stage.addChild(soundText1);

  soundText1.on("click", () => {
    sound.play("assets/sound/bullet.mp3");
  });

  const soundText2 = new Text({
    text: "音效低音量", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 250, y: 100 }, // 文本位置
  });
  app.stage.addChild(soundText2);

  soundText2.on("click", () => {
    sound.play("assets/sound/bullet.mp3", 0.3);
  });

  const musicText1 = new Text({
    text: "点击播放背景音乐", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 50, y: 200 }, // 文本位置
  });
  app.stage.addChild(musicText1);

  musicText1.on("click", () => {
    music.play("assets/sound/bg.mp3");
    music.fadeIn("assets/sound/bg.mp3", 3);
  });

  const musicText2 = new Text({
    text: "暂停", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 250, y: 200 }, // 文本位置
  });
  app.stage.addChild(musicText2);

  musicText2.on("click", () => {
    music.pause("assets/sound/bg.mp3");
  });

  const musicText3 = new Text({
    text: "恢复", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 350, y: 200 }, // 文本位置
  });
  app.stage.addChild(musicText3);

  musicText3.on("click", () => {
    music.resume("assets/sound/bg.mp3");
  });

  const musicText4 = new Text({
    text: "停止", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 450, y: 200 }, // 文本位置
  });
  app.stage.addChild(musicText4);

  musicText4.on("click", () => {
    music.stopAll();
  });

  const musicText5 = new Text({
    text: "销毁", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 550, y: 200 }, // 文本位置
  });
  app.stage.addChild(musicText5);

  musicText5.on("click", () => {
    music.destroyAll();
  });

  const musicText6 = new Text({
    text: "音量-", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 250, y: 250 }, // 文本位置
  });
  app.stage.addChild(musicText6);

  musicText6.on("click", () => {
    music.setVolume("assets/sound/bg.mp3", 0.5);
  });

  const musicText7 = new Text({
    text: "速率+", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 350, y: 250 }, // 文本位置
  });
  app.stage.addChild(musicText7);

  musicText7.on("click", () => {
    music.setPlaybackRate("assets/sound/bg.mp3", 2);
  });

  const musicText8 = new Text({
    text: "不循环", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 450, y: 250 }, // 文本位置
  });
  app.stage.addChild(musicText8);

  musicText8.on("click", () => {
    music.setLoop("assets/sound/bg.mp3", false);
  });

  const musicText9 = new Text({
    text: "恢复", // 文本内容
    fillColor: "#ff0000", // 文本颜色（红色）
    fontSize: 20, // 字体大小
    pos: { x: 550, y: 250 }, // 文本位置
  });
  app.stage.addChild(musicText9);

  musicText9.on("click", () => {
    music.setVolumeAll(1);
    music.setPlaybackRateAll(1);
    music.setLoopAll(true);
  });
}
test();
