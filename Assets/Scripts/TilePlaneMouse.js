#pragma strict

@script RequireComponent(Plane);

var currentTileCoordinate : Vector3;
var selectionCube : Transform;
var cursor : Transform;

private var tilePlane : TilePlane;
private var highlightedObject : GameObject;
private var movingObject : GameObject;
private var moving : boolean = false;

function Start() {
    tilePlane = GetComponent(TilePlane);
    //selectionCube.FindChild("model").collider.enabled = false;
}

function Update () {
    if (Input.GetMouseButtonUp(0) && moving) {
        moving = false;
        movingObject.SendMessage("UnGrab");
    }

	if (Input.GetMouseButtonDown(1)) {
		for (var child : Transform in cursor) {
			if (child.gameObject.name == "Model") {
				child.Rotate(Vector3.up, 90.0);
			}
		}
	}

    var hit: RaycastHit;
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, hit)) {
        var hitObject : GameObject = hit.collider.gameObject;
        
        if (Input.GetMouseButtonDown(0)) {
        	if (tilePlane.IsEmpty(hit.point)) {
				Debug.Log("Adding object" + cursor.name);
				tilePlane.TileAt(hit.point).Add(cursor);
        	}
	        /*
            if (hitObject.tag == "Movable") {
                moving = true;
                movingObject = hitObject;
                movingObject.SendMessage("Grab");
            } else {
				Instantiate(straightWall, GetSnappedCoordinates(hit.point), Quaternion.identity);
			}
			*/
        } else {
            if (hitObject.tag == "Movable") {
				//selectionCube.FindChild("model").renderer.enabled = false;
				/*
                if (highlightedObject != null) {
                    highlightedObject.SendMessage("UnHighlight");
                }
                highlightedObject = hitObject;
                highlightedObject.SendMessage("Highlight");
				*/
            } else {
				cursor.transform.position = tilePlane.Coordinates(hit.point);
				//selectionCube.FindChild("model").renderer.enabled = true;
            }
        }
    }
}
