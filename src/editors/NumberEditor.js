import { BaseEditor } from './BaseEditor.js';

export class NumberEditor extends BaseEditor {
  render() {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = this.value ?? '';
    input.min = this.metadata.min;
    input.max = this.metadata.max;
    input.step = this.metadata.step || 'any';
    input.placeholder = this.metadata.placeholder || '';
    input.required = this.metadata.required || false;

    input.addEventListener('blur', () => {
      const val = parseFloat(input.value);
      this.onCommit(isNaN(val) ? null : val);
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const val = parseFloat(input.value);
        this.onCommit(isNaN(val) ? null : val);
      }
    });

    this.element = input;
    return input;
  }

  getValue() {
    const val = parseFloat(this.element?.value);
    return isNaN(val) ? null : val;
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

  validate() {
    const val = parseFloat(this.element?.value);
    if (this.metadata.required && (val === null || isNaN(val))) {
      return { valid: false, message: 'This field is required' };
    }
    if (this.metadata.min !== undefined && val < this.metadata.min) {
      return { valid: false, message: `Value must be at least ${this.metadata.min}` };
    }
    if (this.metadata.max !== undefined && val > this.metadata.max) {
      return { valid: false, message: `Value must be at most ${this.metadata.max}` };
    }
    return { valid: true, message: null };
  }
}

export default NumberEditor;
