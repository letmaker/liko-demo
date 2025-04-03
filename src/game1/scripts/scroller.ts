import { Script, type Node } from "liko";

/**
 * 滚动背景脚本
 * 实现无限滚动的背景效果，通过克隆节点并移动来创造连续的背景
 */
export class Scroller extends Script {
  /** 滚动节点数组，包含原始节点和克隆节点 */
  nodes: Node[] = [];
  /** 水平滚动速度，正值向右滚动，负值向左滚动 */
  speedX = 1;

  /**
   * 脚本唤醒时调用
   * 克隆当前节点并设置位置，形成连续背景
   */
  onAwake(): void {
    // 克隆当前节点作为第二个背景部分
    const newNode = this.scene?.clone(this.target.id);
    if (newNode) {
      // 根据滚动方向设置克隆节点的初始位置
      const x = this.speedX > 0 ? -this.target.width : this.target.width;
      // 获取当前节点的层级顺序
      const index = this.target.getIndexOrder();
      // 设置克隆节点位置
      newNode.pos.set(x, this.target.pos.y);
      // 将克隆节点添加到相同的父节点，保持相同的渲染层级
      this.target.parent?.addChild(newNode, index);
      // 将原始节点和克隆节点都添加到节点数组中进行管理
      this.nodes.push(this.target, newNode);
    }
  }

  /**
   * 每帧更新时调用
   * 移动所有背景节点并处理循环逻辑
   */
  onUpdate(): void {
    for (const node of this.nodes) {
      // 根据速度移动节点
      node.pos.x += this.speedX;
      // 当向左滚动时（常见情况）
      if (this.speedX < 0) {
        // 当节点完全移出屏幕左侧时
        if (node.pos.x <= -node.width) {
          // 将节点重新放置到右侧，实现无限循环效果
          // 使用模运算确保精确定位，避免累积误差
          node.pos.x = (node.pos.x % node.width) + node.width;
        }
      }
    }
  }
}
