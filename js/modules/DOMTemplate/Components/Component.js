import { DOMTemplate } from "../DOMTemplate.js";

export class DT_Component extends DOMTemplate {
  constructor(data) {
    super({
      tagName: "div",
      className: "component",
      childs: [
        {
          tagName: "img",
          attributes: {
            src: data.src,
          },
        },
      ],
    });
    this.data = data;

    this.template.on("click", () => {
      this.glovalEvents.trigger("selected-component", [data, this]);
    });
  }
}
export default DT_Component;
