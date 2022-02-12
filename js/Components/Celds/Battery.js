import {
  LineStyle,
  DisplayStyle,
  Color,
} from "../../modules/Engine/Display/DisplayStyle/exports.js";
import { State } from "../../modules/Engine/exports.js";

import C_ConectionIndicator from "./ConectionIndicator.js";

export class C_Battery extends C_ConectionIndicator {
  static getImage = (props) => {
    return new C_Battery(...props).display.canvas.toDataURL("base64");
  };
  constructor(celdSize, activeConections, value) {
    super(
      celdSize,
      (() => {
        let aux = {};
        activeConections.forEach((item) => (aux[item] = { value: false }));
        return aux;
      })()
    );
    this.className = "Battery";
    this.state = value ? "Charged" : "Discharged";
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
            ? C_ConectionIndicator.ActiveColor
            : C_ConectionIndicator.DesativeColor,
        }),
        true
      );
    }
  }
}
export default C_Battery;
