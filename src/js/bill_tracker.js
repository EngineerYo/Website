/* 	TODO
	Send timestamp on ajax posts
	Get SSL set up such that I can do location requests
	Send coordinates on ajax posts
	Check if coordinates are near last post; ask for confirmation if they are?
	Reverse geocode the coordinates & find a business name or address?
	Send user on ajax posts?
*/

let init = function() {
	$('div#screw').each(function(i) {
		$(this).css('--rotation', `${Math.random()*180-90}deg`)
	})
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