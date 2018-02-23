import Two from 'two.js'

const ELEM = document.querySelector('#game')

const SPACE_X = 30
const SPACE_Y = 40
const OFFSET_X = 5
const OFFSET_Y = 5
const ANGLE_X = Math.atan(OFFSET_X / SPACE_Y)
const ANGLE_Y = Math.atan(OFFSET_Y / SPACE_X)
const EXTRA_X = Math.tan(ANGLE_X) * ELEM.clientHeight + SPACE_X
const EXTRA_Y = Math.tan(ANGLE_Y) * ELEM.clientWidth + SPACE_Y
const EXTRA_Y2 = EXTRA_X * EXTRA_X / ELEM.clientHeight
const EXTRA_X2 = EXTRA_Y * EXTRA_Y / ELEM.clientWidth
// const EXTRA_X = 0
// const EXTRA_Y = 0
// const EXTRA_X2 = 0
// const EXTRA_Y2 = 0
console.log(EXTRA_Y / SPACE_Y, EXTRA_X / SPACE_X)
console.log(EXTRA_Y2 / SPACE_Y, EXTRA_X2 / SPACE_X)
function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

const SPEED = 0.5
const ANGLE_VERTICAL = Math.PI * .3

const ANGLE_HORIZONTAL = Math.PI * .4


function create (app, x, y, x2, y2) {
	const line = app.makeLine(x, y, x2, y2)
	line.stroke = 'rgb(180, 180, 180)'
	line.vertices.forEach(vertice => console.log(vertice.x, vertice.y))
	// line.vertices.forEach(vertice => vertice.y += (y2 - y) / 2)
	line.vertices.forEach(vertice => console.log(vertice.x, vertice.y))
	// line.translation.y -= (y2 - y) / 2
	line.rotation = ANGLE_VERTICAL
	return line
}

// function main (app, delta) {
// 	app.stage.x -= SPEED * delta
// 	app.stage.y -= SPEED * delta
// 	if (app.stage.x < -SPACE_X) {
// 		app.stage.x = 0
// 	}
// 	if (app.stage.y < -SPACE_Y) {
// 		app.stage.y = 0
// 	}
// }

let polygons
function createApp () {
	polygons = []

	for (let x = Math.floor(-EXTRA_X / SPACE_X); x <= Math.ceil((ELEM.clientWidth + EXTRA_X2) / SPACE_X); x++) {
		for (let y = Math.floor(-EXTRA_Y / SPACE_Y); y <= Math.ceil((ELEM.clientHeight + EXTRA_Y2) / SPACE_Y); y++) {
			const x1 = x * SPACE_X + y * OFFSET_Y
			const y1 = y * SPACE_Y + x * OFFSET_X
			polygons.push(app.makePath(x1, y1, x1 + SPACE_X, y1 + OFFSET_Y, x1 + SPACE_X + OFFSET_X, y1 + SPACE_Y + OFFSET_Y, x1 + OFFSET_X, y1 + SPACE_Y, false))
			// setTimeout(() => createText(app, x * SPACE_X, y * SPACE_Y), x * 10)
			console.log()
			// lines.push(create(app, 0, y * SPACE_Y, ELEM.clientWidth / Math.cos(ANGLE_HORIZONTAL), y * SPACE_Y))
		}
	}
	app.update()
		// lines.push(create(app, x * SPACE_X, 0, x * SPACE_X, ELEM.clientHeight / Math.cos(ANGLE_VERTICAL))) }
	// app.bind('update', () => {
	// 	lines.forEach(line => line.rotation += .01)
	// })
	for (let polygon of polygons) {
		polygon._renderer.elem.addEventListener('mouseover', () => {
			polygon.fill = 'red'
		})
	}
}

const app = new Two({
	width: ELEM.clientWidth,
	height: ELEM.clientHeight,
}).appendTo(ELEM)

createApp()
app.bind('update', mainframeCount => {
	for (let polygon of polygons) {
		polygon.fill = 'white'
	}
	// app.scene.rotation += .01
	// player.translation.addSelf(new Two.Vector(2, 2))
})
app.play()

window.onresize = () => {
	app.clear()
	app.width = ELEM.clientWidth
	app.height = ELEM.clientHeight
	createApp()
}
