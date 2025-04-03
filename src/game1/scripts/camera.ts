import { EventType, Point, Script, type Node } from "liko";

/**
 * 相机控制脚本，配置在场景的 json 内，由场景自动创建和管理
 * 用于跟踪目标节点，实现相机跟随效果
 */
export class Camera extends Script {
  /** 存储目标上一次位置的点 */
  private _lastPos = new Point();
  /** 相机跟随的目标节点 */
  private _lookTarget?: Node;
  /** 目标节点的ID，用于在场景中查找目标 */
  lookTargetId = "";

  /**
   * 脚本唤醒时调用
   * 根据lookTargetId查找目标节点并开始跟随
   */
  onAwake(): void {
    this._lookTarget = this.target.getChild(this.lookTargetId);
    if (this._lookTarget) this.lookAt(this._lookTarget);
  }

  /**
   * 设置相机跟随的目标
   * @param target 要跟随的目标节点
   */
  lookAt(target: Node) {
    this._lastPos.copyFrom(target.pos);
    target.on(EventType.transform, this._onTargetTransform, this);
  }

  /**
   * 目标节点位置变化时的回调函数
   * 计算位置差异并移动相机以保持跟随
   */
  private _onTargetTransform() {
    const lookTarget = this._lookTarget;
    if (lookTarget) {
      // 计算目标位置的变化量
      const tx = this._lastPos.x - lookTarget.pos.x;
      const ty = this._lastPos.y - lookTarget.pos.y;
      // 更新上一次位置记录
      this._lastPos.copyFrom(lookTarget.pos);
      // 如果位置有变化，则移动相机
      if (tx || ty) {
        const pos = this.target.pos;
        pos.set(pos.x + tx, pos.y + ty);
      }
    }
  }
}
