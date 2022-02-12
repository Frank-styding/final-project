import C_Board from "./Components/Board.js";
import { Display } from "./modules/Engine/Display/exports.js";
import { Controller } from "./modules/Engine/exports.js";
import { C_Battery } from "./Components/Celds/Battery.js";
import { DOMTemplate } from "./modules/DOMTemplate/exports.js";

import DT_CanvasContainer from "./DOMTemplateComponents/CanvasContainer/CanvasContainer.js";
import DT_Panel from "./DOMTemplateComponents/Panel/Panel.js";
import DT_ComponentContainer from "./DOMTemplateComponents/Components/ComponentContainer.js";
import C_ConectionPath from "./Components/Celds/ConectionPath.js";

export class App {
  constructor(db) {
    this.requestAnimationFrameIdx = -1;
    this.run = false;
    this.db = db;

    console.log(this.db.level1);

    this.templateRoot = this.createTemplate();
    this.templateRoot.setGlovalEvents();

    this.display = this.createDisplay();
    this.controller = this.createController();

    this.loadComponents();
  }

  createTemplate() {
    return new DOMTemplate({
      template: $("#root"),
      childs: [
        new DT_CanvasContainer(),
        new DT_Panel("Components", [
          new DT_ComponentContainer(
            this.getImagesSrc().map((item) => ({ src: item }))
          ),
        ]),
      ],
    });
  }
  createDisplay() {
    let rect = $(".canvas-container")[0].getBoundingClientRect();
    return new Display({
      width: rect.width,
      height: rect.height,
      canvas: $("#canvas")[0],
    });
  }
  createController() {
    return new Controller.InputController($("#canvas")[0]);
  }
  start() {
    this.run = true;
    this.requestAnimationFrame = requestAnimationFrame(this.loop.bind(this));
  }
  loop() {
    this.display.clear();
    this.board.update();
    this.display.renderComponent(this.board);

    if (this.run) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }
  stop() {
    this.run = false;
  }
  getImagesSrc() {
    if (this.db.level1.panelComponents) {
      let datas = this.db.level1.panelComponents;
      const celdSize = this.db.level1.celdSize;

      return datas.map((data) => {
        console.log(data.activeConections);
        let canvas = undefined;
        switch (data.name) {
          case "battery":
            canvas = new C_Battery(celdSize, data.activeConections).display
              .canvas;
            break;
          case "conectionPath":
            canvas = new C_ConectionPath(celdSize, data.activeConections)
              .display.canvas;
            break;
        }
        return canvas.toDataURL("base64");
      });
    }
    return [];
  }
  loadComponents() {
    this.getImagesSrc();
    this.board = new C_Board(
      this.db.level1.celdSize,
      this.db.level1.gridWidth,
      this.db.level1.gridHeight
    );
    this.board.transform.setValue((transform) => {
      transform.model.translate(
        this.display.width / 2,
        this.display.height / 2
      );
      return transform;
    });
    this.controller.setMouseInteraction(this.board);

    this.db.level1.data.forEach((data, idx) => {
      if (data.name) {
        this.board.grid[idx].setCeld(data.name, [data.activeConections]);
      }
    });

    /*  this.board.grid[6].setCeld("conectionPath", [["left", "top"]]);
    this.board.grid[3].setCeld("battery", [["top", "bottom"]]); */

    /* let value = true;
    this.board.grid[6].events.on("mouseDown", () => {
      this.board.grid[6].child.getValue().value.setValue(value);
      this.board.grid[3].child.getValue().value.setValue(value);

      value = !value;
    }); */
  }
}
