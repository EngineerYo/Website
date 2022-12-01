let a = new Box(60, 60, 0, 100, 100, 100, 4)

a.camera.x = 0
a.camera.y = 100
a.camera.z = -50

let secondsPerRevolution = 4
let interval = 50
let currTurn = 0
let radius = 100

let revolve = function() {
	let radsPerInterval = (2*Math.PI)/secondsPerRevolution*(interval/1000)

	currTurn += radsPerInterval
	if (currTurn >= Math.PI*2) {
		currTurn -= Math.PI*2
	}

	a.camera.x = Math.cos(currTurn)*radius
	a.camera.z = Math.sin(currTurn)*radius

	a.render()
}
setInterval(revolve, interval)