import { Engine } from './engine.js';

(async function init() {
  const engine = new Engine({ container: document.body });
  engine.start();

  // expose for debugging
  window._engine = engine;

  // clean shutdown
  window.addEventListener('beforeunload', () => engine.stop());
})();
