import SVG from 'svg.js'

const svgElement = document.querySelector('.header .banner-svg')
const header = document.querySelector('.header .banner')
const appSun = SVG(svgElement)
appSun.style('position', 'absolute')

const sunSize = 150
const sunColor = 'white'
const moonColor = 'yellow'
const sun = appSun.circle(sunSize).fill(sunColor).y(70)

const angle = 50

const colorDay = [255, 163, 160]
const colorNight = [0, 0, 0]
// const colorNight = [55, 66, 80]

let rotateX, rotateY, rotation, rotateSpeed, night, transitioning, color, slopes
function resize() {
	const circleWidth = -header.clientWidth * .04 + 200
	const circle = document.querySelector('.circle')
	circle.style.left = '-' + ((circleWidth - 100) / 2) + '%'
	circle.style.width = circleWidth + '%'

	sun.rotate(0, rotateX, rotateY)
	rotateX = header.clientWidth / 2
	rotateY = header.clientWidth
	sun.cx(header.clientWidth / 2)
	rotateSpeed = Math.atan(500 / header.clientWidth)

	rotation = -angle
	color = [...colorDay]
	night = false
	transitioning = false
	slopes = colorNight.map((num, i) => (num - colorDay[i]) / (angle * 2 / rotateSpeed))
}
window.onresize = resize
resize()

function updateSun() {
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
	rotation += rotateSpeed
}

const ELEM = document.querySelector('.svg')
const app = SVG(ELEM)
for (let source of ['./img/console.svg', './img/smartphone.svg', './img/sidebar.svg']) {
	console.log(import(source).then(data => console.log(data)))
}
const img = Promise.all(['./img/console.svg', './img/smartphone.svg', './img/sidebar.svg'].map(source => require(source)))
const imgColor = Promise.all(['./img/console-color.svg', './img/smartphone-color.svg', './img/sidebar-color.svg'].map(source => import(source)))

const spawnRate = 60
const size = 10
const tubes = Array.from(document.querySelectorAll('.main .tube .end'))
const end = document.querySelector('.main .awards')
const items = tubes.map((tube, i) =>
	app
		.image(img[i], size)
		.cx(tube.offsetLeft + tube.offsetWidth / 2)
		.cy(tube.offsetTop + tube.offsetHeight / 2)
		.addClass(i)
		.animate(3)
		.pause()
		.y(end.offsetTop)
)
function updatePipes() {
	items.push(items[randRange(3)].clone().play())
}

function update() {
	updateSun()
	updatePipes()

	window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

function randRange(range) {
	return Math.floor(Math.random() * range)
}
