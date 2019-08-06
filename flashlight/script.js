// define a class to contain all simulation state and parameters
class Simulation {
  constructor() {
    this.startTime = new Date().getTime();
    this.on = true;
    this.brightness = 0;
    this.timeStep = 30; //milliseconds
    this.flickerChance = 1 / 10;
    this.frames = new Array(10).fill(0); //window for moving average
    this.movingAverage = 0; // moving average value
    this.pBrightDark = 0.05; //chance to transition to dark from light
    this.pDarkBright = 0.2; // chance to transition to bright from dark
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
}

function drawSimulation(ctx, sim) {
  // background
  ctx.fillStyle = `rgb(0,0,0)`;
  ctx.fillRect(0, 0, 300, 300);
  // flashlight
  var img = document.getElementById("img-flashlight");
  ctx.drawImage(img, 150, 150, 100, 50);
  //   console.log(sim.movingAverage);
  //   light beam
  var b = sim.movingAverage * 255;
  ctx.fillStyle = `rgb(${b},${b},${b})`;
  ctx.beginPath();
  ctx.moveTo(0, 150-50);
  ctx.lineTo(150, 150);
  ctx.lineTo(150, 200);
  ctx.lineTo(0, 200+50);
  ctx.closePath();
  ctx.fill();

  //   ctx.fillRect(0, 150, 150, 50);
}
function startDrawing() {
  var canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    var sim = new Simulation();
    // main loop
    setInterval(() => {
      sim.step();
      drawSimulation(ctx, sim);
    }, sim.timeStep);
  }
}
