import * as SVG from 'svg.js'

const ELEM = document.querySelector('#game')

const SPACE_X = 40
const SPACE_Y = 40


function init (app) {
	const squares = app.group()
	for (let x = 0; x <= ELEM.clientWidth / SPACE_X; x++) {
		for (let y = 0; y <= ELEM.clientWidth / SPACE_Y; y++) {
			squares
				.rect(SPACE_X, SPACE_Y)
				.attr({
					fill: 'white',
					stroke: 'rgb(100, 100, 100)',
					x: SPACE_X * x,
					y: SPACE_Y * y,
				})
		}
	}

	const colors = ['#DBA159', '#EFD780', '#FCFDAF']
	squares
		.skew(10, 3)
		.scale(1.2)
		.mousemove(function (this: SVG.G, mouse: any) {
			this.each(function (this: SVG.Element) {
				const square = this as SVG.Rect
				const rect = square.node.getBoundingClientRect()
				const x = (rect.left + rect.right) / 2
				const y = (rect.top + rect.bottom) / 2
				let distance = Math.floor(Math.sqrt(
					((x - mouse.clientX) / SPACE_X) ** 2 +
					((y - mouse.clientY) / SPACE_Y) ** 2
				) - .9)

				if (distance < colors.length) {
					square.attr({ fill: colors[distance] })
				} else {
					if (square.attr('fill') !== 'white') square.attr({ fill: 'white' })
				}
			})
		})
}

const app = SVG(ELEM as HTMLElement).size(ELEM.clientWidth, ELEM.clientHeight)
init(app)

window.onresize = (resize) => {
	app
		.size(ELEM.clientWidth, ELEM.clientHeight)
		.clear()
	init(app)
}
