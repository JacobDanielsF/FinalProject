// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Loot.js
// Loot prefab

function Loot(posX, posY, type){
	// adds a shadow below a weapon to make it stand out more.
	var shadow = game.add.sprite(posX, posY+2, type);
	shadow.anchor.set(0.5);
	shadow.tint = 0x000000;
	shadow.alpha = 0.4;
	this.shadow = shadow;
	
	// spawns the weapon itself
	var item = game.add.sprite(posX, posY, type);
	item.anchor.set(0.5);
	this.item = item;
	
	this.centerX = posX;
	this.centerY = posY;
	// all weapon names. Gives the loot a name based on the type.
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
}

Loot.prototype.constructor = Loot;
