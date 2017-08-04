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
			let healthImg = this.ui.page.querySelector('.enemyInfo > img[src*="icon-hp3.png"]');
			if (healthImg) this.health = healthImg.previousElementSibling.textContent.trim()*1;
			else this.health = 0;
			
			let shieldImg = this.ui.page.querySelector('.enemyInfo > img[src*="icon-shield.png"]');
			if (shieldImg) this.shield = shieldImg.previousSibling.textContent.trim()*1;
			else this.shield = 0;
		}
	}
	
	updateDamage() {
		if (this.ui.stage == config.stage.battle) {
			let el = this.ui.page.querySelector('.enemyInfo > strong');
			if (el) {
				let dam = el.textContent.trim()*1;
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