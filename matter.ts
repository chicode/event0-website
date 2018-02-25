import { Engine, World, Bodies, Constraint, Composites, Composite, Body } from 'matter-js'
import * as SVG from 'svg.js'
import { KeyEvent } from 'paper';

const ELEM = document.querySelector('#game') as HTMLElement
const app = SVG(ELEM)

const engine = Engine.create()

function createRope () {
	const location = [100, 100]
	const size = [10, 10]
	const bodies = [...Array(5).keys()].map(i => (
		Bodies.rectangle(
			location[0], location[1] + i * size[1],
			size[0], size[1],
		)
	))

	const composite = Composite.create({ bodies, label: 'rope' })
	Composites.chain(composite, -.5, 0, .5, 0, {})
	Composite.add(composite, Constraint.create({
		bodyB: composite.bodies[0],
		// pointB: { x: -20, y: 0 },
		pointA: { x: composite.bodies[0].position.x, y: composite.bodies[0].position.y },
		// stiffness: 0.5
	}))
	World.add(engine.world, composite)
	app.path(createPath(bodies)).id(composite.id.toString()).stroke({ width: 3 })
	// bodies.forEach(body => app.rect(size[0], size[1]).x(body.position.x).y(body.position.y).id(body.id.toString()))
}

createRope()

Engine.run(engine)
// Engine.update(engine)

function frame (timestep) {
	for (const composite of engine.world.composites) {
		if (composite.label.split(' ').includes('rope')) {
			// composite.bodies.forEach(body => {
			// 	SVG.get(body.id.toString()).x(body.position.x).y(body.position.y)
			// })
			;(SVG.get(composite.id.toString()) as SVG.Path).plot(createPath(composite.bodies))
		}
	}

	requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

// window.onkeypress = (event: KeyboardEvent) => {
// 	if (event.key === 'n') {
// 		Engine.update(engine)
// 		requestAnimationFrame(frame)
// 	}
// }

function createPath (bodies: Body[]) {
	// if is first body then move the svg otherwise draw a line
	return bodies.map((body, i) => [!i ? 'M' : 'L', body.position.x, body.position.y])
}
