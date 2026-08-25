import { BaseEditor } from './BaseEditor.js';

export class SelectEditor extends BaseEditor {
  render() {
    const select = document.createElement('select');
    select.required = this.metadata.required || false;

    // Add placeholder option if not required
    if (!this.metadata.required) {
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = this.metadata.placeholder || 'Select...';
      select.appendChild(empty);
    }

    this.metadata.options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label || opt.value;
      option.selected = opt.value === this.value;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      this.onCommit(select.value);
    });

    this.element = select;
    return select;
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

  validate() {
    if (this.metadata.required && !this.element?.value) {
      return { valid: false, message: 'Please select a value' };
    }
    return { valid: true, message: null };
  }
}

export default SelectEditor;
