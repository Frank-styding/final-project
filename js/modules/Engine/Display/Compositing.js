export class Compositing {
  constructor(globalAlpha, globalCompositeOperation) {
    this.globalAlpha = globalAlpha ?? 1.0;
    this.globalCompositeOperation = globalCompositeOperation ?? "source-over";
  }
  setToContext(ctx) {
    ctx.glovalAlpha = this.globalAlpha;
    ctx.globalCompositeOperation = this.globalCompositeOperation;
  }
}
export default Compositing;
