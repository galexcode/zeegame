import System.Collections.Generic;

private var duringPlacement : boolean;

private var bottomLeft : Transform;
private var bottomRight : Transform;
private var topRight : Transform;
private var topLeft : Transform;
private var top : Transform;
private var bottom : Transform;
private var left : Transform;
private var right : Transform;

private var coordinates : Vector3;
private var tilePlane : TilePlane;
private var extraPieces = new List.<Transform>();

function Awake() {
	bottomLeft = transform.Find("BottomLeft");
	bottomRight = transform.Find("BottomRight");
	topLeft = transform.Find("TopLeft");
	topRight = transform.Find("TopRight");
	top = transform.Find("Top");
	bottom = transform.Find("Bottom");
	left = transform.Find("Left");
	right = transform.Find("Right");
	
	duringPlacement = true;
	tilePlane = GameObject.FindWithTag("TilePlane").GetComponent(TilePlane);
}

function Update() {
	if (Input.GetMouseButtonUp(0)) {
		duringPlacement = false;
	}
	if (duringPlacement && Input.GetMouseButton(0)) {
		var hit: RaycastHit;
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, hit)) {
			var hitObject : GameObject = hit.collider.gameObject;

			if (tilePlane.IsEmpty(hit.point)) {
				var newCoordinates = tilePlane.Coordinates(hit.point);
				if (this.coordinates != newCoordinates) {
					Resize(newCoordinates);
					this.coordinates = newCoordinates;
				}
			}
		}
	}
}

function Resize(point : Vector3) {
	var origin = bottomLeft.transform.position;

	// Destroy cloned wall pieces
	for (var transform : Transform in extraPieces) {
		if (transform != null) {
			Destroy(transform.gameObject);
		}
	}

	var start = Vector3.Min(bottomLeft.transform.position, point);
	var end = Vector3.Max(bottomLeft.transform.position, point);

	for (var x=start.x+1; x<end.x; x++) {
		extraPieces.Add(Instantiate(top, Vector3(x, 0, point.z), top.transform.rotation));
		extraPieces.Add(Instantiate(bottom, Vector3(x, 0, origin.z), bottom.transform.rotation));
	}

	for (var z=start.z+1; z<end.z; z++) {
		extraPieces.Add(Instantiate(right, Vector3(origin.x, 0, z), right.transform.rotation));
		extraPieces.Add(Instantiate(left, Vector3(point.x, 0, z), left.transform.rotation));
	}

	for (var transform : Transform in extraPieces) {
		if (transform != null) {
			transform.Find("Model").renderer.enabled = true;
		}
	}

	bottomRight.transform.position = Vector3(point.x, 0, origin.z);
	topRight.transform.position = Vector3(point.x, 0, point.z);
	topLeft.transform.position = Vector3(origin.x, 0, point.z);

}
