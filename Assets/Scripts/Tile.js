#pragma strict

class Tile {
	var x : int;
	var z : int;
	var tilePlane : TilePlane;

	var state : String = 'empty';
	var content : Transform;

	// Not needed?
	/*
	private var adjacentVectors : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(0, 0, 1),
		Vector3(1, 0, 0),
		Vector3(0, 0, -1)
	];
	*/

	private var surroundingVectors : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(-1, 0, 1),
		Vector3(0, 0, 1),
		Vector3(1, 0, 1),
		Vector3(1, 0, 0),
		Vector3(1, 0, -1),
		Vector3(0, 0, -1),
		Vector3(-1, 0, -1)
	];

	private var intersectionPattern : Vector3[] = [
		Vector3(0, 0, 0),
		Vector3(-1, 0, 0),
		Vector3(1, 0, 0),
		Vector3(0, 0, -1),
		Vector3(0, 0, 1)
	];

	private var horizontalPattern : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(0, 0, 0),
		Vector3(1, 0, 0)
	];

	private var verticalPattern : Vector3[] = [
		Vector3(0, 0, -1),
		Vector3(0, 0, 0),
		Vector3(0, 0, 1)
	];

	private var bottomLeftPattern : Vector3[] = [
		Vector3(0, 0, 1),
		Vector3(0, 0, 0),
		Vector3(1, 0, 0)
	];

	private var topLeftPattern : Vector3[] = [
		Vector3(0, 0, -1),
		Vector3(0, 0, 0),
		Vector3(1, 0, 0)
	];

	private var topRightPattern : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(0, 0, 0),
		Vector3(0, 0, -1)
	];

	private var bottomRightPattern : Vector3[] = [
		Vector3(0, 0, 1),
		Vector3(0, 0, 0),
		Vector3(-1, 0, 0)
	];

	function Tile(x : int, z : int, tilePlane : TilePlane) {
		this.x = x;
		this.z = z;
		this.tilePlane = tilePlane;
	}

	function IsEmpty() {
		return state == 'empty';
	}

	function IsFull() {
		return state == 'full';
	}

	function IsInside() {
		return state == 'inside';
	}

	function SetInside() {
		if (content != null) {
			tilePlane.Destroy(content.gameObject);
			content = null;
		}
		state = 'inside';
	}

	function IsWall() {
		return state == 'wall';
	}

	function Position() {
		return Vector3(x, 0, z);
	}
	
	function NumAdjacent(state : String, adjacencyMatrix : Vector3[]) : int {
		var adjacent = 0;

		for (var i=0; i<adjacencyMatrix.length; i++) {
			var tile = tilePlane.TileAt(Position() + adjacencyMatrix[i]);

			if (tile != null) {
				if (tile.state == state) {
					adjacent++;
				}
			} else {
				// Consider things outside the tile plane as "empty"
				if (state == 'empty') {
					adjacent++;
				}
			}
		}

		return adjacent;
	}

	function SetWall() {
		// Don't create a wall inside of an existing building.
		if (!IsInside()) {
			state = 'wall';
		}
	}

	function MergeInside() {
		if (NumAdjacent('empty', surroundingVectors) == 0) {
			SetInside();
		}
	}

	function Draw() {
		if (state == 'wall') {
			if (content != null) {
				tilePlane.Destroy(content.gameObject);
				content = null;
			}

			var newTransform : Transform;
			var isWall = function(tile : Tile) { tile.IsWall(); };
			if (All(intersectionPattern, isWall)) {
				content = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
				content.position = Vector3(x+0.5, 0, z+0.5);
				content.renderer.material.SetColor("_Color", Color.yellow);
			} else if (All(horizontalPattern, isWall)) {
				newTransform = tilePlane.horizontal;
			} else if (All(verticalPattern, isWall)) {
				newTransform = tilePlane.vertical;
			} else if (All(bottomLeftPattern, isWall)) {
				newTransform = tilePlane.bottomLeft;
			} else if (All(topLeftPattern, isWall)) {
				newTransform = tilePlane.topLeft;
			} else if (All(topRightPattern, isWall)) {
				newTransform = tilePlane.topRight;
			} else if (All(bottomRightPattern, isWall)) {
				newTransform = tilePlane.bottomRight;
			} else {
				content = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
				content.position = Vector3(x+0.5, 0, z+0.5);
				content.renderer.material.SetColor("_Color", Color.blue);
			}

			if (newTransform != null) {
				content = tilePlane.Instantiate(newTransform, Position(), newTransform.rotation);
				content.parent = tilePlane.transform;
				content.Find("Model").renderer.enabled = true;
			}
		}
	}

	function Add(content : Transform) {
		this.content = content;
		state = 'full';
	}

	function Create(content : Transform) {
		this.Add(tilePlane.Instantiate(content, Coordinates(), content.transform.rotation));
	}

	function Coordinates() {
		return Vector3(x, 0, z);
	}

	function Text() {
		var output = '?';
		switch (state) {
			case 'empty':
				output = '_';
				break;
			case 'wall':
				output = 'W';
				break;
			case 'inside':
				output = 'I';
				break;
		}
		return output;
	}

	// Returns true if aFunction returns true for all tiles
	function All(pattern : Vector3[], aFunction : Function) : boolean {
		for (vector in pattern) {
			var tile = tilePlane.TileAt(Position() + vector);
			if (tile == null || !aFunction(tile)) {
				return false;
			}
		}

		return true;
	}
}
