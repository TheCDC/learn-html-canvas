// define a class to contain all simulation state and parameters
class Simulation {
  constructor() {
    this.startTime = new Date().getTime();
    this.on = true;
    this.brightness = 0;
    this.timeStep = 1000 / 60; //milliseconds
    this.flickerChance = 1 / 10;
    this.movingWindowSize = 100;
    this.frames = new Array(this.movingWindowSize).fill(0); //window for moving average
    this.movingAverage = 0; // moving average value
    this.pBrightDark = 0.03; //chance to transition to dark from light
    this.pDarkBright = 0.2; // chance to transition to bright from dark
    this.mousex = 150;
    this.mousey = 150;
    this.onState = false;

    this.beamSlope = 1 / 5;

    this.audio = new Audio("pen click.wav");
  }
  step() {
    if (this.onState) {
      //   simple markov model for dark-light transitions
      if (this.brightness === 1) {
        if (Math.random() < this.pBrightDark) {
          this.brightness = 0;
        }
      } else if (this.brightness === 0) {
        if (Math.random() < this.pDarkBright) {
          this.brightness = 1;
        }
      } else {
        console.error("brightness has invalid value of ", this.brightness);
      }
    } else {
      this.brightness = 0;
    }
    // moving average for brightness
    this.frames.shift();
    this.frames.push(this.brightness);
    // calculate average
    this.movingAverage =
      (arr => arr.reduce((a, b) => a + b, 0))(this.frames) / this.frames.length;
    // make brightness changes more pronounced with an exponent > 1
    this.movingAverage = Math.pow(this.movingAverage, 2);
  }
  setMousePos(x, y) {
    this.mousex = x;
    this.mousey = y;
  }

  toggleOnState() {
    this.audio.play();
    this.onState = !this.onState;
    if (!this.onState) {
      this.frames = new Array(this.movingWindowSize).fill(0);
      this.movingAverage = 0;
    } else {
      // make startup brightness random.
      const rand = Math.random()/2 + 0.5;
      this.frames = new Array(this.movingWindowSize).fill(rand);
      this.movingAverage = rand;
    }
  }
}
class SimulationPlotter {
  constructor(ctx, sim) {
    this.ctx = ctx;
    this.sim = sim;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    ctx.fillStyle = `rgb(0,0,0)`;
  }
  draw() {
    this.ctx.globalCompositeOperation = "copy";
    this.ctx.drawImage(this.ctx.canvas, -1, 0);
    // reset back to normal for subsequent operations.
    this.ctx.globalCompositeOperation = "source-over";

    this.ctx.fillStyle = `rgb(0,255,0)`;

    this.ctx.fillRect(
      this.width - 1,
      this.height - this.sim.movingAverage * this.height - 1,
      1,
      1
    );

    this.ctx.fillStyle = `rgb(255,0,0)`;

    this.ctx.fillRect(this.width - 1, this.height - 1, 1, 1);

    this.ctx.fillStyle = `rgb(52, 183, 235)`;

    this.ctx.fillRect(this.width - 1, 0, 1, 1);
  }
}

var sim = new Simulation();

function drawSimulation(ctx, sim) {
  const X = sim.mousex;
  const Y = sim.mousey;
  // background
  ctx.fillStyle = `rgb(0,0,0)`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // flashlight
  var img = document.getElementById("img-flashlight");
  ctx.drawImage(img, X, Y, 100, 50);
  //   console.log(sim.movingAverage);
  //   light beam
  var b = sim.movingAverage * 255;
  ctx.fillStyle = `rgb(${b},${b},${b})`;
  ctx.beginPath();
  ctx.moveTo(0, Y - X * sim.beamSlope);
  ctx.lineTo(X, Y);
  ctx.lineTo(X, Y + 50);
  ctx.lineTo(0, Y + 50 + X * sim.beamSlope);
  ctx.closePath();
  ctx.fill();

  //   ctx.fillRect(0, 150, 150, 50);
}

function startDrawing() {
  var canvas = document.getElementById("myCanvas");
  var graphCanvas = document.getElementById("brightnessPlot");
  var graphCtx = graphCanvas.getContext("2d");

  var plotter = new SimulationPlotter(graphCtx, sim);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    // logic loop
    setInterval(() => {
      sim.step();
      plotter.draw();
    }, sim.timeStep);
    // render loop
    setInterval(() => {
      drawSimulation(ctx, sim);
    }, 1000 / 60);
  }
}

function mousemove(event) {
  var rect = document.getElementById("myCanvas").getBoundingClientRect();
  sim.setMousePos(event.clientX - rect.left, event.clientY - rect.top);
}

function mouseClick(event) {
  sim.toggleOnState();
}
