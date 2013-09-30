#pragma strict

class Tile {
	var x : int;
	var z : int;
	var tileGrid : TileGrid;

	enum State { EMPTY, WALL, INSIDE, FULL };

	var state : State = State.EMPTY;
	var oldState : State = State.EMPTY;

	var content : Transform;
	var oldContent : Transform;

	// make static?
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
		return state == State.EMPTY;
	}

	function IsInside() {
		return state == State.INSIDE;
	}

	function IsWall() {
		return state == State.WALL;
	}
	
	function SetInside() {
		SetState(State.INSIDE);
	}

	function SetWall() {
		// Don't create a wall inside of an existing building.
		if (!IsInside()) {
			SetState(State.WALL);
		}
	}

	function SetState(state : State) {
		oldState = this.state;
		this.state = state;
		DestroyContent();
	}

	function NumAdjacent(state : State, adjacencyMatrix : Vector3[]) : int {
		var adjacent = 0;

		for (var i=0; i<adjacencyMatrix.length; i++) {
			var tile = tileGrid.TileAt(Coordinates() + adjacencyMatrix[i]);

			if (tile != null) {
				if (tile.state == state) {
					adjacent++;
				}
			} else {
				// Consider things outside the tile plane as "empty"
				if (state == State.EMPTY) {
					adjacent++;
				}
			}
		}

		return adjacent;
	}

	function MergeInside() {
		if (NumAdjacent(State.EMPTY, surroundingVectors) == 0) {
			SetInside();
		}
	}

	function Draw() {
		if (IsWall()) {
			DestroyContent();

			var newTransform : Transform;
			var isWall = function(tile : Tile) { tile.IsWall(); };
			if (All(intersectionPattern, isWall)) {
				newTransform = tileGrid.intersection;
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
		state = State.FULL;
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

	function DestroyContent() {
		oldContent = content;

		if (content != null) {
			tileGrid.Destroy(content.gameObject);
			content = null;
		}
	}

	function Undo() {
		state = oldState;
		content = oldContent;
	}

	function ToString() {
		var output = '?';
		switch (state) {
			case State.EMPTY:
				output = '_';
				break;
			case State.WALL:
				output = 'W';
				break;
			case State.INSIDE:
				output = 'I';
				break;
			case State.FULL:
				output = 'F';
				break;
		}
		return output;
	}
}
