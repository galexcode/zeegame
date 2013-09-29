import System.Collections.Generic;


var bottomLeft : Transform;
var bottomRight : Transform;
var topRight : Transform;
var topLeft : Transform;
var vertical : Transform;
var horizontal : Transform;
var pieces = new List.<Transform>();
var start : Vector3;
var end : Vector3;

private var tilePlane : TilePlane;
private var origin : Vector3;
private var mouseCoordinates : Vector3;
private var duringPlacement : boolean;

function Awake() {
	duringPlacement = false;
	tilePlane = GameObject.FindWithTag("TilePlane").GetComponent(TilePlane);

	origin = transform.position;
}

function Start() {
	// TODO: call this so that it appears
	//Resize(origin);
}

function Update() {
	var tile : Tile;
	// Don't allow resizing when the object is already placed.
	if (!duringPlacement) {
		return;
	}

	if (Input.GetMouseButtonUp(0)) {
		tilePlane.Add(start, end);
		//Debug.Log("Added a tilePlane at " + start + ", " + end);
		Debug.Log(tilePlane.TextState());
		//duringPlacement = false;
		DestroyAll();
	}

	if (Input.GetMouseButton(0)) {
		var hit: RaycastHit;
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit)) {
			var hitObject : GameObject = hit.collider.gameObject;

			//if (tilePlane.IsEmpty(hit.point)) {
				var newCoordinates = tilePlane.Coordinates(hit.point);
				if (this.mouseCoordinates != newCoordinates) {
					Resize(newCoordinates);
					this.mouseCoordinates = newCoordinates;
				}
			//}
		}
	}
}

/*
function CanCreate() {
	for (var transform : Transform in pieces) {
		if (!tilePlane.IsEmpty(transform.position)) {
			var occupant = tilePlane.TileAt(transform.position).content.parent.gameObject;
			if (occupant.tag != 'Building') {
				// Don't place a building on top of a non-building object
				Debug.Log("Can't create at " + transform.position + " because " + occupant.tag + " is there");
				return false;
			}
		}
	}
	return true;
}
*/

function Merge(other : GameObject) {
	// TODO
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
	//Debug.Log("Resize called, pieces count = " + pieces.Count);
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

	//Debug.Log("start = " + start + ", end = " + end + ", distance = " + distance);

	pieces.Add(Instantiate(bottomLeft, Vector3(start.x, 0, start.z), bottomLeft.transform.rotation));
	pieces.Add(Instantiate(bottomRight, Vector3(end.x, 0, start.z), bottomRight.transform.rotation));
	pieces.Add(Instantiate(topRight, Vector3(end.x, 0, end.z), topRight.transform.rotation));
	pieces.Add(Instantiate(topLeft, Vector3(start.x, 0, end.z), topLeft.transform.rotation));

	for (var x=start.x+1; x<end.x; x++) {
		pieces.Add(Instantiate(horizontal, Vector3(x, 0, end.z), horizontal.transform.rotation));
		pieces.Add(Instantiate(horizontal, Vector3(x, 0, start.z), horizontal.transform.rotation));
	}

	for (var z=start.z+1; z<end.z; z++) {
		pieces.Add(Instantiate(vertical, Vector3(start.x, 0, z), vertical.transform.rotation));
		pieces.Add(Instantiate(vertical, Vector3(end.x, 0, z), vertical.transform.rotation));
	}

	for (var transform : Transform in pieces) {
		if (transform != null) {
			transform.parent = tilePlane.transform;
			transform.Find("Model").renderer.enabled = true;
		}
	}
}

function StartPlacement() {
	duringPlacement = true;
}
