class Roulette {
	constructor(scope) {
		let {description, data} = scope

		this.description = description
		this.data = data

		this.radius = d3.select('body').node().offsetHeight*0.4

		this.wheelAngle = 0
		this.ballAngle = 0
		this.angleToSpinWheel = 0

		this.ballUpTime = 0
		this.ballDownTime = 2
		this.spinUpTime = 1
		this.spinDownTime = 3

		this.spinTime = 0

		this.stage = 0
		this.stageTimer = 0

		this.wheelSpeed = 1
		this.ballSpeed = 0.1

		this.prevSelect
		this.prevColor

		let colors = {
			red: '#E0080B',
			black:	'#000000',
			green:	'#016D29'
		}
		this.colorOrder = [colors['red'], colors['black'], colors['green']]

		this.pockets = []
	}

	build(scope) {
		let {minL, maxL} = scope

		// Check for even pocket count
		if (this.data%2 != 0) return

		// Create shuffled list of labels for assignment
		let nFullIter = Math.floor(this.data / (maxL - minL + 1))
		let labelArray = []
		for (let i = 0; i < nFullIter; i += 1) {
			for (let j = minL; j <= maxL; j += 1) {
				labelArray.push(j)
			}
		}
		
		// Now get remainder
		let remainder = this.data - nFullIter*(maxL - minL + 1)
		for (let i = 0; i < remainder; i += 1) {
			// Random number between minL and maxL
			labelArray.push(Math.ceil(Math.random()*(maxL-minL)+minL))
		}

		// Shuffle labelArray
		let rLabelArray = labelArray.sort( (a, b) => 0.5 - Math.random())

		// Add a pocket for the 0 slot first
		// Assign pockets for given data
		for (let n = 0; n < this.data; n++) {
			this.pockets.push({
				type: n%2,
				label: rLabelArray[n]
			})
		}

		// Create extra green pocket
		let greenPocket = {
			type: 2,
			label: '0'
		}

		// Add green pockets to the front
		this.pockets.unshift(greenPocket)

		// Add green pocket to middle
		this.pockets.splice(this.data/2+1, 0, greenPocket)

		this.init()
		return this
	}

	init() {
		d3.select('body').append('svg')
			.attr('width', '100%').attr('height', '100%')
		
		let windowSize = d3.select('svg').node().getBoundingClientRect()

		d3.select('svg').append('g')
			.attr('id', 'container')
			.attr('transform', `translate(${windowSize.width/2-this.radius} ${windowSize.height/2-this.radius}) rotate(${this.angleToSpinWheel})`)
			.attr('transform-origin', `${this.radius} ${this.radius}`)

		// Math stuff for later
		let arcWidth = Math.PI*2/this.pockets.length
		let prevAngle = (-1 * arcWidth/2) + this.wheelAngle

		// Draw pockets
		for (let i = 0; i < this.pockets.length; i++) {

			// Create pocket arcs
			const outerArc = d3.arc()
			.innerRadius(this.radius*(3/4)).outerRadius(this.radius*(4/4))
			.startAngle(prevAngle).endAngle(prevAngle+arcWidth)

			const innerArc = d3.arc()
				.innerRadius(this.radius*(2/4)).outerRadius(this.radius*(3/4))
				.startAngle(prevAngle).endAngle(prevAngle+arcWidth)

			const textArc = d3.arc()
				.innerRadius(this.radius*(27/32)).outerRadius(this.radius*(27/32))
				.startAngle(prevAngle).endAngle(arcWidth+prevAngle)

			// Draw paths
			d3.select('g').append('path')
				.attr('id', `outerArc-${i}`)
				.attr('d', outerArc)
				.attr('transform', `translate(${this.radius}, ${this.radius})`)
				.style('stroke', 'white').style('stroke-width', '0')
				.style('fill', this.colorOrder[this.pockets[i].type])

			d3.select('g').append('path')
					.attr('id', `innerArc-${i}`).attr('class', 'innerArc')
					.attr('d', innerArc)
					.attr('transform', `translate(${this.radius}, ${this.radius})`)
					.style('stroke', 'white').style('stroke-width', '4')
					.style('fill', d3.rgb(this.colorOrder[this.pockets[i].type]).darker().toString())
			
			d3.select('g').append('path')
				.attr('id', `edge-${i}`)
				.attr('d', textArc)
				.attr('transform', `translate(${this.radius}, ${this.radius})`)
				.style('stroke', 'none').style('fill', 'none')

			// Apply text labels
			d3.select('g').append('text')
			.style('font', `${this.radius/4}px arial`).style('font-weight', 20)
			.style('text-anchor', 'middle')
			.style('fill', 'white')
			.append('textPath')
				.attr('xlink:href', `#edge-${i}`)
				.attr('startOffset', '25%')
				.text(this.pockets[i].label)
				.attr('alignment-baseline', 'middle')

			prevAngle += arcWidth
		}
		// Create center 3/4 ring
		d3.select('g').append('circle')
			.attr('id', 'center-arc')
			.attr('cx', this.radius).attr('cy', this.radius)
			.attr('r', this.radius*3/4)
			.style('fill', 'none')
			.style('stroke', '#777777').style('stroke-width', 4)

		// Create center transparent circle
		d3.select('g').append('circle')
			.attr('id', 'center-circle')
			.attr('r', this.radius*(2/4))
			.attr('cx', this.radius).attr('cy', this.radius)
			.attr('fill', '#00000066')
			.attr('stroke', 'white').style('stroke-width', 3)

	// Create ball
	d3.select('g').append('circle')
		.attr('id', 'ball')
		.attr('cx', this.radius).attr('cy', this.radius*(1-5/8))
		.attr('cx', this.radius + this.radius*(5/8)*Math.cos(this.ballAngle)).attr('cy', this.radius+this.radius*(5/8)*Math.sin(this.ballAngle))
		.attr('r', 20)
		.style('fill', 'white')

		
	d3.select(`#innerArc-4`).node().classList.add('selected')
	this.prevSelect = 'innerArc-4'

	}


