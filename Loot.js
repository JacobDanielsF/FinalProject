function Loot(game, posX, posY, type){
	
	Phaser.Sprite.call(this, game, posX, posY, type);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	
	if (type == "wooden_crossbow"){
		this.name = "Wooden Crossbow";
		
	} else if (type == "iron_dagger"){
		this.name = "Iron Dagger";
		
	} else if (type == "short_bow"){
		this.name = "Short Bow";
		
	} else if (type == "revolver_gun"){
		this.name = "Revolver Gun";
		
	} else if (type == "energy_staff"){
		this.name = "Energy Staff";
		
	} else if (type == "bronze_sword"){
		this.name = "Bronze Sword";
		
	}
	
	game.physics.enable(this);
	
	game.add.existing(this);
}

Loot.prototype = Object.create(Phaser.Sprite.prototype);
Loot.prototype.constructor = Loot;

Loot.prototype.update = function() {
	
	if (InRange(player.body.x, player.body.y, this.body.x, this.body.y, 70) == true) {
		pickupText.setText('Press SPACE to pick up ' + this.name);
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1) {
				PLAYER_PROPERTIES.WEAPON_1 = this.name;
			} else {
				PLAYER_PROPERTIES.WEAPON_2 = this.name;
			}
			
			PLAYER_PROPERTIES.CURRENT_WEAPON = this.name;
			SetWeaponSprite();
			SetFireRate();
			weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
			
			nextFire = 0;
			isslashing = false;
			slashframe = 0;
			
			pickupText.setText('');
			this.kill();
			this.destroy();
		}
		
	} else {
		pickupText.setText('');
	}
	
}