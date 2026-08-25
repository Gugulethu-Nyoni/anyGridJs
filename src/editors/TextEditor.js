import { BaseEditor } from './BaseEditor.js';

export class TextEditor extends BaseEditor {
  render() {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = this.value ?? '';
    input.placeholder = this.metadata.placeholder || '';
    input.required = this.metadata.required || false;

    input.addEventListener('blur', () => {
      this.onCommit(input.value);
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.onCommit(input.value);
      }
    });

    this.element = input;
    return input;
  }

  getValue() {
    return this.element?.value || null;
  }

  setValue(value) {
    this.value = value;
    if (this.element) {
      this.element.value = value ?? '';
    }
  }

  _updateElement() {
    if (this.element) {
      this.element.value = this.value ?? '';
    }
  }
}

export default TextEditor;