	render() {
		let windowSize = d3.select('svg').node().getBoundingClientRect()

		// Rotate assembly
		d3.select('svg').select('g')
			.attr('transform', `translate(${windowSize.width/2-this.radius} ${windowSize.height/2-this.radius}) rotate(${this.angleToSpinWheel})`)
			.attr('transform-origin', `${this.radius} ${this.radius}`)

		// Rotate ball
		d3.select('g').select('#ball')
			.attr('cx', this.radius + this.radius*(5/8)*Math.cos(this.ballAngle)).attr('cy', this.radius+this.radius*(5/8)*Math.sin(this.ballAngle))
	}

	spin(timeToSpin=3) {
		if (this.stage != 0) {
			return
		}
		let [minTime, maxTime] = [timeToSpin*0.75, timeToSpin*1.75]
		let deltaSpinTime = Math.random()*(maxTime-minTime) + minTime

		this.spinTime = deltaSpinTime
		this.stageTimer = 0

		this.animate()

		return this
	}

	animate() {
		let frameRate = 1/120
		let wheelSpinRate = 1
		let ballSpinRate = 0.1

		if (this.ballAngle >= Math.PI*2) {
			this.ballAngle -= Math.PI*2
		}
		else if (this.ballAngle <= Math.PI*2) {
			this.ballAngle += Math.PI*2
		}
		if (this.wheelAngle >= Math.PI*2) {
			this.wheelAngle -= Math.PI*2
		}
		else if (this.wheelAngle <= Math.PI*2) {
			this.wheelAngle += Math.PI*2
		}

		this.stageTimer += frameRate

		// Wind wheel up
		if (this.stage == 0) {
			// Linear interpolation between stationary and wheelSpinRate
			wheelSpinRate = this.wheelSpeed*(1-(1-(this.stageTimer / this.spinUpTime)))

			if (this.stageTimer >= this.spinUpTime) {
				this.stage += 1
				this.stageTimer = 0
			}
		}

		// Wait 1s
		else if (this.stage == 1) {

			if (this.stageTimer >= 1) {
				this.stage += 1
				this.stageTimer = 0
			}
		}

		// Ball windup
		else if (this.stage == 2) {
			this.ballAngle -= ballSpinRate

			this.stage += 1
			this.stageTimer = 0
		}
		
		// Rotate ball
		else if (this.stage == 3) {
			this.ballAngle -= ballSpinRate

			// Did we run out of spin time?
			if (this.stageTimer >= this.spinTime) {
				this.stage += 1
				this.stageTimer = 0
			}
		}

		// Wind ball down
		else if (this.stage == 4) {
			ballSpinRate = 0.1 * (1-(this.stageTimer / this.ballDownTime))
			this.ballAngle -= ballSpinRate

			if (this.stageTimer >= this.ballDownTime) {
				this.stage += 1
				this.stageTimer = 0
			}
		}

		// Wait 1s
		else if (this.stage == 5) {
			if (this.stageTimer >= 1) {
				this.stage += 1
				this.stageTimer = 0
			}
		}

		// Wheel wind down
		else if (this.stage == 6) {
			wheelSpinRate = this.wheelSpeed * (1-this.stageTimer / this.spinDownTime)
			this.spinDown -= frameRate

			if (this.stageTimer >= this.spinDownTime) {
				this.stage = 0
				this.stageTimer = 0

				return
			}
		}
		
		if (this.prevSelect != null) {
			// d3.select(`#${this.prevSelect}`).style('fill', this.prevColor)
			d3.select(`#${this.prevSelect}`).node().classList.remove('selected')
		}

		let ballRect = d3.select('#ball').node().getBoundingClientRect()
		let ballRectCenter = [(ballRect.left + ballRect.right)/2, (ballRect.top + ballRect.bottom)/2]

		// Iterate over ever pocket, find closest to ball
		let cElement, cDistance
		let pocketNodes = d3.selectAll('.innerArc').nodes()
		for (let i = 0; i < pocketNodes.length; i += 1) {
			// Calculate distance
			let arcRect = pocketNodes[i].getBoundingClientRect()
			let arcRectCenter = [(arcRect.left + arcRect.right)/2, (arcRect.top + arcRect.bottom)/2]
			let distance = Math.pow(Math.pow(arcRectCenter[0] - ballRectCenter[0], 2) + Math.pow(arcRectCenter[1] - ballRectCenter[1], 2), 0.5)

			if (!cElement || distance < cDistance) {
				cElement = pocketNodes[i]
				cDistance = distance
			}
		}


		this.prevSelect = cElement.id
		this.prevColor = d3.select(`#${cElement.id}`).style('fill')
		console.log(this.prevColor)
		// d3.select(`#${cElement.id}`).style('fill', 'blue')
		d3.select(`#${cElement.id}`).node().classList.add('selected')

		this.toSpin = wheelSpinRate
		this.angleToSpinWheel += wheelSpinRate
		this.wheelAngle += wheelSpinRate

		this.render()

		let that = this
		let spinTimeout = setTimeout(function() {
			that.animate()
		}, frameRate*1000)
	}
}