${include-once: ../Stage.js}
class PatrolStage extends Stage {
	reset() {
		this.targets = [];
		this.bounties = [];
		this.scanned = 0;
		this.player.died = false;
		this.luckyDayWait = 0;
		this.luckyDay = [];
		this.captcha = null;
		this.captchaChallenge = null;
		this.notified = false;
		GM_setValue('drb_captcha', '');
		GM_setValue('drb_captcha_solved', '');
	}
	
	updateBounties() {
		this.bounties = toArray(this.ui.page.querySelectorAll('#progressItems > .card')).filter(it=>{return it.textContent.search('Bounty:')>-1;}).map(it=>{return it.textContent.trim().replace(/^.+\d+\s*\/\s*\d+\s*(.+?)\s*\(.+$/, '$1');});
	}
	
	updateTargets() {
		this.updateBounties();
		this.targets = toArray(this.ui.page.querySelectorAll('.page-content > .list-block > ul > li > a.initBattle')).map((a) => {
			let after = a.querySelector('.item-content > .item-inner > .item-after');
			return {
				el: a,
				name: a.querySelector('.item-content > .item-inner > .item-title').textContent.trim(),
				health: after.querySelector('.item-media > img[src*="icon-hp3.png"]') ? after.textContent.trim().replace(/,/g, '')*1 || 0 : 0,
				shield: after.querySelector('.item-media > img[src*="icon-shield.png"]') ? after.textContent.trim().replace(/,/g, '')*1 || 0 : 0,
				// types: currency (chest/cache), ultra (white skull), ultra-pe (red skull)?
				type: (a.querySelector('.item-content > .item-media > img') || {src:'normal'}).src.replace(/^.*icon-(.+?)\.png.*$/, '$1'),
				ribbon: (a.querySelector('.ribbon')||{textContent:false}).textContent
			}
		}).filter((t) => {
			// remove disabled
			if (t.el.getAttribute('disabled')) return false;
			// if bounty-focus and active bounties...
			if (prefs.onlyBounties && this.bounties.length > 0) {
				// keep enemy with bounty
				if (this.bounties.indexOf(t.name) > -1) return true;
				// if bounty+chest: keep chests
				if (prefs.bountiesAndChests && t.type == 'currency') return true;
				// if bounty+ultra: keep ultras
				if (prefs.bountiesAndUltras && (t.type == 'ultra' || t.type == 'ultra-pe')) return true;
				// remove all else
				return false;
			}
			// if enemy types are selected, keep those
			if (prefs.attack.length == 0 || prefs.attack.indexOf(t.type) > -1) return true;
			// remove all else
			return false;
		});
		this.targets.sort((a,b) => {
			// prioritize chests and caches
			if (a.type == 'currency' && b.type != 'currency') return -1;
			if (a.type != 'currency' && b.type == 'currency') return 1;
			// prioritize bounties
			if (this.bounties.indexOf(a.name) > -1 && this.bounties.indexOf(b.name) == -1) return -1;
			if (this.bounties.indexOf(a.name) == -1 && this.bounties.indexOf(b.name) > -1) return -1;
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
		if (this.luckyDay.length <= 0) {
			this.luckyDayWait = 0;
		} else {
			this.captcha = this.ui.page.querySelector('.g-recaptcha iframe');
			if (this.captcha) {
				let params = getParams(this.captcha.src);
				let key = params.k + '&' + params.v;
				if (GM_getValue('drb_captcha_solved') == key) {
					this.captcha = null;
				} else {
					GM_setValue('drb_captcha', key);
				}
			}
			let challenges = toArray($$('iframe[title="recaptcha challenge"]'));
			if (challenges.length > 0) {
				this.captchaChallenge = challenges.filter(challenge=>{return getComputedStyle(challenge).visibility != 'hidden';}).length > 0;
			}
			if (!this.captcha) this.notified = false;
		}
	}
	
	go() {
		this.updateTargets();
		this.updateLuckyDay();
		
		
		// if the "i'm not a robot" captcha shows up, wait for user input
		if (this.captcha) {
			log.log("🤖 I'm not a robot!");
			this.luckyDayWait = 0;
			if (GM_getValue('drb_captcha_solved') == GM_getValue('drb_captcha')) {
				log.log('🤖 captcha solved');
			} else if (!this.notified && this.captchaChallenge) {
				this.captchaNotification = new Notification("[DRB] 🤖 I'm not a robot!", {body: 'You need to solve the captcha for the bot to continue.'});
				this.notified = true;
			}
		}
		// if there is a "lucky day" prompt, choose the preferred boost
		else if (this.luckyDay.length > 0) {
			log.log('Lucky Day');
			if (this.luckyDayWait++ < 5) {
				log.log('waiting to check for captcha');
			} else {
				let modalConfirm = $('.actions-modal-button');
				if (modalConfirm) {
					click(modalConfirm);
				} else {
					click((this.luckyDay.find((it)=>{return it.type==prefs.luckyDay;}) || this.luckyDay[0]).el);
				}
			}
		} else {
			// remove leftover modal dialog (from lucky day)
			toArray($$('.actions-modal, .modal-overlay')).forEach((it) => { it.remove(); });
			// attack the first enemy
			if (this.targets.length > 0) {
				let target = this.targets[0];
				let hits = Math.ceil((target.health || target.shield) / this.player.minDamage);
				log.log('⚔ Fighting ' + target.name + ' (' + target.type + ') [' + (target.health ? target.health+'HP' : target.shield+'SH') + '] [~' + hits + ' hits]');
				this.enemy.type = target.type;
				click(target.el);
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
}