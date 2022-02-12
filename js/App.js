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

    this.panelSelectedComponent = undefined;
    this.eraser = false;

    this.currentLevel = 1;

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
          new DT_ComponentContainer(this.getPanelComponents()),
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

  getImageSrc(component) {
    if (component.display) {
      return component.display.canvas.toDataURL("base64");
    }
  }

  getPanelComponents() {
    if (this.db.levels[this.currentLevel].panelComponents) {
      let _data = this.db.levels[this.currentLevel].panelComponents;
      const celdSize = this.db.levels[this.currentLevel].celdSize;

      return _data.map((data) => {
        let result = { name: data.name };
        if (data.name == "battery") {
          result.props = [data.activeConections, data.value];
          result.src = C_Battery.getImage([celdSize, ...result.props]);
        }
        if (data.name == "conectionPath") {
          result.props = [data.activeConections];
          result.src = C_ConectionPath.getImage([celdSize, ...result.props]);
        }
        return result;
      });
    }
  }

  loadComponents() {
    this.board = new C_Board(
      this.db.levels[this.currentLevel].celdSize,
      this.db.levels[this.currentLevel].gridWidth,
      this.db.levels[this.currentLevel].gridHeight
    );
    this.board.transform.setValue((transform) => {
      transform.model.translate(
        this.display.width / 2,
        this.display.height / 2
      );
      return transform;
    });
    this.controller.setMouseInteraction(this.board);

    this.db.levels[this.currentLevel].data.forEach((data, idx) => {
      if (data.name) {
        if (data.name == "battery") {
          this.board.grid[idx].setCeld(data.name, [
            data.activeConections,
            data.value,
          ]);
        } else {
          this.board.grid[idx].setCeld(data.name, [data.activeConections]);
        }
      }
    });

    this.templateRoot.glovalEvents.on("selected-component", (data) => {
      this.panelSelectedComponent = data;
      console.log(this.panelSelectedComponent);
    });

    this.templateRoot.glovalEvents.on("panel-click", () => {
      this.panelSelectedComponent = undefined;
    });

    this.board.events.on("mouseDown", (event) => {
      let celd = event.target;
      if (this.panelSelectedComponent) {
        celd.setCeld(
          this.panelSelectedComponent.name,
          this.panelSelectedComponent.props
        );
        this.updateCeldsState();
      }
    });

    this.updateCeldsState();
  }

  updateCeldsState() {
    let grid = this.board.grid;
    const gridWidth = this.board.gridWidth.getValue();
    const gridHeight = this.board.gridHeight.getValue();
    let getCeld = (x, y) => {
      if (!(x >= 0 && y >= 0 && x < gridWidth && y < gridHeight))
        return undefined;
      let celd = grid[x + y * gridWidth];
      if (celd.child.getValue()) {
        return celd;
      }
      return undefined;
    };
    let celds = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        let celd = getCeld(x, y);
        if (celd) {
          const directions = Object.keys(
            celd.child.getValue().activeConections.getValue()
          );
          celds.push({
            celd: celd.child.getValue(),
            directions,
            x,
            y,
            top: undefined,
            bottom: undefined,
            left: undefined,
            right: undefined,
          });
        }
      }
    }
    for (let celd of celds) {
      celd.directions.forEach((direction) => {
        switch (direction) {
          case "top":
            let top = celds.filter(
              (item) => item.x == celd.x && item.y == celd.y - 1
            );
            if (top.length > 0 && top[0].directions.indexOf("bottom") != -1) {
              celd.top = top[0];
              top[0].bottom = celd;
            }
            break;
          case "bottom":
            let bottom = celds.filter(
              (item) => item.x == celd.x && item.y == celd.y + 1
            );
            if (
              bottom.length > 0 &&
              bottom[0].directions.indexOf("top") != -1
            ) {
              celd.bottom = bottom[0];
              bottom[0].top = celd;
            }
            break;
          case "left":
            let left = celds.filter(
              (item) => item.x == celd.x - 1 && item.y == celd.y
            );
            if (left.length > 0 && left[0].directions.indexOf("right") != -1) {
              celd.left = left[0];
              left[0].right = celd;
            }
            break;
          case "right":
            let right = celds.filter(
              (item) => item.x == celd.x + 1 && item.y == celd.y
            );
            if (right.length > 0 && right[0].directions.indexOf("left") != -1) {
              celd.right = right[0];
              right[0].left = celd;
            }
            break;
        }
      });
    }
    let equal = (a, b) => {
      if (a.length != b.length) {
        return false;
      }
      for (let item of a) {
        let exits = false;
        for (let item1 of b) {
          if (item == item1) {
            exits = true;
          }
        }
        if (!exits) {
          return false;
        }
      }
      return true;
    };
    let trees = [];
    for (let celd of celds) {
      let list = [celd];
      let list1 = [];

      while (list.length > 0) {
        let item = list.pop();
        if (list1.indexOf(item) == -1) {
          list1.push(item);
          if (item.top) {
            if (list1.indexOf(item.top) == -1) {
              list.push(item.top);
            }
          }
          if (item.bottom) {
            if (list1.indexOf(item.bottom) == -1) {
              list.push(item.bottom);
            }
          }
          if (item.left) {
            if (list1.indexOf(item.left) == -1) {
              list.push(item.left);
            }
          }
          if (item.right) {
            if (list1.indexOf(item.right) == -1) {
              list.push(item.right);
            }
          }
        }
      }

      if (!trees.some((item) => equal(list1, item))) {
        trees.push(list1);
      }
    }
    trees.forEach((tree) => {
      let activeTree =
        tree.filter(
          (item) =>
            item.celd.className == "Battery" && item.celd.value.getValue()
        ).length > 0;

      tree.forEach((item) => {
        item.celd.value.setValue(activeTree);
      });
    });
  }
}
