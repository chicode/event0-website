import * as p2 from 'p2'
import * as matter from 'matter-js'
import * as SVG from 'svg.js'

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
	// private render = matter.Render.create({element: document.body, engine: this.engine})
	// constructor() {
	// 	super()
	// 	matter.Render.run(this.render)
	// }
	makeBody({ position, size, ...rest }: BodyInput ): Body {
		const body =  matter.Bodies.rectangle(
			position[0] + size[0] / 2, position[1] + size[1] / 2,
			size[0], size[1],
			{
				// ...rest,
				velocity: { x: 0, y: 0},
				isStatic: rest.mass === 0,
			}
		)
		if (rest.velocity) matter.Body.setVelocity(body, { x: rest.velocity[0], y: rest.velocity[1] })
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
		return [bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y]
	}
}

function getVelocity(rotation, speed) {
	return [speed * Math.cos(rotation), speed * Math.sin(rotation)] as Vector
}

window.onload = () => {
	const physics = new _Matter()
	const ELEM = document.querySelector('.svg') as HTMLElement
	const app = SVG(ELEM)
	const bodies = app.group()

	const spawnRate = 120
	const speed = 15
	const pipeRotations = [Math.PI * .25, Math.PI * .5, -Math.PI * .25 + Math.PI]
	const rotationDeviation = Math.PI * .03
	const pipes = Array.from(document.querySelectorAll('.main .pipe .shaft')) as HTMLElement[]
	const pipePositions: Vector[] = [
		[pipes[0].getBoundingClientRect().left + pipes[1].offsetWidth / 2, 0],
		[pipes[1].getBoundingClientRect().left + pipes[1].offsetWidth / 2, 0],
		[pipes[2].getBoundingClientRect().left + pipes[2].getBoundingClientRect().width - pipes[1].offsetWidth / 2, 0],
	]

	const tube = document.querySelector('.main .tube') as HTMLElement
	const border = 30
	physics.makeBody({
		position: [tube.offsetLeft, tube.offsetTop],
		size: [border, tube.offsetHeight],
		mass: 0,
	})
	physics.makeBody({
		position: [tube.offsetLeft + tube.offsetWidth - border, tube.offsetTop],
		size: [border, tube.offsetHeight],
		mass: 0,
	})
	physics.makeBody({
		position: [tube.offsetLeft, tube.offsetTop + tube.offsetHeight - border],
		size: [tube.offsetWidth, border + 50],
		mass: 0,
	})

	function randRange(range) {
		return Math.floor(Math.random() * range)
	}

	let step = 0
	// let i = 0
	function update(dt) {
		if (step % spawnRate === 0) {
			const i = randRange(3);
			const rotation = pipeRotations[i] - rotationDeviation// + Math.random() * rotationDeviation * 2
			const body = physics.makeBody({
				position: pipePositions[i],
				// size: pipeSizes[i],
				size: [10, 10],
				angle: pipeRotations[i],
				mass: 10,
				velocity: getVelocity(rotation, speed)
			})
			// i++
			// if (i === 3) i = 0
			bodies.rect(10, 10).id(body.id)
		}
		for (const body of physics.getBodies()) {
			const svg = SVG.get(body.id.toString())
			if (svg) {
				svg.cx(body.position[0]).cy(body.position[1])
			}
		}

		physics.update()
		window.requestAnimationFrame(update)
		step++
	}
	window.requestAnimationFrame(update)
}
