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
function render () {

    game.debug.geom(floor,'#0fffff');

}

var floor;
var groupThing
var showMap;
function Map(){
	for ( var i = 0; i <FLOOR_SIZE/(WALL_SIZE) ; i++ ) {
		map[i] = []; 
	}
	map = MakeMap();
	console.log(mapHeight+" "+mapWidth);
	
	let posX = game.camera.width-(mapWidth*2);
	// let posX = 300;
	let posY = 0;
	//Phaser.Sprite.call(this, game, posX, posY, 'map4');
	pixel = game.add.sprite(posX, posY, 'map3');
	permX = 0;
	permY = 0;
	for(var i=0;i<mapHeight;i++){
		for(var j=0;j<mapWidth;j++){
			posX = permX+(2*j);
			posY = permY;
			if(map[j][i]=="0"){
				pixels = pixel.addChild(game.make.sprite(posX, posY,"map1"));
			}
		}
		permY += 2;
	}
	pixel.fixedToCamera = true;
	pixel.bringToTop();
	console.log(player.x+" playa "+player.y);
	//game.add.existing(this);
	
}

var lastPlayerPostionX;
var lastPlayerPostionY;
function unchangedPositionX(){
	playerX = player.body.x;
	let truth = false;
	if(playerX==lastPlayerPostionX){
		truth = true;
	}else{
		truth = false;
	}
	lastPlayerPostionX = playerX;
	return truth;
}
function unchangedPositionY(){
	playerY = player.body.y;
	let truth = false;
	if(playerY==lastPlayerPostionY){
		truth = true;
	}else{
		truth = false;
	}
	lastPlayerPostionY = playerY;
	return truth;
}

Map.prototype = Object.create(Phaser.Sprite.prototype);
Map.prototype.constructor = Map;



Map.prototype.update = function() {
	
}