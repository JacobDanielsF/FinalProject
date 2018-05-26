





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
		this.points = 10;
		
		this.animations.add('idle', Phaser.Animation.generateFrameNames('enemyidle', 1, 2), 5, true);
		this.animations.add('walkup', Phaser.Animation.generateFrameNames('enemyup', 1, 2), 5, true);
		this.animations.add('walkright', Phaser.Animation.generateFrameNames('enemyright', 1, 2), 5, true);
		this.animations.add('walkleft', Phaser.Animation.generateFrameNames('enemyleft', 1, 2), 5, true);
		this.animations.add('walkdown', Phaser.Animation.generateFrameNames('enemydown', 1, 2), 5, true);
		this.animations.add('walkupleft', Phaser.Animation.generateFrameNames('enemyupleft', 1, 2), 5, true);
		this.animations.add('walkupright', Phaser.Animation.generateFrameNames('enemyupright', 1, 2), 5, true);
		this.animations.add('walkdownleft', Phaser.Animation.generateFrameNames('enemydownleft', 1, 2), 5, true);
		this.animations.add('walkdownright', Phaser.Animation.generateFrameNames('enemydownright', 1, 2), 5, true);
	}
	
	
	this.animations.play('idle');
	game.add.existing(this);
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
				//enemybullettable.push(bullet);
				enemybulletgroup.add(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				
				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
			}
		}

		if (dirX > game.math.difference(0, dirY)){
			this.animations.play('walkright');
		} else if (dirX < -game.math.difference(0, dirY)){
			this.animations.play('walkleft');
		} else if (dirY > game.math.difference(0, dirX)){
			this.animations.play('walkdown');
		} else if (dirY < -game.math.difference(0, dirX)){
			this.animations.play('walkup');
		} else {
			this.animations.play('idle');
		}
						
		if (this.type == "turret"){
			// more types
		}
						
	} else {
		// enemy idle
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	
}

