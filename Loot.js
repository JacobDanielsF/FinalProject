function Loot(posX, posY, type){
	
	var shadow = game.add.sprite(posX, posY+2, type);
	shadow.anchor.set(0.5);
	shadow.tint = 0x000000;
	shadow.alpha = 0.4;
	this.shadow = shadow;
	
	var item = game.add.sprite(posX, posY, type);
	item.anchor.set(0.5);
	this.item = item;
	
	this.centerX = posX;
	this.centerY = posY;
	
	/*
	Phaser.Sprite.call(this, game, posX, posY, type);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	*/
	if (type == "knife_dagger"){
		this.name = "Knife Dagger";
	}
	if (type == "scorpion_dagger"){
		this.name = "Scorpion Dagger";
	}
	if (type == "wooden_crossbow"){
		this.name = "Wooden Crossbow";
	}
	if (type == "iron_dagger"){
		this.name = "Iron Dagger";
	}
	if (type == "short_bow"){
		this.name = "Short Bow";
	}
	if (type == "composite_bow"){
		this.name = "Composite Bow";
	}
	if (type == "revolver_gun"){
		this.name = "Revolver Gun";
	}
	if (type == "energy_staff"){
		this.name = "Energy Staff";
	}
	if (type == "bronze_sword"){
		this.name = "Bronze Sword";
	}
	if (type == "ornate_dagger"){
		this.name = "Ornate Dagger";
	}
	if (type == "bone_dagger"){
		this.name = "Bone Dagger";
	}
	if (type == "serpentine_staff"){
		this.name = "Serpentine Staff";
	}
	if (type == "stone_sword"){
		this.name = "Stone Sword";
	}
	
	//game.add.existing(this);
}

//Loot.prototype = Object.create(Phaser.Sprite.prototype);
Loot.prototype.constructor = Loot;

/*
Loot.prototype.update = function() {
	
	if (InRange(player.body.x, player.body.y, this.body.x, this.body.y, 70) == true) {
		pickupText.setText('Press SPACE to pick up ' + this.name);
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			
			if (this.name == "Ornate Dagger"){
				player.ornateuse = false;
			}
			
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
*/