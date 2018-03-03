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

}


window.onload = () => {
	const physics = new _P2()
	const ELEM = document.querySelector('.svg') as HTMLElement
	const app = SVG(ELEM)
	const bodies = app.group()

	const spawnRate = 120
	const speed = 1000
	const pipeRotations = [-30, 0, 30]
	const pipes = Array.from(document.querySelectorAll('.pipe')) as HTMLElement[]
	const pipePositions: Vector[] = pipes.map(element => [element.offsetLeft, element.offsetTop] as Vector)
	const pipeSizes: Vector[] = pipes.map(element => [element.clientWidth, element.clientHeight] as Vector)
	const pipeVelocities: Vector[] = pipeRotations.map(rotation => [speed * Math.cos(rotation), speed * Math.sin(rotation)] as Vector)
	for (let i = 0; i < pipes.length; i++) {
		const positions: Vector[] = [
			[pipePositions[i][0], pipePositions[i][1]],
			[pipePositions[i][0] + pipeSizes[i][0], pipePositions[i][1]],
		]
		for (const position of positions) {
			const body = physics.makeBody({
				position,
				size: [1, pipeSizes[i][1]],
				angle: pipeRotations[i],
			})
			app.rect(1, pipeSizes[i][1]).x(position[0]).y(position[1]).rotate(pipeRotations[i]).id(body.id)
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
				mass: 10
			})
			bodies.rect(10, 10).id(body.id)
		}
		for (const body of physics.getBodies()) {
			SVG.get(body.id.toString()).x(body.position[0]).y(body.position[1])
		}

		physics.update()
		window.requestAnimationFrame(update)
		step++
	}
	window.requestAnimationFrame(update)
}
