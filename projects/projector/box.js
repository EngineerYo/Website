let Box = function(x, y, z, dx, dy, dz, subs) {
	this.camera = new Camera(0, 0, 0)
	this.edges = []

	this.x = x
	this.y = y
	this.z = z

	this.dx = dx
	this.dy = dy
	this.dz = dz

	let dxDiv = dx/(subs-1)
	let dyDiv = dy/(subs-1)
	let dzDiv = dz/(subs-1)

	let axy0 = new Node(dx/2,	 dy/2,	 dz/2)
	let axy1 = new Node(-dx/2, 	 dy/2,	 dz/2)
	let axy2 = new Node(-dx/2,	-dy/2,	 dz/2)
	let axy3 = new Node(dx/2, 	-dy/2,	 dz/2)

	let bxy0 = new Node( dx/2,	 dy/2,	-dz/2)
	let bxy1 = new Node(-dx/2, 	 dy/2,	-dz/2)
	let bxy2 = new Node(-dx/2,	-dy/2,	-dz/2)
	let bxy3 = new Node( dx/2, 	-dy/2,	-dz/2)

	this.axy0 = axy0
	this.axy1 = axy1
	this.axy2 = axy2
	this.axy3 = axy3

	this.bxy0 = bxy0
	this.bxy1 = bxy1
	this.bxy2 = bxy2
	this.bxy3 = bxy3

	this.addEdge(new Edge(axy0, axy1, subs))
	this.addEdge(new Edge(axy1, axy2, subs))
	this.addEdge(new Edge(axy2, axy3, subs))
	this.addEdge(new Edge(axy3, axy0, subs))
	
	this.addEdge(new Edge(bxy0, bxy1, subs))
	this.addEdge(new Edge(bxy1, bxy2, subs))
	this.addEdge(new Edge(bxy2, bxy3, subs))
	this.addEdge(new Edge(bxy3, bxy0, subs))
	
	this.addEdge(new Edge(axy0, bxy0, subs))
	this.addEdge(new Edge(axy1, bxy1, subs))
	this.addEdge(new Edge(axy2, bxy2, subs))
	this.addEdge(new Edge(axy3, bxy3, subs))

	// this.getCamera()
}
Box.prototype.addEdge = function(edge) {
	edge['id'] = this.edges.length
	this.edges.push(edge)
}
Box.prototype.render = function() {
	let box = this
	if (d3.select('svg').empty()) {
		d3.select('body').append('svg')
		d3.select('svg').append('g')
			.attr('id', 'container')
			.style('transform', 'translate(50%, 50%')
	}

	for (let edge of this.edges) {
		edge.render(this.camera)

	}

	let xAxis = [new Node(-this.dx,0,0), new Node(this.dx, 0, 0)]
	let yAxis = [new Node(0,-this.dy,0), new Node(0, this.dy, 0)]
	let zAxis = [new Node(0,0,-this.dz), new Node(0, 0, this.dz)]

	let pXAxis = [this.camera.project(xAxis[0]), this.camera.project(xAxis[1])]
	let pYAxis = [this.camera.project(yAxis[0]), this.camera.project(yAxis[1])]
	let pZAxis = [this.camera.project(zAxis[0]), this.camera.project(zAxis[1])]


	// let points = `${this.camera.project(this.axy0).x},${this.camera.project(this.axy0).y} ${this.camera.project(this.axy1).x},${this.camera.project(this.axy1).y} ${this.camera.project(this.axy2).x},${this.camera.project(this.axy2).y} ${this.camera.project(this.axy3).x},${this.camera.project(this.axy3).y}`
	// if (d3.select(`polygon#face`).empty()) {
	// 	d3.select('svg').select('g').append('polygon')
	// 		.attr('id', 'face')
	// 		.attr('points', points)
	// 		.attr('fill', 'red').attr('fill-opacity', 0.5)
	// }
	// else {
	// 	d3.select('polygon#face')
	// 		.attr('points', points)
	// 		.attr('fill', 'red').attr('fill-opacity', 0.5)
	// }
	if (d3.select(`line#x`).empty()) {
		d3.select('svg').select('g').append('line')
			.attr('id', 'x')
			.attr('x0', pXAxis[0].x).attr('x1', pXAxis[1].x)
			.attr('y0', pXAxis[0].y).attr('y1', pXAxis[1].y)
			.attr('stroke', 'red').attr('stroke-width', 1)

		d3.select('svg').select('g').append('line')
			.attr('id', 'y')
			.attr('x0', pYAxis[0].x).attr('x1', pYAxis[1].x)
			.attr('y0', pYAxis[0].y).attr('y1', pYAxis[1].y)
			.attr('stroke', 'green').attr('stroke-width', 1)
		d3.select('svg').select('g').append('line')
			.attr('id', 'z')
			.attr('x0', pZAxis[0].x).attr('x1', pZAxis[1].x)
			.attr('y0', pZAxis[0].y).attr('y1', pZAxis[1].y)
			.attr('stroke', 'blue').attr('stroke-width', 1)
	}
	else {
		d3.select(`line#x`)
			.attr('x0', pXAxis[0].x).attr('x1', pXAxis[1].x)
			.attr('y0', pXAxis[0].y).attr('y1', pXAxis[1].y)
		d3.select(`line#y`)
			.attr('x0', pYAxis[0].x).attr('x1', pYAxis[1].x)
			.attr('y0', pYAxis[0].y).attr('y1', pYAxis[1].y)
		d3.select(`line#z`)
			.attr('x0', pZAxis[0].x).attr('x1', pZAxis[1].x)
			.attr('y0', pZAxis[0].y).attr('y1', pZAxis[1].y)

	}
}
Box.prototype.getCamera = function(fov=Math.PI/2) {
	let apothem = Math.tan(Math.PI/4) * this.dx / 2

	let cx = this.dx/2
	let cy = this.dy/2
	let cz = -Math.cos(Math.PI/4) * apothem

	let camera = new Node(cx, cy, cz)
	this.camera = camera
}

let Edge = function(p0, p1, subs, args) {
	this.length = p1.sub(p0).length

	this.partitionLength = this.length/(subs-1)
	this.partition = (p0.sub(p1)).unit.mul(this.partitionLength)
	
	this.points = [p0, p1]
	// for (let i = 0; i <= this.length/this.partitionLength; i += 1) {
	// 	let newNode = p0.add(this.partition.mul(i))
	// 	newNode.arg[{'edge': this}]
	// 	this.points.push(newNode)
	// }

	for (let i in args) {
		this[i] = args[i]
	}
}
Edge.prototype.render = function(camera) {
	let thisEdge = this
	let corner0 = this.points[0]
	let corner1 = this.points[this.points.length-1]

	let projP0 = camera.project(corner0)
	let projP1 = camera.project(corner1)

	if (d3.select(`#edge${thisEdge.id}`).empty()) {
		d3.select('#container').append('g')
			.attr('id', `edge${thisEdge.id}`)
	}
	if (d3.select(`#line${thisEdge.id}`).empty()) {
		d3.select(`#edge${thisEdge.id}`).append('line')
			.attr('id', `line${thisEdge.id}`)
			.attr('stroke', 'black').attr('stroke-width', '2px')
			.attr('x1', projP0.x).attr('x2', projP1.x)
			.attr('y1', projP0.y).attr('y2', projP1.y)
	}
	else {
		d3.select(`#line${thisEdge.id}`)
			.attr('x1', projP0.x).attr('x2', projP1.x)
			.attr('y1', projP0.y).attr('y2', projP1.y)
	}
}