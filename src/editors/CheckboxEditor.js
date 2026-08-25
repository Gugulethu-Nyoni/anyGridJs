import { BaseEditor } from './BaseEditor.js';

export class CheckboxEditor extends BaseEditor {
  render() {
    const container = document.createElement('div');
    container.className = 'checkbox-editor';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!this.value;
    input.required = this.metadata.required || false;

    const label = document.createElement('label');
    label.textContent = this.metadata.label || '';

    input.addEventListener('change', () => {
      this.onCommit(input.checked);
    });

    container.appendChild(input);
    if (label.textContent) {
      container.appendChild(label);
    }

    this.element = container;
    this._input = input;
    return container;
  }

  getValue() {
    return this._input?.checked || false;
  }

  setValue(value) {
    this.value = value;
    if (this._input) {
      this._input.checked = !!value;
    }
  }

  focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  _updateElement() {
    if (this._input) {
      this._input.checked = !!this.value;
    }
  }
}

export default CheckboxEditor;
