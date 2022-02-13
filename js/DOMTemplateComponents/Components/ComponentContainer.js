import { DOMTemplate } from "../../modules/DOMTemplate/exports.js";
import { DT_Component } from "./Component.js";

export class DT_ComponentContainer extends DOMTemplate {
  constructor(data) {
    super({
      tagName: "div",
      className: "component-container",
      childs: [
        {
          tagName: "div",
          className: "btn-container",
          childs: [
            {
              tagName: "div",
              className: "btn eraser",
              id: "eraser",
              innerHTML: "eraser",
            },
            {
              tagName: "div",
              className: "btn reset",
              id: "reset",
              innerHTML: "reset",
            },
          ],
        },
        {
          tagName: "div",
          className: "container",
          childs: data.map((component) => new DT_Component(component)),
        },
      ],
    });

    let $eraser = this.childs[0].childs[0].template;
    let $reset = this.childs[0].childs[1].template;

    $eraser.on("click", (event) => {
      event.stopPropagation();

      this.glovalEvents.trigger("btn-eraser-click");
    });

    $reset.on("click", (event) => {
      event.stopPropagation();
      this.glovalEvents.trigger("btn-reset-click");
    });

    this.glovalEvents.on("select-eraser-btn", () => {
      this.childs[0].childs[0].template.addClass("selected");
    });
    this.glovalEvents.on("unselect-eraser-btn", () => {
      this.childs[0].childs[0].template.removeClass("selected");
    });

    this.glovalEvents.on("select-reset-btn", () => {
      this.childs[0].childs[1].template.addClass("selected");
    });
    this.glovalEvents.on("unselect-reset-btn", () => {
      this.childs[0].childs[1].template.removeClass("selected");
    });
  }
}
export default DT_ComponentContainer;
