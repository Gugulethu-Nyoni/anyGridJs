import { BaseEditor } from './BaseEditor.js';

export class TextareaEditor extends BaseEditor {
  render() {
    const textarea = document.createElement('textarea');
    textarea.value = this.value ?? '';
    textarea.placeholder = this.metadata.placeholder || '';
    textarea.rows = this.metadata.rows || 4;
    textarea.required = this.metadata.required || false;

    textarea.addEventListener('blur', () => {
      this.onCommit(textarea.value);
    });

    textarea.addEventListener('keyup', (e) => {
      // Ctrl+Enter or Cmd+Enter to commit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.onCommit(textarea.value);
      }
    });

    this.element = textarea;
    return textarea;
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

export default TextareaEditor;
