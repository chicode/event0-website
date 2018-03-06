import * as p2 from 'p2'
import * as matter from 'matter-js'
import * as SVG from 'svg.js'
import { Vector } from 'matter-js';

type Vector = [number, number]

interface Body {
	position: Vector;
	size: Vector;
	angle: number;
	id: string;
	mass: number;
	velocity: Vector;
}

interface BodyInput {
	position: Vector;
	size: Vector;
	angle?: number;
	velocity?: Vector;
	mass?: number;
}

abstract class Physics<extBody> {
	abstract makeBody(input: BodyInput): Body;
	abstract getBodies(): Body[];
	abstract update(): void;
	protected abstract toBody(input: extBody): Body;
	// protected abstract fromBody(input: BodyInput): extBody;
}

class _P2 extends Physics<p2.Body> {
	private world = new p2.World({ gravity: [0, 100] });
	private bodies = [];
	makeBody({ size, ...rest }: BodyInput): Body {
		const body = new p2.Body(rest)
		body.addShape(new p2.Box({ width: size[0], height: size[1] }))
		this.world.addBody(body)
		this.bodies.push(body)
		return this.toBody(body)
	}
	getBodies(): Body[] {
		return this.bodies.map(body => this.toBody(body))
	}
	update() {
		this.world.step(1 / 60)
	}
	protected toBody(input: p2.Body): Body {
		return {
			mass: input.mass,
			angle: input.angle,
			position: input.position as Vector,
			velocity: input.velocity as Vector,
			size: [(input.shapes[0] as p2.Box).width, (input.shapes[0] as p2.Box).height] as Vector,
			id: input.id.toString(),
		}
	}
}

class _Matter extends Physics<matter.Body> {
	private engine = matter.Engine.create()
	private render = matter.Render.create({element: document.body, engine: this.engine})
	constructor() {
		super()
		matter.Render.run(this.render)
	}
	makeBody({ position, size, ...rest }: BodyInput ): Body {
		const body =  matter.Bodies.rectangle(
			position[0], position[1],
			size[0], size[1],
			{
				...rest,
				velocity: { x: 0, y: 0},
				isStatic: rest.mass === 0,
			}
		)
		matter.Body.setVelocity(body, rest.velocity ? { x: rest.velocity[0], y: rest.velocity[1] } : { x: 0, y: 0 })
		matter.World.add(this.engine.world, body)
		return this.toBody(body)
	}
	protected toBody(input: matter.Body): Body {
		return {
			position: [input.position.x, input.position.y],
			velocity: input.velocity ? [input.velocity.x, input.velocity.y] : [0, 0],
			mass: input.mass,
			angle: input.angle,
			id: input.id.toString(),
			size: _Matter.boundsToSize(input.bounds)
		}
	}
	update() {
		matter.Engine.update(this.engine)
	}
	getBodies(): Body[] {
		return _Matter.scrape(this.engine.world).map(body => this.toBody(body))
	}
	static scrape(rootComposite: matter.Composite) {
		const bodies = []
		for (const composite of rootComposite.composites) {
			bodies.concat(this.scrape(composite))
		}
		for (const body of rootComposite.bodies) {
			bodies.push(body)
		}
		return bodies
	}
	static hasLabel(thing: matter.Composite | matter.Body, label: string) {
		return thing.label.split(' ').includes(label)
	}
	static boundsToSize(bounds): Vector {
		return [bounds.min.x - bounds.max.x, bounds.min.y - bounds.max.y]
	}
}


window.onload = () => {
	const physics = new _Matter()
	// const ELEM = document.querySelector('.svg') as HTMLElement
	// const app = SVG(ELEM)
	// const bodies = app.group()

	const spawnRate = 120
	const speed = 10
	const pipeRotations = [Math.PI * .3, 0, Math.PI * .3 + Math.PI]
	const pipePositions = [[0, 100], [200, 100], [400, 100]]
	const pipeSizes = [[100, 100], [100, 100], [100, 100]]
	// const pipeRotations = [0, 0, 0]
	// const pipes = Array.from(document.querySelectorAll('.pipe')) as HTMLElement[]
	// const pipePositions: Vector[] = pipes.map(element => [element.offsetLeft, element.offsetTop] as Vector)
	// const pipePositions: Vector[] = pipes.map(element => [element.offsetLeft, 0] as Vector)
	// const pipeSizes: Vector[] = pipes.map(element => [element.clientWidth, element.clientHeight] as Vector)
	const pipeVelocities: Vector[] = pipeRotations.map(rotation => [speed * Math.cos(rotation), speed * Math.sin(rotation)] as Vector)
	console.log(pipeVelocities)
	for (let i = 0; i < 3; i++) {
		const positions: Vector[] = [
			[pipePositions[i][0], pipePositions[i][1]],
			[pipePositions[i][0] + pipeSizes[i][0], pipePositions[i][1]],
		]
		for (const position of positions) {
			const body = physics.makeBody({
				position,
				size: [0, pipeSizes[i][1]],
				// angle: pipeRotations[i],
				mass: 0
			})
			// app.rect(1, pipeSizes[i][1]).x(position[0]).y(position[1]).rotate(pipeRotations[i] * 180 / Math.PI).id(body.id)
		}
	}

	function randRange(range) {
		return Math.floor(Math.random() * range)
	}

	let step = 0
	function update(dt) {
		if (step % spawnRate === 0) {
			const i = randRange(3)
			const body = physics.makeBody({
				position: pipePositions[i],
				size: pipeSizes[i],
				angle: pipeRotations[i],
				mass: 10,
				velocity: pipeVelocities[i]
			})
			// bodies.rect(10, 10).id(body.id)
		}
		for (const body of physics.getBodies()) {
			// SVG.get(body.id.toString()).x(body.position[0]).y(body.position[1])
		}

		physics.update()
		window.requestAnimationFrame(update)
		step++
	}
	window.requestAnimationFrame(update)
}
