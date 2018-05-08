
function PlayerProjectile(game, posX, posY, type, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	
	this.type = type;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check enemy type
	if (type == "default"){
		this.speed = 600;
		this.damage = 1;
		//this.model = playerprojectiles.create(posX, posY, 'character_atlas', 'projectile1');
		//this.model.anchor.x = 0.5;
		//this.model.anchor.y = 0.5;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
	}
	
	game.physics.arcade.moveToPointer(this, this.speed);
}

PlayerProjectile.prototype = Object.create(Phaser.Sprite.prototype);
PlayerProjectile.prototype.constructor = PlayerProjectile;

PlayerProjectile.prototype.update = function() {
	
	var bulletHitWall = game.physics.arcade.collide(this, walls);
	var bulletHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
	// delete the bullet if it hits a wall
	if (bulletHitWall == true || bulletHitCurrentWall == true){
		this.kill();
		this.destroy();
	}
	
}