// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      2.1
// @author       LenAnderson
// @match        https://game.destinyrpg.com/*
// @match        https://test.destinyrpg.com/*
// @match        https://www.google.com/recaptcha/api2/anchor*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function() {
	${include-once: config.js}
	${include-once: prefs.js}
	${include-once: PrefsGUI.js}
	${include-once: helpers.js}
	${include-once: Bot.js}
	
	
	log.log('Hi', location.href);
	
	
	if (location.href.search('https://www.google.com/recaptcha/api2/anchor') > -1) {
		let clicked = false;
		let iv = setInterval(()=>{
			let params = getParams();
			let box = $('.recaptcha-checkbox');
			if (params.k + '&' + params.v == GM_getValue('drb_captcha')) {
				if (!clicked && box.getAttribute('aria-checked') == 'false') {
					log.log('need to solve this captcha...');
					click(box);
					clicked = true;
				} else if (box.getAttribute('aria-checked') == 'true') {
					log.log('yay! solved the captcha');
					GM_setValue('drb_captcha_solved', params.k + '&' + params.v);
				}
			}
		}, 2000);
	} else {
		Notification.requestPermission();
		
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
	}
})();