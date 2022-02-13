import { DOMTemplate } from "../../modules/DOMTemplate/exports.js";

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

    this.glovalEvents.on("panel-click", () => {
      this.glovalEvents.trigger("unselect-components");
    });

    this.glovalEvents.on("unselect-components", () => {
      this.template.removeClass("selected");
    });

    this.template.on("click", (event) => {
      event.stopPropagation();

      this.template.animate(
        {
          height: this.template.height() + 5,
          width: this.template.height() + 5,
        },
        200,
        () => {
          this.template.animate(
            {
              height: this.template.height() - 5,
              width: this.template.height() - 5,
            },
            200
          );
        }
      );

      this.glovalEvents.trigger("unselect-components");
      this.template.addClass("selected");
      this.glovalEvents.trigger("selected-component", [data, this]);
    });
    this.template.on("dragstart", () => false);
  }
}
export default DT_Component;
