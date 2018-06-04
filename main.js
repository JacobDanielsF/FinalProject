// main.js

var game;
var config = {
    width: 800,
    height: 600,
    renderer: Phaser.AUTO,
    antialias: false,
}

window.onload = function() {
	game = new Phaser.Game(config);
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
		PLAYER_PROPERTIES.FIRE_RATE = 0.8;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Short Bow"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.6;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Composite Bow"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.6;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Revolver Gun"){
		PLAYER_PROPERTIES.FIRE_RATE = 2;
	}
	
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bronze Sword"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.5;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Stone Sword"){
		PLAYER_PROPERTIES.FIRE_RATE = 2;
	}
	
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Knife Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.4;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Iron Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.3;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Ornate Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.3;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Bone Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.3;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Scorpion Dagger"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.5;
	}
	
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Energy Staff"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.6;
	}
	if (PLAYER_PROPERTIES.CURRENT_WEAPON == "Serpentine Staff"){
		PLAYER_PROPERTIES.FIRE_RATE = 0.6;
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
	if (index == "Composite Bow"){
		return "composite_bow";
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
	if (index == "Knife Dagger"){
		return "knife_dagger";
	}
	if (index == "Scorpion Dagger"){
		return "scorpion_dagger";
	}
}

function SetWeaponSprite(){
	weapon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
	weaponshadow.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
}


var FLOOR_WEAPONS = {
	A: ["wooden_crossbow", "iron_dagger", "iron_dagger", "iron_dagger", "short_bow", "energy_staff", "bronze_sword", "bronze_sword"],
	B: ["ornate_dagger", "bone_dagger", "serpentine_staff", "stone_sword", "revolver_gun", "composite_bow", "scorpion_dagger"],
}

var ENEMY_TYPES = {
	A: ["scorpion", "scorpion", "scorpion", "scorpion", "snake"],
	B: ["scorpion", "scorpion", "snake", "snake", "snake"],
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
var difficulty=1;
var difficultyText="Easy";
var TitleScreen = function(game) {};
TitleScreen.prototype = {
	
	preload: function() {
		console.log('TitleScreen: preload');
		game.load.image('logo', 'assets/img/logo.png');
		game.load.image('border', 'assets/img/border.png');
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		game.load.audio('In Pursuit', 'assets/audio/In Pursuit.mp3');
	},
	
	create: function() {
		console.log('TitleScreen: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'TitleScreen', { fontSize: '20px', fill: '#ffffff' });
		for (let i=64;i<config.width-64;i+=56){
			for (let j=64;j<config.height-64;j+=59){
				let titleTile = game.add.image(i,j,'tile_atlas','floor1');
				titleTile.scale.x = 0.875;
				titleTile.scale.y = 0.921875;
				titleTile.alpha = 0.5;
			}
		}
		var logo = game.add.sprite(400, 250, 'logo');
		logo.anchor.set(0.5);
		var scale = 2;
		logo.scale.x = scale;
		logo.scale.y = scale;
		
		
		let titleTile = game.add.image(0,0,'border');
		titleTile.alpha = 0.5;
	
		//promptText = game.add.text(400, 250, 'Tomb of the Ancients', { fontSize: '40px', fill: '#ffffff' });
		//promptText.anchor.x = 0.5;
		//promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 400, 'Press SPACE to begin.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		promptText = game.add.text(400, 450, 'Press Q to view credits.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		diffText = game.add.text(400, 500, 'Press E to change difficulty: '+difficultyText, { fontSize: '20px', fill: '#ffffff' });
		diffText.anchor.x = 0.5;
		diffText.anchor.y = 0.5;

		PLAYER_PROPERTIES.POINTS = 0;
		PLAYER_PROPERTIES.FLOOR = 0;
		PLAYER_PROPERTIES.HEALTH = 10;
		PLAYER_PROPERTIES.CURRENT_WEAPON = "Knife Dagger";
		PLAYER_PROPERTIES.WEAPON_1 = "Knife Dagger";
		PLAYER_PROPERTIES.WEAPON_2 = "Knife Dagger";
		SetFireRate();
	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.E)){
			difficulty *= -1; 
			if(difficulty==1){
				difficultyText="Easy";
			}
			if(difficulty==-1){
				difficultyText="Hard";
			}
			diffText.setText('Press E to change difficulty: '+difficultyText);
		}
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
		
		game.load.audio('floor_change', 'assets/audio/floor_change.mp3');
	},
	
	create: function() {
		console.log('Transition: create');
		
		// testing state text
		//stateText = game.add.text(20, 20, 'Transition', { fontSize: '20px', fill: '#ffffff' });
		
		promptText = game.add.text(400, 300, 'Floor ' + (PLAYER_PROPERTIES.FLOOR + 1), { fontSize: '30px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		tick = 0;
		
		floorsound = game.add.audio('floor_change', 0.5, false);
		floorsound.play();
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
		game.load.atlas('enemy_atlas', 'assets/img/enemy8_atlas.png', 'assets/img/enemy8_sprites.json');
		game.load.atlas('scorpion', 'assets/img/scorpion.png', 'assets/img/scorpion.json');
		game.load.atlas('snake', 'assets/img/snake.png', 'assets/img/snake.json');
		
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		game.load.atlas('tile_overlay', 'assets/img/tile_overlay.png', 'assets/img/overlay_glyphs.json');
		game.load.image('blank', 'assets/img/blank.png');
		game.load.image('slash', 'assets/img/slash_s.png');
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
		game.load.image('knife_dagger', 'assets/img/knife_dagger.png');
		game.load.image('composite_bow', 'assets/img/composite_bow.png');
		game.load.image('scorpion_dagger', 'assets/img/scorpion_dagger.png');
		
		game.load.image('shader', 'assets/img/shader.png');
		game.load.image('shadow', 'assets/img/shadow.png');
		
		game.load.atlas('arrow', 'assets/img/arrow_bow_s.png', 'assets/img/2_frame.json');
		game.load.atlas('bolt', 'assets/img/bolt_crossbow_s.png', 'assets/img/2_frame.json');
		game.load.atlas('bullet', 'assets/img/bullet_gun_s.png', 'assets/img/3_frame.json');
		game.load.atlas('orb', 'assets/img/missile_staff_s.png', 'assets/img/2_frame.json');
		game.load.atlas('enemyproj', 'assets/img/enemy_proj_s.png', 'assets/img/3_frame.json');
		
		game.load.image('map1', 'assets/img/map1.png');
		game.load.image('map2', 'assets/img/map2.png');
		game.load.image('map3', 'assets/img/map3.png');
		
		game.load.audio('Immuration', 'assets/audio/Immuration.mp3');
		game.load.audio('In Pursuit', 'assets/audio/In Pursuit.mp3');
		game.load.audio('Doomed Romance', 'assets/audio/Doomed Romance.mp3');
		game.load.audio('Maelstrom', 'assets/audio/Maelstrom.mp3');
		
		game.load.audio('player_step', 'assets/audio/player_step.mp3');
		game.load.audio('whoosh', 'assets/audio/whoosh.mp3');
		game.load.audio('ranged_hit', 'assets/audio/ranged_hit.mp3');
		game.load.audio('enemy_spit', 'assets/audio/enemy_spit.mp3');
		game.load.audio('door_slam', 'assets/audio/door_slam.mp3');
		game.load.audio('crossbow_shoot', 'assets/audio/crossbow_shoot.mp3');
		
		game.load.audio('grunt1', 'assets/audio/grunt1.mp3');
		game.load.audio('grunt2', 'assets/audio/grunt2.mp3');
		game.load.audio('grunt3', 'assets/audio/grunt3.mp3');
		game.load.audio('grunt4', 'assets/audio/grunt4.mp3');
		game.load.audio('grunt5', 'assets/audio/grunt5.mp3');
		
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
		bosscoords = [];
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
		
		
		
		enemygroup = game.add.group();
		enemygroup.enableBody = true;
		
		// create projectile groups
		playerbulletgroup = game.add.group();
		playerbulletgroup.enableBody = true;
		
		enemybulletgroup = game.add.group();
		enemybulletgroup.enableBody = true;
		
		//roomenemies = game.add.group();
		//roomenemies.enableBody = true;
		
		// weapon cooldown
		nextFire = 0;

		
		//enemytable = [];
		
		
		// spawn enemies in hallways
		if (PLAYER_PROPERTIES.FLOOR < 2){
			for (var i = 0; i < enemies.length; i++){
				var rand = game.rnd.integerInRange(0, ENEMY_TYPES.A.length-1);
				
				enemy = new Enemy(game, enemies[i][0], enemies[i][1], ENEMY_TYPES.A[rand], false);
				enemygroup.add(enemy);
			}
		} else {
			for (var i = 0; i < enemies.length; i++){
				var rand = game.rnd.integerInRange(0, ENEMY_TYPES.B.length-1);
				
				enemy = new Enemy(game, enemies[i][0], enemies[i][1], ENEMY_TYPES.B[rand], false);
				enemygroup.add(enemy);
			}
		}
		
		boss = null;
		
		playerslash = null;
		
		weaponswitch = 0;
		
		lastroombounds = null;
		currentroom = null;
		roomenemies = 0;
		
		completedrooms = [];
		
		currentwalls = game.add.group();
		currentwalls.enableBody = true;
		
		weaponoffset = -3;
		weapon = game.add.sprite(posX, posY + weaponoffset, GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
		weapon.anchor.set(0.5);
		game.physics.arcade.enable(weapon);
		
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
		
		shader = game.add.sprite(posX, posY, 'shader');
		shader.anchor.set(0.5);
		game.physics.arcade.enable(shader);
		
		bosscomplete = false
		
		weaponshadow = game.add.sprite(posX, posY + weaponoffset + 4, weaponsprite);
		weaponshadow.anchor.set(0.5);
		weaponshadow.scale.set(1);
		weaponshadow.tint = 0x000000;
		weaponshadow.alpha = 0.4;
		game.physics.arcade.enable(weaponshadow);
		
		SetWeaponSprite();
		SetFireRate();
		
		game.input.mouse.mouseWheelCallback = mouseWheel;
		function mouseWheel(event) {
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
		}
		if(difficulty==1){
			map = new Map();
		}
		roommusic = game.add.audio('Doomed Romance', 1, true);
		bossmusic = game.add.audio('Maelstrom', 1, true);
		
		stepfx = game.add.audio('player_step', 1, true);
		whooshfx = game.add.audio('whoosh', 1, false);
		rangedhitfx = game.add.audio('ranged_hit', 0.5, false);
		enemyspitfx = game.add.audio('enemy_spit', 1, false);
		crossbowfx = game.add.audio('crossbow_shoot', 1, false);
		doorslamfx = game.add.audio('door_slam', 0.75, false);
		lightdoorslamfx = game.add.audio('door_slam', 0.25, false);
		
		var gruntvolume = 0.5;
		gruntfx1 = game.add.audio('grunt1', gruntvolume, false);
		gruntfx2 = game.add.audio('grunt2', gruntvolume, false);
		gruntfx3 = game.add.audio('grunt3', gruntvolume, false);
		gruntfx4 = game.add.audio('grunt4', gruntvolume, false);
		gruntfx5 = game.add.audio('grunt5', gruntvolume, false);
		
		mainmusic = game.add.audio('Immuration', 1, true);
		mainmusic.play();
	},
	
	
	
	
	
	update: function() {
		// easy-use debug function
		// helper function
		function Debug() {
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
		}
		
		// turn on debug options with CTRL
		if(game.input.keyboard.isDown(Phaser.Keyboard.P) || DEBUG_ENABLED == true){
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
			roomenemies = enemyspawns;
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
				
				if (PLAYER_PROPERTIES.FLOOR < 2){
					var rand = game.rnd.integerInRange(0, ENEMY_TYPES.A.length-1);
					
					enemy = new Enemy(game, posX, posY, ENEMY_TYPES.A[rand], false);
					enemygroup.add(enemy);
				} else {
					var rand = game.rnd.integerInRange(0, ENEMY_TYPES.B.length-1);
					
					enemy = new Enemy(game, posX, posY, ENEMY_TYPES.B[rand], false);
					enemygroup.add(enemy);
				}
				
				doorslamfx.play();
				
				mainmusic.pause();
				roommusic.play();
				
				temp++;
			}
		} else if (PlayerInBoss(player.body.x, player.body.y) == true && currentroom == null) {
			if (inbossroom == false) {
				inbossroom = true
				MakeBossBounds();
				boss = new Boss(game, bosscoords[0], bosscoords[1], "turret", false, 'enemy_atlas', 'enemyidle1');
				
				doorslamfx.play();
				
				mainmusic.pause();
				bossmusic.play();
			}
		} else {
			roomText.setText('');
		}
		
		if (bosscomplete == true) {
			roomText.setText('End of dungeon. Press E to continue.');
			bossmusic.stop();
			mainmusic.resume();
		}
		
		
		if (currentroom != null){
			if (roomenemies == 0){
				PLAYER_PROPERTIES.POINTS += 50;
				currentwalls.removeAll();
				currentroom = null;
				
				var chance = game.rnd.integerInRange(0, 2);
				if (PLAYER_PROPERTIES.FLOOR < 2 && chance != 0){
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.A.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					new Loot(game, lootX, lootY, FLOOR_WEAPONS.A[rand]);
				} else if (chance != 0){
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.B.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					new Loot(game, lootX, lootY, FLOOR_WEAPONS.B[rand]);
				}
				
				lightdoorslamfx.play();
				roommusic.stop();
				mainmusic.resume();
			}
		}
		
		
		// extremely basic state handling
		if (PLAYER_PROPERTIES.HEALTH <= 0) {
			//music.stop();
			game.state.start('GameOver', true, true);
		}
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
			if (PlayerInBoss(player.body.x, player.body.y) == true){
				currentroom = null;
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
			playerbulletgroup.forEach(function(bullet) {
				if (bullet != null){
					// check if any bullet has collided into any enemy
					enemygroup.forEach(function(enemy) {
					
						if (enemy != null){
							// check for bullet-enemy collision
							var bulletHitEnemy = game.physics.arcade.collide(bullet, enemy);
							// delete the bullet if it hits an enemy and damage the enemy
							if (bulletHitEnemy == true){
								if (bullet.type == "Scorpion Dagger" && enemy.poison == false){
									enemy.poison = true;
									enemy.speed /= 2;
								}
								
								bullet.kill();
								bullet.destroy();
								//playerbullettable[i] = null;
							
								// enemy is damaged, delete enemy if it dies
								enemy.damage = function(dmg) {
									this.health -= bullet.damage;
									if (this.health < 0) {
										if (roomenemies > 0){
											roomenemies--;
										}
										
										this.kill();
										this.destroy();
										//enemytable[j] = null;
									}
								}
								enemy.damage(bullet.damage);
							}
						}
					}, this);
					
					bullet.duration = bullet.duration - 1;
					if (bullet.duration < 1){
						bullet.kill();
						bullet.destroy();
						//playerbullettable.pop(i);
					}
				}
			}, this);
			
			
			/*
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
			*/
			
			
			var slash = playerslash;
			
				if (slash != null){
					for (var k = 0; k < slash.hitboxes.length; k++){
						var box = slash.hitboxes[k];
						
						enemygroup.forEach(function(enemy) {
							
							if (enemy != null){
								// check for bullet-enemy collision
								var boxHitEnemy = game.physics.arcade.collide(box, enemy);
								// delete the bullet if it hits an enemy and damage the enemy
								if (boxHitEnemy == true){
									
									// enemy is damaged, delete enemy if it dies
									enemy.damage = function(dmg) {
										this.health -= slash.damage;
										if (this.health < 0) {
											if (roomenemies > 0){
												roomenemies--;
											}
											
											this.kill();
											this.destroy();
											//enemytable[j] = null;
											
										}
									}
									enemy.damage(slash.damage);
								}
							}
						}, this);
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
					}
				}
			
			/*
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
			*/
			
		}
		
		ProjectileCheck();
		
		
		// invincibility frame counter
		if (iframes > 0){
			iframes--;
		} else {
			iframes = 0;
		}
		
		
		shader.bringToTop();
		if(difficulty==1){
			map.pixel.bringToTop();
		}
		scoreText.setText('Score: ' + PLAYER_PROPERTIES.POINTS);
		healthText.setText('Health: ' + PLAYER_PROPERTIES.HEALTH);
		weaponText.setText(PLAYER_PROPERTIES.CURRENT_WEAPON);
		healthText.bringToTop();
		weaponText.bringToTop();
		roomText.bringToTop();
		scoreText.bringToTop();
		weaponicon.bringToTop();
		weaponicon2.bringToTop();
		pickupText.bringToTop();
		
		if (boss != null){
			healthBoss.bringToTop();
		}
		
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
		
		game.load.audio('death_sound', 'assets/audio/death_sound.mp3');
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
		
		endsound = game.add.audio('death_sound', 1, false);
		endsound.play();
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			endsound.stop();
			game.state.start('BeginMusic');
		}
	}
	
}

var End = function(game) {};
End.prototype = {
	
	preload: function() {
		console.log('End: preload');
		
		game.load.audio('Sierra Nevada', 'assets/audio/Sierra Nevada.mp3');
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
		
		endmusic = game.add.audio('Sierra Nevada', 1, true);
		endmusic.play();
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			endmusic.stop();
			game.state.start('BeginMusic');
		}
	}
	
}


// ... (define other states)

