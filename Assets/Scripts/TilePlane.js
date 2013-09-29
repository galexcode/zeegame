#pragma strict

@script ExecuteInEditMode;
@script RequireComponent(MeshFilter);
@script RequireComponent(MeshRenderer);
@script RequireComponent(MeshCollider);

// Wall pieces
var bottomLeft : Transform;
var bottomRight : Transform;
var topRight : Transform;
var topLeft : Transform;
var vertical : Transform;
var horizontal : Transform;

var sizeX : int = 20;
var sizeZ : int = 10;
var tileSize : int = 1;

private var tiles : Tile[];

function Start () {
	BuildMesh();
}

function BuildMesh() {
	var vSizeX : int = sizeX + 1;
	var vSizeZ : int = sizeZ + 1;

	var numVerts : int = vSizeX * vSizeZ;

	tiles = new Tile[vSizeZ * vSizeX];
	var vertices : Vector3[] = new Vector3[numVerts];
	var normals : Vector3[] = new Vector3[numVerts];
	var uv : Vector2[] = new Vector2[numVerts];

	var x : int;
	var z : int;

	for (z = 0; z < vSizeZ; z++) {
		for (x = 0; x < vSizeX ; x++) {
			var i : int = offset(x, z);

			tiles[i] = new Tile(x, z, this);
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

function TileAt(x : int, z : int) {
	return TileAt(Vector3(x, 0, z));
}

function TileAt(point : Vector3) : Tile {
	var offset : int = this.offset(point.x, point.z);
	if (offset >= tiles.length || offset < 0) {
		//Debug.Log("Could not find tile at point (" + point.x + ", " + point.z + ")");
		return null;
	}

	return tiles[offset];
}

function IsEmpty(point : Vector3) : boolean {
	return TileAt(point).IsEmpty();
}

function Coordinates(point : Vector3) : Vector3 {
	var tileCoordinate : Vector3;

	tileCoordinate.x = Mathf.FloorToInt(point.x / tileSize);
	tileCoordinate.z = Mathf.FloorToInt(point.z / tileSize);
	tileCoordinate.y = 0;
	return tileCoordinate * tileSize;
}

function Add(origin : Vector3, contents : Transform) {
	Instantiate(contents, origin, contents.transform.rotation);
}

function TextState() {
    var output : String = '';

	for (var z=sizeZ-1; z>=0; z--) {
		for (var x=0; x<sizeX; x++) {
			output += TileAt(x, z).Text();
		}
		output += "\n";
	}
	return output;
}

function Add(start : Vector3, end : Vector3) {
	//Debug.Log("start = " + start + ", end = " + end);

	var rectangle = Rectangle(start, end);

	// Fill in the inside with "inside space"
	rectangle.ProcessInside(function(x : int, z : int) {
			TileAt(x, z).SetInside();
			});

	// Fill in the walls on the outside
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).SetWall();
			});

	// If this wall extends into another wall, try to turn it into inside space
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).MergeInside();
			});

	// If this wall butts up against another wall, try to turn the two walls into inside space
	Rectangle(start - Vector3.one, end + Vector3.one).ProcessEdge(function(x : int, z : int) {
			var tile : Tile = TileAt(x, z);
			if (tile != null) {
				tile.MergeInside();
			}
			});

	// Draw the wall if needed
	rectangle.ProcessEdge(function(x : int, z : int) {
			TileAt(x, z).Draw();
			});

	// Adjust adjacent walls if needed
	Rectangle(start - Vector3.one, end + Vector3.one).ProcessEdge(function(x : int, z : int) {
			var tile : Tile = TileAt(x, z);
			if (tile != null) {
				tile.Draw();
			}
			});
}
