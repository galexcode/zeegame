#pragma strict

class Tile {
	var x : int;
	var z : int;
	var tileGrid : TileGrid;

	enum State { UNDEFINED, EMPTY, WALL, INSIDE, FULL };

	var state : State = State.EMPTY;
	var oldState : State;

	var content : Transform;
	var oldContent : Transform;

	private var inTransaction : boolean = false;

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
		if (this.state == State.UNDEFINED) {
			Debug.Log("State = undefined for point " + Coordinates());
		}
		this.state = state;

		// When state changes, destroy any content currently in this tile.
		DestroyContent();
	}

	function DestroyContent() {
		if (content != null) {
			content.gameObject.SetActive(false);
		}
		content = null;
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
				CreateContent(newTransform);
			}
		} 
	}

	function Add(content : Transform) {
		this.content = content;
		state = State.FULL;
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

	function CreateContent(content : Transform) {
		this.content = tileGrid.Instantiate(content, Position(), content.rotation);
		this.content.parent = tileGrid.transform;
		this.content.Find("Model").renderer.enabled = true;
		if (oldContent != null) {
			oldContent.gameObject.SetActive(false);
		}
	}

	function Begin() {
		oldContent = content;
		oldState = state;
		inTransaction = true;
	}

	function Commit() {
		if (inTransaction) {
			if (oldContent != null && oldContent != content) {
				tileGrid.Destroy(oldContent.gameObject);
			}

			oldContent = null;
			oldState = State.UNDEFINED;
		} else {
			Debug.Log("Commit() called, but Begin() was not called, aborting");
		}
	}

	function Revert() {
		if (inTransaction) {
			if (content != null && oldContent != content) {
				tileGrid.Destroy(content.gameObject);
			}

			if (oldContent != null) {
				oldContent.gameObject.SetActive(true);
			}

			state = oldState;
			content = oldContent;

			oldState = State.UNDEFINED;
			oldContent = null;

			inTransaction = false;
		} else {
			Debug.Log("Commit() called, but Begin() was not called, aborting");
		}
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
			case State.UNDEFINED:
				output = '?';
				break;
		}
		return output;
	}
}
