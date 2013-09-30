#pragma strict

@script RequireComponent(Plane);

var selectionCube : Transform;
var cursor : GameObject;

private var tileGrid : TileGrid;
private var highlightedObject : GameObject;
private var movingObject : GameObject;
private var moving : boolean = false;

function Start() {
    tileGrid = GetComponent(TileGrid);
}

function Update () {
    if (Input.GetMouseButtonUp(0) && moving) {
        moving = false;
        movingObject.SendMessage("UnGrab");
    }

	if (cursor != null && Input.GetMouseButtonDown(1)) {
		cursor.transform.Find("Model").Rotate(Vector3.up, 90.0);
	}

	var hit: RaycastHit;
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast(ray, hit)) {
		var hitObject : GameObject = hit.collider.gameObject;

		if (Input.GetMouseButton(0)) {
			if (Input.GetMouseButtonDown(0)) {
				if (hitObject.tag == "Movable") {
					Debug.Log("grabbing object" + hitObject);
					Grab(hitObject);
				} else if (cursor != null) {
					var object = Instantiate(cursor, tileGrid.TileAt(hit.point).Coordinates(), cursor.transform.rotation);
					object.GetComponent(BuildingPlacer).StartPlacement();
					Destroy(cursor);
				}
			}
		} else  { //if (tileGrid.IsEmpty(hit.point)) {
			var currentTileCoordinate = tileGrid.Coordinates(hit.point);

			selectionCube.position = currentTileCoordinate;
			if (cursor != null) {
				cursor.transform.position = currentTileCoordinate;
			}
		}
	}
}

function Grab(gameObject : GameObject) {
	moving = true;
	movingObject = gameObject;
	movingObject.SendMessage("Grab");
}

function SetCursor(cursor : GameObject) {
	if (this.cursor != null) {
		Destroy(this.cursor);
	}
	this.cursor = Instantiate(cursor).gameObject;
}
