(function () {
	const ACTIVE_CLASS = 'active'

	document.querySelectorAll("#desktop figure").forEach(fig => {
		const name = fig.getAttribute('name')
		console.log(`setting up ${name}`)

		fig.onclick = () => {
			console.log(`showing ${name}`)
			document.querySelectorAll('#window article').forEach(art => {
				art.classList.remove(ACTIVE_CLASS)
			})
			const activeArt = document.querySelector(`#window article[name='${name}']`)
			if (activeArt) {
				activeArt.classList.add(ACTIVE_CLASS)
			} else {
				console.error(`No window for ${name}!`)
			}
		}
	})

	const startButton = document.querySelector('#toolbar button')
	startButton.onclick = () => window.location.reload()
})();