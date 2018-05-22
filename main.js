// main.js

var game;

window.onload = function() {
	game = new Phaser.Game(800, 600, Phaser.AUTO);
	game.state.add('TitleScreen', TitleScreen);
	game.state.add('DungeonFloor', DungeonFloor);
	game.state.add('NextFloor', NextFloor);
	game.state.add('GameOver', GameOver);
	game.state.add('Tutorial', Tutorial);
	game.state.add('Transition', Transition);
	game.state.add('End', End);
	game.state.add('Credits', Credits);
	game.state.add('BeginMusic', BeginMusic);

	game.state.start('BeginMusic');
}

// GLOBAL VARIABLES
var WALL_SIZE = 64; // map grid scale
var FLOOR_SIZE = 4096; // total map size
var ROOM_SCALE = 2; // scale of room/hallway width
var PATH_WIDTH = WALL_SIZE*ROOM_SCALE;
var ROOM_MAX = 3*ROOM_SCALE;
var ROOM_MIN = 2.5*ROOM_SCALE;
var START_ROOM = 2*ROOM_SCALE;
var BOSS_ROOM = 4*ROOM_SCALE;
var WALK_SPEED = 300; // default player speed
var RUN_SPEED = 400; // running speed
var DEBUG_ENABLED = false; // debug toggle
var IFRAMES_MAX = 20; // invincibility frames

var PLAYER_PROPERTIES = {
	VELOCITY: 80, // unused
	HEALTH: 10,
	CURRENT_WEAPON: "Wooden Crossbow",
	WEAPON_1: "Wooden Crossbow",
	WEAPON_2: "Iron Dagger",
	FIRE_RATE: 0.4,
	POINTS: 0,
	FLOOR: 0,
};




// helper function
function InRange(x1, y1, x2, y2, range){
	var diff = game.math.distance(x1, y1, x2, y2);
	if (diff < range){
		return true;
	}
	return false;
}

function SetFireRate(){
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Wooden Crossbow"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.4;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.25;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.45;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.5;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.35;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.3;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.3;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.35;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.4;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.5;
	}
}

function GetWeaponSprite(index){
	if (index == "Wooden Crossbow"){
		return "wooden_crossbow";
	}
	if (index == "Iron Dagger"){
		return "iron_dagger";
	}
	if (index == "Short Bow"){
		return "short_bow";
	}
	if (index == "Revolver Gun"){
		return "revolver_gun";
	}
	if (index == "Energy Staff"){
		return "energy_staff";
	}
	if (index == "Bronze Sword"){
		return "bronze_sword";
	}
	if (index == "Ornate Dagger"){
		return "ornate_dagger";
	}
	if (index == "Bone Dagger"){
		return "bone_dagger";
	}
	if (index == "Serpentine Staff"){
		return "serpentine_staff";
	}
	if (index == "Stone Sword"){
		return "stone_sword";
	}
}

function SetWeaponSprite(){
	weapon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
}


var FLOOR_WEAPONS = {
	A: ["short_bow", "revolver_gun", "energy_staff", "bronze_sword"],
	B: ["ornate_dagger", "bone_dagger", "serpentine_staff", "stone_sword"],
}




var BeginMusic = function(game) {};
BeginMusic.prototype = {
	
	preload: function() {
		console.log('BeginMusic: preload');
		
		game.load.audio('In Pursuit', 'assets/audio/In Pursuit.mp3');
	},
	
	create: function() {
		console.log('BeginMusic: create');

		
		music = game.add.audio('In Pursuit', 1, true);
		music.play();
		game.state.start('TitleScreen');
	}
	
}

