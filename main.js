// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// main.js
// Main game loop and states

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
var WALK_SPEED = 350; // default player speed
var DEBUG_ENABLED = false; // debug toggle
var IFRAMES_MAX = 20; // invincibility frames
var MAIN_FONT = 'Verdana';
var MAIN_STYLE = 'bold';

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
// returns the correct weapon sprite name based on the weapon name
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
// sets the weapon sprite
function SetWeaponSprite(){
	weapon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
	weaponshadow.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
}

function SpawnGems(num, x, y, lorange, hirange){
	for (var i = 0; i < num; i++){
		
		var angle = (game.rnd.integerInRange(-100, 100)/100) * Math.PI;
		
		var thisrange = game.rnd.integerInRange(lorange*10, hirange*10)/10;
		var thisX = x + (Math.cos(angle) * thisrange);
		var thisY = y + (Math.sin(angle) * thisrange);
		
		var gem;
		var rand = game.rnd.integerInRange(1, 5); 
		// Spawns a variety of random gems.
		if (rand == 1){
			gem = new Gem(game, thisX, thisY, 'topaz');
		} else if (rand == 2){
			gem = new Gem(game, thisX, thisY, 'ruby');
		} else if (rand == 3){
			gem = new Gem(game, thisX, thisY, 'sapphire');
		} else if (rand == 4){
			gem = new Gem(game, thisX, thisY, 'emerald');
		} else {
			gem = new Gem(game, thisX, thisY, 'diamond');
		}
	}
}

// Pool of weapons available for a floor
var FLOOR_WEAPONS = {
	A: ["wooden_crossbow", "iron_dagger", "iron_dagger", "iron_dagger", "short_bow", "energy_staff", "bronze_sword", "bronze_sword"],
	B: ["ornate_dagger", "bone_dagger", "serpentine_staff", "stone_sword", "revolver_gun", "composite_bow", "scorpion_dagger"],
}
// Pool of enemy types available for a floor
var ENEMY_TYPES = {
	A: ["scorpion", "scorpion", "scorpion", "scorpion", "snake"],
	B: ["scorpion", "scorpion", "snake", "snake", "snake"],
}



