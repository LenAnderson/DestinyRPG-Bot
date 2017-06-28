// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      1.0
// @author       LenAnderson
// @match        https://game.destinyrpg.com/*
// @grant        none
// ==/UserScript==

(function() {
	let config = {
	stage: {
	orbit: 'index-1',
	battle: 'battle',
	patrol: 'patrol'
}
}
	let prefs = {
	updateInterval: 1000,
	
	coverAt: 50,
	runAt: 20,
	
	luckyDay: 'glimmer'
};
	let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
Element.prototype.$ = Element.prototype.querySelector;
Element.prototype.$$ = Element.prototype.querySelectorAll;

HTMLCollection.prototype.toArray = Array.prototype.slice;
NodeList.prototype.toArray = Array.prototype.slice;
NamedNodeMap.prototype.toArray = Array.prototype.slice;

Node.prototype.replace = function(el) {
	this.parentNode.replaceChild(el, this);
}
Node.prototype.isChildOf = function(el) {
	return this.parentNode && this != document.body && this != document.body.parentNode && (this.parentNode == el || this.parentNode.isChildOf(el));
}
Node.prototype.parent = function(q) {
	if (this.parentElement.matches(q)) return this.parentElement;
	return this.parentElement.parent(q);
}
Node.prototype.getElement = function() {
	if (this instanceof Element) return this;
	return this.parentElement;
}

let log = {
	error: (...args) => { console.error.apply(console, ['[DRB]'].concat(args)); },
	log: (...args) => { console.log.apply(console, ['[DRB]'].concat(args)); },
	warn: (...args) => { console.warn.apply(console, ['[DRB]'].concat(args)); },
}
	class UI {
	get page() {
		return $('body > .views > .view > .pages > .page.page-on-center') || $('body > .views > .view > .pages > .page[data-page="index-1"]');
	}
	get stage() {
		let page = this.page;
		if (page) {
			return page.getAttribute('data-page').toLowerCase();
		}
	}
}
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
			let parts = this.ui.page.$('.page-content > .content-block > .row > .col-50 > span').textContent.replace(/,/g, '').match(/.*?(\d+)\s*\/\s*(\d+)\s*HP.*$/, '$1 : $2');
			this.health = parseInt(parts[1]);
			this.maxHealth = parseInt(parts[2]);
		}
	}
	
	updateDamage() {
		if (this.ui.stage == config.stage.battle) {
			let el = this.ui.page.$$('#console > strong').toArray().find(it=>{return getComputedStyle(it).color == 'rgb(50, 205, 50)';});
			if (el) {
				let parts = el.textContent.replace(/,/g, '').match(/.*?(\d+).*$/, '$1');
				let dam = (parts[1]*1) || 0;
				this.minDamage = Math.min(this.minDamage, dam||this.minDamage);
				this.maxDamage = Math.max(this.maxDamage, dam);
			}
		}
	}
}
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
			let parts = this.ui.page.$('.page-content > .content-block > .row > .col-50 + .col-50 > a > span').textContent.replace(/,/g, '').match(/.*?(?:(?:(\d+)\s*HP)|(?:(\d+)\s*Shield)).*$/);
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
			let el = this.ui.page.$$('#console > strong').toArray().find(it=>{return getComputedStyle(it).color == 'rgb(255, 0, 0)';});
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
class Stage {
	constructor(ui, player, enemy) {
		this.ui = ui;
		this.player = player;
		this.enemy = enemy;
	}
	
	go() {
		log.error('Stage.go', 'is not implemented');
	}
}
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

class BattleStage extends Stage {
	constructor(ui, player, enemy) {
		super(ui, player, enemy);
		
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
			attack: this.ui.page.$('.attacklink'),
			special: this.ui.page.$('.speciallink'),
			heavy: this.ui.page.$('.heavylink'),
			super: this.ui.page.$('.superlink'),
			cover: this.ui.page.$('.coverlink'),
			run: this.ui.page.$('.runlink')
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

class Bot {
	constructor() {
		this.ui = new UI();
		
		this.player = new Player(this.ui);
		this.enemy = new Enemy(this.ui);
		
		this.stage = new Stage(this.ui, this.player, this.enemy);
		
		this.update();
	}
	
	updatePlayer() {
		this.player.update();
	}
	
	update() {
		this.player.update();
		this.enemy.update();
		
		switch (this.ui.stage) {
			case config.stage.patrol:
				this.stage = new PatrolStage(this.ui, this.player, this.enemy);
				break;
			case config.stage.battle:
				this.stage = new BattleStage(this.ui, this.player, this.enemy);
				break;
			default:
				this.stage = new Stage(this.ui, this.player, this.enemy);
		}
		this.stage.go();
		
		setTimeout(this.update.bind(this), prefs.updateInterval);
	}
}
	
	let bot = new Bot();
	
	unsafeWindow.bot = bot;
})();