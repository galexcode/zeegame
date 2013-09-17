#pragma strict

private var originalColor : Color;
private var highlighted : boolean = false;
private var grabbed : boolean = false;

function Start () {

}

function Update () {
    if (grabbed) {
        Move();
    }
    UnHighlight();
}

function UnHighlight() {
    if (highlighted) {
        renderer.material.SetColor("_Color", originalColor);
        highlighted = false;
    }
}

function Highlight() {
    if (!highlighted) {
        highlighted = true;
        originalColor = renderer.material.color;
        renderer.material.SetColor("_Color", renderer.material.color + Color(-0.2f, -0.2f, 1f));
    }
}

function Grab() {
    Debug.Log("Grab!");
    grabbed = true;
    collider.enabled = false;
}

function UnGrab() {
    Debug.Log("UnGrab!");
    grabbed = false;
    collider.enabled = true;
}

function Grabbed() {
    return grabbed;
}

function Move() {
    var hit: RaycastHit;
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, hit)) {
        transform.position = hit.point;
    }
}
