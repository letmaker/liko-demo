import { EventType } from "liko";
import { type INodeData, Script, type Text } from "liko";
import { scene1Data } from "../scene";

export class GameOver extends Script {
  private _scoreText?: Text;
  onAwake(): void {
    this._scoreText = this.target.findChild<Text>({ label: "score", deep: true });

    const score = this.stage?.store.get("score");
    this._scoreText?.setText(`Score: ${score}`);

    const restart = this.target.findChild<Text>({ label: "restart", deep: true });
    restart?.on(EventType.click, () => {
      this.stage?.timer.resume();
      this.stage?.store.set("score", 0);
      this.stage?.createScene(scene1Data as INodeData, { destroyOther: true });
    });

    // TODO 为什么需要延迟
    setTimeout(() => {
      this.stage?.timer.pause();
    }, 100);
  }
}
