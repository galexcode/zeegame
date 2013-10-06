#pragma strict

class Rectangle {
	private var start : Vector3;
	private var end : Vector3;

	function Rectangle(start : Vector3, end : Vector3) {
		this.start = start;
		this.end = end;
	}

	function ProcessAll(aFunction : Function) {
		for (var x=start.x; x<=end.x; x++) {
			for (var z=start.z; z<=end.z; z++) {
				aFunction(x, z);
			}
		}
	}

	function ProcessInside(aFunction : Function) {
		for (var x=start.x+1; x<end.x; x++) {
			for (var z=start.z+1; z<end.z; z++) {
				aFunction(x, z);
			}
		}
	}

	function ProcessEdge(aFunction : Function) {
		/*
		   Add horizontal lines:
		   -------


		   -------
	    */
		for (var x=start.x; x<=end.x; x++) {
			aFunction(x, start.z);
			aFunction(x, end.z);
		}

		/*
		   Add vertical lines:
		   -------
		   |     |
		   |     |
		   -------
	    */
		for (var z=start.z+1; z<end.z; z++) {
			aFunction(start.x, z);
			aFunction(end.x, z);
		}
	}

}
