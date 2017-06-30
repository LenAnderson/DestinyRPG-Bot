// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      1.2
// @author       LenAnderson
// @match        https://game.destinyrpg.com/*
// @match        https://test.destinyrpg.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function() {
	let config = {
	stage: {
	orbit: 'index-1',
	battle: 'battle',
	patrol: 'patrol',
	travel: 'changelocation'
}
}
	let prefs = {
	updateInterval: 1000,
	updateIntervalRange: 400,
	
	// travel
	stayInLocation: false,
	stayInRegion: false,
	
	// patrol
	maxScan: 5,
	avoidHealth: 10,
	luckyDay: 'glimmer',
	
	// battle
	coverAt: 50,
	runAt: 20
};
let sprefs = JSON.parse(GM_getValue('drb_prefs')||'false');
if (sprefs) {
	Object.keys(prefs).forEach((key) => {
		if (sprefs[key] !== undefined) {
			prefs[key] = sprefs[key];
		}
	});
}
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
		this.window = open('about:blank', 'DestinyRPG Bot - Preferences', 'resizable,innerHeight=800,innerWidth=550,centerscreen,menubar=no,toolbar=no,location=no');
		this.window.addEventListener('unload', this.closed.bind(this));
		this.body = this.window.document.body;
		this.body.innerHTML = '<style>body {background-color: rgb(34, 36, 38);color: rgb(221, 221, 221);font-family: -apple-system,SF UI Text,Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 17px;line-height: 1.4;}h1 {color: rgb(255, 255, 255);font-size: 17px;font-weight: bold;line-height: 44px;}h2 {color: rgb(255, 255, 255);font-size: 17px;font-weight: normal;line-height: 1.2;margin: 0;}section {margin: 10px 0 40px 0;}section > p {background-color: rgba(28, 29, 31, 0.5);border-bottom: 1px solid rgb(57, 57, 57);margin: 20px 0;}section > p > label {cursor: pointer;display: inline-block;width: 400px;}section > p > input {background-color: transparent;border: none;color: rgb(255, 255, 255);font: inherit;}section > p > input[type=\"number\"] {text-align: right;}section.actions {text-align: right;}section.actions > button {background-color: rgb(51, 0, 0);border: 1px solid rgb(102, 0, 0);border-radius: 4px;box-sizing: border-box;color: rgb(255, 255, 255);cursor: pointer;font-size: 14px;height: 29px;line-height: 27px;margin: 0 10px;padding: 0 10px;width: 100px;}section.actions > button#save {background-color: rgb(0, 51, 0);border-color: rgb(0, 102, 0);}</style><h1>DestinyRPG Bot - Preferences</h1><section><p><label for=\"updateInterval\">Update Interval (ms)</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"updateInterval\"></p><p><label for=\"updateIntervalRange\">Update Interval Range (±ms)</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"updateIntervalRange\"></p></section><section><h2>Travel</h2><p><label for=\"stayInLocation\">Don\'t Change Location</label><input type=\"checkbox\" id=\"stayInLocation\"></p><p><label for=\"stayInRegion\">Don\'t Change Region</label><input type=\"checkbox\" id=\"stayInRegion\"></p></section><section><h2>Patrol</h2><p><label for=\"maxScan\">Max Times Looking Around Before Travel</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"maxScan\"></p><p><label for=\"avoidHealth\">Avoid Enemies With x Times Player\'s Health</label><input type=\"number\" min=\"1\" max=\"10000\" id=\"avoidHealth\"></p><p><label for=\"luckyDay\">Lucky Day Bonus</label><select id=\"luckyDay\"><option value=\"xp\">XP</option><option value=\"lp\">LP</option><option value=\"glimmer\">Glimmer</option></select></section><section><h2>Battle</h2><p><label for=\"coverAt\">Take Cover At (% max health)</label><input type=\"number\" min=\"1\" max=\"99\" id=\"coverAt\"></p><p><label for=\"runAt\">Run Away At (% max health)</label><input type=\"number\" min=\"1\" max=\"99\" id=\"runAt\"></p></section><section class=\"actions\"><button id=\"save\">Save</button><button id=\"cancel\">Cancel</button></section>';
		
		this.dom.updateInterval = this.body.querySelector('#updateInterval');
		this.dom.updateIntervalRange = this.body.querySelector('#updateIntervalRange');
		this.dom.stayInLocation = this.body.querySelector('#stayInLocation');
		this.dom.stayInRegion = this.body.querySelector('#stayInRegion');
		this.dom.maxScan = this.body.querySelector('#maxScan');
		this.dom.avoidHealth = this.body.querySelector('#avoidHealth');
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
		GM_setValue('drb_prefs', JSON.stringify(prefs));
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
function toArray(collection) {
	return Array.prototype.slice.call(collection);
}

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

