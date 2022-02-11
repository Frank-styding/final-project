import {
  LineStyle,
  DisplayStyle,
  Color,
} from "../../modules/Engine/Display/DisplayStyle/exports.js";
import State from "../../modules/Engine/State/State.js";
import C_Celd from "../Celd.js";
import C_CeldConectionIndicator from "./CeldConectionIndicator.js";

export class C_CeldConectionPath extends C_CeldConectionIndicator {
  constructor(celdSize, conections = []) {
    super(celdSize);
    this.conections = conections;
    this.updateActiveConections();
    this.loadUpdateFuncs();
    this.render();
  }
  loadUpdateFuncs() {
    super.loadUpdateFuncs();
    this.activeConections.onUpdate(() => this.updateActiveConections());
  }
  updateActiveConections() {
    if (this.conections == undefined) return;

    const activeContions = this.activeConections.getValue();

    let value = false;
    for (let conection of this.conections) {
      if (activeContions[conection]) {
        value |= activeContions[conection].value;
      }
    }

    for (let conection of this.conections) {
      if (activeContions[conection]) {
        activeContions[conection].value = value;
      }
    }
  }
  render() {
    super.render();
    const width = this.width.getValue();
    const height = this.height.getValue();
    const radius = 6;

    if (this.conections != undefined) {
      const conectionPos = {
        top: { x: width / 2, y: height / 2 - (height / 2) * 0.4 },
        bottom: { x: width / 2, y: height / 2 + (height / 2) * 0.4 },
        left: { x: width / 2 - (width / 2) * 0.4, y: height / 2 },
        left: { x: width / 2 - (width / 2) * 0.4, y: height / 2 },
      };

      for (let conection of this.conections) {
      }
    }

    this.display.drawLine(
      width / 2,
      height / 2 - (height / 2) * 0.4 + radius / 2,
      width / 2,
      height / 2 + (height / 2) * 0.4 - radius / 2,
      new DisplayStyle({
        fill: false,
        color: C_Celd.ActiveColor,
        lineStyle: new LineStyle({ lineWidth: 3 }),
      })
    );
  }
}
export default C_CeldConectionPath;
