import { type LikoPointerEvent, Point, register, Script } from "liko";

export class Joystick extends Script {
  private _center = new Point(0, 0);
  private _pressed = false;
  private _maxRadius = 100;

  // 公有属性，将来可以在编辑器内修改，不要太快
  moveSpeed = 10;

  onStagePointerDown(e: LikoPointerEvent): void {
    this._pressed = true;
    this._center.set(e.pointer.x, e.pointer.y);
  }

  onStagePointerMove(e: LikoPointerEvent): void {
    if (!this._pressed) return;

    // 计算摇杆偏移量
    const offset = Point.TEMP.set(e.pointer.x - this._center.x, e.pointer.y - this._center.y);
    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);

    // 如果距离太小，停止移动
    if (distance < 5) {
      this.signal("joystickMove", { tx: 0, ty: 0 });
      return;
    }

    // 限制摇杆范围并计算速度倍数
    const clampedDistance = Math.min(distance, this._maxRadius);
    const speedMultiplier = clampedDistance / this._maxRadius;

    // 计算移动方向
    const directionX = offset.x / distance;
    const directionY = offset.y / distance;

    // 发送移动信号
    this.signal("joystickMove", {
      tx: directionX * this.moveSpeed * speedMultiplier,
      ty: directionY * this.moveSpeed * speedMultiplier,
    });
  }

  onStagePointerUp(): void {
    this._pressed = false;
    this.signal("joystickMove", { tx: 0, ty: 0 });
  }
}

register.regScript("scripts/joystick.ts", Joystick);
