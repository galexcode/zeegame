#pragma strict

class Tile {
	var x : int;
	var z : int;
	var tileGrid : TileGrid;

	var state : String = 'empty';
	var content : Transform;

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

	function Tile(x : int, z : int, tileGrid : TileGrid) {
		this.x = x;
		this.z = z;
		this.tileGrid = tileGrid;
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
			tileGrid.Destroy(content.gameObject);
			content = null;
		}
		state = 'inside';
	}

	function IsWall() {
		return state == 'wall';
	}
	
	function NumAdjacent(state : String, adjacencyMatrix : Vector3[]) : int {
		var adjacent = 0;

		for (var i=0; i<adjacencyMatrix.length; i++) {
			var tile = tileGrid.TileAt(Coordinates() + adjacencyMatrix[i]);

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
				tileGrid.Destroy(content.gameObject);
				content = null;
			}

			var newTransform : Transform;
			var isWall = function(tile : Tile) { tile.IsWall(); };
			if (All(intersectionPattern, isWall)) {
				content = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
				content.position = Vector3(x+0.5, 0, z+0.5);
				content.renderer.material.SetColor("_Color", Color.yellow);
			} else if (All(horizontalPattern, isWall)) {
				newTransform = tileGrid.horizontal;
			} else if (All(verticalPattern, isWall)) {
				newTransform = tileGrid.vertical;
			} else if (All(bottomLeftPattern, isWall)) {
				newTransform = tileGrid.bottomLeft;
			} else if (All(topLeftPattern, isWall)) {
				newTransform = tileGrid.topLeft;
			} else if (All(topRightPattern, isWall)) {
				newTransform = tileGrid.topRight;
			} else if (All(bottomRightPattern, isWall)) {
				newTransform = tileGrid.bottomRight;
			} else {
				content = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
				content.position = Vector3(x+0.5, 0, z+0.5);
				content.renderer.material.SetColor("_Color", Color.blue);
			}

			if (newTransform != null) {
				content = tileGrid.Instantiate(newTransform, Position(), newTransform.rotation);
				content.parent = tileGrid.transform;
				content.Find("Model").renderer.enabled = true;
			}
		}
	}

	function Add(content : Transform) {
		this.content = content;
		state = 'full';
	}

	function Create(content : Transform) {
		this.Add(tileGrid.Instantiate(content, Position(), content.transform.rotation));
	}

	// Position in real space
	function Position() {
		return Coordinates() * tileGrid.TileSize();
	}

	// Position in the grid
	function Coordinates() {
		return Vector3(x, 0, z);
	}

	// Returns true if aFunction returns true for all tiles
	function All(pattern : Vector3[], aFunction : Function) : boolean {
		for (vector in pattern) {
			var tile = tileGrid.TileAt(Coordinates() + vector);
			if (tile == null || !aFunction(tile)) {
				return false;
			}
		}

		return true;
	}

	function ToString() {
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
}
