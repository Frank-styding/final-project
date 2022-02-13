import C_Board from "./Components/Board.js";
import { Display } from "./modules/Engine/Display/exports.js";
import { Controller } from "./modules/Engine/exports.js";
import { C_Battery } from "./Components/Celds/Battery.js";
import { DOMTemplate } from "./modules/DOMTemplate/exports.js";

import DT_CanvasContainer from "./DOMTemplateComponents/CanvasContainer/CanvasContainer.js";
import DT_Panel from "./DOMTemplateComponents/Panel/Panel.js";
import DT_ComponentContainer from "./DOMTemplateComponents/Components/ComponentContainer.js";
import C_ConectionPath from "./Components/Celds/ConectionPath.js";
import DisplayStyle from "./modules/Engine/Display/DisplayStyle/DisplayStyle.js";
import TextStyle from "./modules/Engine/Display/DisplayStyle/TextStyle.js";

export class App {
  constructor(db) {
    this.requestAnimationFrameIdx = -1;
    this.run = false;
    this.db = db;

    this.panelSelectedComponent = undefined;
    this.eraser = false;

    const { level, data } = this.readLocalStore();

    this.currentLevel = level;
    this.levelData = this.db.levels[this.currentLevel].data;
    this.celdSize = this.db.levels[this.currentLevel].celdSize;
    this.gridWidth = this.db.levels[this.currentLevel].gridWidth;
    this.gridHeight = this.db.levels[this.currentLevel].gridHeight;

    this.templateRoot = this.createTemplate();
    this.templateRoot.setGlovalEvents();

    this.display = this.createDisplay();
    this.controller = this.createController();

    this.loadComponents();

    this.board.setByData(data);

    this.updateCeldsState();
    this.loadDomInteraction();
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

    this.display.text(
      this.display.width / 2,
      this.display.height - 50,
      "level " + (this.currentLevel + 1),
      new DisplayStyle({
        textStyle: new TextStyle({
          textAlign: "center",
          textBaseline: "middle",
          font: "30px Roboto",
        }),
      })
    );
    if (this.run) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }
  stop() {
    this.run = false;
  }
  reset() {
    this.loadComponents();
    this.loadDomInteraction();
    this.updateCeldsState();
  }

