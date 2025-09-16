import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { Weapons } from './weapons.js';
import { Menu } from './menu.js';

export class Engine {
    constructor(opts = {}) {
        this.container = opts.container || document.body;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.THREE = THREE;

        this.player = {
            pos: new THREE.Vector3(0, 2, 5),
            vel: new THREE.Vector3(0, 0, 0),
            speed: 6,
            jumpSpeed: 6,
            onGround: false,
            height: 1.6,
            noclip: false,
            inventory: [],
            equipped: null
        };

        this.gravity = -18.0;
        this.groundY = 0.0;
        this.rotation = { x: 0, y: 0 };
        this.keys = {};

        // Dev & settings
        this.consoleOpen = false;
        this.consoleElement = null;
        this.commands = {};
        this.sv_cheats = false;
        this.showFPS = false;
        this.thirdPerson = false;
        this.fpsCounter = null;

        this.menu = new Menu(this);
        this.weapons = new Weapons(this);

        this._bindEvents();
        this._buildScene();
        this._initConsole();
        this._initCommands();
    }

    _buildScene() {
        const light = new this.THREE.DirectionalLight(0xffffff, 0.95);
        light.position.set(5,10,7);
        this.scene.add(light);
        this.scene.add(new this.THREE.AmbientLight(0x444444));

        const ground = new this.THREE.Mesh(
            new this.THREE.PlaneGeometry(200,200),
            new this.THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        ground.rotation.x = -Math.PI/2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        const boxMat = new this.THREE.MeshStandardMaterial({ color: 0x00aaff });
        for (let i=0;i<3;i++){
            const b = new this.THREE.Mesh(new this.THREE.BoxGeometry(1.6,1.6,1.6), boxMat);
            b.position.set((i-1)*3, 0.8, -4 - i*2);
            this.scene.add(b);
        }

        this.camera.position.copy(this.player.pos);
        this.camera.position.y = this.player.pos.y + this.player.height;
    }

    _bindEvents() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;

            // Toggle console
            if (e.key === '~' || e.key === '`') {
                this.consoleOpen = !this.consoleOpen;
                if (this.consoleElement) {
                    this.consoleElement.style.display = this.consoleOpen ? 'block' : 'none';
                }
            }
        });

        window.addEventListener('keyup', e => { this.keys[e.code] = false; });

        this.renderer.domElement.addEventListener('click', () => {
            if(!this.consoleOpen) this.renderer.domElement.requestPointerLock();
        });

        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.renderer.domElement && !this.consoleOpen) {
                const sensitivity = this.menu ? this.menu.mouseSensitivity : 0.0015;
                this.rotation.y -= e.movementX * sensitivity;
                this.rotation.x -= e.movementY * sensitivity;
                this.rotation.x = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, this.rotation.x));
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth/window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    _initConsole() {
        const consoleDiv = document.createElement('div');
        consoleDiv.style.position = 'absolute';
        consoleDiv.style.bottom = '0';
        consoleDiv.style.left = '0';
        consoleDiv.style.width = '100%';
        consoleDiv.style.height = '200px';
        consoleDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
        consoleDiv.style.color = '#00ff00';
        consoleDiv.style.fontFamily = 'monospace';
        consoleDiv.style.fontSize = '14px';
        consoleDiv.style.display = 'none';
        consoleDiv.style.overflowY = 'auto';
        consoleDiv.style.padding = '5px';
        this.consoleElement = consoleDiv;
        document.body.appendChild(consoleDiv);

        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.style.background = 'black';
        input.style.color = '#00ff00';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.fontFamily = 'monospace';
        input.style.fontSize = '14px';
        consoleDiv.appendChild(input);

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const line = input.value.trim();
                const args = line.split(' ');
                const cmd = args.shift();
                if(this.commands[cmd]) this.commands[cmd](...args);
                else this._logToConsole(`Unknown command: ${cmd}`);
                this._logToConsole('> ' + line);
                input.value = '';
            }
        });

        // FPS counter
        this.fpsCounter = document.createElement('div');
        this.fpsCounter.style.position = 'absolute';
        this.fpsCounter.style.top = '0';
        this.fpsCounter.style.left = '0';
        this.fpsCounter.style.color = '#0f0';
        this.fpsCounter.style.fontFamily = 'monospace';
        this.fpsCounter.style.fontSize = '12px';
        document.body.appendChild(this.fpsCounter);
    }

    _logToConsole(msg) {
        if(!this.consoleElement) return;
        const div = document.createElement('div');
        div.textContent = msg;
        this.consoleElement.insertBefore(div, this.consoleElement.lastChild);
        this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    }

    _initCommands() {
        this.commands = {
            noclip: () => { 
                if(this.sv_cheats){
                    this.player.noclip = !this.player.noclip; 
                    this._logToConsole(`noclip: ${this.player.noclip}`);
                }
            },
            cl_showfps: (val) => { this.showFPS = true; },
            sv_cheats: (val) => { this.sv_cheats = !!parseInt(val); this._logToConsole(`sv_cheats: ${this.sv_cheats}`); },
            impulse: (val) => { 
                if(!this.sv_cheats) return;
                let force = parseFloat(val);
                if(isNaN(force)){
                    this._logToConsole("Impulse requires a number! Usage: impulse <force>");
                    return;
                }
                if(force < 0){
                    this._crash('SYSTEM_NEGATIVE_IMPULSE', force);
                }
                if(!isFinite(force) || force > 1e9){
                    this._crash('SYSTEM_MATH_CALC_OVERLOAD', force);
                }
                this.player.vel.y += force;
                this._logToConsole(`Impulse applied: ${force} vertical`);
            },
            thirdperson: () => { this.thirdPerson = !this.thirdPerson; this._logToConsole(`thirdPerson: ${this.thirdPerson}`); },
            giveweapon: (name) => { this.weapons.giveWeapon(name); },
            setgravity: (val) => { this.gravity = parseFloat(val); this._logToConsole(`Gravity set to ${this.gravity}`); },
            teleport: (x, y, z) => { this.player.pos.set(parseFloat(x), parseFloat(y), parseFloat(z)); }
        };
    }

    _crash(type, val){
        const dump = {
            type,
            timestamp: Date.now(),
            pos: this.player.pos.clone(),
            vel: this.player.vel.clone(),
            randomMem: Math.floor(Math.random()*0xFFFFFF),
            value: val
        };
        const msg = `💥 ${type} 💥\nDump: ${JSON.stringify(dump, null, 2)}`;
        console.error(msg);
        if(this.consoleElement){
            const div = document.createElement('div');
            div.style.color = '#ff4444';
            div.textContent = msg;
            this.consoleElement.appendChild(div);
        }
        throw new Error(msg);
    }

    start() {
        this.running = true;
        this.clock.start();
        this._tick();
    }

    stop() {
        this.running = false;
        this.clock.stop();
    }

    _tick() {
        if (!this.running) return;
        const dt = Math.min(0.05, this.clock.getDelta());
        this._update(dt);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this._tick());
    }

    _update(dt) {
        const forward = new this.THREE.Vector3(-Math.sin(this.rotation.y), 0, -Math.cos(this.rotation.y));
        const right = new this.THREE.Vector3().crossVectors(forward, new this.THREE.Vector3(0,1,0));

        const input = new this.THREE.Vector3();
        if (!this.consoleOpen) {
            if (this.keys['KeyW']) input.add(forward);
            if (this.keys['KeyS']) input.add(forward.clone().negate());
            if (this.keys['KeyA']) input.add(right.clone().negate());
            if (this.keys['KeyD']) input.add(right);
        }

        if (input.lengthSq() > 0) {
            input.normalize();
            input.multiplyScalar(this.player.speed);
        }

        this.player.vel.x = input.x;
        this.player.vel.z = input.z;

        // Gravity and noclip
        if (!this.player.noclip) {
            if (this.keys['Space'] && this.player.onGround && !this.consoleOpen) {
                this.player.vel.y = this.player.jumpSpeed;
                this.player.onGround = false;
            }
            this.player.vel.y += this.gravity * dt;
        }

        this.player.pos.addScaledVector(this.player.vel, dt);

        if (!this.player.noclip) {
            if (this.player.pos.y <= this.groundY) {
                this.player.pos.y = this.groundY;
                this.player.vel.y = 0;
                this.player.onGround = true;
            } else {
                this.player.onGround = false;
            }
        }

        const targetPos = new this.THREE.Vector3(
            this.player.pos.x,
            this.player.pos.y + this.player.height,
            this.player.pos.z
        );

        let bobOffset = 0;
        if (input.lengthSq() > 0 && this.player.onGround) {
            bobOffset = Math.sin(Date.now() * 0.005 * this.player.speed) * 0.05;
        }
        targetPos.y += bobOffset;

        // Third-person offset
        if(this.thirdPerson) {
            const offset = new this.THREE.Vector3(0, 2, 4);
            targetPos.add(offset);
        }

        this.camera.position.lerp(targetPos, 0.15);

        // LOCK Portal-style camera
        this.camera.rotation.set(this.rotation.x, this.rotation.y, 0);

        if(this.showFPS && this.fpsCounter){
            const fps = (1 / dt).toFixed(1);
            this.fpsCounter.textContent = `FPS: ${fps}`;
        }

        if(this.sky){
            this.sky.position.copy(this.camera.position);
        }
    }

    addCube(x, y, z, color = 0xff5500) {
        const cube = new this.THREE.Mesh(
            new this.THREE.BoxGeometry(1, 1, 1),
            new this.THREE.MeshStandardMaterial({ color })
        );
        cube.position.set(x, y, z);
        this.scene.add(cube);
        return cube;
    }

    setSkybox(texturePath) {
        const loader = new this.THREE.TextureLoader();
        loader.load(texturePath, (tex) => {
            const materialArray = [];
            for (let i = 0; i < 6; i++) {
                materialArray.push(new this.THREE.MeshBasicMaterial({ map: tex, side: this.THREE.BackSide }));
            }
            const skyGeo = new this.THREE.BoxGeometry(1000, 1000, 1000);
            if (this.sky) this.scene.remove(this.sky);
            this.sky = new this.THREE.Mesh(skyGeo, materialArray);
            this.scene.add(this.sky);
        });
    }
}
