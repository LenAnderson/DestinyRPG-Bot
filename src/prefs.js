let prefs = {
	updateInterval: 1000,
	updateIntervalRange: 400,
	
	// travel
	stayInLocation: false,
	stayInRegion: false,
	
	// patrol
	maxScan: 5,
	attackUltraPe: false,
	avoidHealth: 10,
	luckyDay: 'glimmer',
	onlyBounties: true,
	bountiesAndChests: true,
	
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