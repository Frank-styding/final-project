import {
  LineStyle,
  DisplayStyle,
  Color,
} from "../../modules/Engine/Display/DisplayStyle/exports.js";
import { State } from "../../modules/Engine/exports.js";

import C_ConectionIndicator from "./ConectionIndicator.js";

export class C_ConectionPath extends C_ConectionIndicator {
  static getImage = (props) => {
    return new C_ConectionPath(...props).display.canvas.toDataURL("base64");
  };
  constructor(celdSize, activeConections = []) {
    super(
      celdSize,
      (() => {
        let aux = {};
        activeConections.forEach((item) => (aux[item] = { value: false }));
        return aux;
      })()
    );
    this.className = "ConectionPath";
    this.value = new State(false);
    this.loadUpdateFuncs();
    this.updateActiveConections();
    this.render();
  }
  loadUpdateFuncs() {
    super.loadUpdateFuncs();
    this.value.onUpdate(() => {
      this.updateActiveConections();
      this.render();
      this.events.trigger("update");
    }, "conectionPath");
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
    const radius = 6;

    const conectionPos = {
      top: { x: width / 2, y: height / 2 - (height / 2) * 0.4 },
      bottom: { x: width / 2, y: height / 2 + (height / 2) * 0.4 },
      left: { x: width / 2 - (width / 2) * 0.4, y: height / 2 },
      right: { x: width / 2 + (width / 2) * 0.4, y: height / 2 },
    };
    const activeConections = this.activeConections.getValue();

    for (let conection of ["left", "right", "top", "bottom"]) {
      if (activeConections[conection]) {
        let pos = conectionPos[conection];
        this.display.drawLine(
          pos.x,
          pos.y,
          width / 2,
          height / 2,
          new DisplayStyle({
            fill: false,
            color: activeConections[conection].value
              ? C_ConectionIndicator.ActiveColor
              : C_ConectionIndicator.DesativeColor,
            lineStyle: new LineStyle({ lineWidth: 3 }),
          })
        );
        this.display.circle(
          pos.x,
          pos.y,
          radius,
          new DisplayStyle({
            color: activeConections[conection].value
              ? C_ConectionIndicator.ActiveColor
              : C_ConectionIndicator.DesativeColor,
          })
        );
      }
    }
  }
}

export default C_ConectionPath;
