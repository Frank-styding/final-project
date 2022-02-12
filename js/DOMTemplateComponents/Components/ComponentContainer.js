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
          className: "container",
          childs: data.map((component) => new DT_Component(component)),
        },
      ],
    });
  }
}
export default DT_ComponentContainer;
