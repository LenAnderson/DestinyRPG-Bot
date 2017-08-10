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
		this.window = open('about:blank', 'DestinyRPG Bot - Preferences', 'resizable,innerHeight=800,innerWidth=555,centerscreen,menubar=no,toolbar=no,location=no');
		this.window.addEventListener('unload', this.closed.bind(this));
		this.body = this.window.document.body;
		this.body.innerHTML = '${include-min-esc: html/prefs.html}';
		
		this.dom.updateInterval = this.body.querySelector('#updateInterval');
		this.dom.updateIntervalRange = this.body.querySelector('#updateIntervalRange');
		this.dom.stayInLocation = this.body.querySelector('#stayInLocation');
		this.dom.stayInRegion = this.body.querySelector('#stayInRegion');
		this.dom.maxScan = this.body.querySelector('#maxScan');
		this.dom.avoidHealth = this.body.querySelector('#avoidHealth');
		this.dom.luckyDay = this.body.querySelector('#luckyDay');
		this.dom.attack = toArray(this.body.querySelectorAll('[name="attack[]"]'));
		this.dom.onlyBounties = this.body.querySelector('#onlyBounties');
		this.dom.bountiesAndChests = this.body.querySelector('#bountiesAndChests');
		this.dom.coverAt = this.body.querySelector('#coverAt');
		this.dom.runAt = this.body.querySelector('#runAt');
		
		this.setDomValues()
		
		
		this.body.querySelector('#save').addEventListener('click', this.save.bind(this));
		this.body.querySelector('#cancel').addEventListener('click', this.close.bind(this));
	}
	
	save() {
		this.getDomValues();
		GM_setValue('drb_prefs', JSON.stringify(prefs));
		this.close();
	}
	close() {
		this.window.close();
	}
	closed() {
		this.window = undefined;
	}
	
	
	setDomValues(dom, prefsCol) {
		dom = dom || this.dom;
		prefsCol = prefsCol || prefs;
		Object.keys(dom).forEach((key) => {
			if (dom[key] instanceof Array) {
				dom[key].forEach((sdom) => {
					sdom.checked = prefsCol[key].indexOf(sdom.value) > -1;
				})
			} else {
				switch (dom[key].type) {
					case 'checkbox':
						dom[key].checked = prefsCol[key];
						break;
					default:
						dom[key].value = prefsCol[key];
						break;
				}
			}
		});
	}
	getDomValues(dom, prefsCol) {
		dom = dom || this.dom;
		prefsCol = prefsCol || prefs;
		Object.keys(dom).forEach((key) => {
			if (dom[key] instanceof Array) {
				prefsCol[key] = dom[key].filter((sdom) => { return sdom.checked; }).map((sdom) => { return sdom.value; });
			} else {
				switch (dom[key].type) {
					case 'checkbox':
						prefsCol[key] = dom[key].checked;
						break;
					default:
						prefsCol[key] = dom[key].value;
						break;
				}
			}
		});
	}
}