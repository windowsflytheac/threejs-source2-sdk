import { Engine } from './engine.js';

const engine = new Engine({ container: document.body });

// Set your placeholder skybox image
engine.setSkybox('textures/fixed_skybox_placeholder.png');

// Add cubes for testing
engine.addCube(0, 0.5, -2);
engine.addCube(2, 0.5, -4);
engine.addCube(-2, 0.5, -6);

engine.start();
