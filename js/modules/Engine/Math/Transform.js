import { Matrix3x3 } from "./Matrix3x3.js";

export class Transform {
  constructor() {
    this.model = Matrix3x3.M_identity();
    this.parentTransform = undefined;
  }
  setParentTransform(transform) {
    this.parentTransform = transform;
  }
  getTransformMatrix() {
    if (this.parentTransform != undefined) {
      return Matrix3x3.mul(
        this.parentTransform.getTransformMatrix(),
        this.model
      );
    }
    return this.model;
  }
  clone() {
    let transform = new Transform();
    transform.model = this.model.copy();
    transform.parentTranform = this.parentTransform
      ? this.parentTransform.copy()
      : undefined;
    return transform;
  }
  copy(transform) {
    this.model = transform.model.copy();
    this.parentTransform = transform.parentTransform.copy();
    return this;
  }
}
export default Transform;
