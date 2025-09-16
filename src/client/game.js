// game.js
import { Engine } from './engine.js';

// Create engine instance
const engine = new Engine({ container: document.body });

// Add some extra objects to the scene
const boxMat = new THREE.MeshStandardMaterial({ color: 0xff5500 });
for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), boxMat);
    cube.position.set(Math.random() * 10 - 5, 0.5, -i * 3 - 2);
    engine.scene.add(cube);
}

// Add simple lighting effect
const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(5, 10, 5);
engine.scene.add(pointLight);

// Start the engine loop
engine.start();
