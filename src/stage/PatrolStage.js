${include-once: ../Stage.js}
class PatrolStage extends Stage {
	reset() {
		this.targets = [];
		this.scanned = 0;
		this.player.died = false;
	}
	
	updateTargets() {
		this.targets = toArray(this.ui.page.querySelectorAll('.page-content > .list-block > ul > li > a.initBattle')).map((a) => {
			let after = a.querySelector('.item-content > .item-inner > .item-after');
			return {
				el: a,
				name: a.querySelector('.item-content > .item-inner > .item-title').textContent.trim(),
				health: after.querySelector('.item-media > img[src*="icon-hp3.png"]') ? after.textContent.trim().replace(/,/g, '')*1 || 0 : 0,
				shield: after.querySelector('.item-media > img[src*="icon-shield.png"]') ? after.textContent.trim().replace(/,/g, '')*1 || 0 : 0,
				// types: currency (chest/cache), ultra (white skull), ultra-pe (red skull)?
				type: (a.querySelector('.item-content > .item-media > img') || {src:'normal'}).src.replace(/^.*icon-(.+?)\.png.*$/, '$1')
			}
		}).filter((t) => {return (t.type != 'ultra-pe' || prefs.attackUltraPe) && t.el.getAttribute('disabled') == null; });
		this.targets.sort((a,b) => {
			// prioritize chests and caches
			if (a.type == 'currency' && b.type != 'currency') return -1;
			if (a.type != 'currency' && b.type == 'currency') return 1;
			// avoid enemies with much higher health / shield
			if (this.player.maxHealth > 0) {
				if (a.shield+a.health > this.player.maxHealth*prefs.avoidHealth && b.shield+b.health < this.player.maxHealth*prefs.avoidHealth) return 1;
				if (a.shield+a.health < this.player.maxHealth*prefs.avoidHealth && b.shield+b.health > this.player.maxHealth*prefs.avoidHealth) return -1;
			}
			// prioritize ultra-pe (red skulls)
			if (a.type == 'ultra-pe' && b.type != 'ultra-pe') return -1;
			if (a.type != 'ultra-pe' && b.type == 'ultra-pe') return 1;
			// prioritze ultras
			if (a.type == 'ultra' && b.type != 'ultra') return -1;
			if (a.type != 'ultra' && b.type == 'ultra') return 1;
			// prioritize high shield
			if (a.shield > b.shield) return -1;
			if (a.shield < b.shield) return 1;
			// prioritize high health
			if (a.health > b.health) return -1;
			if (a.health < b.health) return 1;
			return 0;
		});
	}
	
	updateLuckyDay() {
		this.luckyDay = toArray(this.ui.page.querySelectorAll('.button.luckyday')).map((btn) => {return {
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
			log.log('⚔ Fighting ' + target.name + ' (' + target.type + ') [' + (target.health ? target.health+'HP' : target.shield+'SH') + '] [~' + hits + ' hits]');
			this.enemy.type = target.type;
			click(target.el);
		}
		// if there is a "lucky day" prompt, choose the preferred boost
		else if (this.luckyDay.length > 0) {
			let modalConfirm = $('.actions-modal-button');
			if (modalConfirm) {
				click(modalConfirm);
			} else {
				click((this.luckyDay.find((it)=>{return it.type==prefs.luckyDay;}) || this.luckyDay[0]).el);
			}
		}
		// if number if times "looking around" is higher then the max from preferences: travel
		else if (this.scanned > prefs.maxScan) {
			log.log('✈ Going somewhere else...');
			click(this.ui.page.querySelector('a[href*="changelocation.php"]'));
		}
		// look around for enemies
		else {
			this.scanned++;
			log.log('🔎 Searching for enemies');
			click(this.ui.page.querySelector('.page-content > .list-block > ul > li > a.nothinglink'));
		}
	}
}