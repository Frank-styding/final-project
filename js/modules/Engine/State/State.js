export class State {
  constructor(initialValue) {
    this._value = initialValue;
    this.events = [];
  }

  onUpdate(func, name = "") {
    if (name != "") {
      if (this.events.filter((item) => item.name == name).length > 0) {
        return;
      }
    }
    this.events.push({ name, func });
  }

  setValue(a, b = null) {
    if (typeof a == "function") {
      let _value = this.clone(this._value);
      _value = a(_value);
      if (!this.equal(_value, this._value)) {
        this._value = a(this._value);
        this.events.forEach((event) => event.func(this._value));
      }
      return;
    }

    if (b != null && typeof this._value == "object") {
      if (Array.isArray(a)) {
        let _value = this._value;

        for (let i = 0; i < a.length - 1; i++) {
          _value = _value[a[i]];
        }

        if (!this.equal(_value[a[a.length - 1]], b)) {
          _value[a[a.length - 1]] = b;
          this.events.forEach((event) => event.func(this._value));
        }

        return;
      }

      if (!this.equal(this._value[a], b)) {
        this._value[a] = b;
        this.events.forEach((event) => event.func(this._value));
      }
      return;
    }

    if (!this.equal(a, this._value)) {
      this._value = a;
      this.events.forEach((event) => event.func(this._value));
    }
  }

  getValue() {
    return this._value;
  }

  equal(a, b) {
    if (typeof a == "object" && typeof b == "object") {
      const keys1 = Object.keys(a);
      const keys2 = Object.keys(b);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let key of keys1) {
        if (!this.equal(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a == b;
  }
  clone(object) {
    if (typeof object == "object") {
      const keys = Object.keys(object);

      let result = {};

      for (let key of keys) {
        result[key] = this.clone(object[key]);
      }
      Object.setPrototypeOf(result, Object.getPrototypeOf(object));
      return result;
    }
    if (Array.isArray(object)) {
      return object.slice();
    }
    return object;
  }
}
export default State;
