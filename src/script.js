// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      1.13
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
	${include-once: config.js}
	${include-once: prefs.js}
	${include-once: PrefsGUI.js}
	${include-once: helpers.js}
	${include-once: Bot.js}
	
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