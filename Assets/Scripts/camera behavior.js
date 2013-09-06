#pragma strict

var movementSpeed : float = 5.0f;

function Start () {
}

function Update () {
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
     
  if (Input.GetMouseButtonDown(0)) {
    grabObject();
  }
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