var TitleScreen = function(game) {};
TitleScreen.prototype = {
	
	preload: function() {
		console.log('TitleScreen: preload');
		game.load.image('logo', 'assets/img/logo.png');
		
		game.load.audio('In Pursuit', 'assets/audio/In Pursuit.mp3');
	},
	
	create: function() {
		console.log('TitleScreen: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'TitleScreen', { fontSize: '20px', fill: '#ffffff' });
		
		var logo = game.add.sprite(400, 250, 'logo');
		
		logo.anchor.set(0.5);
		var scale = 2;
		logo.scale.x = scale;
		logo.scale.y = scale;
		
		//promptText = game.add.text(400, 250, 'Tomb of the Ancients', { fontSize: '40px', fill: '#ffffff' });
		//promptText.anchor.x = 0.5;
		//promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 450, 'Press SPACE to begin.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		promptText = game.add.text(400, 500, 'Press Q to view credits.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		PLAYER_PROPERTIES.POINTS = 0;
		PLAYER_PROPERTIES.FLOOR = 0;
		PLAYER_PROPERTIES.HEALTH = 10;
		PLAYER_PROPERTIES.CURRENT_WEAPON = "Wooden Crossbow";
		PLAYER_PROPERTIES.WEAPON_1 = "Wooden Crossbow";
		PLAYER_PROPERTIES.WEAPON_2 = "Iron Dagger";
		SetFireRate();
	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			game.state.start('Tutorial');
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){
			game.state.start('Credits');
		}
	}
	
}

