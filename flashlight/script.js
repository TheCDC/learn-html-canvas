// define a class to contain all simulation state and parameters
class Simulation {
  constructor() {
    this.startTime = new Date().getTime();
    this.on = true;
    this.brightness = 0;
    this.timeStep = 30; //milliseconds
    this.flickerChance = 1 / 10;
    this.frames = new Array(20).fill(0); //window for moving average
    this.movingAverage = 0; // moving average value
    this.pBrightDark = 0.05; //chance to transition to dark from light
    this.pDarkBright = 0.2; // chance to transition to bright from dark
    this.mousex = 150;
    this.mousey = 150;
  }
  step() {
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
    // moving average for brightness
    this.frames.shift();
    this.frames.push(this.brightness);
    // calculate average
    this.movingAverage =
      (arr => arr.reduce((a, b) => a + b, 0))(this.frames) / this.frames.length;
  }
  setMousePos(x, y) {
    this.mousex = x;
    this.mousey = y;
  }
}

var sim = new Simulation();

function drawSimulation(ctx, sim) {
  const X = sim.mousex;
  const Y = sim.mousey - 100;
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
  ctx.moveTo(0, Y - 50);
  ctx.lineTo(X, Y);
  ctx.lineTo(X, Y + 50);
  ctx.lineTo(0, Y + 50 + 50);
  ctx.closePath();
  ctx.fill();

  //   ctx.fillRect(0, 150, 150, 50);
}

function startDrawing() {
  var canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    // main loop
    setInterval(() => {
      sim.step();
    }, sim.timeStep);
    setInterval(() => {
      drawSimulation(ctx, sim);
    }, 1000 / 60);
  }
}

function mousemove(event) {
  sim.setMousePos(event.clientX, event.clientY);
}
