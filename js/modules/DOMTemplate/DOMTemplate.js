import EventHandler from "../EventHandler/EventHandler.js";

export class DOMTemplate {
  constructor(struct) {
    this.parents = [];
    this.parent = undefined;
    this.events = new EventHandler();
    this.glovalEvents = new EventHandler();
    this.createTemplate(struct);
  }

  createTemplate(struct) {
    this.createTemplateStruct(struct);
  }

  createTag({ tagName, className, attributes, id, innerHTML, template }) {
    if (tagName == undefined && template == undefined) return;

    let $element = $(template ?? document.createElement(tagName));

    if (className) {
      $element.addClass(className);
    }

    if (id) {
      $element.attr("id", id);
    }

    if (attributes) {
      Object.keys(attributes).forEach((attributeName) => {
        $element.attr(attributeName, attributes[attributeName]);
      });
    }
    if (innerHTML != undefined) {
      $element.html(innerHTML);
    }

    return $element;
  }

  createTemplateStruct(struct) {
    let isDomTemplate = struct.template instanceof DOMTemplate;
    let template = isDomTemplate ? struct.template : struct;

    this.template = isDomTemplate
      ? template.template
      : this.createTag(template);

    this.id = template.id;
    this.className = template.className;
    this.tagName = template.tagName;
    this.innerHTML = template.innerHTML;
    this.attributes = template.attributes;

    this.childs = (template.childs || []).map((child) => {
      if (child instanceof DOMTemplate) {
        this.setParents(child);

        return child;
      }
      if (child.template instanceof DOMTemplate) {
        this.setParents(child.template);
        return child.template;
      }

      let aux = new DOMTemplate(child);

      this.setParents(aux);

      return aux;
    });

    if (this.childs.length > 0) {
      this.template[0].innerHTML = "";
      this.childs.forEach((child) => {
        this.template.append(child.template);
      });
    }

    return this;
  }

  setParents(item) {
    item.parent = this;

    let getChilds = (item) => {
      let childs = [item];
      if (item.childs.length > 0) {
        item.childs.forEach((item) => {
          childs.push(...getChilds(item));
        });
      }
      return childs;
    };

    let childs = [];
    item.childs.forEach((child) => childs.push(...getChilds(child)));
    childs.forEach((child) => child.parents.push(this));
  }

  setGlovalEvents() {
    this.childs.forEach((child) => {
      child.glovalEvents.setToEventHandler(this.glovalEvents);
      child.glovalEvents = this.glovalEvents;
      child.setGlovalEvents();
    });
  }
}
export default DOMTemplate;
