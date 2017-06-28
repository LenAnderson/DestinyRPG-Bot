${include-once: UI.js}
${include-once: Player.js}
${include-once: Enemy.js}
${include-once: stage/PatrolStage.js}
${include-once: stage/BattleStage.js}

class Bot {
	constructor() {
		this.ui = new UI();
		
		this.player = new Player(this.ui);
		this.enemy = new Enemy(this.ui);
		
		this.stage = new Stage(this.ui, this.player, this.enemy);
		
		this.update();
	}
	
	updatePlayer() {
		this.player.update();
	}
	
	update() {
		this.player.update();
		this.enemy.update();
		
		switch (this.ui.stage) {
			case config.stage.patrol:
				this.stage = new PatrolStage(this.ui, this.player, this.enemy);
				break;
			case config.stage.battle:
				this.stage = new BattleStage(this.ui, this.player, this.enemy);
				break;
			default:
				this.stage = new Stage(this.ui, this.player, this.enemy);
		}
		this.stage.go();
		
		setTimeout(this.update.bind(this), prefs.updateInterval);
	}
}