import { Vector2, Matrix3x3 } from "../Math/exports.js";
import Collider from "./Collider.js";
export class PathCollider extends Collider {
  constructor(path) {
    super();
    this.path = path;
    this.className = "PathCollider";
  }
  mouseIsInside(x, y) {
    let odd = false;

    for (let i = 0, j = this.path.length - 1; i < this.path.length; i++) {
      if (
        this.path[i][1] > y !== this.path[j][1] > y &&
        x <
          ((this.path[j][0] - this.path[i][0]) * (y - this.path[i][1])) /
            (this.path[j][1] - this.path[i][1]) +
            this.path[i][0]
      ) {
        odd = !odd;
      }
      j = i;
    }
    return odd;
  }
}
export default PathCollider;
