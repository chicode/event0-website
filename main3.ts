import * as Paper from 'paper'

const ELEM = document.querySelector('canvas')

const SPACE_X = 40
const SPACE_Y = 40

Paper.setup(ELEM)

const squares = new Paper.Group()
for (let x = 0; x <= ELEM.clientWidth / SPACE_X; x++) {
	for (let y = 0; y <= ELEM.clientWidth / SPACE_Y; y++) {
		squares.addChild(
			new Paper.Path.Rectangle({
				strokeColor: 'black',
				point: [x * SPACE_X, y * SPACE_Y],
				size: [SPACE_X, SPACE_Y]
			})
		)
	}
}

const colors = ['#DBA159', '#EFD780', '#FCFDAF']
squares.skew(10, 0)
squares.onMouseMove = function (this: Paper.Item, mouse: Paper.MouseEvent) {
	for (let square of squares.children) {
		let distance = Math.floor(Math.sqrt(((square.position.x - mouse.point.x) / (SPACE_X)) ** 2 + ((square.position.y - mouse.point.y) / (SPACE_Y)) ** 2))

		if (distance < colors.length) {
			square.fillColor = colors[distance]
		} else {
			if (square.fillColor !== 'white') square.fillColor = 'white'
		}
	}
}
