import { Script, Node } from 'liko';

export class Scroller extends Script {
  nodes: Node[] = [];
  speedX = 1;

  onAwake(): void {
    const newNode = this.scene?.clone(this.target.id);
    if (newNode) {
      const x = this.target.pos.x + this.speedX > 0 ? -this.target.width : this.target.width;
      const index = this.target.getIndexOrder();
      newNode.pos.set(x, this.target.pos.y);
      this.target.parent?.addChild(newNode, index);
      this.nodes.push(this.target, newNode);
    }
  }

  onUpdate(): void {
    for (const node of this.nodes) {
      node.pos.x += this.speedX;
      if (this.speedX < 0) {
        if (node.pos.x <= -node.width) {
          node.pos.x = (node.pos.x % node.width) + node.width;
        }
      }
    }
  }
}
