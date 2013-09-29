#pragma strict

var straightWall : GameObject;
var cornerWall : GameObject;
var building : GameObject;

private var tilePlaneMouse : TilePlaneMouse;

function Awake() {
	tilePlaneMouse = GameObject.FindWithTag("TilePlane").GetComponent(TilePlaneMouse);
}

function OnGUI () {
	// Make a background box
	GUI.Box (Rect (10,10,150,140), "Object Selection");

	if (GUI.Button (Rect (20,40,80,20), "Straight Wall")) {
		tilePlaneMouse.SetCursor(straightWall);
	}

	if (GUI.Button (Rect (20,70,80,20), "Corner Wall")) {
		tilePlaneMouse.SetCursor(cornerWall);
	}

	if (GUI.Button (Rect (20,100,80,20), "Building")) {
		tilePlaneMouse.SetCursor(building);
	}
}
