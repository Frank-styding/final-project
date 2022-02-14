export class Shadow {
  constructor(color, blur, x, y) {
    this.color = color;
    this.blur = blur;
    this.x = x;
    this.y = y;
  }
  setToContext(ctx) {
    ctx.shadowColor = this.color.toCanvasStyle();
    ctx.shadowBlur = this.blur;
    ctx.shadowOffsetX = this.x;
    ctx.shadowOffsetY = this.y;
  }
}
export default Shadow;
