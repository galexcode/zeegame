#pragma strict

var straightWall : Transform;
var cornerWall : Transform;

private var tilePlaneMouse : TilePlaneMouse;

function Awake() {
	tilePlaneMouse = GameObject.FindWithTag("TilePlane").GetComponent(TilePlaneMouse);
}

function OnGUI () {
	// Make a background box
	GUI.Box (Rect (10,10,100,90), "Object Selection");

	if (GUI.Button (Rect (20,40,80,20), "Straight Wall")) {
		tilePlaneMouse.cursor = straightWall;
	}

	if (GUI.Button (Rect (20,70,80,20), "Corner Wall")) {
		tilePlaneMouse.cursor = cornerWall;
	}
}
