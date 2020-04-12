class Wave {
	constructor(canvas, fx) {
		this.fx = fx;
		this.canvas = canvas;
		this.color = color(random(255),random(255),random(255));
	}
	draw() {
		var lastpoint = {
			x: 0,
			y: this.fx(0)
		};
		colorMode(HSB);
		//stroke(frameCount%255,(frameCount/255)%255,255);
		
		noFill();
		beginShape();
		vertex(lastpoint.x, this.canvas.height / 2 + lastpoint.y);
		
		for (var x = 0; x < this.canvas.width; x += 3) {
			var y = this.fx(x);
			//stroke(255, 255, 255);
		stroke((frameCount/50)%255,255,255);
			

			vertex(x, this.canvas.height / 2 + y)

			lastpoint = {
				x: x,
				y: y
			};
		}
		colorMode(RGB);
		
		endShape();
	}
}
var waves = [];
var canvas;
var a = 100;
var b = 80;
var c = 100;
var d = 2;
var f = 100;
var dev = 0.3;

function setup() {
	canvas = createCanvas(600, 400);
	colorMode(RGB);

	background(32, 32, 32, 25);
	let nmax = 10;
	for (let n = 0; n < nmax; n++) {
		var e = 1;
		var ndev = dev * n / nmax;
		//ndev = dev;
		let na = deviate(a, ndev);
		let nb = deviate(b, ndev);
		let nc = deviate(c, ndev);
		let nd = deviate(d, ndev * 2);
		let ne = deviate(e, ndev);
		let func = genfunc(na, nb, nc, nd, ne, f, ndev);

		wave = new Wave(canvas,
			x => func(x), 0, 0);

		waves.push(wave);
	}

}



function draw() {
	//ellipse(mouseX, mouseY, 20, 20);
	blendMode(DIFFERENCE);
	background(32, 32, 32, 64 * 2);

	blendMode(BLEND);
	waves.forEach(w => w.draw());

}

function deviate(val, deviation) {
	let ret = random() * deviation * val + val;
	return ret;
}

function genfunc(a, b, c, d, e, f, dev) {
	return function(x) {
		return a * (sin(frameCount / b)) * (Math.sin(e + x / c + frameCount / f) + Math.sin(e + d * x / c + frameCount / f));
	}
}