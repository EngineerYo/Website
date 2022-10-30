let main = function() {
	let buttons = $(`button`)
	buttons.each(function(i) {
		let node = $(this)
		node.click(function() {
			let windowLocation = `html/${node.attr('id')}.html`
			// console.log(windowLocation)
			window.location.href = windowLocation

		})
	})
}

main()