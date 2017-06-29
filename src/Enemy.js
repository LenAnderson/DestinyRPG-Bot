class Enemy {
	constructor(ui) {
		this.ui = ui;
		
		this.health = 0;
		this.minDamage = 1;
		this.maxDamage = 1;
		this.shield = 0;
		this.enraged = false;
		this.type = 'normal';
	}
	
	update() {
		this.updateHealth();
		this.updateDamage();
	}
	
	updateHealth() {
		if (this.ui.stage == config.stage.battle) {
			let parts = this.ui.page.querySelector('.page-content > .content-block > .row > .col-50 + .col-50 > a > span').textContent.replace(/,/g, '').match(/.*?(?:(?:(\d+)\s*HP)|(?:(\d+)\s*Shield)).*$/);
			if (parts) {
				this.health = (parts[1]||0)*1;
				this.shield = (parts[2]||0)*1;
			} else {
				this.health = 0;
				this.shield = 0;
			}
		}
	}
	
	updateDamage() {
		if (this.ui.stage == config.stage.battle) {
			let el = toArray(this.ui.page.querySelectorAll('#console > strong')).find(it=>{return getComputedStyle(it).color == 'rgb(255, 0, 0)';});
			if (el) {
				let parts = el.textContent.replace(/,/g, '').match(/.*?(\d+).*$/, '$1');
				let dam = (parts[1]*1) || 0;
				this.minDamage = Math.min(this.minDamage, dam);
				this.maxDamage = Math.max(this.maxDamage, dam);
			}
		}
	}
	
	get boss() {
		switch (this.type) {
			case 'normal':
			case 'currency':
				return false;
			default:
				return true;
		}
	}
}