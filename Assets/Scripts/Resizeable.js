#pragma strict

var width : int;
var length : int;

private var bottomLeft : GameObject;
private var bottomRight : GameObject;
private var topRight : GameObject;
private var topLeft : GameObject;

function Start() {
	/*
	bottomLeft = GetComponent("CornerBottomLeft").gameObject;
	bottomRight = GetComponent("CornerBottomRight").gameObject;
	topRight = GetComponent("CornerTopRight").gameObject;
	topLeft = GetComponent("CornerTopLeft").gameObject;
	*/
}

function Resize(width : int, length : int) {
	this.width = Mathf.Max(width, 3);
	this.length = Mathf.Max(length, 3);

	/*
	this.sidesX = this.width - 2;
	this.sidesZ = this.length - 2;
	*/

	var origin : Vector3 = bottomLeft.transform.position;
	bottomRight.transform.position = origin + Vector3(this.width, 0, 0);
	topRight.transform.position = origin + Vector3(this.width, 0, this.length);
	topLeft.transform.position = origin + Vector3(0, 0, this.length);
}
