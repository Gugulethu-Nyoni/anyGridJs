// Base Editor Interface - All editors inherit from this
export class BaseEditor {
  constructor({ value, metadata, onCommit }) {
    this.value = value;
    this.metadata = metadata;
    this.onCommit = onCommit;
    this.element = null;
  }

  render() {
    throw new Error('render() must be implemented by subclass');
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
    if (this.element) {
      this._updateElement();
    }
  }

  focus() {
    if (this.element) {
      this.element.focus();
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }

  validate() {
    // UX validation only - not authoritative
    return { valid: true, message: null };
  }

  _updateElement() {
    // Override in subclasses
  }
}

export default BaseEditor;
