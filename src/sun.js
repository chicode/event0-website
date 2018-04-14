import SVG from 'svg.js'

const svgElement = document.querySelector('.header .banner-svg')
const header = document.querySelector('.header .banner')
const appSun = SVG(svgElement)
appSun.style('position', 'absolute')

let sunSize = 150
const red = [255, 109, 104]
const blue = [189, 219, 255]
const purple = [106, 80, 121]
const sunColor = 'white'
const moonColor = 'white'
const sun = appSun.circle(sunSize).fill(sunColor).y(70)

const angle = 50

const colorDay = purple.slice()
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
	rotateSpeed = .1

	rotation = -angle
	color = [...colorDay]
	night = false
	transitioning = false
	slopes = colorNight.map((num, i) => (num - colorDay[i]) / (angle * 2 / rotateSpeed))
	let size = (window.innerWidth - 400) / 9
	if (size <= 100) {
		size = 100
	}
	sun.size(size)

	if (window.innerWidth < 500) {
		sun2.stop().fill('none')
		rails.style.marginRight = 0
	} else {
		sun2Size = window.innerWidth / 12.8
		margin = window.innerWidth / 24
		sun2
			.cx(rails.getBoundingClientRect().left)
			.size(sun2Size)
		rails.style.marginRight = sun2Size / 2 + margin + "px";
	}
}
// window.onresize = resize

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

const sun2Element = document.querySelector('.schedule .svg')
const sun2App = SVG(sun2Element)
const rails = document.querySelector('.schedule .timestrip')
const sun2duration = 8 * 1000
let sun2Size = window.innerWidth / 12.8
let margin = window.innerWidth / 24

rails.style.marginRight = sun2Size / 2 + margin + 'px'
console.log(rails.offsetLeft, rails.offsetTop, rails.offsetWidth)
const sun2 = sun2App
	.circle(sun2Size)
	.cx(rails.getBoundingClientRect().left)
	.fill(rgb(red))

function animate(object) {
	object
		.animate(sun2duration, '<')
		.y((rails.offsetHeight - sun2Size) / 2)
		.fill(rgb(purple))
		.animate(sun2duration, '>')
		.fill(rgb(red))
		.y(rails.offsetHeight - sun2Size)
		.after(() => {
			this.y(0)
			animate(this)
		})
}

animate(sun2)
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

resize()
