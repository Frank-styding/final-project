export class DisplayStyle {
  constructor({
    shadow,
    color,
    lineStyle,
    compositing,
    pattern,
    gradient,
    fill,
    filter,
    textStyle,
  } = {}) {
    this.fill = fill ?? true;
    this.shadow = shadow;
    this.gradient = gradient;
    this.pattern = pattern;
    this.color = color;
    this.lineStyle = lineStyle;
    this.compositing = compositing;
    this.filter = filter;
    this.textStyle = textStyle;
  }
  setToContext(ctx) {
    if (this.compositing) {
      this.compositing.setToContext(ctx);
    }
    if (this.filter) {
      ctx.filter = this.filter;
    }
    if (this.textStyle) {
      this.textStyle.setToContext(ctx);
    }

    if (this.fill) {
      if (this.shadow) {
        this.shadow.setToContext(ctx);
      }
      if (this.pattern) {
        this.pattern.setToContext(ctx);
      }
      if (this.color) {
        ctx.fillStyle = this.color.toCanvasStyle();
      }
    } else {
      if (this.color) {
        ctx.strokeStyle = this.color.toCanvasStyle();
      }
      if (this.lineStyle) {
        this.lineStyle.setToContext(ctx);
      }
    }
  }
}
export default DisplayStyle;
