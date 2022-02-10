export class MouseController {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.mouseIsDowm = false;
    this.events = { down: [], move: [], up: [] };
  }

  //handler
  mouseDownHandler() {
    return this.mouseDown.bind(this);
  }
  mouseUpHandler() {
    return this.mouseUp.bind(this);
  }
  mouseMoveHandler() {
    return this.mouseMove.bind(this);
  }

  //events
  mouseDown(e) {
    this.mouseIsDown = true;

    this.x = e.offsetX;
    this.y = e.offsetY;

    this.events.down.forEach((item) => item(this.getContext(e)));
  }
  mouseUp(e) {
    this.mouseIsDown = false;

    this.x = e.offsetX;
    this.y = e.offsetY;

    this.events.up.forEach((item) => item(this.getContext(e)));
  }
  mouseMove(e) {
    this.x = e.offsetX;
    this.y = e.offsetY;

    this.events.move.forEach((item) => item(this.getContext(e)));
  }
  addEvent(name, func) {
    this.events[name].push(func);
  }

  //context
  getContext(e) {
    return {
      mouseEvent: e,
      x: this.x,
      y: this.y,
      mouseIsDown: this.mouseIsDowm,
    };
  }
}
export default MouseController;
