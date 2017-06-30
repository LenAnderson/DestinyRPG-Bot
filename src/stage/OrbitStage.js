${include-once: ../Stage.js}
class OrbitStage extends Stage {
	reset() {}
	
	go() {
		if (this.player.died) {
			this.player.died = false;
			click(this.ui.page.querySelector('.gobacklink'));
		}
	}
}