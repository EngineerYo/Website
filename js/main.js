let main = function() {
	let buttons = $(`button`)
	buttons.each(function(i) {
		let node = $(this)
		node.click(function() {
			window.location.href = `../${node.attr('id')}`
		})
	})
}

main()