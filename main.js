// Random dungeon generator for Phaser
// main.js

var game = new Phaser.Game(800, 600, Phaser.AUTO);


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
	CURRENT_WEAPON: "default",
};

// enemy class
function Enemy(posX, posY, type, roomtoggle){
	console.log("create enemy at: " + posX + ", " + posY);
	this.type = type;
	this.room = roomtoggle;
	
	// check enemy type
	if (type == "default"){
		this.health = 3;
		this.nextfire = 4;
		this.firecooldown = 1;
		this.walkspeed = 100;
		this.seekrange = 400;
		this.model = enemygroup.create(posX, posY, 'enemy_atlas', 'enemyidle1');
	}
}

// player projectile class
function PlayerProjectile(posX, posY, type){
	this.type = type;
	
	if (type == "default"){
		this.speed = 600;
		this.damage = 1;
		this.model = playerprojectiles.create(posX, posY, 'character_atlas', 'projectile1');
		this.model.anchor.x = 0.5;
		this.model.anchor.y = 0.5;
		this.model.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
	}
}
		
// player slash class
function PlayerSlash(posX, posY, type){
	this.type = type;
	var hitboxes = [];
	
	if (type == "melee"){
		var angle = game.physics.arcade.angleToPointer(player);

		var slash = game.add.sprite(player.body.x+(Math.cos(angle)*40)+16, player.body.y+(Math.sin(angle)*40)+16 , 'character_atlas', 'slash');
		slash.anchor.x = 0.5;
		slash.anchor.y = 0.5;
		slash.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI/2);
		this.mainslash = slash

		var hitboxDist = 50
		var increment = 0.4
		for (var i = 0; i < 5; i++){
			var newSlash = game.add.sprite(player.body.x+(Math.cos(angle+increment*(i-2))*hitboxDist)+16, player.body.y+(Math.sin(angle+increment*(i-2))*hitboxDist)+16, 'character_atlas', 'projectile2');
			game.physics.arcade.enable(newSlash);
			newSlash.anchor.x = 0.5;
			newSlash.anchor.y = 0.5;
			hitboxes[hitboxes.length] = newSlash;
		}
		
		this.duration = 5;
		this.damage = 1;
	}
	this.hitboxes = hitboxes;
}

// enemy projectile class
function EnemyProjectile(posX, posY, playerX, playerY, type){
	this.type = type;
	
	if (type == "default"){
		this.speed = 200;
		this.damage = 1;
		this.model = enemyprojectiles.create(posX, posY, 'enemy_atlas', 'projectile1');
		
		var angle = game.math.angleBetween(posX, posY, playerX, playerY);
		this.model.rotation = angle;
	}
}

// helper function
function InRange(x1, y1, x2, y2, range){
	var diff = game.math.distance(x1, y1, x2, y2);
	if (diff < range){
		return true;
	}
	return false;
}
		
		


