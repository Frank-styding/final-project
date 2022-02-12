import { State } from "../State/State.js";
import { Transform, Vector2 } from "../Math/exports.js";
import EventHandler from "../../EventHandler/EventHandler.js";

export class Component {
  static ID = -1;
  constructor() {
    Component.ID++;

    this.id = Component.ID;
    this.name = "";
    this.className = "Component";

    this.display = undefined;
    this.collider = new State(undefined);
    this.transform = new State(new Transform());
    this.pos = new State(new Vector2());

    this.childs = [];
    this.parent = undefined;

    this.events = new EventHandler([
      "keyDown",
      "keyPress",
      "keyUp",
      "mouseDown",
      "mouseUp",
      "mouseMove",
      "mouseLeave",
      "mouseOver",
    ]);

    this.hasMouseInteraction = true;
    this.hasKeyboardInteraction = true;
  }

  loadUpdateFuncs() {}

  _update() {}
  update() {
    this._update();

    this.pos.setValue(
      this.pos
        .getValue()
        .copy(this.transform.getValue().getTransformMatrix().getTranslation())
    );

    this.childs.forEach((child) => child.update());
  }

  render() {}

  setCollider(collider) {
    collider.pos = this.pos.getValue();
    collider.transform = this.transform.getValue();
    this.collider.setValue(() => collider);
  }

  addChild(child) {
    child.parent = this;

    child.transform.setValue((transform) => {
      transform.setParentTransform(this.transform.getValue());
      return transform;
    });

    this.childs.push(child);
  }
}
export default Component;
