let getDeltaTime = function() {
	let startTime = new Date(2022, 9, 31, 2)
	let endTime =	new Date(2022, 10, 4, 20)
	let duration = endTime - startTime

	let scaleFactor = (50 * 365 * 24 * 60 * 60 * 1000) / duration

	let nowTime = new Date()
	let timeRemaining = endTime - nowTime

	let {hours, days, months, years} = unixDuration(timeRemaining*scaleFactor)

	if (endTime < nowTime) {
		$('.counter#years').text(`0 years`)
		$('.counter#months').text(`0 months`)
		$('.counter#days').text(`0 days`)
		$('.counter#hours').text(`0 hours`)
	}
	else {
		$('.counter#years').text(`${years} ${years!=1 ? 'years' : 'year'}`)
		$('.counter#months').text(`${months} ${months!=1 ? 'months' : 'month'}`)
		$('.counter#days').text(`${days} ${days!=1 ? 'days' : 'day'}`)
		$('.counter#hours').text(`${hours} ${hours!=1 ? 'hours' : 'hour'}`)
	}
}

let unixToDays = function(stamp) {
	return stamp / (1000 * 60 * 60 * 24)
}

let unixDuration = function(stamp) {
	let outObj = {minutes: 0, hours: 0, days: 0, months: 0, years: 0}

	// Get years
	const yearConst = 1000 * 60 * 60 * 24 * 365
	let numYears = Math.floor(stamp / yearConst)
	outObj['years'] = numYears
	if (numYears >= 1) {
		stamp -= numYears*yearConst
	}

	// Get months
	const monthConst = 1000 * 60 * 60 * 24 * 30
	let numMonths = Math.floor(stamp / monthConst)
	outObj['months'] = numMonths
	if (numMonths >= 1) {
		stamp -= numMonths*monthConst
	}

	// Get days
	const dayConst = 1000 * 60 * 60 * 24
	let numDays = Math.floor(stamp / dayConst)
	outObj['days'] = numDays
	if (numDays >= 1) {
		stamp -= numDays*dayConst
	}

	// Get hours
	const hourConst = 1000 * 60 * 60
	let numHours = Math.floor(stamp / hourConst)
	outObj['hours'] = numHours
	if (numHours >= 1) {
		stamp -= numHours*hourConst
	}
	
	// Get minutes
	const minuteConst = 1000 * 60
	let numMinutes = Math.floor(stamp / minuteConst)
	outObj['minutes'] = numMinutes
	if (numMinutes >= 1) {
		stamp -= numMinutes*minuteConst
	}

	return outObj
}

setInterval(getDeltaTime, 10)