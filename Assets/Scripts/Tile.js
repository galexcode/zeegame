#pragma strict

class Tile {
	var x : int;
	var z : int;
	var plane : TilePlane;

	var contents : Transform;
	var full : boolean = false;

	function Tile(x : int, z : int, plane : TilePlane) {
		this.x = x;
		this.z = z;
		this.plane = plane;
	}

	function isEmpty() {
		return !full;
	}

	/*
	var tileCoordinate : Vector3;

	tileCoordinate.x = Mathf.FloorToInt(point.x / tileSize);
	tileCoordinate.z = Mathf.FloorToInt(point.z / tileSize);
	tileCoordinate.y = point.y;
	return tileCoordinate * tileSize;
	*/

	function Add(contents : Transform) {
		this.contents = plane.Instantiate(contents, Vector3(x, 0, z), contents.transform.rotation);
		full = true;
	}
}
