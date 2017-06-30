${include-once: ../Stage.js}
class BattleStage extends Stage {
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
			attack: this.ui.page.querySelector('#actions .attacklink'),
			special: this.ui.page.querySelector('#actions .speciallink'),
			heavy: this.ui.page.querySelector('#actions .heavylink'),
			super: this.ui.page.querySelector('#actions .superlink'),
			cover: this.ui.page.querySelector('#actions .coverlink'),
			run: this.ui.page.querySelector('#actions .runlink'),
			respawn: this.ui.page.querySelector('#actions a[href*="index.php"]')
		};
	}
	
	go() {
		this.updateActions();
		
		if (this.actions.attack) {
			this.attack();
		} else if (this.player.health < 0) {
			this.player.died = true;
			log.log('💀 You are dead!');
			if (this.actions.respawn) {
				click(this.actions.respawn);
			}
		} else {
			log.log('🏆 Battle ended');
			click(this.actions.run);
		}
	}
	
	attack() {
		// run if low on health
		if (this.actions.run && (this.player.health < (prefs.runAt / 100) * this.player.maxHealth || this.player.health < this.enemy.damage * 1.1)) {
			log.log('🏃 Low health. Running like hell.');
			click(this.actions.run);
		}
		// heal if possible at less than x% health
		else if (this.actions.cover && this.player.health < (prefs.coverAt / 100) * this.player.maxHealth) {
			log.log('🚑 Healing under cover.');
			click(this.actions.cover);
		}
		// Ultra Attack -- bosses only, must have shield or more HP than four times our min damage
		else if (this.actions.super && this.enemy.boss && (this.enemy.shield > 0 || this.enemy.health > this.player.minDamage*4)) {
			log.log('ULTRA ATTACK!');
			click(this.actions.super);
		}
		// Heavy Attack -- bosses only, must have shield or more HP than twice our min damage
		else if (this.actions.heavy && this.enemy.boss && (this.enemy.shield > 0 || this.enemy.health > this.player.minDamage*2)) {
			log.log('Heavy Attack');
			click(this.actions.heavy);
		}
		// Special Attack -- only on shields
		else if (this.actions.special && this.enemy.shield > 0) {
			log.log('Special Attack');
			click(this.actions.special);
		}
		// Regular Attack
		else if (this.actions.attack) {
			log.log('Regular Attack');
			click(this.actions.attack);
		} else {
			log.warn('fuck');
		}
	}
}