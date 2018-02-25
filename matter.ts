import { Engine, World, Bodies, Constraint, Composites, Composite } from 'matter-js'
import * as SVG from 'svg.js'

const ELEM = document.querySelector('#game') as HTMLElement
const app = SVG(ELEM)

const engine = Engine.create()

// World.add(engine.world, [...Array(5).keys()].map((i) => (
// 	Bodies.rectangle(i * 10, 0, 10, 10)
// )))

// const constraint = Constraint.create({
// 	pointA: { x: 100, y: 30 },
// 	bodyB: body,
// 	// pointB: { x: 400, y: 10 },
// 	// length: 500,
// 	// stiffness: .1,
// })

function createRope () {
	const bodies = []
	for (let i = 0; i < 5; i++) {
		const body = Bodies.rectangle(500, 30 + i * 10, 10, 10)
		app.rect(10, 10).id(body.id.toString())
		bodies.push(body)
	}

	const composite = Composite.create({ bodies })
	Composites.chain(composite, 0.5, 0, -0.5, 0, {})
	Composite.add(composite, Constraint.create({
		bodyB: composite.bodies[0],
		// pointB: { x: -20, y: 0 },
		pointA: { x: composite.bodies[0].position.x, y: composite.bodies[0].position.y },
		// stiffness: 0.5
	}))
	World.add(engine.world, composite)
}

createRope()

Engine.run(engine)

function frame (timestep) {
	for (const body of engine.world.composites[0].bodies) {
		app.get(body.id).x(body.position.x).y(body.position.y)
	}

	requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
