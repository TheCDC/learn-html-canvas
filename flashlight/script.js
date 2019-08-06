class Simulation {
  constructor() {
    this.startTime = new Date().getTime();
    this.on = true;
    this.brightness = 0;
    this.timeStep = 30; //milliseconds
    this.flickerChance = 1 / 10;
    // this.freq = 2;
    this.dBrightness = 0;
    this.frames = new Array(10).fill(0);
    this.movingAverage = 0;
    this.pBrightDark = 0.1;
    this.pDarkbright = 0.3;
  }
  step() {
    // this.brightness = Math.sin((new Date()).getTime()/(1000/this.freq)) >= 0.5 ? 1 : 0
    if (this.brightness === 1) {
      if (Math.random() < this.pBrightDark) {
        this.brightness = 0;
      }
    } else if (this.brightness === 0) {
        if (Math.random() < this.pDarkbright ){
            this.brightness = 1;
        }
    } else {
      console.error("brightness has invalid value of ", this.brightness);
    }
    // moving average for brightness
    this.frames.shift();
    this.frames.push(this.brightness);
    this.movingAverage =
      (arr => arr.reduce((a, b) => a + b, 0))(this.frames) / this.frames.length;
  }
}

function drawSimulation(ctx, sim) {
  ctx.fillStyle = `rgb(0,0,0)`;
  ctx.fillRect(0, 0, 300, 300);
  var img = document.getElementById("img-flashlight");
  ctx.drawImage(img, 150, 150, 100, 50);
//   console.log(sim.movingAverage);
  var b = sim.movingAverage * 255;
  ctx.fillStyle = `rgb(${b},${b},${b})`;
  ctx.fillRect(50, 150, 100, 50);
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
