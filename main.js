import * as PIXI from 'pixi.js'

const CANVAS = document.getElementById('header-canvas')

const STYLE = new PIXI.TextStyle({
	fontFamily: 'Inconsolata',
	fontSize: 60,
	fill: 'rgba(255, 255, 255, .3)'
})

const SPACE_X = 40
const SPACE_Y = 60
const SPEED = 0.5

function createText (app, x, y) {
	const richText = new PIXI.Text('0', STYLE)
	richText.x = x * SPACE_X
	richText.y = y * SPACE_Y

	app.stage.addChild(richText)
}

function main (app, delta) {
	app.stage.x -= SPEED * delta
	app.stage.y -= SPEED * delta
	if (app.stage.x < -SPACE_X) {
		app.stage.x = 0
	}
	if (app.stage.y < -SPACE_Y) {
		app.stage.y = 0
	}
}

function createApp () {
	const app = new PIXI.Application({
		view: CANVAS,
		transparent: true,
		width: CANVAS.clientWidth,
		height: CANVAS.clientHeight,
	})

	for (let x = 0; x <= CANVAS.clientWidth / SPACE_X + 1; x++) {
		for (let y = 0; y <= CANVAS.clientHeight / SPACE_Y + 1; y++) {
			setTimeout(() => createText(app, x, y), x * 10)
		}
	}

	app.ticker.add(delta => main(app, delta))

	return app
}

let app = createApp()

window.onresize = () => {
	app.destroy()
	app = createApp()
}
