// ARTG/CMPM 120 Final Project
// Tomb of the Ancients
// Map.js
// Methods for displaying the dungeon map

var mapHeight;
var mapWidth;

// returns a 2D array with the tile type of each tile in the dungeon.
function MakeMap(){
	// creating 2D array, because JS is weird.
	var map = [];
	for ( var i = 0; i <FLOOR_SIZE/(WALL_SIZE) ; i++ ) {
		map[i] = []; 
	}
	mapHeight=0;
	// Goes through every point in the dungeon and checks the tile type.
	// It stores those points into a 2D array to be used later.
	for (var i = WALL_SIZE/2; i <= FLOOR_SIZE-(WALL_SIZE/2); i += WALL_SIZE) {
		mapWidth=0;
		for (var j = WALL_SIZE/2; j <= FLOOR_SIZE-(WALL_SIZE/2); j += WALL_SIZE) {
			var tilestatus = InBounds(i,j);
			if (tilestatus == "wall") {
				map[mapHeight][mapWidth] = "0"; // It is actually map[mapWidth][mapHeight]
			} else if (tilestatus == "ledge") {
				map[mapHeight][mapWidth] = "0";
			} else if (tilestatus == "air")  { 
				map[mapHeight][mapWidth] = "-";
			} else if (tilestatus == "OOB") { // OOB stands for out of bounds.
				map[mapHeight][mapWidth] = " ";
			}
			mapWidth++;
		}
		mapHeight++;
	}
	return map;
}
// pixels are the group of wall dots that appear on the map.
var pixels = [];
function Map(){
	map = MakeMap();
	let posX = game.camera.width-(mapWidth*2);
	let posY = 0;
	this.pixel = game.add.sprite(posX, posY, 'map3'); // the background for the map.
	permX = 0;
	permY = 0;
	let q = 0;
	for(var i=0;i<mapHeight;i++){
		for(var j=0;j<mapWidth;j++){
			posX = permX+(2*j);
			posY = permY;
			if(map[j][i]=="0"){
				pixels[q] = this.pixel.addChild(game.make.sprite(posX, posY,"map1"));
				// difficult above 0 is hard or promode.
				if(difficulty>0){
					pixels[q].alpha = 0;
				}
				q++;
				// wallPixelGroup.add(pixels);
			}
		}
		permY += 2;
	}
	
	// this is the player's dot on the screen.
	Phaser.Sprite.call(this, game, 672, 0, 'map2');
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.pixel.fixedToCamera = true;
	this.pixel.bringToTop();
	this.fixedToCamera = true;
	game.add.existing(this);
}

Map.prototype = Object.create(Phaser.Sprite.prototype);
Map.prototype.constructor = Map;



Map.prototype.update = function() {
	// moves the players dot correctly to match where they are in the dungeon.
	if(difficulty==0){
		this.fixedToCamera = false;
		this.x = (player.x/32)+game.camera.width-(mapWidth*2);
		this.y = (player.y+32)/32;
		this.fixedToCamera = true;
	}
	// Does the same as above, but also generates the map in based on where the player is
	// in the dungeon.
	if(difficulty==1){
		// Changes the position of the playerDot correctly.
		this.fixedToCamera = false;
		this.x = (player.x/32) + game.camera.width-(mapWidth*2);
		this.y = (player.y/32);
		this.fixedToCamera = true;
		// Checks to see what walls are in range.
		for(var pixelTest=0;pixelTest<pixels.length;pixelTest++){
			if(  InRange( this.x, this.y, (pixels[pixelTest].x+672), pixels[pixelTest].y, 6)   ){
				pixels[pixelTest].alpha=1;
			}
		}
	}
	this.bringToTop();
}
