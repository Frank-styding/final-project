export class KeyboardController {
  constructor() {
    this.buttonState = {};
    this.preButtonState = {};
    this.events = { down: [], press: [], up: [] };
  }

  //handlers
  keyDownHandler() {
    return this.keyDown.bind(this);
  }
  keyPressHandler() {
    return this.keyPress.bind(this);
  }
  keyUpHandler() {
    return this.keyUp.bind(this);
  }

  //events
  keyDown(e) {
    if (this.preButtonState[e.code] != this.buttonState[e.code]) {
      this.preButtonState[e.code] = this.buttonState[e.code];
    }

    this.buttonState[e.code] = true;

    this.events.down.forEach((func) => func(this.getContext(e)));
  }
  keyPress(e) {
    if (this.preButtonState[e.code] != this.buttonState[e.code]) {
      this.preButtonState[e.code] = this.buttonState[e.code];
    }

    this.buttonState[e.code] = true;

    this.events.press.forEach((func) => func(this.getContext(e)));
  }
  keyUp(e) {
    if (this.buttonState[e.code] != this.buttonState[e.code]) {
      this.preButtonState[e.code] = this.buttonState[e.code];
    }

    this.buttonState[e.code] = false;

    this.events.up.forEach((func) => func(this.getContext(e)));
  }
  addEvent(type, func) {
    this.events[type].push(func);
  }

  //context
  getContext(e) {
    return {
      keyboardEvent: e,
      buttonState: this.buttonState,
    };
  }
}
export default KeyboardController;
