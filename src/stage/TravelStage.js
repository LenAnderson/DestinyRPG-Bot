${include-once: ../Stage.js}
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
		if (this.locations.length == 0) {
			this.locations = [{
				current: true,
				title: 'Earth'
			}];
		}
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
			locked: (a.querySelector('.item-content > .item-inner > .item-after > .button > .f7-icons') || {}).textContent == 'lock_fill'
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
				log.log('✈ Traveling to ' + location.title);
				click(location.el);
			} else {
				let region = this.regions[++curReg%this.regions.length];
				this.changedRegion = true;
				log.log('✈ Traveling to ' + this.locations[curLoc].title + ' / ' + region.title);
				click(region.el);
			}
		} else if (this.changedLocation || this.changedRegion) {
			this.changedLocation = false;
			this.chagnedRegion = false;
			if (this.subregions[curSub].title == 'The Tower') return;
			log.log('✈ Traveling to ' + this.locations[curLoc].title + ' / ' + this.regions[curReg].title + ' / ' + this.subregions[curSub].title);
			click(this.subregions[curSub].el);
		} else {
			let subregion = this.subregions[++curSub%this.subregions.length];
			if (subregion.title == 'The Tower') return;
			log.log('✈ Traveling to ' + this.locations[curLoc].title + ' / ' + this.regions[curReg].title + ' / ' + subregion.title);
			click(subregion.el);
		}
	}
}