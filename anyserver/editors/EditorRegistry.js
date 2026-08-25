// Editor Registry - Maps editor types to implementations
// Uses lazy registration to avoid circular dependencies

const editorRegistry = {};

/**
 * Register an editor class for a type
 * @param {string} type - Editor type (e.g., 'text', 'number')
 * @param {Class} EditorClass - Editor class to register
 */
export function registerEditor(type, EditorClass) {
  if (editorRegistry[type]) {
    console.warn(`Editor type "${type}" is already registered, overwriting`);
  }
  editorRegistry[type] = EditorClass;
}

/**
 * Resolve editor class by type
 * @param {string} type - Editor type (e.g., 'text', 'number')
 * @returns {Class|null} Editor class or null if not found
 */
export function resolveEditor(type) {
  const Editor = editorRegistry[type];
  if (Editor) {
    return Editor;
  }
  console.warn(`Editor type "${type}" not found.`);
  return editorRegistry.text || null;
}

/**
 * Get the entire registry (for introspection)
 */
export function getRegistry() {
  return { ...editorRegistry };
}

export default {
  register: registerEditor,
  resolve: resolveEditor,
  getRegistry: getRegistry,
};
