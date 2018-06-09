// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// EnemyProjectile.js
// Enemy projectile prefab

function EnemyProjectile(posX, posY, playerX, playerY, type){
	this.type = type;
	
	if (type == "scorpion"){
		this.speed = 200;
		this.damage = 1;
		Phaser.Sprite.call(this, game, posX, posY, 'enemyproj', 'sprite1');
		
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
		
		game.physics.enable(this);
		this.body.collideWorldBounds = false; // projectile persists offscreen.
		
		var angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
		this.animations.play('anim');
	}
	
	if (type == "snake"){
		this.speed = 250;
		this.damage = 1;
		Phaser.Sprite.call(this, game, posX, posY, 'enemyproj', 'sprite1');
		
		this.anchor.set(0.5);
		var scale = 1;
		this.scale.x = scale;
		this.scale.y = scale;
		
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		var angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
		this.animations.play('anim');
	}
	
	game.add.existing(this);
}

EnemyProjectile.prototype = Object.create(Phaser.Sprite.prototype);
EnemyProjectile.prototype.constructor = EnemyProjectile;

EnemyProjectile.prototype.update = function() {
	
	var bulletHitWall = game.physics.arcade.collide(this, walls);
	var bulletHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
	// delete the bullet if it hits a wall
	if (bulletHitWall == true || bulletHitCurrentWall == true){
		this.kill();
		this.destroy();
	}
	
	var slash = playerslash;
	// destroys a projectile if it comes into contact with a slash.	
	if (slash != null){
		for (var k = 0; k < slash.hitboxes.length; k++){
			var box = slash.hitboxes[k];
			
			var bulletHitSlash = game.physics.arcade.collide(this, box);
			if (bulletHitSlash == true){
				this.kill();
				this.destroy();
			}
		}
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