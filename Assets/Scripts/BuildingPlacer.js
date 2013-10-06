import System.Collections.Generic;


var pieces = new List.<Transform>();
var start : Vector3;
var end : Vector3;

private var tileGrid : TileGrid;
private var tileMesh : TileMesh;
private var origin : Vector3;
private var mouseCoordinates : Vector3;
private var duringPlacement : boolean;

function Awake() {
	duringPlacement = false;
	tileGrid = GameObject.FindWithTag("TilePlane").GetComponent(TileGrid);
	tileMesh = GameObject.FindWithTag("TilePlane").GetComponent(TileMesh);
	origin = tileGrid.Coordinates(transform.position);
	tileGrid.Begin();
}

function Update() {
	var tile : Tile;
	// Don't allow resizing when the object is already placed.
	if (!duringPlacement) {
		return;
	}

	// Back out any changes if the user presses escape.
	if (Input.GetKeyDown('escape')) {
		tileGrid.Revert();
		DestroyAll();
	} else if (Input.GetMouseButtonUp(0)) {
		tileGrid.Commit();
		Debug.Log(tileGrid.ToString());
		DestroyAll();
	} else if (Input.GetMouseButton(0)) {
		var hit: RaycastHit;
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit)) {
			var hitObject : GameObject = hit.collider.gameObject;

			var newCoordinates = tileGrid.Coordinates(hit.point);
			if (this.mouseCoordinates != newCoordinates) {
				tileGrid.Revert();
				tileGrid.Begin();
				Resize(newCoordinates);
				this.mouseCoordinates = newCoordinates;
			}
		}
	}
}

function DestroyWalls() {
	// Destroy cloned wall pieces from previous resize
	for (var transform : Transform in pieces) {
		if (transform != null) {
			Destroy(transform.gameObject);
		}
	}
	pieces = new List.<Transform>();
}

function DestroyAll() {
	DestroyWalls();
	Destroy(gameObject);
}

function Resize(point : Vector3) {
	start = Vector3.Min(origin, point);
	end = Vector3.Max(origin, point);

	var distance = end - start;

	// Minimum of 2x2 building
	if (distance.x <= 1) {
		end.x += 2 - distance.x;
	}

	if (distance.z <= 1) {
		end.z += 2 - distance.z;
	}

	// Don't put a wall beyond the tile mesh
	if (end.x >= tileMesh.sizeX) {
		end.x = tileMesh.sizeX - 1;
		start.x = start.x - 1;
	}

	if (end.z >= tileMesh.sizeZ) {
		end.z = tileMesh.sizeZ - 1;
		start.z = start.z - 1;
	}

	tileGrid.Add(start, end);
}

function StartPlacement() {
	duringPlacement = true;
}
