import { RectCollider } from "../modules/Engine/Colliders/exports.js";
import { Component } from "../modules/Engine/Components/exports.js";
import { State } from "../modules/Engine/exports.js";
import {
  DisplayStyle,
  Color,
  LineStyle,
  Display,
} from "../modules/Engine/Display/exports.js";

import C_ConectionPath from "./Celds/ConectionPath.js";
import { C_Battery } from "./Celds/Battery.js";

export class C_CeldContainer extends Component {
  static ActiveColor = new Color(237, 46, 46);
  static DesativeColor = new Color(255, 255, 255);

  constructor(celd_size) {
    super();
    this.className = "CeldContainer";

    this.display = new Display({
      width: celd_size,
      height: celd_size,
    });

    this.setCollider(new RectCollider(celd_size, celd_size));

    this.celdSize = new State(celd_size);

    this.backgroundColor = new Color(35, 35, 35);

    this.child = new State(undefined);

    this.child.onUpdate(() => {
      this.child.getValue().events.on("update", () => {
        this.render();
      });
    });

    this.loadUpdateFuncs();
    this.render();
  }
  setCeld(celdName, props) {
    this.child._value = undefined;
    switch (celdName) {
      case "Battery":
        this.child.setValue(new C_Battery(this.celdSize.getValue(), ...props));
        break;
      case "ConectionPath":
        this.child.setValue(
          new C_ConectionPath(this.celdSize.getValue(), ...props)
        );
        break;
    }
  }
  clearCeld() {
    this.child._value = undefined;
    this.render();
  }
  getCeldData() {
    if (!this.child.getValue()) return undefined;
    return {
      name: this.child.getValue().className,
    };
  }
  loadUpdateFuncs() {
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

    this.child.onUpdate(() => {
      if (this.child.getValue()) {
        this.child.getValue().parent = this;
        this.child.getValue().transform.setValue((transform) => {
          transform.model.translate(
            this.celdSize.getValue() / 2,
            this.celdSize.getValue() / 2
          );
          return transform;
        });
        this.render();
      }
    });
  }
  render() {
    const width = this.celdSize.getValue();
    const height = this.celdSize.getValue();

    this.display.clear();
    this.display.background(this.backgroundColor);

    if (this.child.getValue()) {
      this.display.renderComponent(this.child.getValue());
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
export default C_CeldContainer;
