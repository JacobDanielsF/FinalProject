
// enemy projectile class
function EnemyProjectile(posX, posY, playerX, playerY, type){
	this.type = type;
	
	if (type == "default"){
		this.speed = 200;
		this.damage = 1;
		Phaser.Sprite.call(this, game, posX, posY, 'enemy_atlas', 'projectile1');
		
		this.anchor.set(0.5);
		var scale = 1;
		this.scale.x = scale;
		this.scale.y = scale;
		
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		//this.model = enemyprojectiles.create(posX, posY, 'enemy_atlas', 'projectile1');
		
		var angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.rotation = angle;
		
		//this.model.anchor.set(0.5);
		//var scale = 1;
		//this.model.scale.x = scale;
		//this.model.scale.y = scale;
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
	
	var bulletHitPlayer = game.physics.arcade.collide(this, player);
	// delete the bullet if it hits an enemy and damage the enemy
	if (bulletHitPlayer == true){
		this.kill();
		this.destroy();
						
		// player is damaged
		if (bulletHitPlayer == true && iframes <= 0){	
			PLAYER_PROPERTIES.HEALTH -= this.damage;
			iframes = IFRAMES_MAX;
		}
	}
}