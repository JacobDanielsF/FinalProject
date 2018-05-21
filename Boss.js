// boss class
var bossSpawned = false;
function Boss(game, posX, posY, type, roomtoggle, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	this.type = type;
	this.room = roomtoggle;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check boss type
	if (type == "default"||type == "triple"){
		this.health = 3;
		this.nextfire = 4;
		this.firecooldown = 1;
		this.walkspeed = 100;
		this.seekrange = 400;
	}
	if (type == "rapid"){
		this.health = 3;
		this.nextfire = 1;
		this.firecooldown = 0.1;
		this.walkspeed = 50;
		this.seekrange = 400;
	}
	if (type == "turret"){
		this.health = 3;
		this.nextfire = 1;
		this.firecooldown = 0.3;
		this.nextWave = 2;
		this.waveFire = 1;
		this.walkspeed = 0;
		this.seekrange = 400;
	}
	game.add.existing(this);
}

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function() {
	var time = (game.time.now)/1000;
	
	if (InRange(player.body.x, player.body.y, this.body.x, this.body.y, this.seekrange) == true) {
						
		// damage player if they hit an boss and give them invincibility frames (iframes)
		// do not damage the player if they have invincibility frames
		var bossHitWall = game.physics.arcade.collide(this, walls);
		var bossHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
						
		var playerHitBoss = game.physics.arcade.collide(player, this);
		if (playerHitBoss == true && iframes <= 0){
			PLAYER_PROPERTIES.HEALTH--;
			iframes = 20;
		}					
		// how does they boss move? do they fire a projectile? if so, what kind?
		// boss type determines actions here.
		if (this.type == "default"){
			var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1);
			var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1);
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
							
			if (time > this.nextfire){
				var bullet = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default",'enemy_atlas', 'projectile1');
				enemybullettable.push(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon

				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
			}
		}	
		if (this.type == "rapid"){
			var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1);
			var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1);
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			if (time > this.nextfire){
				var bullet = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "rapid",'enemy_atlas', 'projectile1');
				enemybullettable.push(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
			}
		}
		// Functions to an extent. Lots of stuff to work out.
		if (this.type == "triple"){
			var dirX = [];
			var dirY = [];
			for (var i=0;i<3;i++){
				var offset = -10+ (i*10);
				dirX[i] = game.math.clamp((player.body.x+offset - this.body.x)/128, -1, 1);
				dirY[i] = game.math.clamp((player.body.y+offset - this.body.y)/128, -1, 1);
			}
			this.body.velocity.x = dirX[1] * this.walkspeed;
			this.body.velocity.y = dirY[1] * this.walkspeed;
							
			if (time > this.nextfire){
				var bullet = []
				for (var i = 0;i<3;i++){
					bullet[i] = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "triple",'enemy_atlas', 'projectile1',i);
					enemybullettable.push(bullet[i]);
				}
				// rotation for bullets still needs to be adjusted here
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				for (var i = 0;i<3;i++){
					bullet[i].body.velocity.x = dirX[i]*bullet[i].speed;
					bullet[i].body.velocity.y = dirY[i]*bullet[i].speed;
					//console.log("Projectile #"+i+" rotation= "+bullet[i].body.rotation+" dir x "+dirX[i]+" dir y"+dirY[i]);
				}
			}
		}
		
						
		if (this.type == "turret"){
			var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1);
			var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1);
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			if (time > this.nextfire){
				var bullet = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default",'enemy_atlas', 'projectile1');
				enemybullettable.push(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon

				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
			}
			if (time > this.nextWave){
				var wave = []
				for (var i = 0;i<4;i++){
					wave[i] = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default",'enemy_atlas', 'projectile1',i);
					enemybullettable.push(wave[i]);
				}
				// rotation for bullets still needs to be adjusted here
				this.nextWave = time + this.waveFire; // this is the bullet rate of the weapon
				
				wave[0].body.velocity.x = -1*wave[0].speed;
				wave[0].body.velocity.y = -1*wave[0].speed;
				
				wave[1].body.velocity.x = -1*wave[1].speed;
				wave[1].body.velocity.y = 1*wave[1].speed;
				
				wave[2].body.velocity.x = 1*wave[2].speed;
				wave[2].body.velocity.y = -1*wave[2].speed;
				
				wave[3].body.velocity.x = 1*wave[3].speed;
				wave[3].body.velocity.y = 1*wave[3].speed;
			}
		}
		
						
	} else {
		// boss idle
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	
	
	
	for (var i = 0; i < playerbullettable.length; i++) {
		var bullet = playerbullettable[i];
				
		if (bullet != null){
			var bulletHitBoss = game.physics.arcade.collide(bullet, this);
			// delete the bullet if it hits an boss and damage the boss
			if (bulletHitBoss == true){
				bullet.kill();
				bullet.destroy();
				playerbullettable.pop(i);
							
				// boss is damaged, delete boss if it dies
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
						

				// check for bullet-boss collision
				var boxHitBoss = game.physics.arcade.collide(box, this);
				// delete the bullet if it hits an boss and damage the boss
				if (boxHitBoss == true){
									
					// boss is damaged, delete boss if it dies
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