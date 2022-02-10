export class EventHandler {
  constructor(eventsNames = []) {
    this.events = {};
    if (Array.isArray(eventsNames)) {
      eventsNames.forEach((eventName) => (this.events[eventName] = []));
    } else {
      eventsNames[eventsNames] = [];
    }
  }

  setToEventHandler(eventHandler) {
    Object.keys(this.events).forEach((eventName) => {
      if (eventHandler.events[eventName] != undefined) {
        eventHandler.events[eventName].push(...this.events[eventName]);
      } else {
        eventHandler.events[eventName] = this.events[eventName];
      }
    });
  }

  on(name, callback) {
    if (this.events[name] == undefined) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  }

  trigger(name, props = []) {
    if (this.events[name] == undefined) {
      this.events[name] = [];
    }
    this.events[name].forEach((func) => func(...props));
  }
}
export default EventHandler;
