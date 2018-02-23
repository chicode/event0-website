import Two from 'two.js'

const ELEM = document.querySelector('#game')

const SPACE_X = 20
const SPACE_Y = 20

const app = new Two({
	width: ELEM.clientWidth,
	height: ELEM.clientHeight,
}).appendTo(ELEM)

const squares = app.makeGroup()
for (let x = 0; x <= ELEM.clientWidth / SPACE_X; x++) {
	for (let y = 0; y <= ELEM.clientWidth / SPACE_Y; y++) {
		squares.add(
			app.makeRectangle(SPACE_X * x, SPACE_Y * y, SPACE_X, SPACE_Y)

		)
	}
}

app.update()

const colors = ['#DBA159', '#EFD780', '#FCFDAF']
squares._renderer.elem.addEventListener('mouseover', mouse => {
	for (let square of squares.children) {
		const rect = square.getBoundingClientRect()
		const x = (rect.left + rect.right) / 2
		const y = (rect.top + rect.bottom) / 2
		let distance = Math.floor(Math.sqrt(((x - mouse.clientX) / (SPACE_X)) ** 2 + ((y - mouse.clientY) / (SPACE_Y)) ** 2))

		if (distance < colors.length) {
			square.fill = colors[distance]
		} else {
			if (square.fill !== 'white') square.fill = 'white'
		}
	}
	app.update()
})
