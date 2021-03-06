import { DOMTemplate } from "../../modules/DOMTemplate/exports.js";

export class DT_Panel extends DOMTemplate {
  constructor(title, childs) {
    super({
      tagName: "div",
      className: "panel",
      childs: [
        {
          tagName: "div",
          className: "title-container",
          childs: [
            {
              tagName: "div",
              className: "title",
              innerHTML: title,
            },
          ],
        },
        {
          tagName: "div",
          className: "container",
          childs: childs,
        },
      ],
    });

    this.template.on("click", (event) => {
      this.glovalEvents.trigger("panel-click");
    });
  }
}
export default DT_Panel;
