#pragma strict

@script ExecuteInEditMode;
@script RequireComponent(MeshFilter);
@script RequireComponent(MeshRenderer);
@script RequireComponent(MeshCollider);

var sizeX : int = 20;
var sizeZ : int = 10;
var tileSize : int = 1;

function Start () {
	BuildMesh();
}

function BuildMesh() {
	var vSizeX : int = sizeX + 1;
	var vSizeZ : int = sizeZ + 1;

	var numVerts : int = vSizeX * vSizeZ;

	var vertices : Vector3[] = new Vector3[numVerts];
	var normals : Vector3[] = new Vector3[numVerts];
	var uv : Vector2[] = new Vector2[numVerts];

	var x : int;
	var z : int;

	for (z = 0; z < vSizeZ; z++) {
		for (x = 0; x < vSizeX ; x++) {
			var i : int = offset(x, z);

			vertices[i] = new Vector3(x, 0, z) * tileSize;
			normals[i] = Vector3.up;
			uv[i] = new Vector2(x / sizeX, z / sizeZ);
		}
	}


	var triangles : int[] = new int[numVerts*2*3];

	for (z = 0; z < sizeZ; z++) {
		for (x = 0; x < sizeX ; x++) {
			var triangleOffset = offset(x, z) * 6;

			triangles[triangleOffset + 0] = z * vSizeX + x +          0;
			triangles[triangleOffset + 1] = z * vSizeX + x + vSizeX + 0;
			triangles[triangleOffset + 2] = z * vSizeX + x + vSizeX + 1;

			triangles[triangleOffset + 3] = z * vSizeX + x +          0;
			triangles[triangleOffset + 4] = z * vSizeX + x + vSizeX + 1;
			triangles[triangleOffset + 5] = z * vSizeX + x +          1;
		}
	}

	var mesh : Mesh = new Mesh();
	mesh.vertices = vertices;
	mesh.triangles = triangles;
	mesh.normals = normals;
	mesh.uv = uv;

	var meshFilter : MeshFilter = GetComponent(MeshFilter);
	var meshCollider : MeshCollider = GetComponent(MeshCollider);

	meshFilter.mesh = mesh;
	meshCollider.sharedMesh = mesh;
}

function offset(x : int, z : int) {
	return z * (sizeX+1) + x;
}

