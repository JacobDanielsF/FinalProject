// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// PlayerProjectile.js
// Player projectile and slash prefabs

function PlayerProjectile(posX, posY, type, angleoffset){
	
	// checks weapon type
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
		this.duration = 35; // lifespan of projectile
		
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
		this.damage = 2.5;
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
		this.damage = 3;
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
	
	this.blink = 8; // used for flying blades. 
	
	var angle = game.physics.arcade.angleToPointer(player) + angleoffset; // Changes angle from the target that this projectile will fly. Used for multiple projectiles.
	var targetX = player.body.x+(Math.cos(angle)*70)+16;
	var targetY = player.body.y+(Math.sin(angle)*70)+16;
	game.physics.arcade.moveToXY(this, targetX, targetY, this.speed);
	
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
		
		var hitboxDist = 50;
		var slashDist = hitboxDist*0.65;
		var slashSpeed = 400;
		this.duration = 10;
		this.damage = 3;
		
		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*(hitboxDist-10))+16, player.body.y+(Math.sin(angle)*(slashDist))+16 , 'slash', 'sprite1');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.scale.setTo(1.2, 1);
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		
		game.physics.enable(slash);
		slash.body.collideWorldBounds = false;
		var targetX = player.body.x+(Math.cos(angle)*70)+16;
		var targetY = player.body.y+(Math.sin(angle)*70)+16;
		game.physics.arcade.moveToXY(slash, targetX, targetY, slashSpeed);
		
		slash.body.velocity.x += (player.body.velocity.x)/2;
		slash.body.velocity.y += (player.body.velocity.y)/2;
		
		slash.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 3), 14, false);
		slash.animations.play('anim');
		
		this.mainslash = slash;
		
		var increment = 0.25;
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'blank');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes.push(newSlash);
			
			game.physics.enable(newSlash);
			newSlash.body.collideWorldBounds = false;
			var targetX = player.body.x+(Math.cos(angle+increment*(i-2))*70)+16;
			var targetY = player.body.y+(Math.sin(angle+increment*(i-2))*70)+16;
			game.physics.arcade.moveToXY(newSlash, targetX, targetY, slashSpeed);
			
			newSlash.body.velocity.x += (player.body.velocity.x)/2;
			newSlash.body.velocity.y += (player.body.velocity.y)/2;
		}
		
	}
	if (type == "Stone Sword"){
		var angle = game.physics.arcade.angleToPointer(player);
		
		var hitboxDist = 50;
		var slashDist = hitboxDist*0.65;
		var slashSpeed = 500;
		this.duration = 20;
		this.damage = 5;
		
		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*(hitboxDist-10))+16, player.body.y+(Math.sin(angle)*(slashDist))+16 , 'slash', 'sprite1');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.scale.setTo(1.2, 1);
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		
		game.physics.enable(slash);
		slash.body.collideWorldBounds = false;
		var targetX = player.body.x+(Math.cos(angle)*70)+16;
		var targetY = player.body.y+(Math.sin(angle)*70)+16;
		game.physics.arcade.moveToXY(slash, targetX, targetY, slashSpeed);
		
		slash.body.velocity.x += (player.body.velocity.x)/2;
		slash.body.velocity.y += (player.body.velocity.y)/2;
		
		slash.animations.add('anim', Phaser.Animation.generateFrameNames('sprite', 1, 3), 7, false);
		slash.animations.play('anim');
		
		this.mainslash = slash;
		
		var increment = 0.25;
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'blank');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes.push(newSlash);
			
			game.physics.enable(newSlash);
			newSlash.body.collideWorldBounds = false;
			var targetX = player.body.x+(Math.cos(angle+increment*(i-2))*70)+16;
			var targetY = player.body.y+(Math.sin(angle+increment*(i-2))*70)+16;
			game.physics.arcade.moveToXY(newSlash, targetX, targetY, slashSpeed);
			
			newSlash.body.velocity.x += (player.body.velocity.x)/2;
			newSlash.body.velocity.y += (player.body.velocity.y)/2;
		}
	}
	
	this.hitboxes = hitboxes;

}

PlayerSlash.prototype.constructor = PlayerSlash;