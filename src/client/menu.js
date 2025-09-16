export class Menu {
    constructor(engine) {
        this.engine = engine;
        this.menuOpen = false;
        this.mouseSensitivity = 0.0015;
        this.menuElement = null;
        this._initMenu();
    }

    _initMenu() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.width = '300px';
        div.style.height = '400px';
        div.style.backgroundColor = 'rgba(0,0,0,0.9)';
        div.style.color = '#0f0';
        div.style.fontFamily = 'monospace';
        div.style.fontSize = '14px';
        div.style.display = 'none';
        div.style.padding = '10px';
        div.style.border = '2px solid #0f0';
        div.style.overflowY = 'auto';
        this.menuElement = div;
        document.body.appendChild(div);

        const title = document.createElement('div');
        title.textContent = 'Main Menu';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        div.appendChild(title);

        // Example settings
        this._addSlider('Mouse Sensitivity', 0.0005, 0.01, this.mouseSensitivity, (val) => {
            this.mouseSensitivity = parseFloat(val);
            this.engine._logToConsole(`Mouse sensitivity set to ${this.mouseSensitivity.toFixed(4)}`);
        });

        this._addButton('Toggle Third-Person', () => {
            this.engine.thirdPerson = !this.engine.thirdPerson;
            this.engine._logToConsole(`Third-person: ${this.engine.thirdPerson}`);
        });

        this._addButton('Close Menu', () => { this.toggleMenu(); });

        window.addEventListener('keydown', e => {
            if(e.key === 'Escape') this.toggleMenu();
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.menuElement.style.display = this.menuOpen ? 'block' : 'none';
        if(this.menuOpen) document.exitPointerLock();
    }

    _addButton(label, onClick) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.width = '100%';
        btn.style.marginBottom = '5px';
        btn.addEventListener('click', onClick);
        this.menuElement.appendChild(btn);
    }

    _addSlider(label, min, max, value, onChange) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const lbl = document.createElement('div');
        lbl.textContent = `${label}: ${value.toFixed(4)}`;
        container.appendChild(lbl);

        const input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.step = (max-min)/1000;
        input.value = value;
        input.style.width = '100%';
        input.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            lbl.textContent = `${label}: ${val.toFixed(4)}`;
            onChange(val);
        });
        container.appendChild(input);

        this.menuElement.appendChild(container);
    }
}
