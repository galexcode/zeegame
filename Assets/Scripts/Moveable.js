#pragma strict

private var originalColor : Color;
private var highlighted : boolean = false;

function Start () {

}

function Update () {
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