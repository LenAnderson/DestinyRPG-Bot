class Player {
	constructor(ui) {
		this.ui = ui;
		
		this.health = 0;
		this.maxHealth = 0;
		this.minDamage = 9999999;
		this.maxDamage = 1;
	}
	
	update() {
		this.updateHealth();
		this.updateDamage();
	}
	
	updateHealth() {
		if (this.ui.stage == config.stage.battle) {
			let parts = this.ui.page.querySelector('.page-content > .content-block > .row > .col-50 > span').textContent.replace(/,/g, '').match(/.*?(\d+)\s*\/\s*(\d+)\s*HP.*$/, '$1 : $2');
			this.health = parseInt(parts[1]);
			this.maxHealth = parseInt(parts[2]);
		}
	}
	
	updateDamage() {
		if (this.ui.stage == config.stage.battle) {
			let el = toArray(this.ui.page.querySelectorAll('#console > strong')).find(it=>{return getComputedStyle(it).color == 'rgb(50, 205, 50)';});
			if (el) {
				let parts = el.textContent.replace(/,/g, '').match(/.*?(\d+).*$/, '$1');
				let dam = (parts[1]*1) || 0;
				this.minDamage = Math.min(this.minDamage, dam||this.minDamage);
				this.maxDamage = Math.max(this.maxDamage, dam);
			}
		}
	}
}