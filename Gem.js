// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Gem.js
// Gem prefab

// gem class
function Gem(game, posX, posY, type){
	Phaser.Sprite.call(this, game, posX, posY, type);
	this.anchor.set(0.5);
	var scale = 2;
	this.scale.x = scale;
	this.scale.y = scale;
	
	game.physics.enable(this);
	
	this.animations.add('sparkle', Phaser.Animation.generateFrameNames('sprite', 1, 4), 6, true);
	this.animations.play('sparkle');
	
	game.add.existing(this);
	
	gemgroup.add(this); // adds this gem to the gemgroup.
}

Gem.prototype = Object.create(Phaser.Sprite.prototype);
Gem.prototype.constructor = Gem;


Gem.prototype.update = function() {
	
	var gemHitPlayer = game.physics.arcade.collide(this, player);
	
	// gives the player a point when collected, and then the gem disappears.
	if (gemHitPlayer == true){
		gemfx.play(); // Pick up sound.
		
		PLAYER_PROPERTIES.POINTS += 1; 
		
		this.kill();
		this.destroy();
	}
	
}