${include-once: ../Stage.js}
class OrbitStage extends Stage {
	reset() {}
	
	go() {
		if (this.player.died) {
			click(this.ui.page.querySelector('.gobacklink'));
		}
	}
}