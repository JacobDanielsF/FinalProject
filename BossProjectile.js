//new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default");
function BossProjectile(posX, posY, playerX, playerY, type, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	var scales = 1.5;
	this.scale.x = scales;
	this.scale.y = scales;
	
	this.type = type;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check boss type
	if (type == "default"){
		this.speed = 200;
		this.damage = 1;
		//this.rotation = game.physics.arcade.angleToPointer(Boss) + (Math.PI/2);
		
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	// check boss type
	if (type == "triple"){
		this.speed = 300;
		this.damage = 1;
		//this.rotation = game.physics.arcade.angleToPointer(Boss) + (Math.PI/2);
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	if (type == "rapid"){
		this.speed = 200;
		this.damage = 1;
		//this.rotation = game.physics.arcade.angleToPointer(Boss) + (Math.PI/2);
		Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	
	
	
	//game.physics.arcade.moveToPointer(this, this.speed);
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
	var bulletHitPlayer = game.physics.arcade.collide(this, player);
	// delete the bullet if it hits an enemy and damage the enemy
	if (bulletHitPlayer == true){
		this.kill();
		this.destroy();
						
		// player is damaged
		if (bulletHitPlayer == true && iframes <= 0){	
			if (PLAYER_PROPERTIES.WEAPON_1 == "Bone Dagger" || PLAYER_PROPERTIES.WEAPON_2 == "Bone Dagger"){
				PLAYER_PROPERTIES.HEALTH -= 2*(this.damage);
			} else {
				PLAYER_PROPERTIES.HEALTH -= this.damage;
			}
		}
	}
	
}