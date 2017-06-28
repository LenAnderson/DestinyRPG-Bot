${include-once: ../Stage.js}
class PatrolStage extends Stage {
	constructor(ui, player, enemy) {
		super(ui, player, enemy);
		
		this.targets = [];
	}
	
	updateTargets() {
		this.targets = this.ui.page.$$('.page-content > .list-block > ul > li > a[href^="battle.php"]').toArray().map((a) => { return {
			el: a,
			name: a.$('.item-content > .item-inner > .item-title').textContent.trim(),
			health: a.$('.item-content > .item-inner > .item-after').textContent.replace(/,/g, '').replace(/.*?(\d+)\s*HP.*$/, '$1')*1 || 0,
			shield: a.$('.item-content > .item-inner > .item-after').textContent.replace(/,/g, '').replace(/.*?(\d+)\s*SH.*$/, '$1')*1 || 0,
			type: (a.$('.item-content > .item-media > img') || {src:'normal'}).src.replace(/^.*icon-(.+?)\.png.*$/, '$1')
		}});
		this.targets.sort(function(a,b)  {
			if (a.type == 'currency' && b.type != 'currency') return -1;
			if (a.type != 'currency' && b.type == 'currency') return 1;
			if (a.shield > b.shield) return -1;
			if (a.shield < b.shield) return 1;
			if (a.health > b.health) return -1;
			if (a.health < b.health) return 1;
			return 0;
		});
	}
	
	updateLuckyDay() {
		this.luckyDay = this.ui.page.$$('.button.luckyday').toArray().map((btn) => {return {
			el: btn,
			type: btn.getAttribute('data-type').toLowerCase()
		}});
	}
	
	go() {
		this.updateTargets();
		this.updateLuckyDay();
		
		
		// attack the first enemy
		if (this.targets.length > 0) {
			let target = this.targets[0];
			let hits = Math.ceil((target.health || target.shield) / this.player.minDamage);
			log.log('Fighting ' + target.name + ' (' + target.type + ') [' + (target.health ? target.health+'HP' : target.shield+'SH') + '] [~' + hits + ' hits]');
			this.enemy.type = target.type;
			target.el.click();
		}
		// if there is a "lucky day" prompt, choose the preferred boost
		else if (this.luckyDay.length > 0) {
			let modalConfirm = $('.actions-modal-button');
			if (modalConfirm) {
				modalConfirm.click();
			} else {
				(this.luckyDay.find((it)=>{return it.type==prefs.luckyDay;}) || this.luckyDay[0]).el.click();
			}
		}
		// look around for enemies
		else {
			log.log('Searching for enemies');
			this.ui.page.$('.page-content > .list-block > ul > li > a.nothinglink[href="#"]').click();
		}
	}
}