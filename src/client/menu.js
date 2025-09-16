export class Menu {
    constructor(engine) {
        this.engine = engine;
        this.menuOpen = false;
        this.mouseSensitivity = 0.0015;
        this._initMenu();
    }

    _initMenu() {
        // Create menu container
        this.menuDiv = document.createElement('div');
        this.menuDiv.style.position = 'absolute';
        this.menuDiv.style.top = '0';
        this.menuDiv.style.left = '0';
        this.menuDiv.style.width = '100%';
        this.menuDiv.style.height = '100%';
        this.menuDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
        this.menuDiv.style.color = '#00ff00';
        this.menuDiv.style.fontFamily = 'monospace';
        this.menuDiv.style.fontSize = '20px';
        this.menuDiv.style.display = 'none';
        this.menuDiv.style.textAlign = 'center';
        this.menuDiv.style.paddingTop = '50px';
        document.body.appendChild(this.menuDiv);

        // Buttons
        this._addButton('Start Game', () => {
            this.toggleMenu();
            this.engine.start();
            this.engine._logToConsole('Game started!');
        });

        this._addButton('Settings', () => {
            this._openSettings();
        });

        this._addButton('Quit', () => {
            this.engine.stop();
            this._logToMenu('Game stopped.');
        });

        // FPS Counter toggle (checkbox)
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

        // Animated background (optional cubes)
        this._initBackground();
    }

    _addButton(label, callback) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.margin = '10px';
        btn.style.padding = '10px 30px';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.onclick = callback;
        this.menuDiv.appendChild(btn);
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.menuDiv.style.display = this.menuOpen ? 'block' : 'none';
        if (this.menuOpen) {
            document.exitPointerLock();
        }
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
        const loader = this.engine.THREE;
        const cubeMat = new loader.MeshStandardMaterial({ color: 0x00aaff });
        for (let i=0; i<20; i++){
            const cube = new loader.Mesh(new loader.BoxGeometry(1,1,1), cubeMat);
            cube.position.set((Math.random()-0.5)*50, Math.random()*10+5, (Math.random()-0.5)*50);
            this.engine.scene.add(cube);
            this.bgCubes.push(cube);
        }

        // Animate
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
