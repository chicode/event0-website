import * as SVG from 'svg.jsistance = Math.floor(Math.sqrt(
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
