import KeyboardController from "./KeyboardController.js";
import MouseController from "./MouseController.js";

export class InputController {
  constructor(template) {
    this.template = template;
    this.mouse = new MouseController();
    this.keyboard = new KeyboardController();
    this.loadEvents();
  }

  loadEvents() {
    $(this.template).on("mousedown", this.mouse.mouseDownHandler());
    $(this.template).on("mouseup", this.mouse.mouseUpHandler());
    $(this.template).on("mousemove", this.mouse.mouseMoveHandler());

    $(window).keydown(this.keyboard.keyDownHandler());
    $(window).keypress(this.keyboard.keyPressHandler());
    $(window).keyup(this.keyboard.keyUpHandler());
  }

  setMouseInteraction(component) {
    let findComponentsSelection = (component, x, y) => {
      let result = [];

      if (
        component.hasMouseInteraction &&
        component.collider.getValue() != undefined
      ) {
        if (component.collider.getValue().pointIsInside(x, y)) {
          result.push(component);
        }
      }

      for (let child of component.childs) {
        let childResult = findComponentsSelection(child, x, y);

        if (childResult.length > 0) {
          result.push(...childResult);
        }
      }

      return result;
    };

    let selectedComponents = [],
      lastSelectedComponents = [],
      event = {};

    let createContext = (e) => {
      e.target = selectedComponents[selectedComponents.length - 1];
      e.targets = selectedComponents;
      return e;
    };

    this.mouse.events.down.push((e) => {
      event = createContext(e);

      selectedComponents.forEach((selectedComponent) => {
        selectedComponent.events.trigger("mouseDown", [e]);
      });
    });

    this.mouse.events.up.push((e) => {
      event = createContext(e);

      selectedComponents.forEach((selectedComponent) => {
        selectedComponent.events.trigger("mouseUp", [e]);
      });
    });

    this.mouse.events.move.push((e) => {
      event = createContext(e);

      selectedComponents.forEach((selectedComponent) => {
        selectedComponent.events.trigger("mouseMove", [e]);
      });
    });

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

    setInterval(() => {
      selectedComponents = findComponentsSelection(
        component,
        this.mouse.x,
        this.mouse.y
      );

      if (
        !equal(lastSelectedComponents, selectedComponents) ||
        lastSelectedComponents.length == 0
      ) {
        event = createContext(event);

        lastSelectedComponents.forEach((selectedComponent) => {
          selectedComponent.events.trigger("mouseLeave", [event]);
        });

        selectedComponents.forEach((selectedComponent) => {
          selectedComponent.events.trigger("mouseOver", [event]);
        });

        lastSelectedComponents = selectedComponents;
        selectedComponents = [];
      }
    }, 1);
  }

  setKeyBoardInteraction(component) {
    let subComponents = [];

    let findComponents = (component) => {
      if (component.hasKeyboardInteraction) {
        subComponents.push(component);
      }
      component.childs.forEach((item) => findComponents(item));
    };

    findComponents(component);

    this.keyboard.events.down.push((event) =>
      subComponents.forEach((subComponent) => subComponent.keyDown(event))
    );

    this.keyboard.events.down.push((event) =>
      subComponents.forEach((subComponent) => subComponent.keyPress(event))
    );

    this.keyboard.events.down.push((event) =>
      subComponents.forEach((subComponent) => subComponent.keyUp(event))
    );
  }
}
export default InputController;
