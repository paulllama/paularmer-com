const initLinks = () => {
	document.querySelectorAll('a').forEach(a => {
		a.setAttribute('target', '_blank')
	})
}

const initIcons = () => {
	const ACTIVE_CLASS = 'active'

	document.querySelectorAll("#desktop figure").forEach(fig => {
		const name = fig.getAttribute('name')

		fig.onclick = () => {
			document.querySelectorAll('#window article').forEach(art => {
				art.classList.remove(ACTIVE_CLASS)
			})
			const activeArt = document.querySelector(`#window article[name='${name}']`) || document.querySelector(`#window article[name='soon']`)
			activeArt.classList.add(ACTIVE_CLASS)
		}
	})
}

const initToolbar = () => {
	const startButton = document.querySelector('#toolbar button')
	startButton.onclick = () => window.location.reload()
}

(function () {
	initLinks()
	initIcons()
	initToolbar()
})();