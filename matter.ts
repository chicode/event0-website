import { Engine, World, Bodies, Constraint, Composites, Composite, Body, Composites } from 'matter-js'
import * as SVG from 'svg.js'
import { KeyEvent } from 'paper';

const ELEM = document.querySelector('#game') as HTMLElement
const app = SVG(ELEM)

const engine = Engine.create()

function createRope (beginning, end, width, segments = 10, depth = 1) {
	const slope = [(end[0] - beginning[0]) / segments, (end[1] - beginning[1]) / segments]
	const bodies = [...Array(segments).keys()].map(i => (
		Bodies.rectangle(
			beginning[0] + i * slope[0], beginning[1] + i * slope[1],
			.01, 1,
		)
	))

	const composite = Composite.create({ bodies, label: 'path' })
	Composite.add(composite, Constraint.create({
		bodyB: composite.bodies[0],
		// pointB: { x: -20, y: 0 },
		pointA: { x: composite.bodies[0].position.x, y: composite.bodies[0].position.y },
	}))
	Composites.chain(composite, .5, 0, -.5, 0, {})
	World.add(engine.world, composite)
	app.path(createPath(bodies)).id(composite.id.toString()).stroke({ width }).fill('none')
	// bodies.forEach(body => setPosition(app.rect(10, 10).id(body.id.toString()), body))
	return composite
}

const coords = [100, 10]
const size = [100, 10]

const body = Bodies.rectangle(coords[0], coords[1], size[0], size[1], { label: 'shape'  })
Body.setMass(body, .00001)
World.add(engine.world, body)
app.rect(size[0], size[1]).id(body.id.toString())

const rope1 = createRope([coords[0], coords[1] + 100], coords, 3)
const rope2 = createRope([coords[0] + size[0], coords[1] + 100], [coords[0] + size[0], coords[1]], 3)
const composite = Composite.create({
	bodies: [body],
	constraints: [
		Constraint.create({
			bodyA: body,
			bodyB: rope1.bodies[rope1.bodies.length - 1],
			// pointA: { x: 100, y: 10 },
			// stiffness: 1,
		}),
		Constraint.create({
			bodyA: body,
			bodyB: rope2.bodies[rope1.bodies.length - 1],
			// pointA: { x: 200, y: 10 },
			// stiffness: 1,
		}),
	],
})
World.add(engine.world, composite)

// Engine.run(engine)
// console.log(engine)
Engine.update(engine)

function frame (timestep) {
	find(engine.world)
	// requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

function find (rootComposite: Composite) {
	console.log(rootComposite)
	for (const composite of rootComposite.composites) {
		if (hasLabel(composite, 'path')) {
			// composite.bodies.forEach(body => {
			// 	setPosition(SVG.get(body.id.toString()), body)
			// })

			setPath(composite)
		} else {
			find(composite)
			for (const body of composite.bodies) {
				if (hasLabel(body, 'shape')) {
					console.log(1)
					setPosition(body)
				}
			}
		}
	}
}

window.onkeypress = (event: KeyboardEvent) => {
	if (event.key === 'n') {
		Engine.update(engine)
		requestAnimationFrame(frame)
	}
}

function createPath (bodies: Body[]) {
	// if is first body then move the svg otherwise draw a line
	return bodies.map((body, i) => [!i ? 'M' : 'L', body.position.x, body.position.y])
}

function hasLabel (thing: Composite | Body, label: string) {
	return thing.label.split(' ').includes(label)
}

function get (thing: Composite | Body) {
	return SVG.get(thing.id.toString())
}

function setPosition(body: Body) {
	(get(body) as SVG.Rect).x(body.position.x).y(body.position.y)
}

function setPath(composite: Composite) {
	(get(composite) as SVG.Path).plot(createPath(composite.bodies))
}
