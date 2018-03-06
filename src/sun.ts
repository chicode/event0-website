import * as SVG from 'svg.js'

const svgElement = document.querySelector('.header .banner-svg') as HTMLElement
const header = document.querySelector('.header .banner') as HTMLElement
const app = SVG(svgElement)
app.style('position', 'absolute')

const sunSize = 150
const sunColor = 'white'
const moonColor = 'yellow'
const sun = app.circle(sunSize).fill(sunColor).y(70)

const angle = 50

const colorDay = [255, 163, 160]
const colorNight = [0, 0, 0]
// const colorNight = [55, 66, 80]

let rotateX, rotateY, rotation, rotateSpeed, night, transitioning, color, slopes
function resize() {
	const circleWidth = -header.clientWidth * .04 + 200
	const circle = document.querySelector('.circle') as HTMLElement
	circle.style.left = '-' + ((circleWidth - 100) / 2) + '%'
	circle.style.width = circleWidth + '%'

	sun.rotate(0, rotateX, rotateY)
	rotateX = header.clientWidth / 2
	rotateY = header.clientWidth
	sun.cx(header.clientWidth / 2)
	rotateSpeed = Math.atan(500/header.clientWidth)

	rotation = -angle
	color = [...colorDay]
	night = false
	transitioning = false
	slopes = colorNight.map((num, i) => (num - colorDay[i]) / (angle * 2 / rotateSpeed))
}
window.onresize = resize
resize()

function update() {
	if (rotation >= angle) {
		rotation = -angle
		transitioning = !transitioning
		if (transitioning) {
			night = !night
			sun.fill(night ? moonColor : sunColor)
		}
	}
	if (transitioning) {
		color = color.map((num, i) => num += slopes[i] * (night ? 1 : -1))
		header.style.background = `rgb(${color.map(color => Math.floor(color)).join(',')})`
	}

	sun.rotate(rotation, rotateX, rotateY)
	window.requestAnimationFrame(update)
	rotation += rotateSpeed
}
window.requestAnimationFrame(update)
