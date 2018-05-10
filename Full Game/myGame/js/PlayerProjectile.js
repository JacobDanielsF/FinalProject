
function PlayerProjectile(posX, posY, type, sprite, frame){
	Phaser.Sprite.call(this, game, posX, posY, sprite, frame);
	this.anchor.set(0.5);
	var scale = 1;
	this.scale.x = scale;
	this.scale.y = scale;
	
	this.type = type;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// check enemy type
	if (type == "Wooden Crossbow"){
		this.speed = 600;
		this.damage = 1;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
	}
	
	game.physics.arcade.moveToPointer(this, this.speed);
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
	}
	
}

// player slash class
function PlayerSlash(posX, posY, type){
	this.type = type;
	var hitboxes = [];
	
	if (type == "Iron Dagger"){
		var angle = game.physics.arcade.angleToPointer(player);
		
		var hitboxDist = 50
		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*(hitboxDist-10))+16, player.body.y+(Math.sin(angle)*(hitboxDist-10))+16 , 'character_atlas', 'slash');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.scale.setTo(1.2, 1);
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		this.mainslash = slash

		var increment = 0.3
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'blank');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes.push(newSlash);
		}
		
		this.duration = 5;
		this.damage = 1;
	}
	this.hitboxes = hitboxes;
	//game.add.existing(this);
}

PlayerSlash.prototype.constructor = PlayerSlash;