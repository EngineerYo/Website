const projects = [
	{name: 'Countdown', size: [2, 1]},
	{name: 'Swing Roulette', size: [2, 2]},
	{name: 'Bill Tracker', size: [1, 1]},
	{name: 'List', size: [2, 1]},
	{name: 'White Elephant', size: [1, 1]},
	{name: 'Stars Without Number', size: [1, 2]},
	{name: 'Terrain Analyzer', size: [2, 2]},
	{name: 'Projector', size: [1, 2]},
	{name: 'Bingo', size: [1, 1]},
	{name: 'Q Learning', size: [1, 1]},
	{name: 'Transit Method', size: [2, 1]},
]

let main = function() {

	// Generate Project buttons
	for (let project of projects) {
		let pointer = project['name'].toLowerCase().split(' ').join('_')

		let button = document.createElement('button')
		// button.innerText = project['name'].toUpperCase()
		button.setAttribute('id', pointer)
		button.setAttribute('class', 'project_button')
		
		button.style['position'] = 'relative'
		button.style['grid-column'] = `span ${project['size'][0]}`
		button.style['grid-row'] = `span ${project['size'][1]}`
		button.style['background-color'] = '#00000000'
		button.style['z-index'] = '10'
		button.style['width'] = `calc(100%)`// - ${project['size'][0]*4}px)`
		button.style['height'] = `calc(100%)`// - ${project['size'][1]*4}px)`
		// button.style['font-size'] = `${1.5*project['size'][0]}vw`
		
		button.style['aspect-ratio'] = `${project['size'][0]} / ${project['size'][1]}`
		
		button.addEventListener('click', function() {
			window.location.href = `php/${pointer}.php`
		})
		
		let img = document.createElement('img')
		button.append(img)

		img.style['position'] = 'absolute'
		img.setAttribute('id', `img-${pointer}`)
		img.setAttribute('class', `background_image`)
		img.setAttribute('src', `ex/${pointer}_preview.png`)

		let label = document.createElement('span')
		button.append(label)

		label.innerText = project['name'].toUpperCase()
		label.setAttribute('id', `label-${pointer}`)
		label.setAttribute('class', `project_label`)

		let gradient = document.createElement('div')
		// button.append(gradient)

		gradient.setAttribute('id', `gradient_${pointer}`)
		gradient.setAttribute('class', `gradient`)

		$('.divGrid').append(button)
	}
}

let setUUID = function() {
	if (localStorage.getItem('UUID')) {
		// Welcome back!

		return
	}

	let time = new Date().getTime()
	console.log(localStorage.getItem('UUID'))
	// localStorage.setItem('name', 'Will')
}

main()
setUUID()