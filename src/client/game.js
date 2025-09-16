import { Engine } from './engine.js';
import { Menu } from './menu.js';

const engine = new Engine({ container: document.body });
const menu = new Menu(engine); // Start with menu open

// Skybox placeholder
engine.setSkybox('textures/fixed_skybox_placeholder.png');

// Add test cubes
engine.addCube(0, 0.5, -2);
engine.addCube(2, 0.5, -4);
engine.addCube(-2, 0.5, -6);

// Weapons are integrated via engine.weapons
engine.weapons.giveWeapon('pistol');
