class PrefsGUI {
	constructor() {
		this.window;
		this.dom = {};
	}
	
	show() {
		if (this.window) {
			this.window.focus();
			return;
		}
		this.window = open('about:blank', 'DestinyRPG Bot - Preferences', 'resizable,innerHeight=800,innerWidth=550,centerscreen,menubar=no,toolbar=no,location=no');
		this.window.addEventListener('unload', this.closed.bind(this));
		this.body = this.window.document.body;
		this.body.innerHTML = '${include-min-esc: html/prefs.html}';
		
		this.dom.updateInterval = this.body.querySelector('#updateInterval');
		this.dom.updateIntervalRange = this.body.querySelector('#updateIntervalRange');
		this.dom.stayInLocation = this.body.querySelector('#stayInLocation');
		this.dom.stayInRegion = this.body.querySelector('#stayInRegion');
		this.dom.maxScan = this.body.querySelector('#maxScan');
		this.dom.luckyDay = this.body.querySelector('#luckyDay');
		this.dom.coverAt = this.body.querySelector('#coverAt');
		this.dom.runAt = this.body.querySelector('#runAt');
		
		Object.keys(this.dom).forEach((key) => {
			switch (this.dom[key].type) {
				case 'checkbox':
					this.dom[key].checked = this.dom[key].value = prefs[key];
					break;
				default:
					this.dom[key].value = prefs[key];
					break;
			}
		});
		
		this.body.querySelector('#save').addEventListener('click', this.save.bind(this));
		this.body.querySelector('#cancel').addEventListener('click', this.close.bind(this));
	}
	
	save() {
		Object.keys(this.dom).forEach((key) => {
			switch (this.dom[key].type) {
				case 'checkbox':
					prefs[key] = this.dom[key].checked;
					break;
				default:
					prefs[key] = this.dom[key].value;
					break;
			}
		});
		GM_setValue('drb_prefs', JSON.stringify(prefs));
		this.close();
	}
	close() {
		this.window.close();
	}
	closed() {
		this.window = undefined;
	}
}