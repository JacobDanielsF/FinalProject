// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Enemy.js
// Enemy prefab

// enemy class
function Enemy(game, posX, posY, type, roomtoggle){
	// gets the proper enemy sprite
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
		this.nextfire = 4; // when the scorpion can fire the first projectile.
		this.firecooldown = 1; // how long until it can fire the next one.
		this.walkspeed = 100;
		this.seekrange = 380; // If the player is in range, then the scorpion will begin to attack and move towards them.
		this.points = 10;
		this.gemcount = 3; // how many gems the scorpion gives.
		
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
		this.seekrange = 380;
		this.points = 20;
		this.gemcount = 5;
		
		this.animations.add('walkright', Phaser.Animation.generateFrameNames('snakeright', 1, 2), 5, true);
		this.animations.add('walkleft', Phaser.Animation.generateFrameNames('snakeleft', 1, 2), 5, true);
		this.animations.add('attackright', Phaser.Animation.generateFrameNames('snakeattackright', 1, 2), 5, true);
		this.animations.add('attackleft', Phaser.Animation.generateFrameNames('snakeattackleft', 1, 2), 5, true);
	}
	
	this.direction = "right";
	this.poison = false; // status effect from Scorpion Dagger
	
	// first thing that came to mind for overriding the walk animations based on attacks. 
	this.attacking = false; // is the attack animation playing?
	this.attackTimer = 0; // will hold the time for when the attack animation can be overriden by the walking animation.
	
	this.animations.play('idle');
	game.add.existing(this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	var time = (game.time.now)/1000;
	
	if (InRange(player.body.x, player.body.y, this.body.x, this.body.y, this.seekrange) == true) { // if the player is in range
						
		// damage player if they hit an enemy and give them invincibility frames (iframes)
		// do not damage the player if they have invincibility frames
		var enemyHitWall = game.physics.arcade.collide(this, walls);
		var enemyHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
						
		var playerHitEnemy = game.physics.arcade.collide(player, this);
		if (playerHitEnemy == true && iframes <= 0){
			PLAYER_PROPERTIES.HEALTH--;
			iframes = 20;
		}
						
		var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1); // left is -1, right is 1.
		var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1); // down is -1, up is 1.
						
		// how does they enemy move? do they fire a projectile? if so, what kind?
		// enemy type determines actions here.
		if (this.type == 'scorpion'){
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			
			if (time > this.nextfire){
				var bullet = new EnemyProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "scorpion");
				enemybulletgroup.add(bullet);
				this.nextfire = time + this.firecooldown; // enemy bullet rate
				
				// play attack animation
				if (dirX>0){
					this.animations.play('attackright');
				}
				if (dirX<0){
					this.animations.play('attackleft');	
				}
				
				this.attackTimer = time+0.25;
				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
				
				stingerfx.play();
			}
		}
		
		if (this.type == 'snake'){
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			
			// plays the animation before the projectile, since the snake charges it and then fires.
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
					enemybulletgroup.add(bullet);
					this.nextfire = time + this.firecooldown; // enemy bullet rate
					
					// offsets both snake projectiles.
					var angleoffset = (i - 0.5)*0.3;
					var angle = game.math.angleBetween(this.body.x + 16, this.body.y + 16, player.body.x, player.body.y) + angleoffset;
					
					var targetX = this.body.x+(Math.cos(angle)*70)+16;
					var targetY = this.body.y+(Math.sin(angle)*70)+16;
					game.physics.arcade.moveToXY(bullet, targetX, targetY, bullet.speed);
				}
				enemyspitfx.play();
			}
		}
		// 
		if (this.type == 'scorpion'){
			if (dirX > 0){ // is it facing to the right?
				if(time>this.attackTimer){ // to prevent walk animation from overriding attack animation
					this.animations.play('walkright');
					this.direction = "right";
				}
			} else if (dirX < 0){ // is it facing to the left?
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
			if (dirX > 0){ // is it facing to the right?
				if(time>this.attackTimer){	
					this.animations.play('walkright');
					this.direction = "right";
				}
			} else if (dirX < 0){ // is it facing to the left?
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
						
	} else { // if the player is not in range
		// enemy idle
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	
	// poison effect
	if (this.poison == true){
		this.health -= 0.1; // damage over time
		
		if (this.health <= 0){
			if (roomenemies > 0){
				roomenemies--;
			}
			
			// removes the enemy
			this.kill();
			this.destroy();
		}
	}
}

