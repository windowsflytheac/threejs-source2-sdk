// engine.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class Engine {
    constructor(opts = {}) {
        this.container = opts.container || document.body;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // Expose THREE for helpers
        this.THREE = THREE;

        // Player physics
        this.player = {
            pos: new THREE.Vector3(0, 2, 5),
            vel: new THREE.Vector3(0, 0, 0),
            speed: 6,
            jumpSpeed: 6,
            onGround: false,
            height: 1.6
        };

        this.gravity = -18.0;
        this.groundY = 0.0;

        this.rotation = { x: 0, y: 0 };
        this.keys = {};

        this._bindEvents();
        this._buildScene();
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

        // Example obstacles
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
        window.addEventListener('keydown', e => { this.keys[e.code] = true; });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });

        this.renderer.domElement.addEventListener('click', () => this.renderer.domElement.requestPointerLock());

        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.renderer.domElement) {
                const sensitivity = 0.0015;
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
        if (this.keys['KeyW']) input.add(forward);
        if (this.keys['KeyS']) input.add(forward.clone().negate());
        if (this.keys['KeyA']) input.add(right.clone().negate());
        if (this.keys['KeyD']) input.add(right);

        if (input.lengthSq() > 0) {
            input.normalize();
            input.multiplyScalar(this.player.speed);
        }

        this.player.vel.x = input.x;
        this.player.vel.z = input.z;

        if (this.keys['Space'] && this.player.onGround) {
            this.player.vel.y = this.player.jumpSpeed;
            this.player.onGround = false;
        }

        this.player.vel.y += this.gravity * dt;
        this.player.pos.addScaledVector(this.player.vel, dt);

        if (this.player.pos.y <= this.groundY) {
            this.player.pos.y = this.groundY;
            this.player.vel.y = 0;
            this.player.onGround = true;
        } else {
            this.player.onGround = false;
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

        this.camera.position.lerp(targetPos, 0.15);
        this.camera.rotation.x = this.THREE.MathUtils.lerp(this.camera.rotation.x, this.rotation.x, 0.15);
        this.camera.rotation.y = this.THREE.MathUtils.lerp(this.camera.rotation.y, this.rotation.y, 0.15);
    }

    // Helper method to add cubes safely
    addCube(x, y, z, color = 0xff5500) {
        const cube = new this.THREE.Mesh(
            new this.THREE.BoxGeometry(1, 1, 1),
            new this.THREE.MeshStandardMaterial({ color })
        );
        cube.position.set(x, y, z);
        this.scene.add(cube);
        return cube;
    }
}