var Credits = function(game) {};
Credits.prototype = {
	
	preload: function() {
		console.log('Credits: preload');
	},
	
	create: function() {
		console.log('Credits: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'Credits', { fontSize: '20px', fill: '#ffffff' });
		
		newText = game.add.text(400, 100, 'CREDITS', { fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 150, 'Developed by: Jacob Daniels-Flechtner, Kameron Fincher,', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 175, 'Jeffrey Yao, Alexai Zachow and Eric Mitchell.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 250, 'Demo sprites (from opengameart.org) by:', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 275, 'gtkampos, Andor Salga, and MetaShinryu.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 350, 'Music by: Purple Planet Music.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 500, 'Press Q to go back.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;

	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){ // or isPressed
			game.state.start('TitleScreen');
		}
	}
	
}

var Tutorial = function(game) {};
Tutorial.prototype = {
	
	preload: function() {
		console.log('Tutorial: preload');
	},
	
	create: function() {
		console.log('Tutorial: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'Tutorial', { fontSize: '20px', fill: '#ffffff' });
		
		newText = game.add.text(400, 200, 'Press WASD to move, SHIFT to run.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 250, 'Left-click to use your weapon.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 300, 'Press Q to switch weapons.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 350, 'Rack up points by defeating enemies and clearing rooms.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 400, 'Attempt to progress through 4 floors of the temple.', { fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 450, 'Press SPACE to continue.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;

	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			music.stop();
			game.state.start('Transition');
		}
	}
	
}

var Transition = function(game) {};
Transition.prototype = {
	
	preload: function() {
		console.log('Transition: preload');
	},
	
	create: function() {
		console.log('Transition: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'Transition', { fontSize: '20px', fill: '#ffffff' });
		
		promptText = game.add.text(400, 300, 'Floor ' + (PLAYER_PROPERTIES.FLOOR + 1), { fontSize: '30px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		tick = 0;
	},
	
	update: function() {
		// shift to main game state
		tick++;
		if(tick > 100){
			game.state.start('DungeonFloor');
		}
	}
	
}




// dungeon floor game state
// spawns a random dungeon map which the player can walk in
var DungeonFloor = function(game) {};
DungeonFloor.prototype = {
	
	// preload dungeon assets
	preload: function() {
		console.log('DungeonFloor: preload');
		game.load.image('slash', 'assets/img/slash_s.png');
		game.load.atlas('enemy_atlas', 'assets/img/enemy8_atlas.png', 'assets/img/enemy8_sprites.json');
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		game.load.atlas('tile_overlay', 'assets/img/tile_overlay.png', 'assets/img/overlay_glyphs.json');
		game.load.image('blank', 'assets/img/blank.png');
		game.load.atlas('player', 'assets/img/player.png', 'assets/img/player.json');
		
		game.load.image('wooden_crossbow', 'assets/img/wooden_crossbow.png');
		game.load.image('iron_dagger', 'assets/img/iron_dagger.png');
		game.load.image('short_bow', 'assets/img/short_bow.png');
		game.load.image('revolver_gun', 'assets/img/revolver_gun.png');
		game.load.image('energy_staff', 'assets/img/energy_staff.png');
		game.load.image('bronze_sword', 'assets/img/bronze_sword.png');
		game.load.image('ornate_dagger', 'assets/img/ornate_dagger.png');
		game.load.image('bone_dagger', 'assets/img/bone_dagger.png');
		game.load.image('serpentine_staff', 'assets/img/serpentine_staff.png');
		game.load.image('stone_sword', 'assets/img/stone_sword.png');
		
		game.load.atlas('arrow', 'assets/img/arrow_bow_s.png', 'assets/img/2_frame.json');
		game.load.atlas('bolt', 'assets/img/bolt_crossbow_s.png', 'assets/img/2_frame.json');
		game.load.atlas('bullet', 'assets/img/bullet_gun_s.png', 'assets/img/3_frame.json');
		game.load.atlas('orb', 'assets/img/missile_staff_s.png', 'assets/img/2_frame.json');
		game.load.atlas('enemyproj', 'assets/img/enemy_proj_s.png', 'assets/img/3_frame.json');
		
		game.load.audio('Immuration', 'assets/audio/Immuration.mp3');
		game.load.audio('In Pursuit', 'assets/audio/In Pursuit.mp3');
		
		//game.time.advancedTiming = true;
	},
	
	// generate the dungeon floor and spawn entities
	create: function() {
		console.log('DungeonFloor: create');
		
		game.world.setBounds(-FLOOR_SIZE/2, -FLOOR_SIZE/2, FLOOR_SIZE*2, FLOOR_SIZE*2);

		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		
		// create necessary groups and arrays for storing data and entities of the dungeon
		walls = game.add.group();
		walls.enableBody = true;

		rooms = [];
		mainrooms = [];
		bossroom = null;
		
		points = [];
		enemies = [];
		playercoords = [];
		treasure = [];
		
		SpawnDungeon(); // this all the work of dungeon generation.
		
		// spawn the player, who has been given a spawn location by SpawnDungeon().
		var posX = playercoords[0];
		var posY = playercoords[1];
		posX = posX - (posX % WALL_SIZE) + (WALL_SIZE/2);
		posY = posY - (posY % WALL_SIZE) + (WALL_SIZE/2);
		
		player = new Player(game, posX, posY, 'player', 'idledown');
		
		// invincibility frames
		iframes = 0;
		
		
		// testing state text
		//stateText = game.add.text(20, 20, 'DungeonFloor', { fontSize: '20px', fill: '#ffffff' });
		//stateText.fixedToCamera = true;
		
		healthText = game.add.text(350, 550, 'Health: ' + PLAYER_PROPERTIES.HEALTH, { fontSize: '20px', fill: '#ffffff' });
		healthText.anchor.x = 0.5;
		healthText.anchor.y = 0.5;
		healthText.fixedToCamera = true;
		
		weaponText = game.add.text(720, 550, PLAYER_PROPERTIES.CURRENT_WEAPON, { fontSize: '20px', fill: '#ffffff' });
		weaponText.anchor.x = 1;
		weaponText.anchor.y = 0.5;
		weaponText.fixedToCamera = true;
		
		roomText = game.add.text(400, 500, '', { fontSize: '20px', fill: '#ffffff' });
		roomText.anchor.x = 0.5;
		roomText.anchor.y = 0.5;
		roomText.fixedToCamera = true;
		
		scoreText = game.add.text(50, 550, 'Score: ' + PLAYER_PROPERTIES.POINTS, { fontSize: '20px', fill: '#ffffff' });
		scoreText.anchor.x = 0;
		scoreText.anchor.y = 0.5;
		scoreText.fixedToCamera = true;
		
		pickupText = game.add.text(400, 500, '', { fontSize: '20px', fill: '#ffffff' });
		pickupText.anchor.x = 0.5;
		pickupText.anchor.y = 0.5;
		pickupText.fixedToCamera = true;
		
		
		// create projectile groups
		playerprojectiles = game.add.group();
		playerprojectiles.enableBody = true;
		
		enemyprojectiles = game.add.group();
		enemyprojectiles.enableBody = true;
		
		// weapon cooldown
		nextFire = 0;
		
		// create enemy group
		enemygroup = game.add.group();
		enemygroup.enableBody = true;
		
		enemytable = [];
		
		
		// spawn enemies in hallways
		for (var i = 0; i < enemies.length; i++){
			enemy = new Enemy(game, enemies[i][0], enemies[i][1], "default", false, 'enemy_atlas', 'enemyidle1');
			enemytable.push(enemy);
			//game.add.existing(enemy);
		}
		
		playerbullettable = [];
		
		//playerbulletgroup = game.add.group();
		//playerbulletgroup.enableBody = true;
		
		playerslashtable = [];
		enemybullettable = [];
		
		weaponswitch = 0;
		
		lastroombounds = null;
		currentroom = null;
		roomenemies = game.add.group();
		roomenemies.enableBody = true;
		completedrooms = [];
		
		currentwalls = game.add.group();
		currentwalls.enableBody = true;
		
		weaponoffset = -3;
		weapon = game.add.sprite(posX, posY + weaponoffset, GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
		weapon.anchor.set(0.5);
		game.physics.arcade.enable(weapon);
		
		SetWeaponSprite();
		SetFireRate();
		
		isslashing = false;
		slashframe = 0;
		
		var weaponsprite = GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON);
		weaponicon = game.add.sprite(posX + 340, posY + 240, weaponsprite);
		weaponicon.anchor.set(0.5);
		weaponicon.scale.set(2);
		game.physics.arcade.enable(weaponicon);
		
		var weaponsprite2;
		if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1){
			weaponsprite2 = GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_2);
		} else {
			weaponsprite2 = GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_1);
		}
		weaponicon2 = game.add.sprite(posX + 360, posY + 200, weaponsprite2);
		weaponicon2.anchor.set(0.5);
		weaponicon2.scale.set(1);
		game.physics.arcade.enable(weaponicon2);
		
		inbossroom = false
		
		music = game.add.audio('Immuration', 1, true);
		music.play();
	},
	
	
	
	
	
	update: function() {
		// easy-use debug function
		// helper function
		function Debug() {
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
		}
		
		// turn on debug options with CTRL
		if(game.input.keyboard.isDown(Phaser.Keyboard.CONTROL) || DEBUG_ENABLED == true){
			DEBUG_ENABLED = true;
			Debug();
		}
		
		
		
		
		// base player physics
		var playerHitWall = game.physics.arcade.collide(player, walls);
		var playerHitCurrentWall = game.physics.arcade.collide(player, currentwalls);
		
		
		var bounds = PlayerInBounds(player.body.x, player.body.y);
		if (bounds != -1 && currentroom == null) {
			currentroom = bounds;
			MakeBounds(bounds);
			completedrooms.push(bounds);
			lastroombounds = mainrooms[bounds];
			
			var temp = 0;
			var enemyspawns = game.rnd.integerInRange(2, 3);
			for (var i = 0; i < enemyspawns; i++){
				var roombounds = mainrooms[bounds];
				var wallpos = game.rnd.integerInRange(1, 4);
				
				if (wallpos == 1){ // left wall
					posX = roombounds[0] - (roombounds[2]/2) - (WALL_SIZE/2);
					posY = roombounds[1] + game.rnd.integerInRange((-roombounds[3]/2) + (WALL_SIZE/2), (roombounds[3]/2) - (WALL_SIZE/2));
				} else if (wallpos == 2){ // right wall
					posX = roombounds[0] + (roombounds[2]/2) + (WALL_SIZE/2);
					posY = roombounds[1] + game.rnd.integerInRange((-roombounds[3]/2) + (WALL_SIZE/2), (roombounds[3]/2) - (WALL_SIZE/2));
				} else if (wallpos == 3){ // upper wall
					posX = roombounds[0] + game.rnd.integerInRange((-roombounds[2]/2) + (WALL_SIZE/2), (roombounds[2]/2) - (WALL_SIZE/2));
					posY = roombounds[1] - (roombounds[3]/2) - (WALL_SIZE/2);
				} else if (wallpos == 4){ // lower wall
					posX = roombounds[0] + game.rnd.integerInRange((-roombounds[2]/2) + (WALL_SIZE/2), (roombounds[2]/2) - (WALL_SIZE/2));
					posY = roombounds[1] + (roombounds[3]/2) + (WALL_SIZE/2);
				}
				
				//posX = roombounds[0] + game.rnd.integerInRange((-roombounds[2]/2) + (WALL_SIZE/2), (roombounds[2]/2) - (WALL_SIZE/2));
				//posY = roombounds[1] + game.rnd.integerInRange((-roombounds[3]/2) + (WALL_SIZE/2), (roombounds[3]/2) - (WALL_SIZE/2));
				enemy = new Enemy(game, posX, posY, "default", false, 'enemy_atlas', 'enemyidle1');
				enemytable.push(enemy);
				roomenemies.add(enemy);
				temp++;
			}
		} else if (PlayerInBoss(player.body.x, player.body.y) == true && currentroom == null) {
			roomText.setText('End of dungeon. Press E to continue.');
			if (inbossroom == false) {
				inbossroom = true
				MakeBossBounds();
			}
		} else {
			roomText.setText('');
		}
		
		
		if (currentroom != null){
			if (roomenemies.length == 0){
				PLAYER_PROPERTIES.POINTS += 50;
				currentwalls.removeAll();
				currentroom = null;
				
				var chance = game.rnd.integerInRange(0, 2);
				if (PLAYER_PROPERTIES.FLOOR < 2 && chance != 0){
					console.log(FLOOR_WEAPONS.A.length-1);
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.A.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					new Loot(game, lootX, lootY, FLOOR_WEAPONS.A[rand]);
				} else if (chance != 0){
					console.log(FLOOR_WEAPONS.B.length-1);
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.B.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					new Loot(game, lootX, lootY, FLOOR_WEAPONS.B[rand]);
				}
			}
		}
		
		
		// extremely basic state handling
		if (PLAYER_PROPERTIES.HEALTH <= 0) {
			music.stop();
			game.state.start('GameOver', true, true);
		}
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
			if (PlayerInBoss(player.body.x, player.body.y) == true){
				PLAYER_PROPERTIES.POINTS += 100;
				PLAYER_PROPERTIES.FLOOR += 1;
				music.stop();
				if (PLAYER_PROPERTIES.FLOOR != 4){
					game.state.start('Transition', true, true);
				} else {
					game.state.start('End', true, true);
				}
			}
		}

		
		function ProjectileCheck(){
			
			for (var i = 0; i < playerbullettable.length; i++) {
				var bullet = playerbullettable[i];
				
				if (bullet != null){
				
					// check if any bullet has collided into any enemy
					for (var j = 0; j < enemytable.length; j++) {
						var enemy = enemytable[j];
					
						if (enemy != null){
							// check for bullet-enemy collision
							var bulletHitEnemy = game.physics.arcade.collide(bullet, enemy);
							// delete the bullet if it hits an enemy and damage the enemy
							if (bulletHitEnemy == true){
								bullet.kill();
								bullet.destroy();
								playerbullettable[i] = null;
							
								// enemy is damaged, delete enemy if it dies
								enemy.damage = function(dmg) {
									this.health -= bullet.damage;
									if (this.health < 0) {
										this.kill();
										this.destroy();
										enemytable[j] = null;
										
									}
								}
								enemy.damage(bullet.damage);
							}
						}
					}
					
					bullet.duration = bullet.duration - 1;
					if (bullet.duration < 1){
						bullet.kill();
						bullet.destroy();
						playerbullettable.pop(i);
					}
				}
			}
			
			for (var i = 0; i < playerslashtable.length; i++) {
				var slash = playerslashtable[i];
				
				if (slash != null){
					for (var k = 0; k < slash.hitboxes.length; k++){
						var box = slash.hitboxes[k];
						
						for (var j = 0; j < enemytable.length; j++) {
							var enemy = enemytable[j];
							
							if (enemy != null){
								// check for bullet-enemy collision
								var boxHitEnemy = game.physics.arcade.collide(box, enemy);
								// delete the bullet if it hits an enemy and damage the enemy
								if (boxHitEnemy == true){
									
									// enemy is damaged, delete enemy if it dies
									enemy.damage = function(dmg) {
										this.health -= slash.damage;
										if (this.health < 0) {
											this.kill();
											this.destroy();
											enemytable[j] = null;
											
										}
									}
									enemy.damage(slash.damage);
								}
							}
						}
					}
					
					slash.duration = slash.duration - 1;
					if (slash.duration < 1){
						for (var k = 0; k < slash.hitboxes.length; k++){
							var box = slash.hitboxes[k];
							box.kill();
							box.destroy();
						}
						slash.mainslash.kill();
						slash.mainslash.destroy();
						playerslashtable.pop(i);
					}
				}
			}

			
			
			for (var i = 0; i < playerslashtable.length; i++) {
				var slash = playerslashtable[i];
				
				if (slash != null){
					slash.duration = slash.duration - 1;
					if (slash.duration < 1){
						for (var k = 0; k < slash.hitboxes.length; k++){
							var box = slash.hitboxes[k];
							box.kill();
							box.destroy();
						}
						slash.mainslash.kill();
						slash.mainslash.destroy();
						playerslashtable.pop(i);
					}
				}
			}
			
			
		}
		
		ProjectileCheck();
		
		
		// invincibility frame counter
		if (iframes > 0){
			iframes--;
		} else {
			iframes = 0;
		}
		
		
		scoreText.setText('Score: ' + PLAYER_PROPERTIES.POINTS);
		healthText.setText('Health: ' + PLAYER_PROPERTIES.HEALTH);
		weaponText.setText(PLAYER_PROPERTIES.CURRENT_WEAPON);
		healthText.bringToTop();
		weaponText.bringToTop();
		roomText.bringToTop();
		scoreText.bringToTop();
		weaponicon.bringToTop();
		
		//game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
	}
}

var NextFloor = function(game) {};
NextFloor.prototype = {
	
	preload: function() {
		console.log('NextFloor: preload');
	},
	
	create: function() {
		console.log('NextFloor: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'NextFloor', { fontSize: '20px', fill: '#ffffff' });
		
		// input prompt
		promptText = game.add.text(400, 300, 'Press SPACE to continue.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			game.state.start('DungeonFloor');
		}
	}
	
}

var GameOver = function(game) {};
GameOver.prototype = {
	
	preload: function() {
		console.log('GameOver: preload');
	},
	
	create: function() {
		console.log('GameOver: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'GameOver', { fontSize: '20px', fill: '#ffffff' });
		
		promptText = game.add.text(400, 270, 'GAME OVER', { fontSize: '30px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 330, 'Press SPACE to continue.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			game.state.start('BeginMusic');
		}
	}
	
}

var End = function(game) {};
End.prototype = {
	
	preload: function() {
		console.log('End: preload');
	},
	
	create: function() {
		console.log('End: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'End', { fontSize: '20px', fill: '#ffffff' });
		
		// input prompt
		promptText = game.add.text(400, 250, 'You made it through the tomb!', { fontSize: '30px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 300, 'Your score: ' + PLAYER_PROPERTIES.POINTS, { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 350, 'Press SPACE to continue.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			game.state.start('BeginMusic');
		}
	}
	
}


// ... (define other states)

