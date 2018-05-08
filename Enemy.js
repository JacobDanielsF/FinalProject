function InRange(x1, y1, x2, y2, range){
	var diff = game.math.distance(x1, y1, x2, y2);
	if (diff < range){
		return true;
	}
	return false;
}




// enemy class
function Enemy(game, posX, posY, type, roomtoggle, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	
	this.type = type;
	this.room = roomtoggle;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check enemy type
	if (type == "default"){
		this.health = 3;
		this.nextfire = 4;
		this.firecooldown = 1;
		this.walkspeed = 100;
		this.seekrange = 400;
	}
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	var time = (game.time.now)/1000;
	
	if (InRange(player.body.x, player.body.y, this.body.x, this.body.y, this.seekrange) == true) {
						
		// damage player if they hit an enemy and give them invincibility frames (iframes)
		// do not damage the player if they have invincibility frames
		var enemyHitWall = game.physics.arcade.collide(this, walls);
		var enemyHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
						
		var playerHitEnemy = game.physics.arcade.collide(player, this);
		if (playerHitEnemy == true && iframes <= 0){
			PLAYER_PROPERTIES.HEALTH--;
			iframes = 20;
		}
						
		var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1);
		var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1);
						
		// how does they enemy move? do they fire a projectile? if so, what kind?
		// enemy type determines actions here.
		if (this.type == "default"){
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
							
			if (time > this.nextfire){
				var bullet = new EnemyProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default");
				enemybullettable.push(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon

				bullet.model.body.velocity.x = dirX*bullet.speed;
				bullet.model.body.velocity.y = dirY*bullet.speed;
			}
		}
						
		if (this.type == "turret"){
			// more types
		}
						
	} else {
		// enemy idle
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	
	
	
	for (var i = 0; i < playerbullettable.length; i++) {
		var bullet = playerbullettable[i];
				
		if (bullet != null){
			var bulletHitEnemy = game.physics.arcade.collide(bullet, this);
			// delete the bullet if it hits an enemy and damage the enemy
			if (bulletHitEnemy == true){
				bullet.kill();
				bullet.destroy();
				playerbullettable.pop(i);
							
				// enemy is damaged, delete enemy if it dies
				this.health -= bullet.damage;
				if (this.health < 0) {
					if (roomenemies.length > 0 && this.room == true){
						roomenemies.remove(this);
					}
					
					this.kill();
					this.destroy();
				}
			}
		}
	}
	

	for (var i = 0; i < playerslashtable.length; i++) {
		var slash = playerslashtable[i];
				
		if (slash != null){
			for (var k = 0; k < slash.hitboxes.length; k++){
				var box = slash.hitboxes[k];
						

				// check for bullet-enemy collision
				var boxHitEnemy = game.physics.arcade.collide(box, this);
				// delete the bullet if it hits an enemy and damage the enemy
				if (boxHitEnemy == true){
									
					// enemy is damaged, delete enemy if it dies
					this.health -= slash.damage;
					if (this.health < 0) {
						if (roomenemies.length > 0 && this.room == true){
							roomenemies.remove(this);
						}
						
						this.kill();
						this.destroy();
					}
				}
			}
		}
	}
	
}

