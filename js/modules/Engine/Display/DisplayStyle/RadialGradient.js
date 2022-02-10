export class RadialGradient {
  constructor(x, y, r, x1, y1, r1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.x1 = x1;
    this.y1 = y1;
    this.r1 = r1;
    this.colors = {};
  }
  addColorTo(idx, color) {
    this.colors[idx] = color;
  }
  getGradient(ctx) {
    let grd = ctx.createRadialGradient(
      this.x,
      this.y,
      this.r,
      this.x1,
      this.y1,
      this.r1
    );

    Object.keys(this.colors).forEach((idx) => {
      ctx.addColorTop(idx, this.colors[idx].toCanvasStyle());
    });

    return grd;
  }
}
export default RadialGradient;
