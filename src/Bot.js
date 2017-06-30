${include-once: UI.js}
${include-once: Player.js}
${include-once: Enemy.js}
${include-once: stage/PatrolStage.js}
${include-once: stage/BattleStage.js}
${include-once: stage/TravelStage.js}

class Bot {
	constructor() {
		this.ui = new UI();
		
		this.paused = false;
		
		this.player = new Player(this.ui);
		this.enemy = new Enemy(this.ui);
		
		this.stages = {
			'default': new Stage(this.ui, this.player, this.enemy)
		};
		this.stages[config.stage.patrol] = new PatrolStage(this.ui, this.player, this.enemy);
		this.stages[config.stage.battle] = new BattleStage(this.ui, this.player, this.enemy);
		this.stages[config.stage.travel] = new TravelStage(this.ui, this.player, this.enemy);
		this.stageId = 'default';
		
		this.update();
	}
	
	updatePlayer() {
		this.player.update();
	}
	
	get stage() {
		return this.stages[this.stageId];
	}
	set stage(stageId) {
		if (this.stages[stageId]) {
			if (this.stageId != stageId) {
				this.stageId = stageId;
				this.stage.reset();
			}
		} else {
			this.stageId = 'default';
		}
	}
	
	update() {
		if (this.paused) return;
		
		this.player.update();
		this.enemy.update();
		
		this.stage = this.ui.stage;
		this.stage.go();
		
		setTimeout(this.update.bind(this), prefs.updateInterval*1 + random(prefs.updateIntervalRange*(-1), prefs.updateIntervalRange*1));
	}
	pause() {
		this.paused = true;
	}
	unpause() {
		this.paused = false;
		this.update();
	}
}