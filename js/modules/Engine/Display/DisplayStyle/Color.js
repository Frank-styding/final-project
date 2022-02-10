export class Color {
  constructor(r = 255, g = 255, b = 255, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  toCanvasStyle() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}
export default Color;
