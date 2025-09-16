export class Console {
    constructor(engine) {
        this.engine = engine;
        this.visible = false;
        this._initConsole();
        this.commands = {
            'noclip': () => { this.engine.player.noclip = !this.engine.player.noclip; this._log(`Noclip: ${this.engine.player.noclip}`); },
            'thirdperson': () => { this.engine.thirdPerson = !this.engine.thirdPerson; this._log(`ThirdPerson: ${this.engine.thirdPerson}`); },
            'cl_showfps': () => { this.engine.showFPS = !this.engine.showFPS; this._log(`ShowFPS: ${this.engine.showFPS}`); },
            'sv_cheats': (val) => { this.engine.sv_cheats = val === '1'; this._log(`SV_Cheats: ${this.engine.sv_cheats}`); },
            'give': (weapon) => { this.engine.weapons.giveWeapon(weapon); },
            'switch': (index) => { this.engine.weapons.switchWeapon(Number(index)); },
            'fire': () => { this.engine.weapons.fire(); },
            'help': () => { this._log('Commands: noclip, thirdperson, cl_showfps, sv_cheats 1, give [weapon], switch [index], fire'); }
        };

        window.addEventListener('keydown', (e) => {
            if(e.key === '`') this.toggle(); // ~ key
            if(e.key === 'Enter' && this.visible) this._execute();
        });
    }

    _initConsole() {
        this.consoleDiv = document.createElement('div');
        Object.assign(this.consoleDiv.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '200px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: '16px',
            overflowY: 'auto',
            display: 'none',
            padding: '10px',
            zIndex: '1002'
        });
        document.body.appendChild(this.consoleDiv);

        this.input = document.createElement('input');
        Object.assign(this.input.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            fontSize: '16px',
            fontFamily: 'monospace',
            backgroundColor: '#111',
            color: '#0f0',
            border: 'none',
            outline: 'none',
            padding: '5px',
            zIndex: '1003'
        });
        this.consoleDiv.appendChild(this.input);
    }

    toggle() {
        this.visible = !this.visible;
        this.consoleDiv.style.display = this.visible ? 'block' : 'none';
        if (this.visible) this.input.focus();
    }

    _execute() {
        const line = this.input.value.trim();
        if(!line) return;
        const [cmd, ...args] = line.split(' ');
        if(this.commands[cmd]){
            this.commands[cmd](...args);
        } else {
            this._log(`Unknown command: ${cmd}`);
        }
        this.input.value = '';
        this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
    }

    _log(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        this.consoleDiv.appendChild(div);
        this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
    }
}