  //load
  getPanelComponents() {
    if (this.db.levels[this.currentLevel].panelComponents) {
      let components = this.db.levels[this.currentLevel].panelComponents;
      const celdSize = this.db.levels[this.currentLevel].celdSize;

      return components.map((component) => {
        let result = { name: component.name };
        if (component.name == "Battery") {
          result.props = [component.activeConections, component.value];
          result.src = C_Battery.getImage([celdSize, ...result.props]);
        }
        if (component.name == "ConectionPath") {
          result.props = [component.activeConections];
          result.src = C_ConectionPath.getImage([celdSize, ...result.props]);
        }
        return result;
      });
    }
  }
  loadComponents() {
    this.board = new C_Board(this.celdSize, this.gridWidth, this.gridHeight);
    this.board.transform.setValue((transform) => {
      transform.model.translate(
        this.display.width / 2,
        this.display.height / 2
      );
      return transform;
    });
    this.levelData.forEach((data, idx) => {
      if (data.name) {
        switch (data.name) {
          case "Battery":
            this.board.grid[idx].setCeld(data.name, [
              data.activeConections,
              data.value,
            ]);
            break;
          default:
            this.board.grid[idx].setCeld(data.name, [data.activeConections]);
            break;
        }
      }
    });
    this.controller.setMouseInteraction(this.board);
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

    let inverDirection = (direction) => {
      if (direction == "top") return "bottom";
      if (direction == "bottom") return "top";
      if (direction == "left") return "right";
      if (direction == "right") return "left";
    };

    for (let celd of celds) {
      celd.directions.forEach((direction) => {
        let pos = {
          x:
            celd.x +
            (direction === "left" ? -1 : direction === "right" ? 1 : 0),
          y:
            celd.y +
            (direction === "top" ? -1 : direction === "bottom" ? 1 : 0),
        };
        let list = celds.filter((item) => item.x === pos.x && item.y === pos.y);
        if (
          list.length > 0 &&
          list[0].directions.indexOf(inverDirection(direction)) != -1
        ) {
          celd[direction] = list[0];
          list[0][inverDirection(direction)] = celd;
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

        let addItemInList = (item) => {
          if (list1.indexOf(item) == -1) {
            list.push(item);
          }
        };

        if (list1.indexOf(item) == -1) {
          list1.push(item);
          if (item.top) {
            addItemInList(item.top);
          }
          if (item.bottom) {
            addItemInList(item.bottom);
          }
          if (item.right) {
            addItemInList(item.right);
          }
          if (item.left) {
            addItemInList(item.left);
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
            item.celd.className == "Battery" &&
            item.celd.value.getValue() &&
            item.celd.state == "Charged"
        ).length > 0;

      tree.forEach((item) => {
        item.celd.value.setValue(activeTree);
      });
    });

    this.advanceLevel();
  }

  advanceLevel() {
    if (this.levelIsComplete()) {
      if (this.currentLevel + 1 < this.db.levels.length) {
        this.currentLevel++;
      } else {
        this.currentLevel = 0;
      }
      this.updateLevel();
    }
    this.saveInLocalStorage();
  }

  loadDomInteraction() {
    this.templateRoot.glovalEvents.on("selected-component", (data) => {
      this.templateRoot.glovalEvents.trigger("unselect-eraser-btn");
      this.templateRoot.glovalEvents.trigger("unselect-reset-btn");
      this.panelSelectedComponent = data;
      this.eraser = false;
    });
    this.templateRoot.glovalEvents.on("btn-reset-click", () => {
      this.templateRoot.glovalEvents.trigger("unselect-components");
      this.templateRoot.glovalEvents.trigger("unselect-eraser-btn");
      this.templateRoot.glovalEvents.trigger("select-reset-btn");
      this.reset();
    });
    this.templateRoot.glovalEvents.on("btn-eraser-click", () => {
      this.templateRoot.glovalEvents.trigger("unselect-components");
      this.templateRoot.glovalEvents.trigger("unselect-reset-btn");
      this.templateRoot.glovalEvents.trigger("select-eraser-btn");
      this.panelSelectedComponent = undefined;
      this.eraser = true;
    });
    this.templateRoot.glovalEvents.on("panel-click", () => {
      this.templateRoot.glovalEvents.trigger("unselect-eraser-btn");
      this.templateRoot.glovalEvents.trigger("unselect-reset-btn");
      this.panelSelectedComponent = undefined;
      this.eraser = false;
    });
    this.board.events.on("mouseDown", (event) => {
      let celd = event.target;
      let isInitalCeld = false;
      this.board.grid.forEach((item, idx) => {
        if (item == celd) {
          if (this.db.levels[this.currentLevel].data[idx].name) {
            isInitalCeld = true;
          }
        }
      });
      if (!isInitalCeld) {
        if (this.eraser) {
          celd.clearCeld();
          this.updateCeldsState();
        }
        if (this.panelSelectedComponent) {
          celd.setCeld(
            this.panelSelectedComponent.name,
            this.panelSelectedComponent.props
          );
          this.updateCeldsState();
        }
      }
    });
  }

  //level
  levelIsComplete() {
    let dischargedBatteries = this.board.grid
      .filter((item) => item.child.getValue())
      .filter(
        (item) =>
          item.child.getValue().className == "Battery" &&
          item.child.getValue().state == "Discharged"
      );
    let isComplete =
      dischargedBatteries.filter(
        (item) => item.child.getValue().value.getValue() == true
      ).length == dischargedBatteries.length;
    return isComplete;
  }

  updateLevel() {
    if (this.db.levels[this.currentLevel] != undefined) {
      this.levelData = this.db.levels[this.currentLevel].data;
      this.celdSize = this.db.levels[this.currentLevel].celdSize;
      this.gridWidth = this.db.levels[this.currentLevel].gridWidth;
      this.gridHeight = this.db.levels[this.currentLevel].gridHeight;
      this.templateRoot = this.createTemplate();
      this.templateRoot.setGlovalEvents();

      this.display = this.createDisplay();
      this.controller = this.createController();
      this.loadComponents();
      this.loadDomInteraction();
      this.updateCeldsState();
    }
  }

  saveInLocalStorage() {
    localStorage.setItem("level", this.currentLevel);
    localStorage.setItem("data", JSON.stringify(this.board.getAsData()));
  }

  readLocalStore() {
    if (
      localStorage.getItem("level") == null &&
      localStorage.getItem("data") == null
    )
      return {
        level: 0,
        data: [],
      };

    return {
      level: parseInt(localStorage.getItem("level")),
      data: JSON.parse(localStorage.getItem("data")),
    };
  }
}
