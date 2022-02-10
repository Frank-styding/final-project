import Collider from "./Collider.js";

export class CircleCollider extends Collider {
  constructor(r) {
    super();
    this.r = r;
    this.className = "CircleCollider";
  }
  set(r) {
    this.radius = r;
  }
  pointIsInside(x, y) {
    return (this.pos.x - x) ** 2 + (this.pos.y - y) ** 2 <= this.r * this.r;
  }
}
export default CircleCollider;
