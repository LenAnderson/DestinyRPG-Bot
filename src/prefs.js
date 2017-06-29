let prefs = JSON.parse(GM_getValue('drb_prefs')||'false') || {
	updateInterval: 1000,
	updateIntervalRange: 400,
	
	coverAt: 50,
	runAt: 20,
	
	luckyDay: 'glimmer'
};