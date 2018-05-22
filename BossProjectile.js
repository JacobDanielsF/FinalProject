//new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default");
function BossProjectile(posX, posY, playerX, playerY, type, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	
	this.type = type;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check boss type
	if (type == "default"){
		this.speed = 600;
		this.damage = 1;
		//this.rotation = game.physics.arcade.angleToPointer(Boss) + (Math.PI/2);
		
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	
	
	
	game.physics.arcade.moveToPointer(this, this.speed);
	game.add.existing(this);
}

BossProjectile.prototype = Object.create(Phaser.Sprite.prototype);
BossProjectile.prototype.constructor = BossProjectile;

BossProjectile.prototype.update = function() {
	
	var bulletHitWall = game.physics.arcade.collide(this, walls);
	var bulletHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
	// delete the bullet if it hits a wall
	if (bulletHitWall == true || bulletHitCurrentWall == true){
		this.kill();
		this.destroy();
	}
	
}