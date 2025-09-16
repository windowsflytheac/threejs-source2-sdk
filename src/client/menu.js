export class Menu {
    constructor(engine) {
        this.engine = engine;
        this.menuOpen = true; // Start open
        this.mouseSensitivity = 0.0015;
        this._initMenu();
    }

    _initMenu() {
        // Menu container
        this.menuDiv = document.createElement('div');
        Object.assign(this.menuDiv.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: '20px',
            display: 'block', // visible initially
            textAlign: 'center',
            paddingTop: '50px',
            zIndex: '1001', // above console
        });
        document.body.appendChild(this.menuDiv);

        // Buttons
        this._addButton('Start Game', () => {
            this.toggleMenu();
            this.engine.start();
            this.engine._logToConsole('Game started!');
        });

        this._addButton('Settings', () => this._openSettings());
        this._addButton('Quit', () => {
            this.engine.stop();
            this._logToMenu('Game stopped.');
        });

        // FPS toggle
        const fpsDiv = document.createElement('div');
        fpsDiv.style.marginTop = '30px';
        fpsDiv.innerHTML = `
            <label style="color:#0f0;">
                <input type="checkbox" id="fpsToggle">
                Show FPS
            </label>
        `;
        this.menuDiv.appendChild(fpsDiv);
        fpsDiv.querySelector('#fpsToggle').addEventListener('change', (e) => {
            this.engine.showFPS = e.target.checked;
        });

        // Animated background cubes
        this._initBackground();
    }

    _addButton(label, callback) {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            margin: '10px',
            padding: '10px 30px',
            fontSize: '18px',
            cursor: 'pointer'
        });
        btn.onclick = callback;
        this.menuDiv.appendChild(btn);
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.menuDiv.style.display = this.menuOpen ? 'block' : 'none';
        if (this.menuOpen) document.exitPointerLock();
    }

    _openSettings() {
        alert('Settings will go here!');
    }

    _logToMenu(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        this.menuDiv.appendChild(div);
    }

    _initBackground() {
        this.bgCubes = [];
        const THREE = this.engine.THREE;
        const cubeMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });

        for (let i=0;i<20;i++){
            const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), cubeMat);
            cube.position.set((Math.random()-0.5)*50, Math.random()*10+5, (Math.random()-0.5)*50);
            this.engine.scene.add(cube);
            this.bgCubes.push(cube);
        }

        const animateBg = () => {
            if(this.menuOpen){
                for(const c of this.bgCubes){
                    c.rotation.x += 0.01;
                    c.rotation.y += 0.01;
                }
            }
            requestAnimationFrame(animateBg);
        }
        animateBg();
    }
}
