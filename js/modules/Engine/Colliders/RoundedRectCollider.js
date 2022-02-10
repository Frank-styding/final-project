import { Vector2, Matrix3x3 } from "../Math/exports.js";
import Collider from "./Collider.js";
export class RoundedRectCollider extends Collider {
  constructor(width, height, radius) {
    super();
    this.width = width;
    this.height = height;
    this.radius = radius;
  }
  set(width, height, radius) {
    this.width = width;
    this.height = height;
    this.radius = radius;
  }
  pointIsInside(x, y) {
    let v = new Vector2(x - this.pos.x, y - this.pos.y);
    if (this.transform) {
      v = Matrix3x3.mulByVector(v, this.transform.getTransformMatrix(), 0);
    }

    return (
      (-this.width / 2 + this.radius <= v.x &&
        v.x <= this.width / 2 - this.radius &&
        -this.height / 2 <= v.y &&
        v.y <= this.height / 2) ||
      (v.x <= this.width / 2 &&
        -this.height / 2 + this.radius <= v.y &&
        v.y <= this.height / 2 - this.radius) ||
      (this.width / 2 - this.radius - v.x) ** 2 +
        (this.height / 2 - this.radius - v.y) ** 2 <=
        this.radius * this.radius ||
      (-(this.width / 2 - this.radius) - v.x) ** 2 +
        (-(this.height / 2 - this.radius) - v.y) ** 2 <=
        this.radius * this.radius ||
      (-(this.width / 2 - this.radius) - v.x) ** 2 +
        (this.height / 2 - this.radius - v.y) ** 2 <=
        this.radius * this.radius ||
      (this.width / 2 - this.radius - v.x) ** 2 +
        (-(this.height / 2 - this.radius) - v.y) ** 2 <=
        this.radius * this.radius
    );
  }
}
export default RoundedRectCollider;
