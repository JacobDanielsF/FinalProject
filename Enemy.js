
// enemy class
function Enemy(game, posX, posY, type, roomtoggle){
	if (type == 'scorpion'){
		Phaser.Sprite.call(this, game, posX, posY, 'scorpion', 'scorpionidleright');
	}
	if (type == 'snake'){
		Phaser.Sprite.call(this, game, posX, posY, 'snake', 'snakeright1');
	}
	this.scale.set(0.5);
	this.anchor.set(0.5);
	
	this.type = type;
	this.room = roomtoggle;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check enemy type
	if (type == "scorpion"){
		this.health = 3;
		this.nextfire = 4;
		this.firecooldown = 1;
		this.walkspeed = 100;
		this.seekrange = 400;
		this.points = 10;
		this.gemcount = 3;
		
		this.animations.add('walkright', Phaser.Animation.generateFrameNames('scorpionwalkright', 2, 3), 5, true);
		this.animations.add('walkleft', Phaser.Animation.generateFrameNames('scorpionwalkleft', 2, 3), 5, true);
		this.animations.add('attackright', ['scorpionattackright'], 5, true);
		this.animations.add('attackleft', ['scorpionattackleft'], 5, true);
	}
	if (type == "snake"){
		this.health = 5;
		this.nextfire = 4;
		this.firecooldown = 1.5;
		this.walkspeed = 120;
		this.seekrange = 400;
		this.points = 20;
		this.gemcount = 5;
		
		this.animations.add('walkright', Phaser.Animation.generateFrameNames('snakeright', 1, 2), 5, true);
		this.animations.add('walkleft', Phaser.Animation.generateFrameNames('snakeleft', 1, 2), 5, true);
		this.animations.add('attackright', Phaser.Animation.generateFrameNames('snakeattackright', 1, 2), 5, true);
		this.animations.add('attackleft', Phaser.Animation.generateFrameNames('snakeattackleft', 1, 2), 5, true);
	}
	
	this.direction = "right";
	this.poison = false;
	// first thing that came to mind for overriding the walk animations based on attacks. 
	this.attacking = false;
	this.attackTimer = 0;
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
		if (this.type == 'scorpion'){
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			
			if (time > this.nextfire){
				var bullet = new EnemyProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "scorpion");
				//enemybullettable.push(bullet);
				enemybulletgroup.add(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				if (dirX>0){
					this.animations.play('attackright');	
				}
				if (dirX<0){
					this.animations.play('attackleft');	
				}
				
				this.attackTimer = time+0.25;
				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
			}
		}
		
		if (this.type == 'snake'){
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			if(time>(this.nextfire-0.29)){
				if (dirX>0){
					this.animations.play('attackright');	
				}
				if (dirX<0){
					this.animations.play('attackleft');	
				}
				this.attackTimer = time+0.1;
			}
			
			if (time > this.nextfire){
				for (var i = 0; i < 2; i++){
					var bullet = new EnemyProjectile(this.body.x + 16, this.body.y + 16, player.body.x, player.body.y, "snake");
					//enemybullettable.push(bullet);
					enemybulletgroup.add(bullet);
					this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
					
					var angleoffset = (i - 0.5)*0.3;
					var angle = game.math.angleBetween(this.body.x + 16, this.body.y + 16, player.body.x, player.body.y) + angleoffset;
					
					var targetX = this.body.x+(Math.cos(angle)*70)+16;
					var targetY = this.body.y+(Math.sin(angle)*70)+16;
					game.physics.arcade.moveToXY(bullet, targetX, targetY, bullet.speed);
					
					enemyspitfx.play();
				}
			}
		}
		
		if (this.type == 'scorpion'){
			if (dirX > 0){
				if(time>this.attackTimer){	
					this.animations.play('walkright');
					this.direction = "right";
				}
			} else if (dirX < 0){
				if(time>this.attackTimer){	
					this.animations.play('walkleft');
					this.direction = "left";
				}
			} else {
				if (this.direction == "left"){
					player.frameName = 'scorpionidleleft';
				} else {
					player.frameName = 'scorpionidleright';
				}
			}
		}
		
		if (this.type == 'snake'){
			if (dirX > 0){
				if(time>this.attackTimer){	
					this.animations.play('walkright');
					this.direction = "right";
				}
			} else if (dirX < 0){
				if(time>this.attackTimer){
					this.animations.play('walkleft');
					this.direction = "left";
				}
			} else {
				if (this.direction == "left"){
					player.frameName = 'snakeright1';
				} else {
					player.frameName = 'snakeleft1';
				}
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
	
	if (this.poison == true){
		this.health -= 0.1;
		
		if (this.health <= 0){
			if (roomenemies > 0){
				roomenemies--;
			}
			
			this.kill();
			this.destroy();
		}
	}
}

