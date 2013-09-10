#pragma strict

@script RequireComponent(Plane);

var currentTileCoordinate : Vector3;
var selectionCube : Transform;
private var _tilePlane : TilePlane;
private var highlightedObject : GameObject;

function Start() {
  _tilePlane = GetComponent(TilePlane);
}

function Update () {
  highlight();
}

function highlight() {
  var hit: RaycastHit;
  var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
  if (Physics.Raycast(ray, hit)) {
    if (hit.collider.gameObject.tag == "Movable") {
      if (highlightedObject != null) {
        highlightedObject.SendMessage("UnHighlight");
      }
      highlightedObject = hit.collider.gameObject;
      highlightedObject.SendMessage("Highlight");
    } else {
      currentTileCoordinate.x = Mathf.FloorToInt(hit.point.x / _tilePlane.tileSize);
      currentTileCoordinate.z = Mathf.FloorToInt(hit.point.z / _tilePlane.tileSize);

      selectionCube.transform.position = currentTileCoordinate;
    }

    //if (hit.collider != null && hit.collider.gameObject.tag == "Movable") {
    //  hit.collider.gameObject.SendMessage("grab");
    //}
  }
}
