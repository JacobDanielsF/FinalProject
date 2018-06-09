// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// BossProjectile.js
// Boss projectile prefab

function BossProjectile(posX, posY, playerX, playerY, type, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	var scales = 1.5;
	this.scale.x = scales;
	this.scale.y = scales;
	
	this.type = type; // type of projectile to spawn
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check boss type
	if (type == "default"){
		this.speed = 200;
		this.damage = 1;		
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	if (type == "triple"){
		this.speed = 300;
		this.damage = 1;
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
	if (type == "rapid"){
		this.speed = 200;
		this.damage = 1;
		Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
		angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
	}
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
			iframes = IFRAMES_MAX; 
		}
		//plays a random sound effect each time
		var rand = game.rnd.integerInRange(1, 5);
		
		if (rand == 1){
			gruntfx1.play();
		}
		if (rand == 2){
			gruntfx2.play();
		}
		if (rand == 3){
			gruntfx3.play();
		}
		if (rand == 4){
			gruntfx4.play();
		}
		if (rand == 5){
			gruntfx5.play();
		}
	}
	
}