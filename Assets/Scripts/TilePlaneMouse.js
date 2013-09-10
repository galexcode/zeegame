#pragma strict

@script RequireComponent(Plane);

var currentTileCoordinate : Vector3;
var selectionCube : Transform;
private var _tilePlane : TilePlane;
private var highlightedObject : GameObject;
private var movingObject : GameObject;
private var moving : boolean = false;

function Start() {
    _tilePlane = GetComponent(TilePlane);
}

function Update () {
    if (Input.GetMouseButtonUp(0) && moving) {
        moving = false;
        movingObject.SendMessage("UnGrab");
    }

    var hit: RaycastHit;
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, hit)) {
        var hitObject : GameObject = hit.collider.gameObject;
        if (Input.GetMouseButtonDown(0)) {
            if (hitObject.tag == "Movable") {
                moving = true;
                movingObject = hitObject;
                movingObject.SendMessage("Grab");
            } else {
				var cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
				cube.AddComponent(Rigidbody);
				cube.transform.position = GetSnappedCoordinates(hit.point) + Vector3(0.5, 1.0, 0.5);
			}
        } else {
            if (hitObject.tag == "Movable") {
                if (highlightedObject != null) {
                    highlightedObject.SendMessage("UnHighlight");
                }
                highlightedObject = hitObject;
                highlightedObject.SendMessage("Highlight");
            } else {
                selectionCube.transform.position = GetSnappedCoordinates(hit.point);
            }
        }
    }
}

function GetSnappedCoordinates(point : Vector3) : Vector3 {
    var tileCoordinate : Vector3;

    tileCoordinate.x = Mathf.FloorToInt(point.x / _tilePlane.tileSize);
    tileCoordinate.z = Mathf.FloorToInt(point.z / _tilePlane.tileSize);
	tileCoordinate.y = point.y;
    return tileCoordinate * _tilePlane.tileSize;
}
