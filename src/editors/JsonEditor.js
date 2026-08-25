import { BaseEditor } from './BaseEditor.js';

export class JsonEditor extends BaseEditor {

  constructor({ value, metadata, onCommit }) {
    super({ value, metadata, onCommit });

    this.metadata = metadata || {};
    this.mode = this.metadata.mode || 'structured';
    this._expanded = {};
  }

  render() {
    const container = document.createElement('div');
    container.className = 'json-editor';

    const toolbar = document.createElement('div');
    toolbar.className = 'json-toolbar';

    const structuredButton = document.createElement('button');
    structuredButton.type = 'button';
    structuredButton.className =
      `json-mode-btn ${this.mode === 'structured' ? 'active' : ''}`;
    structuredButton.dataset.mode = 'structured';
    structuredButton.textContent = '📊 Structured';

    const rawButton = document.createElement('button');
    rawButton.type = 'button';
    rawButton.className =
      `json-mode-btn ${this.mode === 'raw' ? 'active' : ''}`;
    rawButton.dataset.mode = 'raw';
    rawButton.textContent = '📝 Raw JSON';

    toolbar.appendChild(structuredButton);
    toolbar.appendChild(rawButton);

    const content = document.createElement('div');
    content.className = 'json-content';

    this._renderContent(content);

    const setMode = (mode) => {
      this.mode = mode;

      structuredButton.classList.toggle(
        'active',
        mode === 'structured'
      );

      rawButton.classList.toggle(
        'active',
        mode === 'raw'
      );

      this._renderContent(content);
    };

    structuredButton.addEventListener('click', () => {
      setMode('structured');
    });

    rawButton.addEventListener('click', () => {
      setMode('raw');
    });

    container.appendChild(toolbar);
    container.appendChild(content);

    this.element = container;

    return container;
  }

  _renderContent(content) {
    content.replaceChildren();

    if (this.mode === 'raw') {
      content.appendChild(this._renderRaw());
      return;
    }

    content.appendChild(
      this._renderStructuredRoot()
    );
  }

  /*
   * ------------------------------------------------------------
   * STRUCTURED ROOT
   * ------------------------------------------------------------
   */

  _renderStructuredRoot() {
    const wrapper = document.createElement('div');
    wrapper.className = 'json-structured';

    const value = this.value;

    if (Array.isArray(value)) {
      wrapper.appendChild(
        this._renderArray(
          value,
          this._getArrayMetadata()
        )
      );

      return wrapper;
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      wrapper.appendChild(
        this._renderObject(
          value,
          this._getObjectMetadata(),
          0
        )
      );

      return wrapper;
    }

    wrapper.appendChild(
      this._renderPrimitiveEditor(
        value,
        this._getRootValueMetadata()
      )
    );

    return wrapper;
  }

  /*
   * ------------------------------------------------------------
   * OBJECT EDITOR
   * ------------------------------------------------------------
   *
   * Metadata can describe known properties:
   *
   * {
   *   editor: {
   *     type: 'json',
   *     properties: {
   *       name: { type: 'string' },
   *       age: { type: 'number' },
   *       active: { type: 'boolean' }
   *     }
   *   }
   * }
   *
   * "fields" is also accepted as an alias for "properties".
   */

