import { Engine } from './engine.js';
import { Weapons } from './weapons.js';
import { Console } from './console.js';

const engine = new Engine({ container: document.body });
engine.weapons = new Weapons(engine);
engine.console = new Console(engine); // <--- this line creates the console instance

engine.setSkybox(); // pitch black
engine.start();
