#pragma strict

@script RequireComponent(Plane);

var currentTileCoordinate : Vector3;
var selectionCube : Transform;
var straightWall : Transform;
private var _tilePlane : TilePlane;
private var highlightedObject : GameObject;
private var movingObject : GameObject;
private var moving : boolean = false;

function Start() {
    _tilePlane = GetComponent(TilePlane);
    //selectionCube.FindChild("model").collider.enabled = false;
}

function Update () {
    if (Input.GetMouseButtonUp(0) && moving) {
        moving = false;
        movingObject.SendMessage("UnGrab");
    }

	// TODO: rotate the wall by 90 degrees
	//if (Input.GetMouseButtonDown(1)) {
	//}

    var hit: RaycastHit;
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, hit)) {
        var hitObject : GameObject = hit.collider.gameObject;
        
        if (Input.GetMouseButtonDown(0)) {
        	if (_tilePlane.IsEmpty(hit.point)) {
				Debug.Log("Adding object" + straightWall.name);
				_tilePlane.TileAt(hit.point).Add(straightWall);
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
				//selectionCube.FindChild("model").renderer.enabled = true;
                //selectionCube.transform.position = GetSnappedCoordinates(hit.point);
            }
        }
    }
}
