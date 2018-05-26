
function Player(game, posX, posY, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 0.5;
	this.scale.x = scale;
	this.scale.y = scale;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	this.body.setSize(64, 84, 32, 26);
	
		
	// lock the camera to the player
	game.camera.follow(this);
	
	//this.animations.add('idle', Phaser.Animation.generateFrameNames('idledown'), 5, true);
	this.animations.add('walkup', Phaser.Animation.generateFrameNames('frameup', 1, 4), 8, true);
	this.animations.add('walkright', Phaser.Animation.generateFrameNames('frameright', 1, 6), 12, true);
	this.animations.add('walkleft', Phaser.Animation.generateFrameNames('frameleft', 1, 6), 12, true);
	this.animations.add('walkdown', Phaser.Animation.generateFrameNames('framedown', 1, 4), 8, true);
	
	//this.animations.play('idle');
	
	this.walkspeed = 300;
	this.runspeed = 400;
	this.direction = "down";
	game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	
	weaponicon.body.x = player.body.x + 340;
	weaponicon.body.y = player.body.y + 240;
	
	weaponicon2.body.x = player.body.x + 360;
	weaponicon2.body.y = player.body.y + 200;

	
	shader.body.x = player.body.x - 400 + 16;
	shader.body.y = player.body.y - 300 + 20;
	
	
	var angle = game.physics.arcade.angleToPointer(player);
	//console.log(angle);
	
	// function used for 8-directional player movement
		//function PlayerMovement(){
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			
			// run with SHIFT
			var RUNBOOL = false;
			if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
				RUNBOOL = true;
			}
		
			// toggle run speed
			var velocity = this.walkspeed;
			if (RUNBOOL == true){
				velocity = this.runspeed;
			}
			
			/*
			if (angle < Math.PI/4 && angle > -(Math.PI/4)){
				player.direction = "right";
				
			} else if (angle < -(Math.PI/4) && angle > -3*(Math.PI/4)){
				player.direction = "up";
				
			} else if (angle > Math.PI/4 && angle < 3*(Math.PI/4)){
				player.direction = "down";
				
			} else if (angle < -3*(Math.PI/4) || angle > 3*(Math.PI/4)){
				player.direction = "left";
				
			}
			*/
			//console.log(player.direction);
			
			var pressed = false;
			
			if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				// Move left
				player.body.velocity.x = -velocity;
				if (pressed == false){
					player.animations.play('walkleft');
					player.direction = "left";
				}
				pressed = true;
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				// Move right
				player.body.velocity.x = velocity;
				if (pressed == false){
					player.animations.play('walkright');
					player.direction = "right";
				}
				pressed = true;
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				// Move up
				player.body.velocity.y = -velocity;
				if (pressed == false){
					player.animations.play('walkup');
					player.direction = "up";
				}
				pressed = true;
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				// Move down
				player.body.velocity.y = velocity;
				if (pressed == false){
					player.animations.play('walkdown');
					player.direction = "down";
				}
				pressed = true;
			}
			
			//console.log(pressed);
			
			if (pressed == false) {
				//player.animations.play('idle');
				if (player.direction == "down"){
					player.frameName = 'idledown';
					
				} else if (player.direction == "up"){
					player.frameName = 'idleup';
					
				} else if (player.direction == "left"){
					player.frameName = 'idleleft';
					
				} else if (player.direction == "right"){
					player.frameName = 'idleright';
					
				}
			}
			/*
			if (pressed == true) {
				if (player.direction == "down"){
					player.animations.play('walkdown');
					
				} else if (player.direction == "up"){
					player.animations.play('walkup');
					
				} else if (player.direction == "left"){
					player.animations.play('walkleft');
					
				} else if (player.direction == "right"){
					player.animations.play('walkright');
					
				}
			}
			*/
			
		//}
		
		//PlayerMovement();
		
		
		if (weaponswitch > 0) { weaponswitch--; }
		if (game.input.keyboard.isDown(Phaser.Keyboard.Q) && weaponswitch < 1) {
			
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1) {
				PLAYER_PROPERTIES.CURRENT_WEAPON = PLAYER_PROPERTIES.WEAPON_2;
				weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
				weaponicon2.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_1));
			} else {
				PLAYER_PROPERTIES.CURRENT_WEAPON = PLAYER_PROPERTIES.WEAPON_1;
				weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
				weaponicon2.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_2));
			}
			
			SetWeaponSprite();
			SetFireRate();
			
			weaponswitch = 10;
			
		}
		
		
		
		//function UpdateWeaponPos(){
			
			var range = 32;
			if (slashframe < 0 || PLAYER_PROPERTIES.CURRENT_WEAPON == "Knife Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger"){
				weapon.body.x = player.body.x + (Math.cos(angle)*range);
				weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
				weapon.rotation = angle + (Math.PI/4);
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff") {
				range -= slashframe*50;
				weapon.body.x = player.body.x + (Math.cos(angle)*range);
				weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
				weapon.rotation = angle + (Math.PI/4);
				slashframe = slashframe - 0.03;
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword") {
				//console.log(slashframe);
				angle += -1 + (slashframe*10);
				weapon.body.x = player.body.x + (Math.cos(angle)*range);
				weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
				weapon.rotation = angle + (Math.PI/4);
				slashframe = slashframe - 0.02;
			}
		//}
		
		//UpdateWeaponPos();
		
		function MakePlayerSlash(posX, posY, time, type){
			slash = new PlayerSlash(posX, posY + weaponoffset, type);
			if (playerslash != null){
				for (var k = 0; k < playerslash.hitboxes.length; k++){
					var box = playerslash.hitboxes[k];
					box.kill();
					box.destroy();
				}
				playerslash.mainslash.kill();
				playerslash.mainslash.destroy();
				playerslash = null;
			}
			playerslash = slash;
			nextFire = time + PLAYER_PROPERTIES.FIRE_RATE; // this is the bullet rate of the weapon
		}
		
		function MakePlayerBullet(posX, posY, time, type, angleoffset){
			bullet = new PlayerProjectile(posX, posY + weaponoffset, type, angleoffset);
			//playerbullettable.push(bullet);
			playerbulletgroup.add(bullet);
			nextFire = time + PLAYER_PROPERTIES.FIRE_RATE; // this is the bullet rate of the weapon
		}
		
		
		//function FireButton(){
			// fire weapon on left mouse click
			if (game.input.activePointer.leftButton.isDown){
				var time = (game.time.now)/1000;
				// check if you can fire the weapon (based on fire rate)
				if (time > nextFire) {
					// check weapon type
					if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Knife Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun") {
						MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, 0);
						
					} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff"){
						for (var i = 0; i < 3; i++){
							MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, (i - 1)*0.2);
						}
						
					} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword") {
						MakePlayerSlash(player.body.x + 8, player.body.y + 8, time, PLAYER_PROPERTIES.CURRENT_WEAPON);
						
					}
					// list other weapon types here
					
					isslashing = true;
					slashframe = 0.2;
				} else {
					isslashing = false;
				}
			}
			
			
		//}
		
		//FireButton();
		
		weaponshadow.body.x = weapon.body.x;
		weaponshadow.body.y = weapon.body.y+4;
		weaponshadow.rotation = weapon.rotation;
		
	if (angle < 0){
		weaponshadow.bringToTop();
		weapon.bringToTop();
		player.bringToTop();
	} else {
		weaponshadow.bringToTop();
		player.bringToTop();
		weapon.bringToTop();
	}
}