var TitleScreen = function(game) {};
TitleScreen.prototype = {
	
	preload: function() {
		console.log('TitleScreen: preload');
	},
	
	create: function() {
		console.log('TitleScreen: create');
		
		// testing state text
		stateText = game.add.text(20, 20, 'TitleScreen', { fontSize: '20px', fill: '#ffffff' });
		
		// input prompt
		promptText = game.add.text(400, 300, 'Press SPACE to begin.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
	},
	
	update: function() {
		// shift to main game state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
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
		game.load.atlas('character_atlas', 'assets/img/player8_atlas.png', 'assets/img/player8_sprites.json');
		game.load.atlas('enemy_atlas', 'assets/img/enemy8_atlas.png', 'assets/img/enemy8_sprites.json');
		game.load.atlas('tile_atlas', 'assets/img/tile_atlas.png', 'assets/img/tile_sprites.json');
		game.load.atlas('tile_overlay', 'assets/img/tile_overlay.png', 'assets/img/overlay_glyphs.json');
		//game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
	},
	
	// generate the dungeon floor and spawn entities
	create: function() {
		console.log('DungeonFloor: create');
		
		game.world.setBounds(0, 0, FLOOR_SIZE, FLOOR_SIZE);

		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		
		// create necessary groups and arrays for storing data and entities of the dungeon
		walls = game.add.group();
		walls.enableBody = true;

		rooms = [];
		mainrooms = [];
		bossroom = null;
		
		points = [];
		enemies = [];
		bosscoords = [];
		playercoords = [];
		treasure = [];
		
		
		// DUNGEON GENERATION
		// Dungeon generation methods, in the order that they are accessed: SpawnDungeon(), Shuffle(), MakeRoom(), MakePath(), MakeWalls(), InBounds()
		// SpawnDungeon() determines the general layout of a dungeon while applying significant randomization.
		// Shuffle() is a helper function that simply shuffles an array.
		// MakeRoom() stores room values generated by SpawnDungeon().
		// MakePath() calls MakeRoom() but shapes rooms in a hallway formation.
		// MakeWalls() actually builds the walls by placing sprites in the way we ask it to.
		// InBounds() is an important helper function that determines what kind of tile should be drawn.
		
		
		// MakeRoom()
		// stores all room values as subarrays in rooms[]. InBounds() will later check for these values.
		// anything that can be initialized in a certain type of room will check for roomtype and save
		// -the coordinates for where that entity should spawn, which can be accessed later.
		function MakeRoom(x, y, width, height, roomtype){
			rooms[rooms.length] = [x, y, width, height];
			
			if (roomtype == "normal"){
				mainrooms[mainrooms.length] = [x, y, width, height];
				
			}
	
			if (roomtype == "start") { // save player coordinates.
				playercoords = [x, y];
			}
			
			/*
			if (roomtype == "normal") { // chance of spawning an arbitrary enemy in the middle of a room.
				var temp = game.rnd.integerInRange(0, 1);
				if (temp == 0) {
					enemies[enemies.length] = [x, y];
				}
			}
			*/
	
			if (roomtype == "hall") { // chance of spawning an arbitrary enemy in a hallway segment.
				enemies[enemies.length] = [x, y];
				
			}
			
			
	
			if (roomtype == "boss") { // save boss coordinates.
				bosscoords = [x, y];
				bossroom = [x, y, width, height];
			}
			
			/*
			if (roomtype == "normal") { // chance of spawning teasure slightly off from the center of a room.
				var temp = game.rnd.integerInRange(0, 4);
				if (temp < 2) {
					var randomX = game.rnd.integerInRange(0, 1);
					var randomY = game.rnd.integerInRange(0, 1);
					treasure[treasure.length] = [x + (randomX-0.5)*(WALL_SIZE*2), y + (randomY-0.5)*(WALL_SIZE*2)];
				}
			}
			*/
		}
		
		// MakePath()
		// creates 2 narrow rooms that connect (x1,y1) and (x2,y), resembling hallways.
		// pathtype determines which side the path will appear on, spawnenemy determines if an enemy can spawn inside it.
		function MakePath(x1, y1, x2, y2, pathtype, spawnenemy){
			var halltype = "hall";
			
			// bypass enemy spawning in hallway directly adjacent from spawn
			
			var avgX = (x1+x2)/2;
			var diffX = game.math.difference(x1, x2);
			
			// spawn first hallway segment (in one of two directions)
			if (pathtype == "in") {
				if (spawnenemy == false) {
					halltype = "cleanhall";
				}
				MakeRoom(avgX, y1, (diffX) + PATH_WIDTH, PATH_WIDTH, halltype);
			} else if (pathtype == "out") {
				MakeRoom(avgX, y2, (diffX) + PATH_WIDTH, PATH_WIDTH, halltype)
			}
			
			var halltype = "hall";
	
			var avgY = (y1+y2)/2;
			var diffY = game.math.difference(y1, y2);
			
			// spawn second hallway segment (in one of two directions)
			if (pathtype == "in") {
				MakeRoom(x2, avgY, PATH_WIDTH, (diffY) + PATH_WIDTH, halltype);
			} else if (pathtype == "out") {
				if (spawnenemy == false) {
					halltype = "cleanhall";
				}
				MakeRoom(x1, avgY, PATH_WIDTH, (diffY) + PATH_WIDTH, halltype);
			}
		}
		
		// InBounds()
		// checks if the (x,y) pair exists in a room, a wall, or a ledge and returns a status.
		function InBounds(x,y){
			var tilestatus = "wall";
			var OOBcount = 0;
			for (var i = 0; i < rooms.length; i++) { // check the bounds of all rooms
				var boundX1 = rooms[i][0] - (rooms[i][2]/2);
				var boundX2 = rooms[i][0] + (rooms[i][2]/2);
				var boundY1 = rooms[i][1] - (rooms[i][3]/2);
				var boundY2 = rooms[i][1] + (rooms[i][3]/2);
				var extrabound = boundY1 - WALL_SIZE; // designate a small space above a room where a ledge can be placed
				
				if ((x <= boundX1 - (WALL_SIZE)) || (x > boundX2 + (WALL_SIZE)) || (y <= boundY1 - (WALL_SIZE)) || (y > boundY2 + (WALL_SIZE))){
					OOBcount++;
				}
				
				if (x > boundX1 && x <= boundX2) {
					if (y > extrabound && y <= boundY1 && tilestatus != "air") {
						tilestatus = "ledge";
					}
					if (y > boundY1 && y <= boundY2) {
						tilestatus = "air";
					}
				}
			}
			
			// out of bounds
			if (OOBcount == rooms.length){
				tilestatus = "OOB";
			}
			
			return tilestatus;
		}
		
		// MakeWalls()
		// places tiles across the map space. essentially a grid full of squares carved out by checking InBounds().
		// the status returned by InBounds() indicates what kind of sprite should be placed.
		function MakeWalls(){
			for (var i = WALL_SIZE/2; i <= FLOOR_SIZE-(WALL_SIZE/2); i += WALL_SIZE) {
				for (var j = WALL_SIZE/2; j <= FLOOR_SIZE-(WALL_SIZE/2); j += WALL_SIZE) {
					var tilestatus = InBounds(i,j);
					
					// tile sprites by: asalga (Andor Salga) and gtkampos from opengameart.org
					
					if (tilestatus == "wall") {
						var tile = walls.create(i, j, 'tile_atlas', 'wall'); // spawn a wall
						tile.body.immovable = true;
						tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
						tile.anchor.x = 0.5;
						tile.anchor.y = 0.5;
					} else if (tilestatus == "ledge") {
						var tile = walls.create(i, j, 'tile_atlas', 'ledge'); // spawn a ledge
						tile.body.immovable = true;
						tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
						tile.anchor.x = 0.5;
						tile.anchor.y = 0.5;
					} else if (tilestatus == "air")  { // if status == "air"
						var tile = game.add.sprite(i, j, 'tile_atlas', 'floor1'); // spawn a floor tile
						tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
						tile.anchor.x = 0.5;
						tile.anchor.y = 0.5;
						
						var rand = game.rnd.integerInRange(0, 12);
						if (rand == 0) {
							var overlay = game.add.sprite(i, j, 'tile_overlay', 'glyph1'); // spawn glyph
							overlay.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
							overlay.anchor.x = 0.5;
							overlay.anchor.y = 0.5;
						} else if (rand == 1) {
							var overlay = game.add.sprite(i, j, 'tile_overlay', 'glyph2'); // spawn glyph
							overlay.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
							overlay.anchor.x = 0.5;
							overlay.anchor.y = 0.5;
						} else if (rand == 2) {
							var overlay = game.add.sprite(i, j, 'tile_overlay', 'glyph3'); // spawn glyph
							overlay.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
							overlay.anchor.x = 0.5;
							overlay.anchor.y = 0.5;
						} else if (rand == 3) {
							var overlay = game.add.sprite(i, j, 'tile_overlay', 'glyph4'); // spawn glyph
							overlay.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
							overlay.anchor.x = 0.5;
							overlay.anchor.y = 0.5;
						}
						
						
					} else if (tilestatus == "OOB") {
						var tile = game.add.sprite(i, j, 'tile_atlas', 'wall'); // spawn a wall
						tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
						tile.anchor.x = 0.5;
						tile.anchor.y = 0.5;
					}
					
				}
			}
		}
		
		// Shuffle()
		// shuffles elements of an array.
		function Shuffle(t){
			var n = t.length-1;
			while (n >= 0) {
				var k = game.rnd.integerInRange(0, n);
				var temp = t[n];
				t[n] = t[k];
				t[k] = temp;
				n--;
			}
			return t;
		}
		
		// SpawnDungeon()
		// determines the general layout of the dungeon and spawns rooms and paths with SpawnRoom() and SpawnPath().
		// room positions are determined by shuffling arrays of X and Y vertices using Shuffle()
		// room information is stored in points[i], which can be referred to as the centerpoints of rooms or the
		// -endpoints of paths. both are drawn out using the same set of points, with a bit of randomness varience.
		function SpawnDungeon(){
			var pointnum = game.rnd.integerInRange(6, 8);
			var groupx = [];
			var groupy = [];
			
			// initialize default point values
			for (var i = 0; i < pointnum; i++) {
				groupx[i] = i;
				groupy[i] = i;
			}
			
			// shuffle point values
			groupx = Shuffle(groupx);
			groupy = Shuffle(groupy);

			// store room values in points[]
			for (var i = 0; i < pointnum; i++) {
				var pointX = (FLOOR_SIZE*((groupx[i]+1)/(pointnum+1))) + game.rnd.integerInRange(-WALL_SIZE/4, WALL_SIZE/4);
				var pointY = (FLOOR_SIZE*((groupy[i]+1)/(pointnum+1))) + game.rnd.integerInRange(-WALL_SIZE/4, WALL_SIZE/4);
				points[i] = [pointX, pointY];
			}
			
			// spawn rooms 1 to i-1. the last room is special, so it is added outside of the loop.
			for (var i = 0; i < pointnum-1; i++) {
				// spawn room.
				if (i == 0) {
					MakeRoom(points[i][0], points[i][1], START_ROOM*WALL_SIZE, START_ROOM*WALL_SIZE, "start");
				} else {
					MakeRoom(points[i][0], points[i][1], game.rnd.integerInRange(ROOM_MIN*WALL_SIZE, ROOM_MAX*WALL_SIZE), game.rnd.integerInRange(ROOM_MIN*WALL_SIZE, ROOM_MAX*WALL_SIZE), "normal");
				}
				
				// prevent enemy spawning in the first path that is always adjacent to the spawn.
				var makeenemy = true;
				if (i == 0) {
					makeenemy = false;
				}
				
				// spawn a path that goes from the current room to the next one.
				var temp = game.rnd.integerInRange(0, 1);
				if (temp == 0) {
					MakePath(points[i][0], points[i][1], points[i+1][0], points[i+1][1], "in", makeenemy);
				} else {
					MakePath(points[i][0], points[i][1], points[i+1][0], points[i+1][1], "out", makeenemy);
				}
			}
			
			// spawn the boss room (this is special because no path needs to continue from it, and it spawns a boss.)
			MakeRoom(points[pointnum-1][0], points[pointnum-1][1], BOSS_ROOM*WALL_SIZE, BOSS_ROOM*WALL_SIZE, "boss");
			
			// draw the physical wall sprites.
			MakeWalls();
		}
		
		SpawnDungeon(); // this all the work of dungeon generation.
		
		
		
		
		
		// spawn the player, who has been given a spawn location by SpawnDungeon().
		var posX = playercoords[0];
		var posY = playercoords[1];
		posX = posX - (posX % WALL_SIZE) + (WALL_SIZE/2);
		posY = posY - (posY % WALL_SIZE) + (WALL_SIZE/2);
		
		player = game.add.sprite(posX, posY, 'character_atlas');
		
		// NOTE: phaser does not warn you if you try to use an animation that doesn't exist (such as having a typo in the name)
		player.animations.add('idle', Phaser.Animation.generateFrameNames('playeridle', 1, 2), 5, true);
		player.animations.add('walkup', Phaser.Animation.generateFrameNames('playerup', 1, 2), 5, true);
		player.animations.add('walkright', Phaser.Animation.generateFrameNames('playerright', 1, 2), 5, true);
		player.animations.add('walkleft', Phaser.Animation.generateFrameNames('playerleft', 1, 2), 5, true);
		player.animations.add('walkdown', Phaser.Animation.generateFrameNames('playerdown', 1, 2), 5, true);
		player.animations.add('walkupleft', Phaser.Animation.generateFrameNames('playerupleft', 1, 2), 5, true);
		player.animations.add('walkupright', Phaser.Animation.generateFrameNames('playerupright', 1, 2), 5, true);
		player.animations.add('walkdownleft', Phaser.Animation.generateFrameNames('playerdownleft', 1, 2), 5, true);
		player.animations.add('walkdownright', Phaser.Animation.generateFrameNames('playerdownright', 1, 2), 5, true);
		
		direction = "";
		
		game.physics.arcade.enable(player);
		player.body.setSize(32, 32, 0, 0);
		//player.scale.setTo(0.5, 0.5);
		player.anchor.x = 0.5;
		player.anchor.y = 0.5;
		
		// lock the camera to the player
		game.camera.follow(player);
		
		// invincibility frames
		iframes = 0;
		
		
		
		// testing state text
		stateText = game.add.text(20, 20, 'DungeonFloor', { fontSize: '20px', fill: '#ffffff' });
		stateText.fixedToCamera = true;
		
		healthText = game.add.text(400, 550, 'Health: ' + PLAYER_PROPERTIES.HEALTH, { fontSize: '20px', fill: '#ffffff' });
		healthText.anchor.x = 0.5;
		healthText.anchor.y = 0.5;
		healthText.fixedToCamera = true;
		
		weaponText = game.add.text(650, 550, 'Weapon: ' + PLAYER_PROPERTIES.CURRENT_WEAPON, { fontSize: '20px', fill: '#ffffff' });
		weaponText.anchor.x = 0.5;
		weaponText.anchor.y = 0.5;
		weaponText.fixedToCamera = true;
		
		roomText = game.add.text(150, 550, '', { fontSize: '20px', fill: '#ffffff' });
		roomText.anchor.x = 0.5;
		roomText.anchor.y = 0.5;
		roomText.fixedToCamera = true;
		
		
		
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
			enemytable[enemytable.length] = new Enemy(enemies[i][0], enemies[i][1], "default", false);
		}
		
		playerbullettable = [];
		playerslashtable = [];
		enemybullettable = [];
		
		weaponswitch = 0;
		
		currentroom = null;
		roomenemycount = 0;
		completedrooms = [];
		
		currentwalls = game.add.group();
		currentwalls.enableBody = true;
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
		
		
		
		
		
		function PlayerInBounds(x,y){
			for (var i = 0; i < mainrooms.length; i++) { // check the bounds of all rooms
				var skip = false;
				for (var j = 0; j < completedrooms.length; j++){
					if (i == completedrooms[j]) {
						skip = true;
					}
				}
				if (skip == false){
					var boundX1 = mainrooms[i][0] - (mainrooms[i][2]/2);
					var boundX2 = mainrooms[i][0] + (mainrooms[i][2]/2);
					var boundY1 = mainrooms[i][1] - (mainrooms[i][3]/2);
					var boundY2 = mainrooms[i][1] + (mainrooms[i][3]/2);
					
					if (x > boundX1 && x <= boundX2) {
						if (y > boundY1 && y <= boundY2) {
							return i;
						}
					}
				}
			}
			return -1;
		}
		
		function PlayerInBoss(x,y){
			var boundX1 = bossroom[0] - (bossroom[2]/2);
			var boundX2 = bossroom[0] + (bossroom[2]/2);
			var boundY1 = bossroom[1] - (bossroom[3]/2);
			var boundY2 = bossroom[1] + (bossroom[3]/2);
				
			if (x > boundX1 && x <= boundX2) {
				if (y > boundY1 && y <= boundY2) {
					return true;
				}
			}
			return false;
		}
		
		function MakeBounds(num){
			var roombounds = mainrooms[num];
			var boundX1 = roombounds[0] - (roombounds[2]/2);
			var boundX2 = roombounds[0] + (roombounds[2]/2);
			var boundY1 = roombounds[1] - (roombounds[3]/2);
			var boundY2 = roombounds[1] + (roombounds[3]/2);
			
			// create upper wall
			for (var i = boundX1 - (WALL_SIZE/2); i <= boundX2 + (WALL_SIZE/2); i += WALL_SIZE){
				var tileX = i;
				var tileY = boundY1 - (WALL_SIZE/2);
				var tile = currentwalls.create(tileX - (tileX % WALL_SIZE) + (WALL_SIZE/2), tileY - (tileY % WALL_SIZE) + (WALL_SIZE/2), 'tile_atlas', 'ledge'); // spawn a wall
				
				tile.body.immovable = true;
				tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
				tile.anchor.x = 0.5;
				tile.anchor.y = 0.5;
			}
			// create lower wall
			for (var i = boundX1 - (WALL_SIZE/2); i <= boundX2 + (WALL_SIZE/2); i += WALL_SIZE){
				var tileX = i;
				var tileY = boundY2 + (WALL_SIZE/2);
				var tile = currentwalls.create(tileX - (tileX % WALL_SIZE) + (WALL_SIZE/2), tileY - (tileY % WALL_SIZE) + (WALL_SIZE/2), 'tile_atlas', 'wall'); // spawn a wall
				
				tile.body.immovable = true;
				tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
				tile.anchor.x = 0.5;
				tile.anchor.y = 0.5;
			}
			// create left wall
			for (var i = boundY1 - (WALL_SIZE/2); i <= boundY2 + (WALL_SIZE/2); i += WALL_SIZE){
				var tileX = boundX1 - (WALL_SIZE/2);
				var tileY = i;
				var tile = currentwalls.create(tileX - (tileX % WALL_SIZE) + (WALL_SIZE/2), tileY - (tileY % WALL_SIZE) + (WALL_SIZE/2), 'tile_atlas', 'wall'); // spawn a wall
				
				tile.body.immovable = true;
				tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
				tile.anchor.x = 0.5;
				tile.anchor.y = 0.5;
			}
			// create right wall
			for (var i = boundY1 - (WALL_SIZE/2); i <= boundY2 + (WALL_SIZE/2); i += WALL_SIZE){
				var tileX = boundX2 + (WALL_SIZE/2);
				var tileY = i;
				var tile = currentwalls.create(tileX - (tileX % WALL_SIZE) + (WALL_SIZE/2), tileY - (tileY % WALL_SIZE) + (WALL_SIZE/2), 'tile_atlas', 'wall'); // spawn a wall
				
				tile.body.immovable = true;
				tile.scale.setTo(WALL_SIZE/64, WALL_SIZE/64);
				tile.anchor.x = 0.5;
				tile.anchor.y = 0.5;
			}
		}
		
		var bounds = PlayerInBounds(player.body.x, player.body.y);
		if (bounds != -1 && currentroom == null) {
			currentroom = bounds;
			MakeBounds(bounds);
			completedrooms[completedrooms.length] = bounds;
			
			var temp = 0;
			var enemyspawns = game.rnd.integerInRange(2, 3);
			for (var i = 0; i < enemyspawns; i++){
				var roombounds = mainrooms[bounds];
				var posX = roombounds[0] + game.rnd.integerInRange((-roombounds[2]/2)+1, (roombounds[2]/2)-1);
				var posY = roombounds[1] + game.rnd.integerInRange((-roombounds[3]/2)+1, (roombounds[3]/2)-1);
				enemytable[enemytable.length] = new Enemy(posX, posY, "default", true);
				temp++;
			}
			roomenemycount = temp;
			
		} else if (PlayerInBoss(player.body.x, player.body.y) == true && currentroom == null) {
			roomText.setText('In a boss room');
		} else if (currentroom != null){
			roomText.setText('In a normal room: ' + currentroom);
		} else {
			roomText.setText('');
		}
		
		if (currentroom != null){
			if (roomenemycount == 0){
				currentwalls.removeAll();
				currentroom = null;
			}
		}
		
		
		// extremely basic state handling
		if (PLAYER_PROPERTIES.HEALTH <= 0) {
			game.state.start('GameOver', true, true);
		}
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
			if (PlayerInBoss(player.body.x, player.body.y) == true){
				game.state.start('NextFloor', true, true);
			}
		}
		
		if (weaponswitch > 0) { weaponswitch--; }
		if (game.input.keyboard.isDown(Phaser.Keyboard.Q) && weaponswitch < 1) {
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == "default") {
				PLAYER_PROPERTIES.CURRENT_WEAPON = "melee";
				console.log(PLAYER_PROPERTIES.CURRENT_WEAPON);
				
			} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "melee") {
				PLAYER_PROPERTIES.CURRENT_WEAPON = "default";
				console.log(PLAYER_PROPERTIES.CURRENT_WEAPON);
			}
			weaponswitch = 20;
		}
		
		healthText.setText('Health: ' + PLAYER_PROPERTIES.HEALTH);
		
		weaponText.setText('Weapon: ' + PLAYER_PROPERTIES.CURRENT_WEAPON);
		
		
		// function used for 8-directional player movement
		function PlayerMovement(){
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
			
			// run with SHIFT
			var RUNBOOL = false;
			if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
				RUNBOOL = true;
			}
		
			// toggle run speed
			var velocity = WALK_SPEED;
			if (RUNBOOL == true){
				velocity = RUN_SPEED;
			}
			
			direction1 = "";
			direction2 = "";
			
			if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				// Move left
				player.body.velocity.x = -velocity;
				direction2 = direction1;
				direction1 = "left";
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				// Move right
				player.body.velocity.x = velocity;
				direction2 = direction1;
				direction1 = "right";
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				// Move up
				player.body.velocity.y = -velocity;
				direction2 = direction1;
				direction1 = "up";
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				// Move down
				player.body.velocity.y = velocity;
				direction2 = direction1;
				direction1 = "down";
			}
		
			// negate opposite inputs
			if ((direction1 == "left" && direction2 == "right") || (direction1 == "right" && direction2 == "left")){
				direction2 = "";
			}
			if ((direction1 == "up" && direction2 == "down") || (direction1 == "down" && direction2 == "up")){
				direction2 = "";
			}
			
			if (direction1 == "" && direction2 == ""){
				// Play idle animation
				player.animations.play('idle');
			} else if (direction1 == "left" && direction2 == ""){
				// Play left animation
				player.animations.play('walkleft');
			} else if (direction1 == "right" && direction2 == ""){
				// Play right animation
				player.animations.play('walkright');
			} else if (direction1 == "up" && direction2 == ""){
				// Play up animation
				player.animations.play('walkup');
			} else if (direction1 == "down" && direction2 == ""){
				// Play down animation
				player.animations.play('walkdown');
			} else if ((direction1 == "left" && direction2 == "up") || (direction1 == "up" && direction2 == "left")){
				// Play up-left animation
				player.animations.play('walkupleft');
			} else if ((direction1 == "right" && direction2 == "up") || (direction1 == "up" && direction2 == "right")){
				// Play up-right animation
				player.animations.play('walkupright');
			} else if ((direction1 == "left" && direction2 == "down") || (direction1 == "down" && direction2 == "left")){
				// Play down-left animation
				player.animations.play('walkdownleft');
			} else if ((direction1 == "right" && direction2 == "down") || (direction1 == "down" && direction2 == "right")){
				// Play down-right animation
				player.animations.play('walkdownright');
			}
		}
		
		PlayerMovement();
		
		
		function MakePlayerSlash(posX, posY, time, type){
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == "melee"){
				var slash = new PlayerSlash(posX, posY, "melee");
				playerslashtable[playerslashtable.length] = slash;
				nextFire = time + 0.2; // this is the bullet rate of the weapon
			}
		}
		
		function MakePlayerBullet(posX, posY, time, type){
			if (PLAYER_PROPERTIES.CURRENT_WEAPON == "default"){
				var bullet = new PlayerProjectile(posX, posY, "default");
				playerbullettable[playerbullettable.length] = bullet;
				nextFire = time + 0.2; // this is the bullet rate of the weapon
				game.physics.arcade.moveToPointer(bullet.model, bullet.speed);
			}
		}
		
		function FireButton(){
			// fire weapon on left mouse click
			if (game.input.activePointer.leftButton.isDown){
				var time = (game.time.now)/1000; 
				// check if you can fire the weapon (based on fire rate)
				if (time > nextFire) {
					// check weapon type
					if (PLAYER_PROPERTIES.CURRENT_WEAPON == "default") {
						MakePlayerBullet(player.body.x + 8, player.body.y + 8, time, "default");
					} else if (PLAYER_PROPERTIES.CURRENT_WEAPON == "melee") {
						MakePlayerSlash(player.body.x + 8, player.body.y + 8, time, "melee");
					}
					// list other weapon types here
				}
			}
		}
		
		FireButton()
		
		
		
		// move enemies
		function EnemyMovement(){
			var time = (game.time.now)/1000;
			for (var i = 0; i < enemytable.length; i++) {
				var enemy = enemytable[i];
				
				if (enemy != null){
					
					// check if player is in range of an enemy
					if (InRange(player.body.x, player.body.y, enemy.model.body.x, enemy.model.body.y, enemy.seekrange) == true) {
						
						// damage player if they hit an enemy and give them invincibility frames (iframes)
						// do not damage the player if they have invincibility frames
						var enemyHitWall = game.physics.arcade.collide(enemy.model, walls);
						var enemyHitCurrentWall = game.physics.arcade.collide(enemy.model, currentwalls);
						
						var playerHitEnemy = game.physics.arcade.collide(player, enemy.model);
						if (playerHitEnemy == true && iframes <= 0){
							PLAYER_PROPERTIES.HEALTH--;
							iframes = 20;
						}
						
						var dirX = game.math.clamp((player.body.x - enemy.model.body.x)/128, -1, 1);
						var dirY = game.math.clamp((player.body.y - enemy.model.body.y)/128, -1, 1);
						
						// how does they enemy move? do they fire a projectile? if so, what kind?
						// enemy type determines actions here.
						if (enemy.type == "default"){
							enemy.model.body.velocity.x = dirX * enemy.walkspeed;
							enemy.model.body.velocity.y = dirY * enemy.walkspeed;
							
							if (time > enemy.nextfire){
								var bullet = new EnemyProjectile(enemy.model.body.x + 8, enemy.model.body.y + 8, player.body.x, player.body.y, "default");
								enemybullettable[enemybullettable.length] = bullet;
								enemy.nextfire = time + enemy.firecooldown; // this is the bullet rate of the weapon

								bullet.model.body.velocity.x = dirX*bullet.speed;
								bullet.model.body.velocity.y = dirY*bullet.speed;
							}
						}
						
						if (enemy.type == "turret"){
							// more types
						}
						
					} else {
						// enemy idle
						enemy.model.body.velocity.x = 0;
						enemy.model.body.velocity.y = 0;
					}
				}
			}
		}
		
		EnemyMovement();
		
		
		
		function ProjectileCheck(){
			// check if any bullet has collided into something
			for (var i = 0; i < playerbullettable.length; i++) {
				var bullet = playerbullettable[i];
				
				if (bullet != null){
					// check for bullet-wall collision
					var bulletHitWall = game.physics.arcade.collide(bullet.model, walls);
					var bulletHitCurrentWall = game.physics.arcade.collide(bullet.model, currentwalls);
					// delete the bullet if it hits a wall
					if (bulletHitWall == true || bulletHitCurrentWall == true){
						bullet.model.kill();
						bullet.model.destroy();
						playerbullettable[i] = null;
					}
				
					// check if any bullet has collided into any enemy
					for (var j = 0; j < enemytable.length; j++) {
						var enemy = enemytable[j];
					
						if (enemy != null){
							// check for bullet-enemy collision
							var bulletHitEnemy = game.physics.arcade.collide(bullet.model, enemy.model);
							// delete the bullet if it hits an enemy and damage the enemy
							if (bulletHitEnemy == true){
								bullet.model.kill();
								bullet.model.destroy();
								playerbullettable[i] = null;
							
								// enemy is damaged, delete enemy if it dies
								enemy.damage = function(dmg) {
									this.health -= dmg;
									if (this.health < 0) {
										this.model.kill();
										this.model.destroy();
										enemytable[j] = null;
										
										if (roomenemycount > 0 && this.room == true){
											roomenemycount--;
										}
									}
								}
								enemy.damage(bullet.damage);
							}
						}
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
								var boxHitEnemy = game.physics.arcade.collide(box, enemy.model);
								// delete the bullet if it hits an enemy and damage the enemy
								if (boxHitEnemy == true){
									
									// enemy is damaged, delete enemy if it dies
									enemy.damage = function(dmg) {
										this.health -= dmg;
										if (this.health < 0) {
											this.model.kill();
											this.model.destroy();
											enemytable[j] = null;
											
											if (roomenemycount > 0){
												roomenemycount--;
											}
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
						playerslashtable[i] = null;
					}
				}
			}
			
			for (var i = 0; i < enemybullettable.length; i++) {
				var bullet = enemybullettable[i];
				
				if (bullet != null){
					// check for bullet-wall collision
					var bulletHitWall = game.physics.arcade.collide(bullet.model, walls);
					var bulletHitCurrentWall = game.physics.arcade.collide(bullet.model, currentwalls);
					// delete the bullet if it hits a wall
					if (bulletHitWall == true || bulletHitCurrentWall == true){
						bullet.model.kill();
						bullet.model.destroy();
						enemybullettable[i] = null;
					}
					
					var bulletHitPlayer = game.physics.arcade.collide(bullet.model, player);
					// delete the bullet if it hits an enemy and damage the enemy
					if (bulletHitPlayer == true){
						bullet.model.kill();
						bullet.model.destroy();
						enemybullettable[i] = null;
						
						// player is damaged
						if (bulletHitPlayer == true && iframes <= 0){	
							PLAYER_PROPERTIES.HEALTH -= bullet.damage;
							iframes = IFRAMES_MAX;
						}
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
		

		// base player physics
		var playerHitWall = game.physics.arcade.collide(player, walls);
		var playerHitCurrentWall = game.physics.arcade.collide(player, currentwalls);
		
		//console.log(game.time.fps);
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
		stateText = game.add.text(20, 20, 'NextFloor', { fontSize: '20px', fill: '#ffffff' });
		
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
		stateText = game.add.text(20, 20, 'GameOver', { fontSize: '20px', fill: '#ffffff' });
		
		// input prompt
		promptText = game.add.text(400, 300, 'Press SPACE to continue.', { fontSize: '20px', fill: '#ffffff' });
		promptText.anchor.x = 0.5;
		promptText.anchor.y = 0.5;
		
		PLAYER_PROPERTIES.HEALTH = 10;
	},
	
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ // or isPressed
			game.state.start('TitleScreen');
		}
	}
	
}


// ... (define other states)

game.state.add('TitleScreen', TitleScreen);
game.state.add('DungeonFloor', DungeonFloor);
game.state.add('NextFloor', NextFloor);
game.state.add('GameOver', GameOver);
// ... (add other states)

game.state.start('TitleScreen');