function click(el) {
	if (el == null) return;
	el.scrollIntoViewIfNeeded();
	let rect = el.getBoundingClientRect();
	let x = random(Math.max(0, rect.left), Math.min(innerWidth, rect.right));
	let y = random(Math.max(0, rect.top), Math.min(innerHeight, rect.bottom));
	['mouseover', 'mousedown', 'mouseup', 'click'].forEach((name) => {
		let evt = document.createEvent('MouseEvents');
		evt.initMouseEvent(name, true, true, unsafeWindow, 1, x,y, x,y, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
    });
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
		this.died = false;
	}
	
	update() {
		this.updateHealth();
		this.updateDamage();
	}
	
	updateHealth() {
		if (this.ui.stage == config.stage.battle) {
			let parts = this.ui.page.querySelector('.page-content > .content-block > .row > .col-50 > span').textContent.replace(/,/g, '').match(/.*?(-?\d+)\s*\/\s*(\d+)\s*HP.*$/, '$1 : $2');
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
		this.targets.sort((a,b) => {
			// prioritize chests and caches
			if (a.type == 'currency' && b.type != 'currency') return -1;
			if (a.type != 'currency' && b.type == 'currency') return 1;
			// avoid enemies with much higher health / shield
			if (this.player.maxHealth > 0) {
				if (a.shield+a.health > this.player.maxHealth*prefs.avoidHealth && b.shield+b.health < this.player.maxHealth*prefs.avoidHealth) return 1;
				if (a.shield+a.health < this.player.maxHealth*prefs.avoidHealth && b.shield+b.health > this.player.maxHealth*prefs.avoidHealth) return -1;
			}
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
			log.log('Going somewhere else...');
			click(this.ui.page.querySelector('a[href*="changelocation.php"]'));
		}
		// look around for enemies
		else {
			this.scanned++;
			log.log('Searching for enemies');
			click(this.ui.page.querySelector('.page-content > .list-block > ul > li > a.nothinglink[href="#"]'));
		}
	}
}

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
			log.log('Battle ended');
			click(this.actions.run);
		}
	}
	
	attack() {
		// run if low on health
		if (this.actions.run && (this.player.health < (prefs.runAt / 100) * this.player.maxHealth || this.player.health < this.enemy.damage * 1.1)) {
			log.log('Low health. Running like hell.');
			click(this.actions.run);
		}
		// heal if possible at less than x% health
		else if (this.actions.cover && this.player.health < (prefs.coverAt / 100) * this.player.maxHealth) {
			log.log('Healing under cover.');
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

class TravelStage extends Stage {
	constructor(ui, player, enemy) {
		super(ui, player, enemy);
	}
	reset() {
		this.locations = [];
		this.regions = [];
		this.subregions = [];
		this.changedLocation = false;
		this.changedRegion = false;
	}
	
	updateLocations() {
		this.locations = this.getOptions('location');
	}
	updateRegions() {
		this.regions = this.getOptions('region');
	}
	updateSubregions() {
		this.subregions = this.getOptions('subregion');
	}
	getOptions(type) {
		return toArray(this.ui.page.querySelectorAll('#'+type+'s .change'+type+'link')).map((a) => {return {
			el: a,
			current: a.querySelector('.item-content > .item-media').textContent == 'check',
			title: a.querySelector('.item-content > .item-inner > .item-title').textContent.trim().replace(/^(.+?)(\s+\(\d+\).*)?$/, '$1'),
			players: a.querySelector('.item-content > .item-inner > .item-title').textContent.trim().replace(/^(.+?)(?:\s+\((\d+)\).*)?$/, '$2')*1,
			locked: a.querySelector('.item-content > .item-inner > .item-after') != null
		}}).filter((it) => {return !it.locked;});
	}
	
	go() {
		this.updateLocations();
		this.updateRegions();
		this.updateSubregions();
		
		// try to travel to the next subregion.
		// if the last subregion on the list is the current subregion: travel to the next region
		// if the last region on the list is the current region: travel to the next location
		let curLoc = this.locations.findIndex(it=>{return it.current;})
		let curReg = this.regions.findIndex(it=>{return it.current;})
		let curSub = this.subregions.findIndex(it=>{return it.current;})
		if (!prefs.stayInRegion && !this.changedLocation && !this.changedRegion && (this.subregions.length == 1 || curSub == this.subregions.length-1)) {
			if (!prefs.stayInLocation && (this.regions.length == 1 || curReg == this.regions.length-1)) {
				let location = this.locations[++curLoc%this.locations.length];
				this.changedLocation = true;
				log.log('Traveling to ' + location.title);
				click(location.el);
			} else {
				let region = this.regions[++curReg%this.regions.length];
				this.changedRegion = true;
				log.log('Traveling to ' + this.locations[curLoc].title + ' / ' + region.title);
				click(region.el);
			}
		} else if (this.changedLocation || this.changedRegion) {
			this.changedLocation = false;
			this.chagnedRegion = false;
			log.log('Traveling to ' + this.locations[curLoc].title + ' / ' + this.regions[curReg].title + ' / ' + this.subregions[curSub].title);
			click(this.subregions[curSub].el);
		} else {
			let subregion = this.subregions[++curSub%this.subregions.length];
			log.log('Traveling to ' + this.locations[curLoc].title + ' / ' + this.regions[curReg].title + ' / ' + subregion.title);
			click(subregion.el);
		}
	}
}

class Bot {
	constructor() {
		this.ui = new UI();
		
		this.paused = false;
		
		this.player = new Player(this.ui);
		this.enemy = new Enemy(this.ui);
		
		this.stages = {
			'default': new Stage(this.ui, this.player, this.enemy)
		};
		this.stages[config.stage.patrol] = new PatrolStage(this.ui, this.player, this.enemy);
		this.stages[config.stage.battle] = new BattleStage(this.ui, this.player, this.enemy);
		this.stages[config.stage.travel] = new TravelStage(this.ui, this.player, this.enemy);
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
		if (this.paused) return;
		
		this.player.update();
		this.enemy.update();
		
		this.stage = this.ui.stage;
		this.stage.go();
		
		setTimeout(this.update.bind(this), prefs.updateInterval*1 + random(prefs.updateIntervalRange*(-1), prefs.updateIntervalRange*1));
	}
	pause() {
		this.paused = true;
	}
	unpause() {
		this.paused = false;
		this.update();
	}
}
	
	let bot = new Bot();
	
	let prefsGUI = new PrefsGUI();
	GM_registerMenuCommand('[DRB] Preferences', prefsGUI.show.bind(prefsGUI));
	let cmdPause = GM_registerMenuCommand('[DRB] Pause Bot', pause);
	let cmdUnpause;
	function pause() {
		bot.pause();
		GM_unregisterMenuCommand(cmdPause);
		cmdUnpause = GM_registerMenuCommand('[DRB] Unpause Bot', unpause);
	}
	function unpause() {
		bot.unpause();
		GM_unregisterMenuCommand(cmdUnpause);
		cmdPause = GM_registerMenuCommand('[DRB] Pause Bot', pause);
	}
})();