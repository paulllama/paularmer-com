const initLinks = () => {
	document.querySelectorAll('a').forEach(a => {
		a.setAttribute('target', '_blank')
	})
}

const initIcons = () => {
	const ACTIVE_CLASS = 'active'
	const HIDE_CLASS = 'hide'

	document.querySelectorAll("#desktop figure").forEach(fig => {
		const name = fig.getAttribute('name')

		fig.onclick = () => {
			document.querySelectorAll('#window article').forEach(art => {
				art.classList.remove(ACTIVE_CLASS)
				art.classList.add(HIDE_CLASS)
			})
			const activeArt = document.querySelector(`#window article[name='${name}']`) || document.querySelector(`#window article[name='soon']`)
			activeArt.classList.remove(HIDE_CLASS)
			activeArt.classList.add(ACTIVE_CLASS)
		}
	})
}

const initWindows = () => {
	document.querySelectorAll('#window header').forEach(header => {
		const xButton = document.createElement('button')
		xButton.onclick = () => {
			header.parentElement.classList.remove('active')
		}

		header.appendChild(xButton)
	})
}

const initToolbar = () => {
	const startButton = document.querySelector('#toolbar button')
	startButton.onclick = () => window.location.reload()
}

(function () {
	initLinks()
	initIcons()
	initWindows()
	initToolbar()
})();