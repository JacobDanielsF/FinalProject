var mapHeight;
var mapWidth;
function MakeMap(){
	// creating 2D array, because JS is weird.
	var map = [];
	for ( var i = 0; i <FLOOR_SIZE/(WALL_SIZE) ; i++ ) {
		map[i] = []; 
	}
	mapHeight=0;
	for (var i = WALL_SIZE/2; i <= FLOOR_SIZE-(WALL_SIZE/2); i += WALL_SIZE) {
		mapWidth=0;
		for (var j = WALL_SIZE/2; j <= FLOOR_SIZE-(WALL_SIZE/2); j += WALL_SIZE) {
			var tilestatus = InBounds(i,j);
			if (tilestatus == "wall") {
				map[mapHeight][mapWidth] = "0";
			} else if (tilestatus == "ledge") {
				map[mapHeight][mapWidth] = "0";
			} else if (tilestatus == "air")  { 
				map[mapHeight][mapWidth] = "-";
			} else if (tilestatus == "OOB") {
				map[mapHeight][mapWidth] = " ";
			}
			mapWidth++;
		}
		mapHeight++;
	}
	return map;
}
var pixels = [];
function Map(){
	map = MakeMap();
	console.log(mapHeight+" "+mapWidth);
	
	let posX = game.camera.width-(mapWidth*2);
	let posY = 0;
	this.pixel = game.add.sprite(posX, posY, 'map3');
	permX = 0;
	permY = 0;
	let q = 0;
	// Change this to basic (or whatever else) for the previous verion. Change to advanced for new version.
	this.mode = "advanced"
	for(var i=0;i<mapHeight;i++){
		for(var j=0;j<mapWidth;j++){
			posX = permX+(2*j);
			posY = permY;
			if(map[j][i]=="0"){
				pixels[q] = this.pixel.addChild(game.make.sprite(posX, posY,"map1"));
				if(this.mode=="advanced"){
					pixels[q].alpha = 0;
				}
				q++;
				// wallPixelGroup.add(pixels);
			}
		}
		permY += 2;
	}
	Phaser.Sprite.call(this, game, 672, 0, 'map2');
	this.pixel.fixedToCamera = true;
	this.pixel.bringToTop();
	this.fixedToCamera = true;
	game.add.existing(this);
}

Map.prototype = Object.create(Phaser.Sprite.prototype);
Map.prototype.constructor = Map;



Map.prototype.update = function() {
	if(this.mode=="advanced"){
		// Changes the position of the playerDot correctly.
		this.fixedToCamera = false;
		this.x = (player.x/32)+game.camera.width-(mapWidth*2);
		this.y = (player.y-32)/32;
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
