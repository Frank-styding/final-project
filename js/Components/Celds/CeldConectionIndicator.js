import {
  DisplayStyle,
  Color,
} from "../../modules/Engine/Display/DisplayStyle/exports.js";

import C_Celd from "../Celd.js";

export class C_CeldConectionIndicator extends C_Celd {
  constructor(celdSize) {
    super(celdSize);
    this.activeConections.setValue("bottom", { value: false });
    this.activeConections.setValue("left", { value: false });
    this.activeConections.setValue("top", { value: true });
    this.render();
  }
  render() {
    super.render();
    const width = this.width.getValue();
    const height = this.height.getValue();
    const activeContions = this.activeConections.getValue();
    const radius = 6;

    if (activeContions.top) {
      this.display.circle(
        width / 2,
        height / 2 - (height / 2) * 0.4,
        radius,
        new DisplayStyle({
          color: activeContions.top.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }
    if (activeContions.bottom) {
      this.display.circle(
        width / 2,
        height / 2 + (height / 2) * 0.4,
        radius,
        new DisplayStyle({
          color: activeContions.bottom.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }
    if (activeContions.left) {
      this.display.circle(
        width / 2 - (width / 2) * 0.4,
        height / 2,
        radius,
        new DisplayStyle({
          color: activeContions.left.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }
    if (activeContions.right) {
      this.display.circle(
        width / 2 + (width / 2) * 0.4,
        height / 2,
        radius,
        new DisplayStyle({
          color: activeContions.right.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }
  }
}
export default C_CeldConectionIndicator;
