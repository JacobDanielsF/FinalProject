// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Boss.js
// Boss prefab

var bossSpawned = false;
function Boss(game, posX, posY, type, roomtoggle, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	this.anchor.set(0.5);
	this.type = type; // type of boss to spawn
	this.room = roomtoggle;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// checks boss type
	if (type == "default"||type == "triple"){
		this.nextfire = 4; // in seconds
		this.firecooldown = 1;
		this.walkspeed = 100;
		this.seekrange = 400; // If the player is in range, then the boss will begin to attack and move towards them.
	}
	if (type == "rapid"){
		this.nextfire = ((game.time.now)/1000)+0.1;
		this.firecooldown = 0.2;
		this.walkspeed = 0.5;
		this.seekrange = 400;
	}
	if (type == "turret"){
		this.nextfire = 1;
		this.firecooldown = 0.3;
		this.nextWave = 2;
		this.waveFire = 1;
		this.walkspeed = 0.5; // 100% not creepy.
		this.seekrange = 400;
	}
	game.add.existing(this);
	
	this.poison = false; // status effect from Scorpion Dagger
	this.body.immovable = true;
	this.health = 30;
	this.gemcount = 20; // gems dropped from the boss
	healthBoss = game.add.text(game.camera.width/2, 32, 'Boss health: ' + (Math.floor(this.health)), { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
	healthBoss.anchor.x = 0.5;
	healthBoss.anchor.y = 0.5;
	healthBoss.bringToTop();
	healthBoss.fixedToCamera = true;
	
	// adding this because the shots only go from the anchor the first time, then they come from the top left.
	this.fireOnce = false;
	
	this.animations.add('idle', Phaser.Animation.generateFrameNames('boss', 1, 12), 9, true);
	this.animations.play('idle');
}
var healthBoss
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function() {
	var time = (game.time.now)/1000;
	healthBoss.setText('Boss health: ' + (Math.floor(this.health)));
	
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
							
			if (time > this.nextfire){ // The way firerate is handled
				var bullet = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "default", 'enemyproj', 'sprite1');
				enemybulletgroup.add(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon

				bullet.body.velocity.x = dirX*bullet.speed;
				bullet.body.velocity.y = dirY*bullet.speed;
				
				this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
				this.animations.play('anim');
			}
		}	
		if (this.type == "rapid"){
			var dirX = game.math.clamp((player.body.x - this.body.x)/128, -1, 1);
			var dirY = game.math.clamp((player.body.y - this.body.y)/128, -1, 1);
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			if (time > this.nextfire){
				var numProjectiles = 6
				// var angleRandom = (Math.floor(Math.random()*3))/4 // occasionally shifts angle
				for (var i=0;i<numProjectiles;i++){
					var bullet = new BossProjectile(this.body.x + 64, this.body.y + 75, player.body.x, player.body.y, "rapid",'enemyproj', 'sprite1');
					bullet.scale.setTo(1.5,1.5);
					enemybulletgroup.add(bullet);
					this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
					var fixY = Math.abs(dirY*bullet.speed);	
					var fixX = Math.abs(dirX*bullet.speed);
					var fix 
					if(fixX>fixY){
						fix = fixX;
					}else{
						fix = fixY;
					}
					var angleRandom = (Math.floor(Math.random()*3))/4 // shoots everywhere
					var angle = game.physics.arcade.angleToXY(bullet, player.x,player.y) + ((-2*(Math.PI/numProjectiles)*(numProjectiles/2)) +(2*(Math.PI/numProjectiles)*i))+angleRandom;
					var targetX = bullet.body.x+(Math.cos(angle)*70);
					var targetY = bullet.body.y+(Math.sin(angle)*70);
					game.physics.arcade.moveToXY(bullet, targetX, targetY, fix);
				}
				// this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
				// this.animations.play('anim');
			}
		}
		// Functions to an extent. Lots of stuff to work out. 
		if (this.type == "triple"){
			var dirX = [];
			var dirY = [];
			// change to 5
			for (var i=0;i<3;i++){
				var offset = -40+ (i*40);
				dirX[i] = game.math.clamp((player.body.x+offset - this.body.x)/128, -1, 1);
				dirY[i] = game.math.clamp((player.body.y+offset - this.body.y)/128, -1, 1);
			}
			this.body.velocity.x = dirX[1] * this.walkspeed;
			this.body.velocity.y = dirY[1] * this.walkspeed;
							
			if (time > this.nextfire){
				var bullet = []
				for (var i = 0;i<3;i++){
					bullet[i] = new BossProjectile(this.body.x + 8, this.body.y + 8, player.body.x, player.body.y, "triple", 'enemyproj', 'sprite1',i);
					enemybulletgroup.add(bullet[i]);
					
					this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
					this.animations.play('anim');
				}
				// rotation for bullets still needs to be adjusted here
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				for (var i = 0;i<3;i++){
					bullet[i].body.velocity.x = dirX[i]*bullet[i].speed;
					bullet[i].body.velocity.y = dirY[i]*bullet[i].speed;
				}
			}
		}
		
		
		if (this.type == "turret"){
			var dirX = game.math.clamp((player.body.x - (this.body.x+64))/128, -1, 1);
			var dirY = game.math.clamp((player.body.y - (this.body.y+75))/128, -1, 1);
			this.body.velocity.x = dirX * this.walkspeed;
			this.body.velocity.y = dirY * this.walkspeed;
			if (time > this.nextfire){
				if(this.fireOnce==false){ // this was a duct tape fix, as the first shot was always offset from the boss.
					var bullet = new BossProjectile(this.body.x, this.body.y, player.body.x, player.body.y, "default",'enemyproj', 'sprite1');
					
				}else{
					var bullet = new BossProjectile(this.body.x + 64, this.body.y + 75, player.body.x, player.body.y, "default",'enemyproj', 'sprite1');	
				}
				enemybulletgroup.add(bullet);
				this.nextfire = time + this.firecooldown; // this is the bullet rate of the weapon
				var fixY = Math.abs(dirY*bullet.speed);	
				var fixX = Math.abs(dirX*bullet.speed);
				var fix 
				if(fixX>fixY){
					fix = fixX;
				}else{
					fix = fixY;
				}
				game.physics.arcade.moveToObject(bullet,player, fix); // bullet moves towards player at the speed indicated by "fix"	
			}
			if (time > this.nextWave){// the 4 projectiles that shoot out to the corners
				var wave = []
				for (var i = 0; i<4; i++){
					// Basically a duct tape fix. Problem described above the initial this.fireOnce.
					if(this.fireOnce==false){
						wave[i] = new BossProjectile(this.body.x, this.body.y, player.body.x, player.body.y, "default",'enemyproj', 'sprite1',i);
						if(i>2){
							this.fireOnce=true;
						}
					}else{
						wave[i] = new BossProjectile(this.body.x + 64, this.body.y + 75, player.body.x, player.body.y, "default",'enemyproj', 'sprite1',i);	
					}
					enemybulletgroup.add(wave[i]);
				}
				// rotation for bullets still needs to be adjusted here
				this.nextWave = time + this.waveFire; // this is the bullet rate of the weapon
				// These each fire projectiles at a corner. 4 in total.
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
	
	
	// Checks for collision between each player bullet and the boss.
	playerbulletgroup.forEach(function(bullet) {	
		if (bullet != null){
			var bulletHitBoss = game.physics.arcade.collide(bullet, this);
			// delete the bullet if it hits an boss and damage the boss
			if (bulletHitBoss == true){
				if (bullet.type == "Scorpion Dagger" && this.poison == false){
					this.poison = true;
					this.walkspeed /= 2;
				}
				
				if (bullet.type == "Wooden Crossbow" || bullet.type == "Short Bow" || bullet.type == "Composite Crossbow"){
					rangedenemyhitfx.play();
				} else {
					enemyhitfx.play();
				}
				
				bullet.kill();
				bullet.destroy();
				// boss is damaged, delete boss if it dies
				this.health -= bullet.damage;
				if (this.health < 0) {
					healthBoss.setText("");
					
					bosscomplete = true;
					SpawnGems(this.gemcount, this.body.x + 64, this.body.y + 75, 60, 90);
					
					this.kill();
					this.destroy();
				}
			}
		}
	}, this);
	

	var slash = playerslash;			
	if (slash != null){ 
		for (var k = 0; k < slash.hitboxes.length; k++){ //checks to see if any slash from melee weapons has hit the boss.
			var box = slash.hitboxes[k];
			// check for bullet-boss collision
			var boxHitBoss = game.physics.arcade.collide(box, this);
			// delete the bullet if it hits an boss and damage the boss
			if (boxHitBoss == true){
								
				// boss is damaged, delete boss if it dies
				this.health -= slash.damage;
				if (this.health < 0) {
					healthBoss.setText("");
					
					bosscomplete = true;
					SpawnGems(this.gemcount, this.body.x, this.body.y, 60, 90);
					
					this.kill();
					this.destroy();
				}
			}
		}
	}
	// poison effect.
	if (this.poison == true){
		this.health -= 0.1; //damage over time.
		
		if (this.health < 0){
			healthBoss.setText("");
			
			bosscomplete = true;
			SpawnGems(this.gemcount, this.body.x, this.body.y, 70, 110);
			
			this.kill();
			this.destroy();
		}
	}
}