export class LineStyle {
  constructor({ lineCap, lineWidth, lineJoin, miterLimit }) {
    this.lineCap = lineCap ?? "butt";
    this.lineJoin = lineJoin ?? "bevel";
    this.lineWidth = lineWidth ?? 1;
    this.miterLimit = miterLimit ?? 5;
  }
  setToContext(ctx) {
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = this.lineJoin;
    ctx.miterLimit = this.miterLimit;
  }
}
export default LineStyle;
