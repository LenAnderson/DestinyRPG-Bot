// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      1.0
// @author       LenAnderson
// @match        https://game.destinyrpg.com/*
// @grant        GM_registerMenuCommand
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
	updateIntervalRange: 400,
	
	coverAt: 50,
	runAt: 20,
	
	luckyDay: 'glimmer'
};
	class PrefsGUI {
	constructor() {
		this.window;
		this.dom = {};
	}
	
	show() {
		if (this.window) {
			this.window.focus();
			return;
		}
		this.window = open('about:blank', 'DestinyRPG Bot - Preferences', 'resizable,innerHeight=800,innerWidth=485,centerscreen,menubar=no,toolbar=no,location=no');
		this.window.addEventListener('unload', this.closed.bind(this));
		this.body = this.window.document.body;
		this.body.innerHTML = '<style>body {background-color: rgb(34, 36, 38);color: rgb(221, 221, 221);font-family: -apple-system,SF UI Text,Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 17px;line-height: 1.4;}h1 {color: rgb(255, 255, 255);font-size: 17px;font-weight: bold;line-height: 44px;}h2 {color: rgb(255, 255, 255);font-size: 17px;font-weight: normal;line-height: 1.2;margin: 0;}section {margin: 10px 0 40px 0;}section > p {background-color: rgba(28, 29, 31, 0.5);border-bottom: 1px solid rgb(57, 57, 57);margin: 20px 0;}section > p > label {cursor: pointer;display: inline-block;width: 300px;}section > p > input {background-color: transparent;border: none;color: rgb(255, 255, 255);font: inherit;}section > p > input[type=\"number\"] {text-align: right;}section.actions {text-align: right;}section.actions > button {background-color: rgb(51, 0, 0);border: 1px solid rgb(102, 0, 0);border-radius: 4px;box-sizing: border-box;color: rgb(255, 255, 255);cursor: pointer;font-size: 14px;height: 29px;line-height: 27px;margin: 0 10px;padding: 0 10px;width: 100px;}section.actions > button#save {background-color: rgb(0, 51, 0);border-color: rgb(0, 102, 0);}</style><h1>DestinyRPG Bot - Preferences</h1><p><small><strong>Preferences are currently not saved.</strong><br>Saving them to <code>localStorage</code>, as a Cookie, other other places easily accessible from JavaScript would also make them detectable by the game\'s code.<br>If you have a good idea to implement saving the preferences let me know :)</small></p><section><p><label for=\"updateInterval\">Update Interval (ms)</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"updateInterval\"></p><p><label for=\"updateIntervalRange\">Update Interval Range (±ms)</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"updateIntervalRange\"></p></section><section><h2>Patrol</h2><p><label for=\"luckyDay\">Lucky Day Bonus</label><select id=\"luckyDay\"><option value=\"xp\">XP</option><option value=\"lp\">LP</option><option value=\"glimmer\">Glimmer</option></select></section><section><h2>Battle</h2><p><label for=\"coverAt\">Take Cover At (% max health)</label><input type=\"number\" min=\"1\" max=\"99\" id=\"coverAt\"></p><p><label for=\"runAt\">Run Away At (% max health)</label><input type=\"number\" min=\"1\" max=\"99\" id=\"runAt\"></p></section><section class=\"actions\"><button id=\"save\">Save</button><button id=\"cancel\">Cancel</button></section>';
		
		this.dom.updateInterval = this.body.querySelector('#updateInterval');
		this.dom.updateIntervalRange = this.body.querySelector('#updateIntervalRange');
		this.dom.luckyDay = this.body.querySelector('#luckyDay');
		this.dom.coverAt = this.body.querySelector('#coverAt');
		this.dom.runAt = this.body.querySelector('#runAt');
		
		Object.keys(this.dom).forEach((key) => {
			switch (this.dom[key].type) {
				case 'checkbox':
					this.dom[key].checked = this.dom[key].value = prefs[key];
					break;
				default:
					this.dom[key].value = prefs[key];
					break;
			}
		});
		
		this.body.querySelector('#save').addEventListener('click', this.save.bind(this));
		this.body.querySelector('#cancel').addEventListener('click', this.close.bind(this));
	}
	
	save() {
		Object.keys(this.dom).forEach((key) => {
			switch (this.dom[key].type) {
				case 'checkbox':
					prefs[key] = this.dom[key].checked;
					break;
				default:
					prefs[key] = this.dom[key].value;
					break;
			}
		});
		// don't save to localStorage to avoid detection
		// maybe we could save to another site (e.g. GitHub Gist)?
		this.close();
	}
	close() {
		this.window.close();
	}
	closed() {
		this.window = undefined;
	}
}
	let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
