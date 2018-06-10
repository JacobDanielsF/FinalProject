// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Player.js
// Player prefab

// player class
function Player(game, posX, posY, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 0.5;
	this.scale.x = scale;
	this.scale.y = scale;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	this.body.setSize(54, 74, 37, 33); // sets the bounding box.
	
		
	// lock the camera to the player
	game.camera.follow(this);
	this.animations.add('walkup', Phaser.Animation.generateFrameNames('frameup', 1, 4), 8, true);
	this.animations.add('walkright', Phaser.Animation.generateFrameNames('frameright', 1, 6), 12, true);
	this.animations.add('walkleft', Phaser.Animation.generateFrameNames('frameleft', 1, 6), 12, true);
	this.animations.add('walkdown', Phaser.Animation.generateFrameNames('framedown', 1, 4), 8, true);
	
	this.bulletfire = 0;
	this.walkspeed = WALK_SPEED;
	this.direction = "down";
	this.ornateuse = false;
	game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	
	// the two icons at the bottom right of the screen.
	weaponicon.body.x = player.body.x + 340;
	weaponicon.body.y = player.body.y + 240;
	
	weaponicon2.body.x = player.body.x + 360;
	weaponicon2.body.y = player.body.y + 200;
	
	// Cross hair follows mouse. Mouse cursor gets hidden elsewhere.
	crossHair.x = game.input.mousePointer.x+game.camera.x;
	crossHair.y = game.input.mousePointer.y+game.camera.y;
	
	
	var angle = game.physics.arcade.angleToPointer(player);
	
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	
	
	// player movement handling
	var velocity = this.walkspeed;
	var pressed = false;
	
	// check for WASD inputs
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
	
	
	// player idle frames
	if (pressed == false) {
		if (player.direction == "down"){
			player.frameName = 'idledown';
			
		} else if (player.direction == "up"){
			player.frameName = 'idleup';
			
		} else if (player.direction == "left"){
			player.frameName = 'idleleft';
			
		} else if (player.direction == "right"){
			player.frameName = 'idleright';
			
		}
		
		if (stepfx.isPlaying == true){
			stepfx.stop();
		}
	} else {
		
		if (stepfx.isPlaying == false){
			stepfx.play();
		}
	}

	
	// weapon switching
	if (weaponswitch > 0) { weaponswitch--; }
	if (game.input.keyboard.isDown(Phaser.Keyboard.Q) && weaponswitch < 1) {
		
		// switch icons
		if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1) {
			PLAYER_PROPERTIES.CURRENT_WEAPON = PLAYER_PROPERTIES.WEAPON_2;
			weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
			weaponicon2.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_1));
		} else {
			PLAYER_PROPERTIES.CURRENT_WEAPON = PLAYER_PROPERTIES.WEAPON_1;
			weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
			weaponicon2.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_2));
		}
		
		// retrieve weapon properties
		SetWeaponSprite();
		SetFireRate();
		
		weaponswitch = 10;
	}
	
	
	// weapon animations
	var range = 32;
	if (slashframe < 0 || PLAYER_PROPERTIES.CURRENT_WEAPON == "Knife Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Scorpion Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger"){
		// if the weapon is idle, it must follow the player's mouse
		if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword"){
			var offset = -(Math.PI/4);
			
			weapon.body.x = player.body.x + (Math.cos(angle + offset)*range);
			weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle + offset)*range);
			weapon.rotation = angle + offset + (Math.PI/4);
		} else {
			weapon.body.x = player.body.x + (Math.cos(angle)*range);
			weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
			weapon.rotation = angle + (Math.PI/4);
		}
		
	} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Composite Bow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff") {
		// ranged weapon shooting animation
		range -= slashframe*50;
		weapon.body.x = player.body.x + (Math.cos(angle)*range);
		weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
		weapon.rotation = angle + (Math.PI/4);
		slashframe = slashframe - 0.03;
		
		if (slashframe < 0){
			weapon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
		}
	} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword") {
		if (slashframe > 0.2){
			angle = angle + (Math.PI/4);
			weapon.body.x = player.body.x + (Math.cos(angle)*range);
			weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
			weapon.rotation = angle + (Math.PI/4);
			slashframe = slashframe - 0.02;
		} else {
			// sword slash animation
			angle += -1 + (slashframe*10);
			weapon.body.x = player.body.x + (Math.cos(angle)*range);
			weapon.body.y = weaponoffset + player.body.y + (Math.sin(angle)*range);
			weapon.rotation = angle + (Math.PI/4);
			slashframe = slashframe - 0.02;
		}
	}
	
	
	if (daggerreturn == false && daggercooldown < 0){
		daggerreturn = true;
		weapon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
		weaponshadow.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
	}
	
	if (daggercooldown >= 0){
		daggercooldown--;
	}
	
	
	// flip gun sprite so that it is not upside-down
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun"){	
		if(weapon.body.x<player.body.x){
			weapon.scale.x=-1;
			weaponshadow.scale.x=-1
			weapon.rotation =  angle + (Math.PI/2) + (Math.PI/4);
		} else {
			weapon.scale.x=1;
			weaponshadow.scale.x=1;
		}
	} else {
		weapon.scale.x=1;
		weaponshadow.scale.x=1;
	}
	
	function MakePlayerSlash(posX, posY, time, type){ // for melee weapons.
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
	}
	
	function MakePlayerBullet(posX, posY, time, type, angleoffset){ // for ranged weapons.
		bullet = new PlayerProjectile(posX, posY + weaponoffset, type, angleoffset);
		playerbulletgroup.add(bullet);
	}
	
	
	// fire weapon on left mouse click
	if (game.input.activePointer.leftButton.isDown){
		var time = (game.time.now)/1000;
		
		// check if you can fire the weapon (based on fire rate)
		if (time > nextFire) {
			
			// check weapon type, play sfx, and makes the correct bullet for it
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Knife Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Scorpion Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow") {
				if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow") {
					weapon.loadTexture('wooden_crossbow_shot');
					crossbowfx.play();
				} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow") {
					weapon.loadTexture('short_bow_shot');
					bowfx.play();
				} else {
					daggerreturn = false;
					daggercooldown = 10;
					weapon.loadTexture('blank');
					weaponshadow.loadTexture('blank');
				}
				
				// special property for ornate daggers
				if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger") { ornateuse = true; }
				
				// shoot a single bullet
				MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, 0);
				
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff"){
				// shoot 3 bullets
				for (var i = 0; i < 3; i++){
					MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, (i - 1)*0.2);
				}
				
				magicfx.play();
				
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun"){
				// sets up a timer for semi-automatic shots
				this.bulletfire = 3;
				
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Composite Bow"){
				weapon.loadTexture('composite_bow_shot');
				bowfx.play();
				
				// shoot 2 arrows
				MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, -0.1);
				MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, PLAYER_PROPERTIES.CURRENT_WEAPON, 0.1);
				
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword" || PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword") {
				// make a slash
				MakePlayerSlash(player.body.x + 8, player.body.y + 8, time, PLAYER_PROPERTIES.CURRENT_WEAPON);
				whooshfx.play();
			}

			
			nextFire = time + PLAYER_PROPERTIES.FIRE_RATE;
			
			isslashing = true;
			slashframe = 0.4;
		} else {
			isslashing = false;
		}
	}
	
	// for semi-auto bullets
	if (this.bulletfire > 0){
		if ((this.bulletfire)%1 == 0.75){
			gunshotfx.play();
			MakePlayerBullet(player.body.x + 16, player.body.y + 16, time, "Revolver Gun", 0);
		}
		this.bulletfire -= 0.25;
		
	} else {
		this.bulletfire = 0;
	}
	
	
	// place shadow behind weapon and rotate it
	weaponshadow.body.x = weapon.body.x;
	weaponshadow.body.y = weapon.body.y+4;
	weaponshadow.rotation = weapon.rotation;
	
	// sprite layering
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