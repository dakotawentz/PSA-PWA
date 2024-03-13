import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Initialize editor
    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to data from IndexedDB, localStorage, or header
    this.editor.on('change', () => {
      this.saveEditorContent();
    });

    // Save the content of the editor when the editor loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      this.saveEditorContent();
    });

    // Load data from IndexedDB
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || header);
    }).catch((error) => {
      console.error('Error loading data from IndexedDB:', error);

      this.editor.on('change', () => {
        localStorage.setItem('content', this.editor.getValue());
      });
  
      // Save the content of the editor when the editor itself is loses focus
      this.editor.on('blur', () => {
        console.log('The editor has lost focus');
        putDb(localStorage.getItem('content'));
      });

      // If there's an error loading from IndexedDB, fall back to localStorage
      const localData = localStorage.getItem('content');
      if (localData) {
        console.info('Loaded data from localStorage, injecting into editor');
        this.editor.setValue(localData);
      } else {
        console.info('No data found in IndexedDB or localStorage, injecting default header');
        this.editor.setValue(header);
      }
    });
  }

  // Save editor content to IndexedDB
  async saveEditorContent() {
    const content = this.editor.getValue();
    try {
      await putDb(content);
      console.log('Content saved to IndexedDB:', content);
    } catch (error) {
      console.error('Error saving content to IndexedDB:', error);
      // Handle error (e.g., fallback to localStorage)
    }
  }
}
