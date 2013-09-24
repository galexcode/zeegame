import System.Collections.Generic;


private var bottomLeft : Transform;
private var bottomRight : Transform;
private var topRight : Transform;
private var topLeft : Transform;
private var vertical : Transform;
private var horizontal : Transform;

private var origin : Vector3;
private var mouseCoordinates : Vector3;
private var tilePlane : TilePlane;
private var pieces = new List.<Transform>();
private var duringPlacement : boolean;

function Awake() {
	bottomLeft = transform.Find("BottomLeft");
	bottomRight = transform.Find("BottomRight");
	topLeft = transform.Find("TopLeft");
	topRight = transform.Find("TopRight");
	vertical = transform.Find("Vertical");
	horizontal = transform.Find("Horizontal");
	
	duringPlacement = true;
	tilePlane = GameObject.FindWithTag("TilePlane").GetComponent(TilePlane);

	origin = transform.position;
}

function Start() {
	// TODO: call this so that it appears
	//Resize(origin);
}

function Update() {
	// Don't allow resizing when the object is already placed.
	if (!duringPlacement) {
		return;
	}

	if (Input.GetMouseButtonUp(0)) {
		if (CanCreate()) {
			// Tell TilePlane that the walls of this building exist
			for (var transform : Transform in pieces) {
				tilePlane.TileAt(transform.position).Add(transform);
			}
		} else {
			DestroyAll();
		}
		duringPlacement = false;
	}

	if (Input.GetMouseButton(0)) {
		var hit: RaycastHit;
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit)) {
			var hitObject : GameObject = hit.collider.gameObject;

			if (tilePlane.IsEmpty(hit.point)) {
				var newCoordinates = tilePlane.Coordinates(hit.point);
				if (this.mouseCoordinates != newCoordinates) {
					Resize(newCoordinates);
					this.mouseCoordinates = newCoordinates;
				}
			}
		}
	}
}

function CanCreate() {
	for (var transform : Transform in pieces) {
		if (!tilePlane.IsEmpty(transform.position)) {
			Debug.Log("Can't create at " + transform.position + " because " + tilePlane.TileAt(transform.position).content + " is there");
			return false;
		}
	}
	return true;
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
	DestroyWalls();

	if (origin == point) {
		point += Vector3.one;
	}
	var start = Vector3.Min(origin, point);
	var end = Vector3.Max(origin, point);

	for (var x=start.x+1; x<end.x; x++) {
		pieces.Add(Instantiate(horizontal, Vector3(x, 0, point.z), horizontal.transform.rotation));
		pieces.Add(Instantiate(horizontal, Vector3(x, 0, origin.z), horizontal.transform.rotation));
	}

	for (var z=start.z+1; z<end.z; z++) {
		pieces.Add(Instantiate(vertical, Vector3(origin.x, 0, z), vertical.transform.rotation));
		pieces.Add(Instantiate(vertical, Vector3(point.x, 0, z), vertical.transform.rotation));
	}

	pieces.Add(Instantiate(bottomLeft, Vector3(start.x, 0, start.z), bottomLeft.transform.rotation));
	pieces.Add(Instantiate(bottomRight, Vector3(end.x, 0, start.z), bottomRight.transform.rotation));
	pieces.Add(Instantiate(topRight, Vector3(end.x, 0, end.z), topRight.transform.rotation));
	pieces.Add(Instantiate(topLeft, Vector3(start.x, 0, end.z), topLeft.transform.rotation));

	for (var transform : Transform in pieces) {
		if (transform != null) {
			transform.parent = this.transform;
			transform.Find("Model").renderer.enabled = true;
		}
	}
}
