import {
  DOMTemplate,
  DT_CanvasContainer,
  DT_Panel,
  DT_Component,
  DT_ComponentContainer,
} from "./modules/DOMTemplate/exports.js";

import C_Board from "./Components/Board.js";
import { Display } from "./modules/Engine/Display/exports.js";
import { Controller } from "./modules/Engine/exports.js";

let root = new DOMTemplate({
  template: $("#root"),
  childs: [
    new DT_CanvasContainer(),
    new DT_Panel("Components", [
      new DT_ComponentContainer(
        new Array(9).fill({
          src: "",
        })
      ),
    ]),
  ],
});
root.setGlovalEvents();

root.glovalEvents.on("selected-component", (data, component) => {
  console.log(data, component);
});

let rect = $(".canvas-container")[0].getBoundingClientRect();
let display = new Display({
  width: rect.width,
  height: rect.height,
  canvas: $("#canvas")[0],
});

let controller = new Controller.InputController($("#canvas")[0]);

let board = new C_Board(150, 4, 4);
controller.setMouseInteraction(board);
board.transform.setValue((transform) => {
  transform.model.translate(display.width / 2, display.height / 2);
  return transform;
});

function loop() {
  display.clear();
  board.update();
  display.renderComponent(board);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
