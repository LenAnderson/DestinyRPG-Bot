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