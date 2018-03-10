import SVG from 'svg.js'

const svgElement = document.querySelector('.header .banner-svg')
const header = document.querySelector('.header .banner')
const appSun = SVG(svgElement)
appSun.style('position', 'absolute')

const sunSize = 150
const sunColor = 'white'
const moonColor = 'white'
const sun = appSun.circle(sunSize).fill(sunColor).y(70)

const angle = 50

// const colorDay = [255, 157, 157] // red
const colorDay = [189, 219, 255] // blue
const colorNight = [0, 0, 0]
header.style.background = rgb(colorDay)

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

function rgb(color) {
	return `rgb(${color.map(color => Math.floor(color)).join(',')})`
}

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
		header.style.background = rgb(color)
	}

	sun.rotate(rotation, rotateX, rotateY)
	rotation += rotateSpeed
}

const ELEM = document.querySelector('.svg')
const app = SVG(ELEM)
const img = [
	require('./img/console.svg'), require('./img/smartphone.svg'), require('./img/sidebar.svg')
]
const imgColor = [
	require('./img/console-color.svg'), require('./img/smartphone-color.svg'), require('./img/sidebar-color.svg')
]

const spawnRate = 60
const speed = 1000 * 3
const pipeElements = Array.from(document.querySelectorAll('.main .pipe .end'))
const size = pipeElements[0].offsetHeight
const transformer = document.querySelector('.main .help')
const end = document.querySelector('.main .awards')
let items = []
function createItem(i) {
	const item = app.image(img[i], size)
	item
		.cx(pipeElements[i].offsetLeft + pipeElements[i].offsetWidth / 2)
		.cy(pipeElements[i].offsetTop + pipeElements[i].offsetHeight / 2)
		.addClass(i)
		.animate(speed)
		.y(end.offsetTop)
		.during(function() {
			if (this.y() >= transformer.offsetTop) {
				this.load(imgColor[this.attr('class')])
			}
		})
		.after(function() {
			items = items.filter(item => item !== this)
			this.remove()
		})
	return item
}
function updatePipes(frame) {
	if (frame % spawnRate === 0) {
		items.push(createItem(randRange(3)))
	}
}

let frame = 0
function update() {
	updateSun(frame)
	updatePipes(frame)

	frame++
	window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

function randRange(range) {
	return Math.floor(Math.random() * range)
}
