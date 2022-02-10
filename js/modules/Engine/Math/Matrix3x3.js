import Vector2 from "./Vector2.js";

export class Matrix3x3 {
  constructor(data = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    this.data = data;
  }

  mul(m) {
    const data = Matrix3x3.mul(this, m).data;
    this.data = data;
    return this;
  }

  rotate(angle) {
    const data = Matrix3x3.mul(this, Matrix3x3.M_rotate(angle)).data;
    this.data = data;
    return this;
  }

  scale(x, y) {
    const data = Matrix3x3.mul(this, Matrix3x3.M_scale(x, y)).data;
    this.data = data;
    return this;
  }

  translate(x, y) {
    const data = Matrix3x3.mul(this, Matrix3x3.M_translate(x, y)).data;
    this.data = data;
    return this;
  }

  getTranslation() {
    return new Vector2(this.data[2], this.data[5]);
  }
  setTranslation(x, y) {
    this.data[2] = x;
    this.data[5] = y;
    return this;
  }

  setToContextTransform(ctx) {
    ctx.transform(
      this.data[0],
      this.data[3],
      this.data[1],
      this.data[4],
      this.data[2],
      this.data[5]
    );
  }

  clone() {
    return new Matrix3x3(this.data.slice());
  }
  copy(m) {
    this.data = m.data.slice();
    return this;
  }

  static M_identity() {
    return new Matrix3x3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }

  static M_scale(x, y) {
    return new Matrix3x3([x, 0, 0, 0, y, 0, 0, 0, 1]);
  }

  static M_translate(x, y) {
    return new Matrix3x3([1, 0, x, 0, 1, y, 0, 0, 1]);
  }

  static M_rotate(angle) {
    const cos = Math.cos((angle * Math.PI) / 180);
    const sin = Math.sin((angle * Math.PI) / 180);
    return new Matrix3x3([cos, sin, 0, -sin, cos, 0, 0, 0, 1]);
  }

  static mulByVector(v, m, z = 1) {
    const data = m.data;
    return new Vector2(
      v.x * data[0] + v.y * data[1] + data[2] * z,
      v.x * data[3] + v.y * data[4] + data[5] * z
    );
  }

  static mul(m, m1) {
    let d = new Array(9).fill(0);
    const d1 = m.data;
    const d2 = m1.data;
    d[0] = d1[0] * d2[0] + d1[1] * d2[3] + d1[2] * d2[6];
    d[1] = d1[0] * d2[1] + d1[1] * d2[4] + d1[2] * d2[7];
    d[2] = d1[0] * d2[2] + d1[1] * d2[5] + d1[2] * d2[8];

    d[3] = d1[3] * d2[0] + d1[4] * d2[3] + d1[5] * d2[6];
    d[4] = d1[3] * d2[1] + d1[4] * d2[4] + d1[5] * d2[7];
    d[5] = d1[3] * d2[2] + d1[4] * d2[5] + d1[5] * d2[8];

    d[6] = d1[6] * d2[0] + d1[7] * d2[3] + d1[8] * d2[6];
    d[7] = d1[6] * d2[1] + d1[7] * d2[4] + d1[8] * d2[7];
    d[8] = d1[6] * d2[2] + d1[7] * d2[5] + d1[8] * d2[8];

    return new Matrix3x3(d);
  }
}
export default Matrix3x3;
