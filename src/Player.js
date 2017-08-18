class Player {
	constructor(ui) {
		this.ui = ui;
		
		this.health = 0;
		this.maxHealth = 0;
		this.minDamage = 9999999;
		this.maxDamage = 1;
		this.died = false;
	}
	
	update() {
		this.updateHealth();
		this.updateDamage();
	}
	
	updateHealth() {
		if (this.ui.stage == config.stage.battle) {
			let el = this.ui.page.querySelector('.playerInfo');
			if (el) {
				let parts = el.textContent.match(/^[\s\S]+?([\d,]+)\s*\/\s*([\d,]+)[\s\S]*$/m, '$1:$2');
				if (parts && parts.length > 2) {
					this.health = parseInt(parts[1].replace(/,/g, '')*1);
					this.maxHealth = parseInt(parts[2].replace(/,/g, '')*1);
				}
			}
		}
	}
	
	updateDamage() {
		if (this.ui.stage == config.stage.battle) {
			let el = this.ui.page.querySelector('.playerInfo > strong');
			if (el) {
				let dam = el.textContent.trim().replace(/,/g,'')*1 || 0;
				this.minDamage = Math.min(this.minDamage, dam||this.minDamage);
				this.maxDamage = Math.max(this.maxDamage, dam);
			}
		}
	}
}