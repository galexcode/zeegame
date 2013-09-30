#pragma strict

// Wall pieces
var intersection : Transform;
var bottomLeft : Transform;
var bottomRight : Transform;
var topRight : Transform;
var topLeft : Transform;
var vertical : Transform;
var horizontal : Transform;

private var tiles : Tile[];
private var tileMesh : TileMesh;

function Awake() {
	tileMesh = GetComponent(TileMesh);
}

function Start() {
	var vSizeX = tileMesh.sizeX + 1;
	var vSizeZ = tileMesh.sizeZ + 1;

	tiles = new Tile[vSizeZ * vSizeX];
	for (var z = 0; z < vSizeZ; z++) {
		for (var x = 0; x < vSizeX ; x++) {
			var i : int = tileMesh.offset(x, z);

			tiles[i] = new Tile(x, z, this);
		}
	}
}


function TileSize() {
	return tileMesh.tileSize;
}

function TileAt(x : int, z : int) {
	return TileAt(Vector3(x, 0, z));
}

function TileAt(point : Vector3) : Tile {
	var offset : int = tileMesh.offset(point.x, point.z);
	if (offset >= tiles.length || offset < 0) {
		return null;
	}

	return tiles[offset];
}

function Coordinates(point : Vector3) : Vector3 {
	var tileCoordinate : Vector3;

	tileCoordinate.x = Mathf.FloorToInt(point.x / tileMesh.tileSize);
	tileCoordinate.z = Mathf.FloorToInt(point.z / tileMesh.tileSize);
	tileCoordinate.y = 0;
	return tileCoordinate * tileMesh.tileSize;
}

function Add(origin : Vector3, contents : Transform) {
	Instantiate(contents, origin, contents.transform.rotation);
}

function Add(start : Vector3, end : Vector3) {
	//Debug.Log("start = " + start + ", end = " + end);

	var rectangle = Rectangle(start, end);

	// Fill in the inside with "inside space"
	rectangle.ProcessInside(function(x : int, z : int) {
			TileAt(x, z).SetInside();
			});

	// Fill in the walls on the outside
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).SetWall();
			});

	// If this wall extends into another wall, try to turn it into inside space
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).MergeInside();
			});

	// If this wall butts up against another wall, try to turn the two walls into inside space
	Rectangle(start - Vector3.one, end + Vector3.one).ProcessEdge(function(x : int, z : int) {
			var tile : Tile = TileAt(x, z);
			if (tile != null) {
				tile.MergeInside();
			}
			});

	// Draw the wall if needed
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).Draw();
			});

	// Adjust adjacent walls if needed
	Rectangle(start - Vector3.one, end + Vector3.one).ProcessEdge(function(x : int, z : int) {
			var tile : Tile = TileAt(x, z);
			if (tile != null) {
				tile.Draw();
			}
			});
}

function ToString() {
	var output : String = '';

	for (var z=tileMesh.sizeZ-1; z>=0; z--) {
		for (var x=0; x<tileMesh.sizeX; x++) {
			output += TileAt(x, z).ToString();
		}
		output += "\n";
	}
	return output;
}
