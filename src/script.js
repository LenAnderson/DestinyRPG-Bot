// ==UserScript==
// @name         DestinyRPG Bot
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/DestinyRPG-Bot/raw/master/DestinyBot.user.js
// @version      1.0
// @author       LenAnderson
// @match        https://game.destinyrpg.com/*
// @grant        GM_registerMenuCommand
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
})();