// Starts title screen music.
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
var difficulty=1; // controls difficulty, which controls what the map will be like.
var difficultyText="Hard";
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

		// handles the background tiles in the title screen.
		for (let i=64;i<config.width-64;i+=56){
			for (let j=64;j<config.height-64;j+=59){
				let titleTile = game.add.image(i,j,'tile_atlas','floor1');
				titleTile.scale.x = 0.875;
				titleTile.scale.y = 0.921875;
				titleTile.alpha = 0.5;
			}
		}
		
		let titleTile = game.add.image(0,0,'border');
		titleTile.alpha = 0.5;
		
		var logo = game.add.sprite(400, 250, 'logo');
		logo.anchor.set(0.5);
		logo.scale.set(2);
		
		
		// input prompt
		promptText = game.add.text(400, 400, 'Press SPACE to begin.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		promptText = game.add.text(400, 450, 'Press Q to view credits.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		diffText = game.add.text(400, 500, 'Press E to change difficulty: '+difficultyText, { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		diffText.anchor.x = 0.5;
		diffText.anchor.y = 0.5;

		PLAYER_PROPERTIES.POINTS = 0;
		PLAYER_PROPERTIES.FLOOR = 0;
		PLAYER_PROPERTIES.HEALTH = 10;
		PLAYER_PROPERTIES.CURRENT_WEAPON = "Knife Dagger";
		PLAYER_PROPERTIES.WEAPON_1 = "Knife Dagger"; // sets the weapon in slot 1
		PLAYER_PROPERTIES.WEAPON_2 = "Knife Dagger"; // sets the weapon in slot 2
		SetFireRate();
	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.E)){ // updates difficulty
			difficulty += 1; 
			if(difficulty>2){
				difficulty=0;
			}
			if(difficulty==0){
				difficultyText="Easy"; // map completely spawned in.
			}
			if(difficulty==1){
				difficultyText="Hard"; // map generates in as player moves around.
			}
			if(difficulty==2){
				difficultyText="Pro"; // no map at all.
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
		
		newText = game.add.text(400, 100, 'CREDITS', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 150, 'Developed by: Jacob Daniels-Flechtner, Kameron Fincher,', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 175, 'Jeffrey Yao, Alexai Zachow and Eric Mitchell.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 225, 'Tile sprites (from opengameart.org) by: gtkampos and Andor Salga.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 275, 'Crosshair sprite by: Kenney.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 325, 'Background music by: Purple Planet Music.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 375, 'Various sounds (from freesound.org) by: Vosvoy, pyro13djt,', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 400, 'deleted_user_6479820, Erdie, adcbicycle, Timbre, Hanbaal,', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 425, 'high_festiva, LiamG_SFX, Seidhepriest, FreqMan, thanvannispen,', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 450, 'qubodup, Groadr, tiptoe84, and Vehicle.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 525, 'Press Q to go back.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
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
		
		game.load.image('border', 'assets/img/border.png');
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		
		game.load.atlas('player', 'assets/img/player.png', 'assets/img/player.json');
		game.load.atlas('scorpion', 'assets/img/scorpion.png', 'assets/img/scorpion.json');
		game.load.atlas('snake', 'assets/img/snake.png', 'assets/img/snake.json');
		
		game.load.image('wooden_crossbow', 'assets/img/wooden_crossbow.png');
		game.load.image('iron_dagger', 'assets/img/iron_dagger.png');
		
		game.load.image('stairs', 'assets/img/stairs.png');
		game.load.image('crosshair', 'assets/img/crosshair.png');
		game.load.image('weapon_ui', 'assets/img/weapon_ui.png');
		
		game.load.atlas('topaz', 'assets/img/topaz.png', 'assets/img/gem.json');
		game.load.atlas('sapphire', 'assets/img/sapphire.png', 'assets/img/gem.json');
		game.load.atlas('ruby', 'assets/img/ruby.png', 'assets/img/gem.json');
		game.load.atlas('diamond', 'assets/img/diamond.png', 'assets/img/gem.json');
		game.load.atlas('emerald', 'assets/img/emerald.png', 'assets/img/gem.json');
		
	},
	
	create: function() {
		console.log('Tutorial: create');
		
		for (let i=64;i<config.width-64;i+=56){
			for (let j=64;j<config.height-64;j+=59){
				let titleTile = game.add.image(i,j,'tile_atlas','floor1');
				titleTile.scale.x = 0.875;
				titleTile.scale.y = 0.921875;
				titleTile.alpha = 0.5;
			}
		}
		
		let titleTile = game.add.image(0,0,'border');
		titleTile.alpha = 0.5;
		
		
		newText = game.add.text(400, 100, 'HOW TO PLAY:', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		
		playerT = game.add.sprite(200, 200, 'player', 'idledown');
		playerT.anchor.set(0.5);
		
		playerT.animations.add('walkup', Phaser.Animation.generateFrameNames('frameup', 1, 4), 8, true);
		playerT.animations.add('walkright', Phaser.Animation.generateFrameNames('frameright', 1, 6), 12, true);
		playerT.animations.add('walkleft', Phaser.Animation.generateFrameNames('frameleft', 1, 6), 12, true);
		playerT.animations.add('walkdown', Phaser.Animation.generateFrameNames('framedown', 1, 4), 8, true);
		
		newText = game.add.text(200, 125, 'W', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(125, 200, 'A', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(200, 275, 'S', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(275, 200, 'D', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		
		crosshair = game.add.sprite(400, 170, 'crosshair');
		crosshair.anchor.set(0.5);
		
		newText = game.add.text(575, 150, 'Aim your weapon with', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(575, 170, 'your mouse and left-click', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(575, 190, 'to use it.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		
		weaponUI = game.add.sprite(650, 275, 'weapon_ui');
		weaponUI.anchor.set(0.5);
		weaponUI.scale.set(2);
		
		weapon1 = game.add.sprite(630, 222, 'wooden_crossbow');
		weapon1.anchor.set(0.5);
		weapon1.scale.set(1);
		weapon1.alpha = 0.5;
		game.physics.enable(weapon1);
		
		weapon2 = game.add.sprite(634, 291, 'iron_dagger');
		weapon2.anchor.set(0.5);
		weapon2.scale.set(1.25);
		game.physics.enable(weapon2);
		
		weapon1.body.x = 630;
		weapon1.body.y = 222;
		weapon2.body.x = 634;
		weapon2.body.y = 291;
		
		newText = game.add.text(450, 250, 'Press Q to switch weapons.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(450, 290, 'Press SPACE to pick up any', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(450, 310, 'new weapons you find.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		
		
		snakeT = game.add.sprite(120, 390, 'snake', 'snakeright1');
		snakeT.anchor.set(0.5);
		snakeT.scale.set(0.75);
		snakeT.animations.add('walkright', Phaser.Animation.generateFrameNames('snakeright', 1, 2), 5, true);
		snakeT.animations.play('walkright');
		
		scorpionT = game.add.sprite(160, 430, 'scorpion', 'scorpionidleright');
		scorpionT.anchor.set(0.5);
		scorpionT.scale.set(0.75);
		scorpionT.animations.add('walkright', Phaser.Animation.generateFrameNames('scorpionwalkright', 2, 3), 5, true);
		scorpionT.animations.play('walkright');
		
		
		// literally just taken from SpawnGems()
		for (var i = 0; i < 15; i++){
			
			var angle = (game.rnd.integerInRange(-100, 100)/100) * Math.PI;
			
			var thisrange = game.rnd.integerInRange(10, 400)/10;
			var thisX = 650 + (Math.cos(angle) * thisrange);
			var thisY = 410 + (Math.sin(angle) * thisrange);
			
			var gem;
			var rand = game.rnd.integerInRange(1, 5); 
			// Spawns a variety of random gems.
			if (rand == 1){
				gem = game.add.sprite(thisX, thisY, 'topaz');
			} else if (rand == 2){
				gem = game.add.sprite(thisX, thisY, 'ruby');
			} else if (rand == 3){
				gem = game.add.sprite(thisX, thisY, 'sapphire');
			} else if (rand == 4){
				gem = game.add.sprite(thisX, thisY, 'emerald');
			} else {
				gem = game.add.sprite(thisX, thisY, 'diamond');
			}
			
			gem.scale.set(2);
			gem.animations.add('sparkle', Phaser.Animation.generateFrameNames('sprite', 1, 4), 4, true);
			gem.animations.play('sparkle');
		}
		
		
		
		newText = game.add.text(400, 375, 'Enemies drop gems, which can be collected.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 425, 'Attempt to progress through 4 floors of the', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		newText = game.add.text(400, 450, 'temple, collecting as many gems as you can.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '15px', fill: '#ffffff' });
		newText.anchor.x = 0.5;
		newText.anchor.y = 0.5;
		
		
		// input prompt
		promptText = game.add.text(400, 500, 'Press SPACE to continue.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		animtick = 0;
	},
	
	update: function() {
		
		// shift to main game state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			music.stop();
			game.state.start('Transition');
		}
		
		if (animtick == 0){
			playerT.animations.play('walkdown');
			
			weapon1.body.x = 630;
			weapon1.body.y = 222;
			weapon1.anchor.set(0.5);
			weapon1.scale.set(1);
			weapon1.alpha = 0.5;
			
			weapon2.body.x = 634;
			weapon2.body.y = 291;
			weapon2.anchor.set(0.5);
			weapon2.scale.set(1.25);
			weapon2.alpha = 1;
		}
		if (animtick == 25){
			playerT.animations.play('walkleft');
		}
		if (animtick == 50){
			playerT.animations.play('walkup');
			
			weapon2.body.x = 630;
			weapon2.body.y = 222;
			weapon2.anchor.set(0.5);
			weapon2.scale.set(1);
			weapon2.alpha = 0.5;
			
			weapon1.body.x = 634;
			weapon1.body.y = 291;
			weapon1.anchor.set(0.5);
			weapon1.scale.set(1.25);
			weapon1.alpha = 1;
		}
		if (animtick == 75){
			playerT.animations.play('walkright');
		}
		
		animtick++;
		
		if (animtick > 100){
			animtick = 0;
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
        
        
        promptText = game.add.text(400, 300, 'FLOOR ' + (PLAYER_PROPERTIES.FLOOR + 1), { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '40px', fill: '#ffffff' });
        promptText.anchor.x = 0.5;
        promptText.anchor.y = 0.5;
        promptText.alpha = 0
		
        tick = 0; 
        fadedIn = false;
        fadedOut = false;
        floorsound = game.add.audio('floor_change', 0.5, false);
        floorsound.play();
    },
    
    update: function() {
        // shift to main game state
        tick++; // manually controlling how long transition time will be.
		
        
        if(tick>0&&fadedIn==false){
            fadedIn = true;
            game.add.tween(promptText).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        } 
		if(tick>100&&fadedOut==false){
            fadedOut = true;
            game.add.tween(promptText).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
        if(tick > 150){
            game.state.start('DungeonFloor');
        }
    }
    
}




// dungeon floor game state, aka the main game state.
// spawns a random dungeon map which the player can walk in
var DungeonFloor = function(game) {};
DungeonFloor.prototype = {
	
	// preload dungeon assets
	preload: function() {
		console.log('DungeonFloor: preload');
		game.load.atlas('scorpion', 'assets/img/scorpion.png', 'assets/img/scorpion.json');
		game.load.atlas('snake', 'assets/img/snake.png', 'assets/img/snake.json');
		
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		game.load.atlas('tile_overlay', 'assets/img/tile_overlay.png', 'assets/img/overlay_glyphs.json');
		game.load.image('blank', 'assets/img/blank.png');
		game.load.atlas('slash', 'assets/img/slash_sword.png', 'assets/img/slash.json');
		game.load.atlas('player', 'assets/img/player.png', 'assets/img/player.json');
		game.load.atlas('boss', 'assets/img/boss.png', 'assets/img/boss.json');
		
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
		
		game.load.atlas('topaz', 'assets/img/topaz.png', 'assets/img/gem.json');
		game.load.atlas('sapphire', 'assets/img/sapphire.png', 'assets/img/gem.json');
		game.load.atlas('ruby', 'assets/img/ruby.png', 'assets/img/gem.json');
		game.load.atlas('diamond', 'assets/img/diamond.png', 'assets/img/gem.json');
		game.load.atlas('emerald', 'assets/img/emerald.png', 'assets/img/gem.json');
		
		game.load.image('shader', 'assets/img/shader.png');
		
		game.load.image('stairs', 'assets/img/stairs.png');
		game.load.image('crosshair', 'assets/img/crosshair.png');
		game.load.image('weapon_ui', 'assets/img/weapon_ui.png');
		
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
		game.load.audio('bow_shoot', 'assets/audio/bow_shoot.mp3');
		
		game.load.audio('grunt1', 'assets/audio/grunt1.mp3');
		game.load.audio('grunt2', 'assets/audio/grunt2.mp3');
		game.load.audio('grunt3', 'assets/audio/grunt3.mp3');
		game.load.audio('grunt4', 'assets/audio/grunt4.mp3');
		game.load.audio('grunt5', 'assets/audio/grunt5.mp3');
		
		game.load.audio('gem', 'assets/audio/gem.mp3');
		game.load.audio('enemy_hit', 'assets/audio/enemy_hit.mp3');
		game.load.audio('stinger', 'assets/audio/new_stinger.mp3');
		game.load.audio('boss_growl', 'assets/audio/boss_growl.mp3');
		game.load.audio('ranged_enemy_hit', 'assets/audio/ranged_enemy_hit.mp3');
		game.load.audio('magic_orb', 'assets/audio/magic_orb.mp3');
		game.load.audio('boss_aura', 'assets/audio/boss_aura.mp3');
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
		
		healthText = game.add.text(350, 560, 'Health: ' + PLAYER_PROPERTIES.HEALTH, { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		healthText.anchor.x = 0.5;
		healthText.anchor.y = 0.5;
		healthText.fixedToCamera = true;
		
		weaponText = game.add.text(710, 560, PLAYER_PROPERTIES.CURRENT_WEAPON, { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		weaponText.anchor.x = 1;
		weaponText.anchor.y = 0.5;
		weaponText.fixedToCamera = true;
		
		QText = game.add.text(710, 483, 'Q', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '18px', fill: '#ffffff' });
		QText.anchor.x = 1;
		QText.anchor.y = 0.5;
		QText.fixedToCamera = true;
		
		scoreText = game.add.text(40, 560, 'Gems: ' + PLAYER_PROPERTIES.POINTS, { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		scoreText.anchor.x = 0;
		scoreText.anchor.y = 0.5;
		scoreText.fixedToCamera = true;
		
		pickupText = game.add.text(400, 510, '', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
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
		
		gemgroup = game.add.group();
		gemgroup.enableBody = true;
		
		thisloot = null;
		
		// weapon cooldown
		nextFire = 0;
		
		
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
		endfloor = false;
		
		completedrooms = [];
		
		currentwalls = game.add.group();
		currentwalls.enableBody = true;
		
		weaponoffset = -3;
		weapon = game.add.sprite(posX, posY + weaponoffset, GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
		weapon.anchor.set(0.5);
		game.physics.arcade.enable(weapon);
		
		// for melee weapons
		isslashing = false;
		slashframe = 0;
		
		
		weaponback = game.add.sprite(760, 520, "weapon_ui");
		weaponback.anchor.set(0.5);
		weaponback.scale.set(2.5);
		weaponback.fixedToCamera = true;
		game.physics.arcade.enable(weaponback);
		
		// Icons for the two weapons in the bottom right screen
		var weaponsprite = GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON);
		weaponicon = game.add.sprite(760, 560, weaponsprite);
		weaponicon.anchor.set(0.5);
		weaponicon.scale.set(1.5);
		weaponicon.fixedToCamera = true;
		game.physics.arcade.enable(weaponicon);
		
		var weaponsprite2;
		if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1){
			weaponsprite2 = GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_2);
		} else {
			weaponsprite2 = GetWeaponSprite(PLAYER_PROPERTIES.WEAPON_1);
		}
		
		weaponicon2 = game.add.sprite(760, 480, weaponsprite2);
		weaponicon2.anchor.set(0.5);
		weaponicon2.scale.set(1.2);
		weaponicon2.alpha = 0.5;
		weaponicon2.fixedToCamera = true;
		game.physics.arcade.enable(weaponicon2);
		
		inbossroom = false;
		stairs = null;
		// the border of darkness around the player.
		shader = game.add.sprite(posX, posY, 'shader');
		game.physics.arcade.enable(shader);
		shader.x = 0;
		shader.y = 0;
		shader.fixedToCamera = true;
		
		bosscomplete = false;
		
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
		if(difficulty<2){
			map = new Map();
		}
		
		pickupcooldown = 0;
		document.body.style.cursor = "none";
		crossHair = game.add.image(game.input.mousePointer.x+game.camera.x,game.input.mousePointer.y+game.camera.y,'crosshair');
		crossHair.scale.set(0.5);
		crossHair.anchor.set(0.5);
		crossHair.alpha = 0.9;

		
		// music/sound variables
		roommusic = game.add.audio('Doomed Romance', 1, true);
		bossmusic = game.add.audio('Maelstrom', 1, true);
		
		stepfx = game.add.audio('player_step', 1, true);
		whooshfx = game.add.audio('whoosh', 1, false);
		rangedhitfx = game.add.audio('ranged_hit', 0.1, false);
		enemyspitfx = game.add.audio('enemy_spit', 1, false);
		crossbowfx = game.add.audio('crossbow_shoot', 0.75, false);
		bowfx = game.add.audio('bow_shoot', 1, false);
		doorslamfx = game.add.audio('door_slam', 0.75, false);
		lightdoorslamfx = game.add.audio('door_slam', 0.25, false);
		
		var gruntvolume = 0.5;
		gruntfx1 = game.add.audio('grunt1', gruntvolume, false);
		gruntfx2 = game.add.audio('grunt2', gruntvolume, false);
		gruntfx3 = game.add.audio('grunt3', gruntvolume, false);
		gruntfx4 = game.add.audio('grunt4', gruntvolume, false);
		gruntfx5 = game.add.audio('grunt5', gruntvolume, false);
		
		gemfx = game.add.audio('gem', 0.5, false);
		enemyhitfx = game.add.audio('enemy_hit', 0.5, false);
		stingerfx = game.add.audio('stinger', 1, false);
		
		bossgrowlfx = game.add.audio('boss_growl', 1.5, false);
		rangedenemyhitfx = game.add.audio('ranged_enemy_hit', 0.5, false);
		magicfx = game.add.audio('magic_orb', 5, false);
		bossaurafx = game.add.audio('boss_aura', 2, true);
		
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
		
		// turn on debug options with P
		if(game.input.keyboard.isDown(Phaser.Keyboard.P) || DEBUG_ENABLED == true){
			DEBUG_ENABLED = true;
			Debug();
		}
		
		
		
		
		// base player physics
		var playerHitWall = game.physics.arcade.collide(player, walls);
		var playerHitCurrentWall = game.physics.arcade.collide(player, currentwalls);
		
		
		var bounds = PlayerInBounds(player.body.x, player.body.y); // returns the room number that the player is in.
		if (bounds != -1 && currentroom == null) {
			currentroom = bounds;
			MakeBounds(bounds); // creates a border around the room, acting like a door, normally.
			completedrooms.push(bounds);
			lastroombounds = mainrooms[bounds];
			
			var temp = 0;
			var enemyspawns = game.rnd.integerInRange(2, 3);
			roomenemies = enemyspawns;
			for (var i = 0; i < enemyspawns; i++){ // spawns in enemies
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
		} else if (PlayerInBoss(player.body.x, player.body.y) == true && currentroom == null) { // spawns in boss
			if (inbossroom == false) {
				inbossroom = true
				MakeBossBounds();
				boss = new Boss(game, bosscoords[0], bosscoords[1], "turret", false, 'boss', 'boss1');
				
				doorslamfx.play();
				
				mainmusic.pause();
				bossmusic.play();
				
				bossgrowlfx.play();
				bossaurafx.play();
			}
		}
		
		if (bosscomplete == true) {
			bossmusic.stop();
			mainmusic.resume();
			bossaurafx.stop();
			
			stairs_img = game.add.sprite(bossroom[0], bossroom[1], 'stairs');
			stairs_img.anchor.set(0.5);
			
			stairs = game.add.sprite(bossroom[0], bossroom[1], 'blank');
			stairs.anchor.set(0.5);
			stairs.scale.set(1.5);
			
			game.physics.arcade.enable(stairs);
		}
		
		
		if (currentroom != null){ // handles loot and removes walls
			if (roomenemies == 0){
				currentwalls.removeAll();
				currentroom = null;
				
				var chance = game.rnd.integerInRange(1, 2);
				if (PLAYER_PROPERTIES.FLOOR < 2 && chance != 0){ 
					
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.A.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					
					if (thisloot != null){
						thisloot.item.kill();
						thisloot.item.destroy();
						
						thisloot.shadow.kill();
						thisloot.shadow.destroy();
						
						thisloot = null;
					}
					
					thisloot = new Loot(lootX, lootY, FLOOR_WEAPONS.A[rand]);
					
				} else if (chance != 0){
					
					var rand = game.rnd.integerInRange(0, FLOOR_WEAPONS.B.length-1);
					var lootX = lastroombounds[0];
					var lootY = lastroombounds[1];
					
					if (thisloot != null){
						thisloot.item.kill();
						thisloot.item.destroy();
						
						thisloot.shadow.kill();
						thisloot.shadow.destroy();
						
						thisloot = null;
					}
					
					thisloot = new Loot(lootX, lootY, FLOOR_WEAPONS.B[rand]);
					
				}
				
				lightdoorslamfx.play();
				roommusic.stop();
				mainmusic.resume();
			}
		}
		
		
		// extremely basic state handling
		if (PLAYER_PROPERTIES.HEALTH <= 0) {
			//music.stop();
			document.body.style.cursor = "default";
			game.state.start('GameOver', true, true);
		}
		
		// advances player to next floor
		if (stairs != null){
			var stairsTouch = game.physics.arcade.collide(player, stairs);
			if (stairsTouch == true && endfloor == false){
				endfloor = true;
				currentroom = null;
				
				PLAYER_PROPERTIES.FLOOR += 1;
				music.stop();
				if (PLAYER_PROPERTIES.FLOOR != 4){
					document.body.style.cursor = "default";
					game.state.start('Transition', true, true);
				} else {
					document.body.style.cursor = "default";
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
								
								if (bullet.type == "Wooden Crossbow" || bullet.type == "Short Bow" || bullet.type == "Composite Crossbow"){
									rangedenemyhitfx.play();
								} else {
									enemyhitfx.play();
								}
								
								bullet.kill();
								bullet.destroy();
							
								// enemy is damaged, delete enemy if it dies
								enemy.damage = function(dmg) {
									this.health -= bullet.damage;
									if (this.health < 0) {
										if (roomenemies > 0){
											roomenemies--;
										}
										
										SpawnGems(this.gemcount, this.body.x, this.body.y, 1, 20);
										
										this.kill();
										this.destroy();
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
					}
				}
			}, this);
			
			
			
			var slash = playerslash;
			
				if (slash != null){
					var hitbool = false;
					
					for (var k = 0; k < slash.hitboxes.length; k++){
						var box = slash.hitboxes[k];
						
						enemygroup.forEach(function(enemy) {
							
							if (enemy != null){
								// check for bullet-enemy collision
								var boxHitEnemy = game.physics.arcade.collide(box, enemy);
								// delete the bullet if it hits an enemy and damage the enemy
								if (boxHitEnemy == true){
									
									hitbool = true;
									enemyhitfx.play();
									
									// enemy is damaged, delete enemy if it dies
									enemy.damage = function(dmg) {
										this.health -= slash.damage;
										if (this.health < 0) {
											if (roomenemies > 0){
												roomenemies--;
											}
											
											SpawnGems(this.gemcount, this.body.x, this.body.y, 1, 20);
											
											this.kill();
											this.destroy();
											
										}
									}
									enemy.damage(slash.damage);
									
								}
							}
						}, this);
					}
					
					if (hitbool == true){
						for (var k = 0; k < slash.hitboxes.length; k++){
							var box = slash.hitboxes[k];
							box.kill();
							box.destroy();
						}
						slash.mainslash.kill();
						slash.mainslash.destroy();
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
			
		}
		
		ProjectileCheck();
		
		// gives a cool down for weapon pick ups. Becomes very game breaking otherwise.
		if (pickupcooldown <= 0){
			if (thisloot != null && pickupcooldown <= 0){
				
				if (InRange(player.body.x, player.body.y, thisloot.centerX, thisloot.centerY, 70) == true) {
					pickupText.setText('Press SPACE to pick up ' + thisloot.name);
					
					if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){ // handles weapon pickups
						
						if (thisloot.name == "Ornate Dagger"){
							player.ornateuse = false;
						}
						
						if (PLAYER_PROPERTIES.CURRENT_WEAPON == PLAYER_PROPERTIES.WEAPON_1) {
							PLAYER_PROPERTIES.WEAPON_1 = thisloot.name;
						} else {
							PLAYER_PROPERTIES.WEAPON_2 = thisloot.name;
						}
						
						var lastweapon = GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON);
						
						PLAYER_PROPERTIES.CURRENT_WEAPON = thisloot.name;
						SetWeaponSprite();
						SetFireRate();
						weaponicon.loadTexture(GetWeaponSprite(PLAYER_PROPERTIES.CURRENT_WEAPON));
						
						nextFire = 0;
						isslashing = false;
						slashframe = 0;
						
						pickupText.setText('');
						
						thisloot.item.kill();
						thisloot.item.destroy();
						
						thisloot.shadow.kill();
						thisloot.shadow.destroy();
						
						thisloot = new Loot(player.body.x, player.body.y, lastweapon);
						
						pickupcooldown = 10;
					}
					
				} else {
					pickupText.setText('');
				}
				
			}
		} else {
			pickupcooldown--;
		}
		
		// invincibility frame counter
		if (iframes > 0){
			iframes--;
			
			if (iframes % 2 == 0){
				player.alpha = 1;
			} else {
				player.alpha = 0;
			}
		} else {
			iframes = 0;
		}
		
		// brings all of the text to the top of the screen in the right order.
		shader.bringToTop();
		crossHair.bringToTop();
		
		if(difficulty<2){
			map.pixel.bringToTop();
		}
		
		scoreText.setText('Gems: ' + PLAYER_PROPERTIES.POINTS);
		healthText.setText('Health: ' + PLAYER_PROPERTIES.HEALTH);
		weaponText.setText(PLAYER_PROPERTIES.CURRENT_WEAPON);
		healthText.bringToTop();
		weaponText.bringToTop();
		QText.bringToTop();
		scoreText.bringToTop();
		weaponback.bringToTop();
		weaponicon.bringToTop();
		weaponicon2.bringToTop();
		pickupText.bringToTop();
		
		if (boss != null){
			healthBoss.bringToTop();
		}
	}
}

var NextFloor = function(game) {};
NextFloor.prototype = {
	
	preload: function() {
		console.log('NextFloor: preload');
	},
	
	create: function() {
		console.log('NextFloor: create');

		// input prompt
		promptText = game.add.text(400, 300, 'Press SPACE to continue.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
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
		

		promptText = game.add.text(400, 280, 'GAME OVER', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '40px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 340, 'Press SPACE to continue.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
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

		// input prompt
		promptText = game.add.text(400, 250, 'You made it through the tomb!', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '30px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 300, 'You collected ' + PLAYER_PROPERTIES.POINTS + ' gems.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		// input prompt
		promptText = game.add.text(400, 350, 'Press SPACE to continue.', { font: MAIN_FONT, fontStyle: MAIN_STYLE, fontSize: '20px', fill: '#ffffff' });
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



