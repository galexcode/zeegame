#pragma strict

var movementSpeed : float = 5.0f;
var rotationSpeed : float = 3.0f;

function Start () {
}

function Update () {
  if (Input.GetMouseButton(1)) {
    rotate();
  }
  
  move();


  if (Input.GetMouseButtonDown(0)) {
    grabObject();
  }
}

function rotate() {
  var pos = Camera.main.ScreenToViewportPoint(Input.mousePosition - Vector3(Screen.width/2, Screen.height/2, 0));

  transform.RotateAround(transform.position, transform.right, -pos.y * rotationSpeed);
  transform.RotateAround(transform.position, Vector3.up, pos.x * rotationSpeed);
}

function move() {
  var velocity : Vector3 = Vector3(Input.GetAxis("Horizontal"), -Input.GetAxis("Mouse ScrollWheel"), Input.GetAxis("Vertical"));
  
  if (Input.mousePosition.x <= 0) {
    velocity.x -= 1.0;
  } else if (Input.mousePosition.x >= Screen.width) {
    velocity.x += 1.0;
  }
  
  if (Input.mousePosition.y <= 0) {
    velocity.z -= 1.0;
  } else if (Input.mousePosition.y >= Screen.height) {
    velocity.z += 1.0;
  }
  transform.Translate(velocity * movementSpeed * Time.deltaTime, Space.World);
}


function grabObject() {
  var hit: RaycastHit;
  var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
  if (Physics.Raycast(ray, hit)) {
    if (hit.collider != null && hit.collider.gameObject.tag == "Movable") {
      hit.collider.gameObject.SendMessage("grab");
    }
  }
}
