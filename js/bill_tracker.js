let init = function() {
	$('.screw').css('--rotation', `${Math.random()*100-50}deg`)
	// This doesn't work :(
}

let main = function() {
	$('.switcher').on('click', function() {
		$('.x').toggleClass('loading', true)
		$.post(
			'../php/bill_tracker_input.php', 
			{
				value: 	$('.container').attr('id'),
				stamp:	new Date().getTime()
			}, 
			function(in_json) {
				let [state, stamp] = JSON.parse(in_json)

				$('.background').attr('id', state)
				$('.x').toggleClass('will', [false, true][state])
				$('.x').toggleClass('sarah', [true, false][state])
				$('.x').toggleClass('loading', false)

				if (navigator.geolocation) console.log('!')
				navigator.geolocation.getCurrentPosition(printPosition)

				function printPosition(position) {
					console.log(position.coords)
				}
			}
		)
	})
}
let update = function() {
	$.get(
		'../php/bill_tracker_req.php',
		function(in_json) {
			let [state] = JSON.parse(in_json)

			$('.container').attr('id', state)
			$('.x').toggleClass('will', [false, true][state])
			$('.x').toggleClass('sarah', [true, false][state])
		}
	)
}

$(document).ready(function() {
	init()
	update()
	main()
	setInterval(update, 1000)

	document.body.addEventListener('touchmove', function(e) {
		e.preventDefault()
	})
})