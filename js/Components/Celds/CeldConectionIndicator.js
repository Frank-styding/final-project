import Engine from "../../modules/Engine/exports.js";

let State = Engine.State;
let { lineStyle, Color, DisplayStyle, Display } = Engine.Display;
let { Component } = Engine.Components;

export class C_CeldConectionIndicator extends Component {
  static ActiveColor = new Color(237, 46, 46);
  static DesativeColor = new Color(255, 255, 255);
  constructor(celdSize, activeConections = {}) {
    super();
    this.className = "ConectionIndicator";
    this.display = new Display({ width: celdSize, height: celdSize });
    this.activeConections = new State(activeConections);
    this.celdSize = celdSize;
    this.render();
  }

  render() {
    const width = this.display.width;
    const height = this.display.height;
    const activeConections = this.activeConections.getValue();
    this.display.clear();

    if (activeConections.top) {
      this.display.rect(
        width / 2,
        3,
        width * 0.3,
        6,
        new DisplayStyle({
          color: activeConections.top.value
            ? C_CeldConectionIndicator.ActiveColor
            : C_CeldConectionIndicator.DesativeColor,
        })
      );
    }
    if (activeConections.bottom) {
      this.display.rect(
        width / 2,
        height - 3,
        width * 0.3,
        6,
        new DisplayStyle({
          color: activeConections.bottom.value
            ? C_CeldConectionIndicator.ActiveColor
            : C_CeldConectionIndicator.DesativeColor,
        })
      );
    }
    if (activeConections.right) {
      this.display.rect(
        width - 3,
        height / 2,
        6,
        height * 0.3,
        new DisplayStyle({
          color: activeConections.right.value
            ? C_CeldConectionIndicator.ActiveColor
            : C_CeldConectionIndicator.DesativeColor,
        })
      );
    }
    if (activeConections.left) {
      this.display.rect(
        3,
        height / 2,
        6,
        height * 0.3,
        new DisplayStyle({
          color: activeConections.left.value
            ? C_CeldConectionIndicator.ActiveColor
            : C_CeldConectionIndicator.DesativeColor,
        })
      );
    }
  }

  getAsProps() {
    return [this.activeConections.getValue()];
  }
}

export default C_CeldConectionIndicator;
