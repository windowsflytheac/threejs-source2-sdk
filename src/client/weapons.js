export class Weapons {
    constructor(engine) {
        this.engine = engine;
        this.weapons = {};
        this._initDefaultWeapons();
    }

    _initDefaultWeapons() {
        // Example weapons
        this.weapons['pistol'] = {
            name: 'Pistol',
            damage: 10,
            model: this._createViewModel('pistol', 0.5, 0.5, 0.5, 0xff0000)
        };
        this.weapons['shotgun'] = {
            name: 'Shotgun',
            damage: 25,
            model: this._createViewModel('shotgun', 0.6, 0.4, 0.7, 0x00ff00)
        };
    }

    _createViewModel(name, sx, sy, sz, color) {
        const geometry = new this.engine.THREE.BoxGeometry(sx, sy, sz);
        const material = new this.engine.THREE.MeshStandardMaterial({ color });
        const mesh = new this.engine.THREE.Mesh(geometry, material);
        mesh.visible = false;
        this.engine.camera.add(mesh);
        mesh.position.set(0.3, -0.3, -0.7); // typical FPS viewmodel offset
        return mesh;
    }

    giveWeapon(name) {
        const weapon = this.weapons[name];
        if(!weapon) {
            this.engine._logToConsole(`Weapon ${name} does not exist.`);
            return;
        }
        this.engine.player.inventory.push(weapon);
        this.engine.player.equipped = weapon;
        this._updateViewModels();
        this.engine._logToConsole(`Given weapon: ${weapon.name}`);
    }

    _updateViewModels() {
        // Hide all viewmodels
        for(const key in this.weapons){
            this.weapons[key].model.visible = false;
        }
        // Show equipped
        if(this.engine.player.equipped){
            this.engine.player.equipped.model.visible = true;
        }
    }

    switchWeapon(index) {
        if(index < 0 || index >= this.engine.player.inventory.length) return;
        this.engine.player.equipped = this.engine.player.inventory[index];
        this._updateViewModels();
        this.engine._logToConsole(`Switched to: ${this.engine.player.equipped.name}`);
    }

    fire() {
        if(!this.engine.player.equipped) return;
        // Example: create a bullet ray
        const origin = this.engine.camera.position.clone();
        const direction = new this.engine.THREE.Vector3(0, 0, -1).applyEuler(this.engine.camera.rotation);
        const ray = new this.engine.THREE.Raycaster(origin, direction);
        const intersects = ray.intersectObjects(this.engine.scene.children, true);
        if(intersects.length > 0){
            this.engine._logToConsole(`Hit object at distance ${intersects[0].distance.toFixed(2)}`);
        } else {
            this.engine._logToConsole('Missed!');
        }
    }
}
