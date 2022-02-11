import { DOMTemplate } from "../DOMTemplate.js";

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
  }
}
export default DT_Panel;
