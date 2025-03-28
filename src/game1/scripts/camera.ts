import { EventType, Point, Script, Node } from 'liko';

export class Camera extends Script {
  private _lastPos = new Point();
  private _lookTarget?: Node;
  lookTargetId = '';

  onAwake(): void {
    this._lookTarget = this.target.getChild('#' + this.lookTargetId);
    if (this._lookTarget) this.lookAt(this._lookTarget);
  }

  lookAt(target: Node) {
    this._lastPos.copyFrom(target.pos);
    target.on(EventType.transform, this._onTargetTransform, this);
  }

  private _onTargetTransform() {
    const lookTarget = this._lookTarget;
    if (lookTarget) {
      const tx = this._lastPos.x - lookTarget.pos.x;
      const ty = this._lastPos.y - lookTarget.pos.y;
      this._lastPos.copyFrom(lookTarget.pos);
      if (tx || ty) {
        const pos = this.target.pos;
        pos.set(pos.x + tx, pos.y + ty);
      }
    }
  }
}
