class Node {
	constructor(x, y, z, args) {
		this.x = x
		this.y = y
		this.z = z

		for (i in args) {
			this[i] = args[i]
		}
	}

	arg(args) {
		for (let i in args) {
			this[i] = args[i]
		}
	}

	add(that) {
		return new Node(that.x + this.x, that.y + this.y, that.z + this.z)
	}
	sub(that) {
		return new Node(that.x - this.x, that.y - this.y, that.z - this.z)
	}
	mul(scalar) {
		return new Node(this.x * scalar, this.y * scalar, this.z * scalar)
	}
	div(scalar) {
		return new Node(this.x / scalar, this.y / scalar, this.z / scalar)
	}

	dot(that) {
		let prod = (this.x*that.x) + (this.y*that.y) + (this.z*that.z)
		
		let epsilon = 1e-6
		if (Math.abs(prod) <= epsilon) {
			return 0
		}

		return prod
	}
	get length() {
		return Math.pow( Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2), 0.5)
	}
	get unit() {
		return this.div(this.length)
	}
	equalTo(that) {
		if (this.sub(that).length <= 1e-6) {
			return true
		}

		return false
	}	
	
	get log() {
		let outStr = ''
		outStr += `[${this.x.log()}, ${this.y.log()}, ${this.z.log()}]`

		return outStr
	}
}

class Camera extends Node {
	constructor(x, y, z, args) {
		super(x, y, z, args)

		this.subject = new Node(0, 0, 0)
		this.cameraPlaneZ = 100
	}

	project(node) {
		// // Project points to camera plane
		let cx = node.x - this.x
		let cy = node.y - this.y
		let cz = node.z - this.z

		let dx = Math.cos(this.orientation.y) * (Math.sin(this.orientation.z)*cy + Math.cos(this.orientation.z)*cx) - Math.sin(this.orientation.y)*cz
		let dy = Math.sin(this.orientation.x) * (Math.cos(this.orientation.y)*cz + Math.sin(this.orientation.y)*(Math.sin(this.orientation.z)*cy + Math.cos(this.orientation.z)*cx)) + Math.cos(this.orientation.x)*(Math.cos(this.orientation.z)*cy - Math.sin(this.orientation.z)*cx)
		let dz = Math.cos(this.orientation.x) * (Math.cos(this.orientation.y)*cz + Math.sin(this.orientation.y)*(Math.sin(this.orientation.z)*cy + Math.cos(this.orientation.z)*cx)) - Math.sin(this.orientation.x)*(Math.cos(this.orientation.z)*cy - Math.sin(this.orientation.z)*cx)

		let bx = this.cameraPlaneZ*dx/dz
		let by = this.cameraPlaneZ*dy/dz

		return new Node(-bx, -by, 0)
		return new Node(dx, dy, 0)

		// let dx = (node.x - this.x) * (this.cameraPlaneZ / (node.z - this.z))
		// let dy = (node.y - this.y) * (this.cameraPlaneZ / (node.z - this.z))
		
		return new Node(dx, dy, 0)
	}

	get orientation() {
		let eulerAngles = {
			u:		Math.atan2(Math.pow( Math.pow(this.subject.x - this.x, 2) + Math.pow(this.subject.z - this.z, 2), 0.5), (this.subject.y - this.y)),
			v:		Math.atan ( (this.subject.x - this.x) / (this.subject.z - this.z)),
			w:		0
		}

		// let u = Math.atan ( (this.subject.y - this.y) / (this.subject.z - this.z))
		// let v = Math.atan2( (this.subject.x - this.x) , (this.subject.z - this.z))
		// let w = Math.atan ( (this.subject.x - this.x) / (this.subject.z - this.z))

		return new Node(eulerAngles.u, eulerAngles.v, eulerAngles.w)
	}

	readoff() {
		// this.subject.sub(this).unit().log()
		// d3.select('.readout#r0').html(`PLANE NORMAL ${this.subject.sub(this).unit.log}`)
	}
}


Number.prototype.log = function(n=3) {
	let outNum = this.toPrecision(n).toString()
	if (this >= 0) {
		outNum = ` ${outNum}`
	}

	return outNum
}