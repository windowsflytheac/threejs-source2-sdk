// game.js
import { Engine } from './engine.js';

// Create engine instance
const engine = new Engine({ container: document.body });

// Add cubes using the engine helper
engine.addCube(0, 0.5, -2);
engine.addCube(2, 0.5, -4);
engine.addCube(-2, 0.5, -6);

// Start the engine loop
engine.start();
