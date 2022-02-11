import { RectCollider } from "../modules/Engine/Colliders/exports.js";
import { Component } from "../modules/Engine/Components/exports.js";
import { Display } from "../modules/Engine/Display/exports.js";
import { State } from "../modules/Engine/exports.js";
import {
  DisplayStyle,
  Color,
  LineStyle,
} from "../modules/Engine/Display/DisplayStyle/exports.js";

export class C_Celd extends Component {
  static ActiveColor = new Color(237, 46, 46);
  static DesativeColor = new Color(255, 255, 255);

  constructor(celd_size) {
    super();

    this.display = new Display({
      width: celd_size,
      height: celd_size,
    });

    this.setCollider(new RectCollider(celd_size, celd_size));

    this.width = new State(celd_size);
    this.height = new State(celd_size);
    this.backgroundColor = new Color(35, 35, 35);

    this.activeConections = new State({
      left: undefined,
      right: undefined,
      top: undefined,
      bottom: undefined,
    });

    this.loadUpdateFuncs();
    this.render();
  }
  loadUpdateFuncs() {
    this.activeConections.onUpdate(() => {
      this.render();
    });

    this.events.on("mouseOver", () => {
      this.backgroundColor.r = 100;
      this.backgroundColor.g = 100;
      this.backgroundColor.b = 100;
      this.render();
    });

    this.events.on("mouseLeave", () => {
      this.backgroundColor.r = 35;
      this.backgroundColor.g = 35;
      this.backgroundColor.b = 35;
      this.render();
    });
  }
  render() {
    const width = this.width.getValue();
    const height = this.height.getValue();
    const activeContions = this.activeConections.getValue();

    this.display.clear();
    this.display.background(this.backgroundColor);

    if (activeContions.top) {
      this.display.rect(
        width / 2,
        3,
        width * 0.3,
        6,
        new DisplayStyle({
          color: activeContions.top.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }

    if (activeContions.bottom) {
      this.display.rect(
        width / 2,
        height - 3,
        width * 0.3,
        6,
        new DisplayStyle({
          color: activeContions.bottom.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }

    if (activeContions.right) {
      this.display.rect(
        width - 3,
        height / 2,
        6,
        height * 0.3,
        new DisplayStyle({
          color: activeContions.right.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }

    if (activeContions.left) {
      this.display.rect(
        3,
        height / 2,
        6,
        height * 0.3,
        new DisplayStyle({
          color: activeContions.left.value
            ? C_Celd.ActiveColor
            : C_Celd.DesativeColor,
        })
      );
    }

    this.display.rect(
      width / 2,
      height / 2,
      width - 1,
      height - 1,
      new DisplayStyle({
        fill: false,
        color: new Color(0, 0, 0),
        lineStyle: new LineStyle({ lineWidth: 2 }),
      })
    );
  }
}
export default C_Celd;
