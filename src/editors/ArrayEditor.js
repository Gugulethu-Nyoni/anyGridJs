import { BaseEditor } from './BaseEditor.js';
import { resolveEditor } from './EditorRegistry.js';

export class ArrayEditor extends BaseEditor {
  render() {
    const container = document.createElement('div');
    container.className = 'array-editor';

    const itemType = this.metadata.itemType || 'string';
    const label = this.metadata.label || 'Items';

    // Header
    const header = document.createElement('div');
    header.className = 'array-header';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'array-label';
    labelSpan.textContent = label;
    
    const badge = document.createElement('span');
    badge.className = 'array-type-badge';
    badge.textContent = itemType + '[]';
    
    header.appendChild(labelSpan);
    header.appendChild(badge);

    // Items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'array-items';

    const items = Array.isArray(this.value) ? this.value : [];

    items.forEach((item, index) => {
      itemsContainer.appendChild(this._createItemElement(item, index, itemType));
    });

    // Add button
    const addRow = document.createElement('div');
    addRow.className = 'array-add-row';

    const addBtn = document.createElement('button');
    addBtn.className = 'array-add-btn';
    addBtn.textContent = '+ Add Item';
    addBtn.type = 'button';

    addBtn.addEventListener('click', () => {
      const items = Array.isArray(this.value) ? [...this.value] : [];
      const defaultValue = this._getDefaultValue(itemType);
      items.push(defaultValue);
      this.value = items;
      this.onCommit(items);
      this._refreshItems(itemsContainer, itemType);
    });

    addRow.appendChild(addBtn);

    container.appendChild(header);
    container.appendChild(itemsContainer);
    container.appendChild(addRow);

    this.element = container;
    this._itemsContainer = itemsContainer;
    this._itemType = itemType;
    return container;
  }

  _createItemElement(item, index, itemType) {
    const row = document.createElement('div');
    row.className = 'array-item-row';

    const indexSpan = document.createElement('span');
    indexSpan.className = 'array-item-index';
    indexSpan.textContent = `#${index + 1}`;

    const valueContainer = document.createElement('div');
    valueContainer.className = 'array-item-value';

    const editor = this._createItemEditor(item, itemType, (newVal) => {
      const items = Array.isArray(this.value) ? [...this.value] : [];
      items[index] = newVal;
      this.value = items;
      this.onCommit(items);
    });

    if (editor) {
      valueContainer.appendChild(editor);
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'array-item-fallback';
      fallback.textContent = String(item);
      valueContainer.appendChild(fallback);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'array-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => {
      const items = Array.isArray(this.value) ? [...this.value] : [];
      items.splice(index, 1);
      this.value = items;
      this.onCommit(items);
      this._refreshItems(this._itemsContainer, this._itemType);
    });

    row.appendChild(indexSpan);
    row.appendChild(valueContainer);
    row.appendChild(removeBtn);

    return row;
  }

  _createItemEditor(value, itemType, onCommit) {
    let editorType = this._mapItemTypeToEditorType(itemType);
    const EditorClass = resolveEditor(editorType);
    if (!EditorClass) {
      return null;
    }

    const itemMetadata = {
      required: this.metadata.required || false,
      placeholder: this.metadata.placeholder || '',
    };

    if (editorType === 'select' || editorType === 'enum') {
      itemMetadata.options = this.metadata.options || [];
    }
    if (editorType === 'number' || editorType === 'decimal') {
      itemMetadata.min = this.metadata.min;
      itemMetadata.max = this.metadata.max;
      itemMetadata.step = this.metadata.step;
    }
    if (editorType === 'decimal') {
      itemMetadata.precision = this.metadata.precision || 2;
    }

    const editor = new EditorClass({
      value: value,
      metadata: itemMetadata,
      onCommit: onCommit
    });

    return editor.render();
  }

  _mapItemTypeToEditorType(itemType) {
    const typeMap = {
      'string': 'text',
      'text': 'text',
      'number': 'number',
      'int': 'number',
      'integer': 'number',
      'float': 'number',
      'decimal': 'decimal',
      'boolean': 'checkbox',
      'bool': 'checkbox',
      'datetime': 'datetime',
      'date': 'datetime',
      'enum': 'select',
      'select': 'select',
    };
    return typeMap[itemType] || 'text';
  }

  _getDefaultValue(itemType) {
    const defaults = {
      'string': '',
      'text': '',
      'number': 0,
      'int': 0,
      'integer': 0,
      'float': 0,
      'decimal': 0,
      'boolean': false,
      'bool': false,
      'datetime': new Date().toISOString(),
      'date': new Date().toISOString(),
      'enum': this.metadata.options?.[0]?.value || '',
      'select': this.metadata.options?.[0]?.value || '',
    };
    return defaults[itemType] ?? '';
  }

  _refreshItems(container, itemType) {
    if (!container) return;
    const items = Array.isArray(this.value) ? this.value : [];
    container.innerHTML = '';
    items.forEach((item, index) => {
      container.appendChild(this._createItemElement(item, index, itemType));
    });
  }

  getValue() {
    return Array.isArray(this.value) ? this.value : [];
  }

  setValue(value) {
    this.value = Array.isArray(value) ? value : [];
    if (this.element && this._itemsContainer) {
      this._refreshItems(this._itemsContainer, this._itemType);
    }
  }
}

export default ArrayEditor;
