import Component from "./Component.js";
import Display from "../Display/Display.js";
import { Color, DisplayStyle } from "../Display/DisplayStyle/exports.js";
import { RectCollider } from "../Colliders/exports.js";
import { State } from "../State/State.js";

export class C_Celd extends Component {
  constructor(celd_size) {
    super();
    this.display = new Display({
      width: celd_size,
      height: celd_size,
    });
    this.setCollider(new RectCollider(celd_size, celd_size));
    this.width = new State(celd_size);
    this.height = new State(celd_size);

    this.state = false;

    this.loadUpdateFuncs();
    this.render();
  }
  loadUpdateFuncs() {}
  render() {
    const width = this.width.getValue();
    const height = this.height.getValue();

    this.display.clear();
  }
}
export default C_Celd;
