import { Vector2, Matrix3x3 } from "../Math/exports.js";
import Collider from "./Collider.js";

export class RectCollider extends Collider {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    this.className = "RectCollider";
  }
  set(width, height) {
    this.width = width;
    this.height = height;
  }
  pointIsInside(x, y) {
    let v = new Vector2(x - this.pos.x, y - this.pos.y);
    if (this.transform) {
      v = Matrix3x3.mulByVector(v, this.transform.getTransformMatrix(), 0);
    }
    return (
      -this.width / 2 <= v.x &&
      v.x <= this.width / 2 &&
      -this.height / 2 <= v.y &&
      v.y <= this.height / 2
    );
  }
}
export default RectCollider;
