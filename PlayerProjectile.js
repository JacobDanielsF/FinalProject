// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// PlayerProjectile.js
// Player projectile and slash prefabs

function PlayerProjectile(posX, posY, type, angleoffset){
	
	// check enemy type
	if (type == "Knife Dagger"){
		Phaser.Sprite.call(this, game, posX, posY, 'knife_dagger');
		this.anchor.set(0.5);
		var scale = 0.75;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 550;
		this.damage = 1;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 35;
		
	}
	if (type == "Scorpion Dagger"){
		Phaser.Sprite.call(this, game, posX, posY, 'scorpion_dagger');
		this.anchor.set(0.5);
		var scale = 0.75;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 650;
		this.damage = 0;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;
		
	}
	if (type == "Iron Dagger"){
		Phaser.Sprite.call(this, game, posX, posY, 'iron_dagger');
		this.anchor.set(0.5);
		var scale = 0.75;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 650;
		this.damage = 1;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;

	}
	if (type == "Ornate Dagger"){
		Phaser.Sprite.call(this, game, posX, posY, 'ornate_dagger');
		this.anchor.set(0.5);
		var scale = 0.75;
		this.scale.x = scale;
		this.scale.y = scale;
		
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 600;
		if (ornateuse == false){
			this.damage = 2;
		} else {
			this.damage = 0.5;
		}
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 30;

	}
	if (type == "Bone Dagger"){
		Phaser.Sprite.call(this, game, posX, posY, 'bone_dagger');
		this.anchor.set(0.5);
		var scale = 0.75;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 600;
		this.damage = 2;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 35;

	}
	if (type == "Wooden Crossbow"){
		Phaser.Sprite.call(this, game, posX, posY, 'bolt', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 600;
		this.damage = 3;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
		this.animations.play('anim');
	}
	if (type == "Short Bow"){
		Phaser.Sprite.call(this, game, posX, posY, 'arrow', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 550;
		this.damage = 2;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
		this.animations.play('anim');
	}
	if (type == "Composite Bow"){
		Phaser.Sprite.call(this, game, posX, posY, 'arrow', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 550;
		this.damage = 2;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 2), 8, true);
		this.animations.play('anim');
	}
	if (type == "Revolver Gun"){
		Phaser.Sprite.call(this, game, posX, posY, 'bullet', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 1000;
		this.damage = 2;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 30;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 3), 8, true);
		this.animations.play('anim');
	}
	if (type == "Energy Staff"){
		Phaser.Sprite.call(this, game, posX, posY, 'orb', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
	
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 500;
		this.damage = 1;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 40;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 3), 8, true);
		this.animations.play('anim');
	}
	if (type == "Serpentine Staff"){
		Phaser.Sprite.call(this, game, posX, posY, 'orb', 'sprite1');
		this.anchor.set(0.5);
		var scale = 1.5;
		this.scale.x = scale;
		this.scale.y = scale;
	
		this.type = type;
		
		game.physics.enable(this);
		this.body.collideWorldBounds = false;
		
		this.speed = 600;
		this.damage = 2;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/4);
		this.duration = 45;
		
		this.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 3), 8, true);
		this.animations.play('anim');
	}
	
	this.blink = 8;
	//this.tick = 0;
	
	var angle = game.physics.arcade.angleToPointer(player) + angleoffset;
	var targetX = player.body.x+(Math.cos(angle)*70)+16;
	var targetY = player.body.y+(Math.sin(angle)*70)+16;
	game.physics.arcade.moveToXY(this, targetX, targetY, this.speed);
	//game.physics.arcade.moveToPointer(this, this.speed);
	
	this.body.velocity.x += (player.body.velocity.x)/2;
	this.body.velocity.y += (player.body.velocity.y)/2;
	
	game.add.existing(this);
}

PlayerProjectile.prototype = Object.create(Phaser.Sprite.prototype);
PlayerProjectile.prototype.constructor = PlayerProjectile;

PlayerProjectile.prototype.update = function() {
	
	var bulletHitWall = game.physics.arcade.collide(this, walls);
	var bulletHitCurrentWall = game.physics.arcade.collide(this, currentwalls);
	// delete the bullet if it hits a wall
	if (bulletHitWall == true || bulletHitCurrentWall == true){
		this.kill();
		this.destroy();
		if (this.type == "Knife Dagger" || this.type == "Iron Dagger" || this.type == "Scorpion Dagger" || this.type == "Ornate Dagger" || this.type == "Bone Dagger" || this.type == "Wooden Crossbow" || this.type == "Short Bow" || this.type == "Composite Bow" || this.type == "Revolver Gun"){
			rangedhitfx.play();
		}
	}
	
	if (this.type == "Knife Dagger" || this.type == "Iron Dagger" || this.type == "Ornate Dagger" || this.type == "Bone Dagger" || this.type == "Scorpion Dagger"){
		this.rotation = this.rotation + 0.5;
		this.blink--;
		if (this.blink < 0){
			this.blink = 8;
			this.tint = 0xFFFFFF;
		} else {
			this.tint = 0xFFFFFF - (0x030303 * this.blink * 8);
		}
	}
}

// player slash class
function PlayerSlash(posX, posY, type){
	this.type = type;
	var hitboxes = [];
	
	if (type == "Bronze Sword"){
		var angle = game.physics.arcade.angleToPointer(player);
		
		var hitboxDist = 75;
		var slashDist = hitboxDist*0.8;
		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*(hitboxDist-10))+16, player.body.y+(Math.sin(angle)*(slashDist))+16 , 'slash');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.scale.setTo(1.2, 1);
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		this.mainslash = slash;

		var increment = 0.25;
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'blank');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes.push(newSlash);
		}
		
		this.duration = 4;
		this.damage = 3;
		
	}
	if (type == "Stone Sword"){
		var angle = game.physics.arcade.angleToPointer(player);
		
		var hitboxDist = 80;
		var slashDist = hitboxDist*0.8;
		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*(hitboxDist-10))+16, player.body.y+(Math.sin(angle)*(slashDist))+16 , 'slash');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.scale.setTo(1.2, 1);
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		this.mainslash = slash;

		var increment = 0.25;
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'blank');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes.push(newSlash);
		}
		
		this.duration = 6;
		this.damage = 4;
		
	}
	
	this.hitboxes = hitboxes;
	//game.add.existing(this);
}

PlayerSlash.prototype.constructor = PlayerSlash;