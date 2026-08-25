import { BaseEditor } from './BaseEditor.js';

export class TagsEditor extends BaseEditor {
  render() {
    const container = document.createElement('div');
    container.className = 'tags-editor';

    // Tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags-container';

    // Render existing tags
    const tags = Array.isArray(this.value) ? this.value : [];
    tags.forEach(tag => {
      tagsContainer.appendChild(this._createTagElement(tag));
    });

    // Show placeholder if no tags
    if (tags.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'tags-placeholder';
      placeholder.textContent = 'No tags added yet';
      tagsContainer.appendChild(placeholder);
    }

    // Input row
    const inputRow = document.createElement('div');
    inputRow.className = 'tags-input-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tags-input';
    input.placeholder = this.metadata.placeholder || 'Add tag...';

    const addBtn = document.createElement('button');
    addBtn.className = 'tags-add-btn';
    addBtn.textContent = '+';
    addBtn.type = 'button';

    const addTag = () => {
      const val = input.value.trim();
      if (val) {
        const currentTags = Array.isArray(this.value) ? this.value : [];
        if (!currentTags.includes(val)) {
          const newTags = [...currentTags, val];
          this.value = newTags;
          this.onCommit(newTags);
          
          const placeholder = tagsContainer.querySelector('.tags-placeholder');
          if (placeholder) placeholder.remove();
          
          tagsContainer.appendChild(this._createTagElement(val));
          input.value = '';
          input.focus();
        } else {
          input.style.borderColor = '#f44336';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 1000);
        }
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });

    addBtn.addEventListener('click', addTag);

    inputRow.appendChild(input);
    inputRow.appendChild(addBtn);

    container.appendChild(tagsContainer);
    container.appendChild(inputRow);

    this.element = container;
    this._input = input;
    this._tagsContainer = tagsContainer;
    return container;
  }

  _createTagElement(tag) {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag-item';

    const text = document.createElement('span');
    text.className = 'tag-text';
    text.textContent = tag;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'tag-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => {
      const currentTags = Array.isArray(this.value) ? this.value : [];
      const index = currentTags.indexOf(tag);
      if (index !== -1) {
        const newTags = [
          ...currentTags.slice(0, index),
          ...currentTags.slice(index + 1)
        ];
        this.value = newTags;
        this.onCommit(newTags);
        tagEl.remove();

        if (newTags.length === 0 && this._tagsContainer) {
          const placeholder = document.createElement('div');
          placeholder.className = 'tags-placeholder';
          placeholder.textContent = 'No tags added yet';
          this._tagsContainer.appendChild(placeholder);
        }
      }
    });

    tagEl.appendChild(text);
    tagEl.appendChild(removeBtn);
    return tagEl;
  }

  getValue() {
    return Array.isArray(this.value) ? this.value : [];
  }

  setValue(value) {
    this.value = Array.isArray(value) ? value : [];
    if (this.element) {
      this._refreshTags();
    }
  }

  _refreshTags() {
    const tags = Array.isArray(this.value) ? this.value : [];
    if (this._tagsContainer) {
      this._tagsContainer.innerHTML = '';
      if (tags.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'tags-placeholder';
        placeholder.textContent = 'No tags added yet';
        this._tagsContainer.appendChild(placeholder);
      } else {
        tags.forEach(tag => {
          this._tagsContainer.appendChild(this._createTagElement(tag));
        });
      }
    }
  }
}

export default TagsEditor;
