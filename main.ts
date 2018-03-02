import * as p2 from 'p2'
import * as matter from 'matter-js'
import * as SVG from 'svg.js'

interface Body {
	position: number[];
	size: number[];
	angle: number;
	id: string;
}

abstract class Physics {
	protected abstract world: any;
	abstract rect(position: number[], size: number[], angle: number): Body;
	abstract getBodies(): Body[];
	abstract update(): void;
}

class _P2 extends Physics {
	protected world: p2.World = new p2.World({ gravity: [0, 100] });
	private bodies: p2.Body[] = [];
	rect(position, size, angle) {
		const body = new p2.Body({ position, angle } as any)
		body.addShape(new p2.Box({ width: size[0], height: size[1] }))
		this.world.addBody(body)
		this.bodies.push(body)
		return this.convert(body)
	}
	getBodies() {
		return this.bodies.map(body => this.convert(body))
	}
	update() {
		this.world.step(1 / 60)
	}
	private convert(body: p2.Body): Body {
		return {
			position: body.position,
			angle: body.angle,
			size: [(body.shapes[0] as p2.Box).width, (body.shapes[0] as p2.Box).height],
			id: body.id.toString(),
		}
	}
}


window.onload = () => {
	const physics: Physics = new _P2()
	const ELEM = document.querySelector('.svg') as HTMLElement
	const app = SVG(ELEM)
	const bodies = app.group()

	const spawnRate = 120
	const speed = 1000
	const pipeRotations = [-30, 0, 30]
	const pipes = Array.from(document.querySelectorAll('.pipe')) as HTMLElement[]
	const pipePositions = pipes.map(element => [element.offsetLeft, element.offsetTop])
	const pipeSizes = pipes.map(element => [element.clientWidth, element.clientHeight])
	const pipeVelocities = pipeRotations.map(rotation => [speed * Math.cos(rotation), speed * Math.sin(rotation)])
	console.log(pipeVelocities)
	for (let i = 0; i < pipes.length; i++) {
		const positions = [
			[pipePositions[i][0], pipePositions[i][1]],
			[pipePositions[i][0] + pipeSizes[i][0], pipePositions[i][1]],
		]
		for (const position of positions) {
			app.rect(1, pipeSizes[i][1]).x(position[0]).y(position[1]).rotate(pipeRotations[i])
		}
	}

	function randRange(range) {
		return Math.floor(Math.random() * range)
	}

	let step = 0
	function update(dt) {
		if (step % spawnRate === 0) {
			const i = randRange(3)
			const body = physics.rect(
				pipePositions[i],
				pipeSizes[i],
				pipeRotations[i]
			)
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
