// game.js
import { Engine } from './engine.js';

// Create engine instance
const engine = new Engine({ container: document.body });

// Example helper: add cubes using the engine
// (we add this method directly to engine for convenience)
engine.addCube = function(x, y, z, color = 0xff5500) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color })
    );
    cube.position.set(x, y, z);
    this.scene.add(cube);
    return cube;
};

// Add some cubes to the scene
engine.addCube(0, 0.5, -2);
engine.addCube(2, 0.5, -4);
engine.addCube(-2, 0.5, -6);

// Start the engine loop
engine.start();
