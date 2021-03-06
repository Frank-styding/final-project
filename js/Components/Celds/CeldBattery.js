import Engine from "../../modules/Engine/exports.js";

let State = Engine.State;
let { lineStyle, Color, DisplayStyle } = Engine.Display;

import C_CeldConectionIndicator from "./CeldConectionIndicator.js";

export class C_CeldBattery extends C_CeldConectionIndicator {
  static getImage = (props) => {
    return new C_CeldBattery(...props).display.canvas.toDataURL("base64");
  };
  constructor(celdSize, nameActiveConection, value) {
    super(
      celdSize,
      (() => {
        let aux = {};
        nameActiveConection.forEach((item) => (aux[item] = { value: false }));
        return aux;
      })()
    );
    this.className = "Battery";
    this.state = value ? "Charged" : "Discharged";
    this.nameActiveConections = nameActiveConection;
    this.value = new State(value);
    this.loadUpdateFuncs();
    this.updateActiveConections();
    this.render();
  }
  loadUpdateFuncs() {
    this.value.onUpdate(() => {
      this.updateActiveConections();
      this.render();
      this.events.trigger("update");
    }, "battery");
  }
  updateActiveConections() {
    const activeContions = this.activeConections.getValue();

    for (let conection of ["left", "right", "top", "bottom"]) {
      if (activeContions[conection]) {
        this.activeConections.setValue(
          [conection, "value"],
          this.value.getValue()
        );
      }
    }
  }
  getAsProps() {
    return [this.nameActiveConections, this.value.getValue()];
  }
  render() {
    super.render();
    const width = this.display.width;
    const height = this.display.height;

    if (this.value != undefined) {
      const positions = [
        {
          x: 1,
          y: 0,
        },
        {
          x: 0.5,
          y: 0.87,
        },
        {
          x: -0.5,
          y: 0.87,
        },
        {
          x: -1,
          y: 0,
        },
        {
          x: -0.5,
          y: -0.87,
        },
        {
          x: 0.5,
          y: -0.87,
        },
      ];
      this.display.path(
        positions.map((position) => ({
          x: (position.x * width * 0.55) / 2 + width / 2,
          y: (position.y * height * 0.55) / 2 + height / 2,
        })),
        new DisplayStyle({
          fill: this.value.getValue(),
          color: this.value.getValue()
            ? C_CeldConectionIndicator.ActiveColor
            : C_CeldConectionIndicator.DesativeColor,
        }),
        true
      );
    }
  }
}
export default C_CeldBattery;
