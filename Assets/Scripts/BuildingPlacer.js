import System.Collections.Generic;


var pieces = new List.<Transform>();
var start : Vector3;
var end : Vector3;

private var tileGrid : TileGrid;
private var origin : Vector3;
private var mouseCoordinates : Vector3;
private var duringPlacement : boolean;

function Awake() {
	duringPlacement = false;
	tileGrid = GameObject.FindWithTag("TilePlane").GetComponent(TileGrid);
	origin = transform.position;
}

function Update() {
	var tile : Tile;
	// Don't allow resizing when the object is already placed.
	if (!duringPlacement) {
		return;
	}

	if (Input.GetMouseButtonUp(0)) {
		tileGrid.Add(start, end);
		Debug.Log(tileGrid.ToString());
		DestroyAll();
	}

	if (Input.GetMouseButton(0)) {
		var hit: RaycastHit;
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit)) {
			var hitObject : GameObject = hit.collider.gameObject;

			var newCoordinates = tileGrid.Coordinates(hit.point);
			if (this.mouseCoordinates != newCoordinates) {
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
			UnityEngine.Object.Destroy(transform.gameObject);
		}
	}
	pieces = new List.<Transform>();
}

function DestroyAll() {
	DestroyWalls();
	Destroy(gameObject);
}

function Resize(point : Vector3) {
	DestroyWalls();

	if (origin == point) {
		point += Vector3.one;
	}

	start = Vector3.Min(origin, point);
	end = Vector3.Max(origin, point);

	var distance = end - start;

	if (distance.x < 1) {
		end.x += 1;
	}

	if (distance.z < 1) {
		end.z += 1;
	}

	pieces.Add(Instantiate(tileGrid.bottomLeft, Vector3(start.x, 0, start.z), tileGrid.bottomLeft.rotation));
	pieces.Add(Instantiate(tileGrid.bottomRight, Vector3(end.x, 0, start.z), tileGrid.bottomRight.rotation));
	pieces.Add(Instantiate(tileGrid.topRight, Vector3(end.x, 0, end.z), tileGrid.topRight.rotation));
	pieces.Add(Instantiate(tileGrid.topLeft, Vector3(start.x, 0, end.z), tileGrid.topLeft.rotation));

	for (var x=start.x+1; x<end.x; x++) {
		pieces.Add(Instantiate(tileGrid.horizontal, Vector3(x, 0, end.z), tileGrid.horizontal.rotation));
		pieces.Add(Instantiate(tileGrid.horizontal, Vector3(x, 0, start.z), tileGrid.horizontal.rotation));
	}

	for (var z=start.z+1; z<end.z; z++) {
		pieces.Add(Instantiate(tileGrid.vertical, Vector3(start.x, 0, z), tileGrid.vertical.rotation));
		pieces.Add(Instantiate(tileGrid.vertical, Vector3(end.x, 0, z), tileGrid.vertical.rotation));
	}

	for (var transform : Transform in pieces) {
		if (transform != null) {
			transform.parent = tileGrid.transform;
			transform.Find("Model").renderer.enabled = true;
		}
	}
}

function StartPlacement() {
	duringPlacement = true;
}
