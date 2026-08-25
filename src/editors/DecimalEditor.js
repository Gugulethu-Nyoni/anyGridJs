import { BaseEditor } from './BaseEditor.js';

export class DecimalEditor extends BaseEditor {
  render() {
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'decimal';
    input.value = this.value ?? '';
    input.placeholder = this.metadata.placeholder || '';
    input.required = this.metadata.required || false;

    // Format on blur
    input.addEventListener('blur', () => {
      const val = this._parseDecimal(input.value);
      this.onCommit(val);
      // Display formatted value
      if (val !== null) {
        input.value = this._formatDecimal(val);
      }
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const val = this._parseDecimal(input.value);
        this.onCommit(val);
        if (val !== null) {
          input.value = this._formatDecimal(val);
        }
      }
    });

    // Allow only valid decimal input
    input.addEventListener('input', () => {
      // Remove non-numeric characters except decimal point
      const cleaned = input.value.replace(/[^0-9.]/g, '');
      // Only allow one decimal point
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        input.value = parts[0] + '.' + parts.slice(1).join('');
      } else {
        input.value = cleaned;
      }
    });

    this.element = input;
    return input;
  }

  _parseDecimal(value) {
    if (!value || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  _formatDecimal(value) {
    if (value === null) return '';
    const precision = this.metadata.precision || 2;
    return Number(value).toFixed(precision);
  }

  getValue() {
    return this._parseDecimal(this.element?.value);
  }

  setValue(value) {
    this.value = value;
    if (this.element) {
      this.element.value = value !== null ? this._formatDecimal(value) : '';
    }
  }

  _updateElement() {
    if (this.element) {
      this.element.value = this.value !== null ? this._formatDecimal(this.value) : '';
    }
  }

  validate() {
    const val = this._parseDecimal(this.element?.value);
    if (this.metadata.required && val === null) {
      return { valid: false, message: 'This field is required' };
    }
    if (val !== null && this.metadata.min !== undefined && val < this.metadata.min) {
      return { valid: false, message: `Value must be at least ${this.metadata.min}` };
    }
    if (val !== null && this.metadata.max !== undefined && val > this.metadata.max) {
      return { valid: false, message: `Value must be at most ${this.metadata.max}` };
    }
    return { valid: true, message: null };
  }
}

export default DecimalEditor;