  _renderObject(obj, metadata = {}, depth = 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'json-object';

    if (depth === 0) {
      const label = document.createElement('div');
      label.className = 'json-object-label';
      label.textContent = metadata.label || 'Properties';
      wrapper.appendChild(label);
    }

    const properties =
      metadata.properties ||
      metadata.fields ||
      {};

    /*
     * Render metadata-defined properties first.
     * This gives deterministic ordering.
     */
    Object.keys(properties).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = this._defaultValue(properties[key]);
      }
    });

    Object.keys(obj).forEach(key => {
      const fieldMetadata =
        properties[key] ||
        metadata.additionalProperties ||
        {
          type: this._inferType(obj[key])
        };

      wrapper.appendChild(
        this._renderObjectProperty(
          obj,
          key,
          fieldMetadata,
          depth
        )
      );
    });

    /*
     * Add-property capability.
     *
     * Unlike the previous implementation, this does not ask
     * the user to type JSON syntax.
     */
    const addProperty = document.createElement('div');
    addProperty.className = 'json-add-property-form';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'json-property-key-input';
    keyInput.placeholder = 'Property name';

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'json-property-value-input';
    valueInput.placeholder = 'Value';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'json-add-property';
    addButton.textContent = '+ Add Property';

    const addPropertyHandler = () => {
      const key = keyInput.value.trim();

      if (!key) {
        keyInput.focus();
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(obj, key)
      ) {
        keyInput.focus();
        keyInput.select();
        return;
      }

      const value = valueInput.value;

      /*
       * New properties are intentionally strings by default.
       * This keeps the interaction predictable.
       *
       * If a future metadata definition supplies the type,
       * _coerceInputValue() handles conversion.
       */
      obj[key] = value;

      this._commitValue();

      keyInput.value = '';
      valueInput.value = '';

      this._refreshStructured();
      keyInput.focus();
    };

    addButton.addEventListener(
      'click',
      addPropertyHandler
    );

    keyInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addPropertyHandler();
      }
    });

    valueInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addPropertyHandler();
      }
    });

    addProperty.appendChild(keyInput);
    addProperty.appendChild(valueInput);
    addProperty.appendChild(addButton);

    wrapper.appendChild(addProperty);

    return wrapper;
  }

  _renderObjectProperty(
    obj,
    key,
    metadata,
    depth
  ) {
    const row = document.createElement('div');
    row.className = 'json-property-row';

    const label = document.createElement('label');
    label.className = 'json-key';
    label.textContent =
      metadata.label || key;

    row.appendChild(label);

    const value = obj[key];
    const type =
      metadata.type ||
      this._inferType(value);

    if (
      type === 'object' &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const nested = document.createElement('div');
      nested.className = 'json-nested-object';

      nested.appendChild(
        this._renderObject(
          value,
          metadata,
          depth + 1
        )
      );

      row.appendChild(nested);

      return row;
    }

    if (
      type === 'array' ||
      Array.isArray(value)
    ) {
      row.appendChild(
        this._renderArray(
          Array.isArray(value) ? value : [],
          metadata
        )
      );

      return row;
    }

    const editor =
      this._renderPrimitiveEditor(
        value,
        metadata,
        (newValue) => {
          obj[key] = newValue;
          this._commitValue();
        }
      );

    row.appendChild(editor);

    return row;
  }

  /*
   * ------------------------------------------------------------
   * ARRAY / REPEATER
   * ------------------------------------------------------------
   */

  _renderArray(arr, metadata = {}) {
    const container = document.createElement('div');
    container.className = 'json-array';

    const label = document.createElement('div');
    label.className = 'json-array-label';

    label.textContent =
      metadata.label ||
      `Items (${arr.length})`;

    container.appendChild(label);

    const items = document.createElement('div');
    items.className = 'json-array-items';

    arr.forEach((item, index) => {
      items.appendChild(
        this._renderArrayItem(
          arr,
          index,
          item,
          metadata
        )
      );
    });

    container.appendChild(items);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'json-add-item';
    addButton.textContent = '+ Add Item';

    addButton.addEventListener('click', () => {
      const itemMetadata =
        metadata.item ||
        metadata.items ||
        {};

      arr.push(
        this._defaultValue(itemMetadata)
      );

      this._commitValue();
      this._refreshStructured();
    });

    container.appendChild(addButton);

    return container;
  }

  _renderArrayItem(
    arr,
    index,
    item,
    metadata
  ) {
    const row = document.createElement('div');
    row.className = 'json-array-item';

    const indexLabel = document.createElement('span');
    indexLabel.className = 'json-index';
    indexLabel.textContent = `${index + 1}.`;

    row.appendChild(indexLabel);

    const itemMetadata =
      metadata.item ||
      metadata.items ||
      {
        type: this._inferType(item)
      };

    const itemType =
      itemMetadata.type ||
      this._inferType(item);

    if (
      itemType === 'object' &&
      item &&
      typeof item === 'object' &&
      !Array.isArray(item)
    ) {
      row.appendChild(
        this._renderObject(
          item,
          itemMetadata,
          1
        )
      );
    } else if (
      itemType === 'array' ||
      Array.isArray(item)
    ) {
      row.appendChild(
        this._renderArray(
          item,
          itemMetadata
        )
      );
    } else {
      row.appendChild(
        this._renderPrimitiveEditor(
          item,
          itemMetadata,
          newValue => {
            arr[index] = newValue;
            this._commitValue();
          }
        )
      );
    }

    const removeButton =
      document.createElement('button');

    removeButton.type = 'button';
    removeButton.className =
      'json-remove-item';

    removeButton.textContent = '×';
    removeButton.title = 'Remove item';

    removeButton.addEventListener(
      'click',
      () => {
        arr.splice(index, 1);

        this._commitValue();
        this._refreshStructured();
      }
    );

    row.appendChild(removeButton);

    return row;
  }

  /*
   * ------------------------------------------------------------
   * PRIMITIVE INPUTS
   * ------------------------------------------------------------
   */

  _renderPrimitiveEditor(
    value,
    metadata = {},
    onChange = null
  ) {
    const type =
      metadata.type ||
      this._inferType(value);

    const wrapper =
      document.createElement('div');

    wrapper.className =
      'json-primitive-editor';

    let input;

    if (type === 'boolean') {
      input =
        document.createElement('input');

      input.type = 'checkbox';
      input.checked = Boolean(value);

      input.addEventListener(
        'change',
        () => {
          const newValue =
            input.checked;

          if (onChange) {
            onChange(newValue);
          } else {
            this.value = newValue;
            this._commitValue();
          }
        }
      );
    } else if (
      type === 'number' ||
      type === 'integer'
    ) {
      input =
        document.createElement('input');

      input.type = 'number';

      if (
        value !== null &&
        value !== undefined
      ) {
        input.value = String(value);
      }

      input.step =
        type === 'integer'
          ? '1'
          : 'any';

      this._bindInput(
        input,
        value,
        metadata,
        onChange
      );
    } else if (type === 'date') {
      input =
        document.createElement('input');

      input.type = 'date';

      if (value) {
        input.value =
          String(value).substring(0, 10);
      }

      this._bindInput(
        input,
        value,
        metadata,
        onChange
      );
    } else if (type === 'datetime') {
      input =
        document.createElement('input');

      input.type =
        'datetime-local';

      if (value) {
        input.value =
          String(value).substring(0, 16);
      }

      this._bindInput(
        input,
        value,
        metadata,
        onChange
      );
    } else {
      input =
        document.createElement('input');

      input.type = 'text';

      if (
        value !== null &&
        value !== undefined
      ) {
        input.value = String(value);
      }

      input.placeholder =
        metadata.placeholder ||
        '';

      this._bindInput(
        input,
        value,
        metadata,
        onChange
      );
    }

    input.classList.add(
      'json-input'
    );

    if (metadata.required) {
      input.required = true;
    }

    wrapper.appendChild(input);

    return wrapper;
  }

  _bindInput(
    input,
    originalValue,
    metadata,
    onChange
  ) {
    const commit = () => {
      const newValue =
        this._coerceInputValue(
          input.value,
          metadata
        );

      if (onChange) {
        onChange(newValue);
      } else {
        this.value = newValue;
        this._commitValue();
      }
    };

    input.addEventListener(
      'blur',
      commit
    );

    input.addEventListener(
      'keydown',
      event => {
        if (event.key !== 'Enter') {
          return;
        }

        event.preventDefault();
        commit();
      }
    );
  }

  /*
   * ------------------------------------------------------------
   * RAW MODE
   * ------------------------------------------------------------
   */

  _renderRaw() {
    const wrapper =
      document.createElement('div');

    wrapper.className =
      'json-raw-wrapper';

    const textarea =
      document.createElement('textarea');

    textarea.className =
      'json-raw';

    textarea.rows = 12;
    textarea.spellcheck = false;

    textarea.value =
      this.value !== undefined &&
      this.value !== null
        ? JSON.stringify(
            this.value,
            null,
            2
          )
        : '{}';

    const commit = () => {
      try {
        const parsed =
          JSON.parse(
            textarea.value
          );

        this.value = parsed;

        this._commitValue();

        textarea.style.borderColor =
          '#4caf50';

        textarea.title = '';
      } catch (error) {
        textarea.style.borderColor =
          '#f44336';

        textarea.title =
          `Invalid JSON: ${error.message}`;
      }
    };

    textarea.addEventListener(
      'blur',
      commit
    );

    /*
     * Ctrl/Cmd + Enter commits raw JSON.
     *
     * Plain Enter remains available for
     * multiline JSON editing.
     */
    textarea.addEventListener(
      'keydown',
      event => {
        if (
          event.key === 'Enter' &&
          (event.ctrlKey ||
            event.metaKey)
        ) {
          event.preventDefault();
          commit();
        }
      }
    );

    wrapper.appendChild(textarea);

    return wrapper;
  }

  /*
   * ------------------------------------------------------------
   * TYPE / VALUE NORMALISATION
   * ------------------------------------------------------------
   */

  _coerceInputValue(
    value,
    metadata = {}
  ) {
    const type =
      metadata.type ||
      'string';

    if (type === 'number') {
      if (value.trim() === '') {
        return null;
      }

      const number =
        Number(value);

      return Number.isNaN(number)
        ? null
        : number;
    }

    if (type === 'integer') {
      if (value.trim() === '') {
        return null;
      }

      const number =
        Number.parseInt(
          value,
          10
        );

      return Number.isNaN(number)
        ? null
        : number;
    }

    if (type === 'boolean') {
      return (
        value === true ||
        value === 'true' ||
        value === '1' ||
        value === 'on'
      );
    }

    if (type === 'null') {
      return null;
    }

    /*
     * Deliberately do NOT JSON.parse ordinary
     * text inputs.
     *
     * A user entering:
     *
     * hello
     *
     * gets:
     *
     * "hello"
     *
     * rather than an attempted JSON parse.
     */
    return value;
  }

  _inferType(value) {
    if (Array.isArray(value)) {
      return 'array';
    }

    if (
      value !== null &&
      typeof value === 'object'
    ) {
      return 'object';
    }

    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? 'integer'
        : 'number';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (value === null) {
      return 'string';
    }

    return 'string';
  }

  _defaultValue(metadata = {}) {
    const type =
      metadata?.type ||
      'string';

    if (type === 'object') {
      return {};
    }

    if (type === 'array') {
      return [];
    }

    if (
      type === 'number' ||
      type === 'integer'
    ) {
      return 0;
    }

    if (type === 'boolean') {
      return false;
    }

    if (type === 'null') {
      return null;
    }

    return '';
  }

  /*
   * ------------------------------------------------------------
   * METADATA HELPERS
   * ------------------------------------------------------------
   */

  _getObjectMetadata() {
    return (
      this.metadata.properties ||
      this.metadata.fields
        ? this.metadata
        : (
            this.metadata.editor &&
            (
              this.metadata.editor.properties ||
              this.metadata.editor.fields
            )
              ? this.metadata.editor
              : {}
          )
    );
  }

  _getArrayMetadata() {
    if (
      this.metadata.items ||
      this.metadata.item
    ) {
      return this.metadata;
    }

    if (
      this.metadata.editor &&
      (
        this.metadata.editor.items ||
        this.metadata.editor.item
      )
    ) {
      return this.metadata.editor;
    }

    return {};
  }

  _getRootValueMetadata() {
    return (
      this.metadata.editor ||
      this.metadata
    );
  }

  /*
   * ------------------------------------------------------------
   * COMMIT / REFRESH
   * ------------------------------------------------------------
   */

  _commitValue() {
    if (typeof this.onCommit === 'function') {
      this.onCommit(this.value);
    }
  }

  _refreshStructured() {
    if (!this.element) {
      return;
    }

    const content =
      this.element.querySelector(
        '.json-content'
      );

    if (!content) {
      return;
    }

    this._renderContent(content);
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;

    if (this.element) {
      if (this.mode === 'structured') {
        this._refreshStructured();
      } else {
        this._renderContent(
          this.element.querySelector(
            '.json-content'
          )
        );
      }
    }
  }

}

export default JsonEditor;
