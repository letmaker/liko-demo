import { Rectangle, type IAppOptions, type INodeData } from "liko";

// 导入脚本
import "./scripts/hero.ts";
import "./scripts/joystick.ts";
import "./scripts/monster.ts";
import "./scripts/monster-creator.ts";

// 导入场景
import scene1 from "./scenes/scene1.json";

export const config: { app: IAppOptions; scenes: INodeData[] } = {
  app: {
    title: "liko-game",
    width: 750,
    height: 1334,
    bgColor: "#333333",
    physics: {
      // 物理引擎是否开启，根据需要打开
      enabled: true,
      debug: false,
      // 物理边界区域，对象碰到后会被销毁，根据需要调整
      boundaryArea: new Rectangle(0, 0, 750, 1334).pad(200),
    },
  },
  scenes: [scene1],
};
