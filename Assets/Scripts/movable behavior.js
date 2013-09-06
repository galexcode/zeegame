#pragma strict

public var grabbed : boolean = false;

function Start () {
}

function Update () {
  if (Input.GetMouseButtonUp(0)) { 
    releaseObject();
  }
  
  if (grabbed) {
    moveObject();
  }
}


function releaseObject() {
  if (grabbed) {
    grabbed = false;
    collider.enabled = true;
  }
}

function moveObject() {
  var hit: RaycastHit;
  var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
  if (Physics.Raycast(ray, hit)) {
    if (hit.collider != null) {
      hit.point -= ray.direction;
      hit.point.x = Mathf.Round(hit.point.x);
      hit.point.z = Mathf.Round(hit.point.z);
      transform.position = hit.point;
      Debug.Log(hit.point);
    }
  }
}

function grab() {
  grabbed = true;
  collider.enabled = false;
  rigidbody.velocity = Vector3(0.0, 0.0, 0.0);
}