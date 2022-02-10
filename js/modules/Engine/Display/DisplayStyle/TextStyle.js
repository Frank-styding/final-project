export class TextStyle {
  constructor({ textAlign, textBaseline, font }) {
    this.textAlign = textAlign ?? "center";
    this.textBaseline = textBaseline ?? "middle";
    this.font = font ?? "20px sans serif";
  }
  setToContext(ctx) {
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.font = this.font;
  }
}
export default TextStyle;