// Element.prototype.$ = Element.prototype.querySelector;
// Element.prototype.$$ = Element.prototype.querySelectorAll;

// HTMLCollection.prototype.toArray = Array.prototype.slice;
// NodeList.prototype.toArray = Array.prototype.slice;
// NamedNodeMap.prototype.toArray = Array.prototype.slice;

// Node.prototype.replace = function(el) {
	// this.parentNode.replaceChild(el, this);
// }
// Node.prototype.isChildOf = function(el) {
	// return this.parentNode && this != document.body && this != document.body.parentNode && (this.parentNode == el || this.parentNode.isChildOf(el));
// }
// Node.prototype.parent = function(q) {
	// if (this.parentElement.matches(q)) return this.parentElement;
	// return this.parentElement.parent(q);
// }
// Node.prototype.getElement = function() {
	// if (this instanceof Element) return this;
	// return this.parentElement;
// }

let log = {
	error: (...args) => { console.error.apply(console, ['[DRB]'].concat(args)); },
	log: (...args) => { console.log.apply(console, ['[DRB]'].concat(args)); },
	warn: (...args) => { console.warn.apply(console, ['[DRB]'].concat(args)); },
}

function random(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
	let range = max - min + 1;
	return Math.floor(Math.random()*range) + min;
}

function toArray(collection) {
	return Array.prototype.slice.call(collection);
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
class Stage {
	constructor(ui, player, enemy) {
		this.ui = ui;
		this.player = player;
		this.enemy = enemy;
	}
	
	go() {
		log.error('Stage.go', 'is not implemented');
	}
	
	reset() {
		log.error('Stage.reset', 'is not implemented');
	}
}
class PatrolStage extends Stage {
	constructor(ui, player, enemy) {
		super(ui, player, enemy);
	}
	
	reset() {
		this.targets = [];
		this.scanned = 0;
	}
	
	updateTargets() {
		this.targets = toArray(this.ui.page.querySelectorAll('.page-content > .list-block > ul > li > a[href^="battle.php"]')).map((a) => { return {
			el: a,
			name: a.querySelector('.item-content > .item-inner > .item-title').textContent.trim(),
			health: a.querySelector('.item-content > .item-inner > .item-after').textContent.replace(/,/g, '').replace(/.*?(\d+)\s*HP.*$/, '$1')*1 || 0,
			shield: a.querySelector('.item-content > .item-inner > .item-after').textContent.replace(/,/g, '').replace(/.*?(\d+)\s*SH.*$/, '$1')*1 || 0,
			// types: currency, ultra, ?
			type: (a.querySelector('.item-content > .item-media > img') || {src:'normal'}).src.replace(/^.*icon-(.+?)\.png.*$/, '$1')
		}});
		this.targets.sort(function(a,b)  {
			// prioritize chests and caches
			if (a.type == 'currency' && b.type != 'currency') return -1;
			if (a.type != 'currency' && b.type == 'currency') return 1;
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
			this.ui.page.querySelector('.page-content > .list-block > ul > li > a.nothinglink[href="#"]').click();
		}
	}
}

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

class Bot {
	constructor() {
		this.ui = new UI();
		
		this.player = new Player(this.ui);
		this.enemy = new Enemy(this.ui);
		
		this.stages = {
			'default': new Stage(this.ui, this.player, this.enemy)
		};
		this.stages[config.stage.patrol] = new PatrolStage(this.ui, this.player, this.enemy);
		this.stages[config.stage.battle] = new BattleStage(this.ui, this.player, this.enemy);
		this.stageId = 'default';
		
		this.update();
	}
	
	updatePlayer() {
		this.player.update();
	}
	
	get stage() {
		return this.stages[this.stageId];
	}
	set stage(stageId) {
		if (this.stages[stageId]) {
			if (this.stageId != stageId) {
				this.stageId = stageId;
				this.stage.reset();
			}
		} else {
			this.stageId = 'default';
		}
	}
	
	update() {
		this.player.update();
		this.enemy.update();
		
		this.stage = this.ui.stage;
		this.stage.go();
		
		setTimeout(this.update.bind(this), prefs.updateInterval*1 + random(prefs.updateIntervalRange*(-1), prefs.updateIntervalRange*1));
	}
}
	
	let bot = new Bot();
	
	let prefsGUI = new PrefsGUI();
	GM_registerMenuCommand('[DRB] Preferences', prefsGUI.show.bind(prefsGUI));
})();