#pragma strict

class Rectangle {
	private var start : Vector3;
	private var end : Vector3;

	function Rectangle(start : Vector3, end : Vector3) {
		this.start = start;
		this.end = end;
	}

	function ProcessAll(aFunction : Function) {
		ProcessAll(aFunction, start, end);
	}

	function ProcessInside(aFunction : Function) {
		for (var x=start.x+1; x<end.x; x++) {
			for (var z=start.z+1; z<end.z; z++) {
				aFunction(x, z);
			}
		}
	}

	function ProcessAll(aFunction : Function, borderSize : int) {
		ProcessAll(aFunction, start-Vector3.one*borderSize, end+Vector3.one*borderSize);
	}

	function ProcessEdge(aFunction : Function) {
		ProcessRectangle(aFunction, this.start, this.end);
	}

	function ProcessEdge(aFunction : Function, borderSize : int) {
		for (var i : int = 0; i < borderSize; i++) {
			ProcessRectangle(aFunction, this.start-Vector3.one*i, this.end+Vector3.one*i);
		}
	}

	private function ProcessRectangle(aFunction : Function, start : Vector3, end : Vector3) {
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

	private function ProcessAll(aFunction : Function, start : Vector3, end : Vector3) {
		for (var x=start.x; x<=end.x; x++) {
			for (var z=start.z; z<=end.z; z++) {
				aFunction(x, z);
			}
		}
	}

}
