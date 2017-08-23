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
	attack: [
		'normal',
		'currency',
		'ultra'
	],
	onlyBounties: true,
	bountiesAndChests: true,
	bountiesAndUltras: true,
	
	// battle
	coverAt: 50,
	runAt: 20,
	heavyAll: false,
	ultraAll: false
};
let sprefs = JSON.parse(GM_getValue('drb_prefs')||'false');
if (sprefs) {
	Object.keys(prefs).forEach((key) => {
		if (sprefs[key] !== undefined) {
			prefs[key] = sprefs[key];
		}
	});
}