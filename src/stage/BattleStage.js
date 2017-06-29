${include-once: ../Stage.js}
class BattleStage extends Stage {
	constructor(ui, player, enemy) {
		super(ui, player, enemy);
	}
	
	reset() {
		this.actions = {
			attack: null,
			special: null,
			heavy: null,
			super: null,
			cover: null,
			run: null
		}
	}
	
	updateActions() {
		this.actions = {
			attack: this.ui.page.querySelector('.attacklink'),
			special: this.ui.page.querySelector('.speciallink'),
			heavy: this.ui.page.querySelector('.heavylink'),
			super: this.ui.page.querySelector('.superlink'),
			cover: this.ui.page.querySelector('.coverlink'),
			run: this.ui.page.querySelector('.runlink')
		};
	}
	
	go() {
		this.updateActions();
		
		if (this.actions.attack) {
			this.attack();
		} else {
			log.log('Battle ended');
			this.actions.run.click();
		}
	}
	
	attack() {
		// run if low on health
		if (this.actions.run && (this.player.health < (prefs.runAt / 100) * this.player.maxHealth || this.player.health < this.enemy.damage * 1.1)) {
			log.log('Low health. Running like hell.');
			this.actions.run.click();
		}
		// heal if possible at less than x% health
		else if (this.actions.cover && this.player.health < (prefs.coverAt / 100) * this.player.maxHealth) {
			log.log('Healing under cover.');
			this.actions.cover.click();
		}
		// Ultra Attack -- bosses only, must have shield or more HP than four times our min damage
		else if (this.actions.super && this.enemy.boss && (this.enemy.shield > 0 || this.enemy.health > this.player.minDamage*4)) {
			log.log('ULTRA ATTACK!');
			this.actions.super.click();
		}
		// Heavy Attack -- bosses only, must have shield or more HP than four times our min damage
		else if (this.actions.heavy && this.enemy.boss && (this.enemy.shield > 0 || this.enemy.health > this.player.minDamage*2)) {
			log.log('Heavy Attack');
			this.actions.heavy.click();
		}
		// Special Attack -- only on shields
		else if (this.actions.special && this.enemy.shield > 0) {
			log.log('Special Attack');
			this.actions.special.click();
		}
		// Regular Attack
		else if (this.actions.attack) {
			log.log('Regular Attack');
			this.actions.attack.click();
		} else {
			log.warn('fuck');
		}
	}
}