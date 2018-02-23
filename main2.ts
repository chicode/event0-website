import SVG from 'svg.js'
import Two from 'two.js'

const ELEM: HTMLElement = document.querySelector('#game')

const SPACE_X = 20
const SPACE_Y = 20

const type: string = 'svg'

let app: SVG.Doc
if (type === 'two') {
	app = new Two({
		width: ELEM.clientWidth,
		height: ELEM.clientHeight,
	}).appendTo(ELEM)
} else if (type === 'svg') {
	app = SVG(ELEM)
}

for (let x = 0; x <= ELEM.clientWidth / SPACE_X; x++) {
	for (let y = 0; y <= ELEM.clientWidth / SPACE_Y; y++) {
		if (type === 'two') {
			app.makeRectangle(x * SPACE_X, y * SPACE_Y, SPACE_X, SPACE_Y)
		} else if (type === 'svg') {
			app.rect(x * SPACE_X, y * SPACE_Y, SPACE_X, SPACE_Y).attr({
				fill: 'transparent',
				stroke: 'black',
			})
		} else if (type === 'snap') {
			// Snap.rect(x * SPACE_X, y * SPACE_Y, SPACE_X, SPACE_Y)
		} else {
			// Paper.Rectangle(x * SPACE_X, y * SPACE_Y, SPACE_X, SPACE_Y)
		}
	}
}

if (type === 'two') {
	app.update()
}
