import Vector2 from "../Math/Vector2.js";

export class Collider {
  constructor() {
    this.pos = new Vector2();
    this.transform = undefined;
    this.className = "Collider";
  }
  setPos(pos) {
    this.pos = pos;
  }
  setTransform(transform) {
    this.transform = transform;
  }
  pointIsInside(x, y) {
    return false;
  }
}
export default Collider;
