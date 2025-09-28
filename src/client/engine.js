// engine.js
// Three.JS: Source 2 Custom Engine (Vanilla JS / WebGL Core)
// Features: SSP, CLST2-ready, portal-style camera

export class Engine {
    constructor(opts = {}) {
        this.container = opts.container || document.body;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // WebGL setup
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        if(!this.gl) alert('WebGL not supported.');

        // Player physics
        this.player = {
            pos: {x:0, y:1.6, z:5},
            vel: {x:0, y:0, z:0},
            speed:6,
            jumpSpeed:6,
            onGround:true,
            height:1.6
        };

        this.gravity = -18;
        this.groundY = 0;
        this.keys = {};
        this.rotation = {x:0, y:0}; // pitch/yaw

        // Scene objects
        this.objects = []; // generic objects for testing (cubes, etc.)

        this.running = false;

        this._bindEvents();
        this._initGL();
    }

    _initGL(){
        const gl = this.gl;
        gl.clearColor(0,0,0,1); // pitch black sky
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0,0,this.width,this.height);
    }

    _bindEvents(){
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        window.addEventListener('mousemove', e => {
            if(document.pointerLockElement === this.canvas){
                const sensitivity = 0.002;
                this.rotation.y -= e.movementX * sensitivity;
                this.rotation.x -= e.movementY * sensitivity;
                // clamp pitch
                this.rotation.x = Math.max(-Math.PI/2 + 0.01, Math.min(Math.PI/2 - 0.01, this.rotation.x));
            }
        });

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.gl.viewport(0,0,this.width,this.height);
        });
    }

    start(){
        this.running = true;
        this._tick();
    }

    stop(){
        this.running = false;
    }

    _tick(){
        if(!this.running) return;
        this._update(1/60); // fixed timestep for testing
        this._render();
        requestAnimationFrame(()=>this._tick());
    }

    _update(dt){
        // Input
        const forward = {x: -Math.sin(this.rotation.y), y:0, z:-Math.cos(this.rotation.y)};
        const right = {x: Math.cos(this.rotation.y), y:0, z:-Math.sin(this.rotation.y)};
        let input = {x:0,y:0,z:0};

        if(this.keys['KeyW']) input.x += forward.x, input.z += forward.z;
        if(this.keys['KeyS']) input.x -= forward.x, input.z -= forward.z;
        if(this.keys['KeyA']) input.x -= right.x, input.z -= right.z;
        if(this.keys['KeyD']) input.x += right.x, input.z += right.z;

        // Normalize input
        const mag = Math.sqrt(input.x**2 + input.z**2);
        if(mag>0){ input.x = (input.x/mag)*this.player.speed; input.z=(input.z/mag)*this.player.speed; }

        // Apply physics
        this.player.vel.x = input.x;
        this.player.vel.z = input.z;
        if(this.keys['Space'] && this.player.onGround){ this.player.vel.y = this.player.jumpSpeed; this.player.onGround=false; }
        this.player.vel.y += this.gravity * dt;

        // Integrate
        this.player.pos.x += this.player.vel.x*dt;
        this.player.pos.y += this.player.vel.y*dt;
        this.player.pos.z += this.player.vel.z*dt;

        // Ground collision
        if(this.player.pos.y <= this.groundY){ this.player.pos.y = this.groundY; this.player.vel.y=0; this.player.onGround=true; }

        // Portal-style camera (upright)
        this.cameraPos = {
            x:this.player.pos.x,
            y:this.player.pos.y + this.player.height,
            z:this.player.pos.z
        };
    }

    _render(){
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // For now, just render objects as colored quads/cubes using simple immediate mode placeholder
        for(const obj of this.objects){
            // placeholder render: just for testing
        }
    }

    addCube(x,y,z,size=1,color=[1,0,0]){
        const cube = {x,y,z,size,color};
        this.objects.push(cube);
        return cube;
    }
}
