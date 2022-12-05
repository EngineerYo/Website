import data from '../../data/data.json' assert {type: 'json'}

let init = function(data) {
	let board = new Roulette(data)
	return board
}

let board = init(data)
board.build({minL: 1, maxL: 6})
board.render()

document.body.onkeyup = function(e) {
	let spaces = [' ', 'Space', 32, 'j']
	if (spaces.includes(e.key) || spaces.includes(e.code) || spaces.includes(e.keyCode)) {
		board.spin(3)
	}
}
