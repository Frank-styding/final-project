import { RectCollider } from "../modules/Engine/Colliders/exports.js";
import { Component } from "../modules/Engine/Components/exports.js";
import { Display } from "../modules/Engine/Display/exports.js";
import { State } from "../modules/Engine/exports.js";
import {
  DisplayStyle,
  Color,
} from "../modules/Engine/Display/DisplayStyle/exports.js";

import C_CeldContainer from "./CeldContainer.js";
import C_ConectionIndicator from "./Celds/ConectionIndicator.js";
import C_ConectionPath from "./Celds/ConectionPath.js";

/* import C_CeldConectionIndicator from "./Celds/CeldConectionIndicator.js";
import C_CeldConectionPath from "./Celds/CeldConectionPath.js"; */

export class C_Board extends Component {
  constructor(celd_size, grid_width, grid_height) {
    super();
    this.className = "Board";
    this.display = new Display({
      width: celd_size * grid_width,
      height: celd_size * grid_height,
    });
    this.setCollider(
      new RectCollider(celd_size * grid_width, celd_size * grid_height)
    );

    this.celdSize = new State(celd_size);
    this.gridWidth = new State(grid_width);
    this.gridHeight = new State(grid_height);

    this.width = new State(celd_size * grid_width);
    this.height = new State(celd_size * grid_height);

    this.update();
    this.render();

    this.createCelds();
    this.alignCelds();
  }
  createCelds() {
    const gridWidth = this.gridWidth.getValue();
    const gridHeight = this.gridHeight.getValue();
    const celdSize = this.celdSize.getValue();
    this.grid = new Array(gridWidth * gridHeight).fill(undefined);
    for (let i = 0; i < gridHeight * gridWidth; i++) {
      let celd = new C_CeldContainer(celdSize);
      this.grid[i] = celd;
      this.addChild(celd);
    }
  }
  alignCelds() {
    const gridWidth = this.gridWidth.getValue();
    const gridHeight = this.gridHeight.getValue();
    const celdSize = this.celdSize.getValue();
    const width = this.width.getValue();
    const height = this.height.getValue();

    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        let pos = {
          x: celdSize / 2 + i * celdSize - width / 2,
          y: celdSize / 2 + j * celdSize - height / 2,
        };

        this.childs[i + j * gridWidth].transform.setValue((transform) => {
          transform.model.setTranslation(pos.x, pos.y);
          return transform;
        });
      }
    }
  }

  render() {
    const width = this.width.getValue();
    const height = this.height.getValue();
    this.display.clear();
    this.display.background(new Color(35, 35, 35));
  }
}
export default C_Board;
