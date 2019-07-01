var WIDTH = 300;
var HEIGHT = 300;
var CELLSIZE = 10;
var SIMWIDTH = 30;

var CHANCE_PARTICLE_STATIC = 0.01;
var CHANCE_PARTICLE_SUSTAIN = 0.25;
var CHANCE_PARTICLE_RESURRECT = 0.005;
var PARTICLE_COLOR = { r: 0, g: 0, b: 0 };
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

class Simulation {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.matrix = new Array();
    for (var i = 0; i < height; i++) {
      this.matrix.push(Array(width).fill(0));
    }
    // set initial values
    for (var i = 0; i < this.width; i++) {
      this.matrix[0][i] = Math.random();
    }
    console.log(this.matrix[0]);
  }
  step() {
    for (var y = 0; y < this.width; y++) {
      this.matrix[0][y] = Math.random();
    }
    for (var y = this.height - 1; y > 0; y--) {
      for (var x = 0; x < this.width; x++) {
        if (y > 0) {
          if (Math.random() < CHANCE_PARTICLE_STATIC) {
            //chance to sustain brightness
            this.matrix[y][x] += this.matrix[y - 1][x];
          } else {
            //decaying brightness
            if (x > 1) {
              this.matrix[y][x] += this.matrix[y - 1][x - 1] / 3;
            }
            this.matrix[y][x] += this.matrix[y - 1][x] / 2;
            if (x < this.width - 2) {
              this.matrix[y][x] += this.matrix[y - 1][x + 1] / 3;
            }
            this.matrix[y][x] /= 2.5;
            if (Math.random() < CHANCE_PARTICLE_SUSTAIN) {
              this.matrix[y][x] = this.matrix[y - 1][x];
            }
            //   sparks
            if (Math.random() < CHANCE_PARTICLE_RESURRECT) {
              this.matrix[y][x] = 1;
            }
          }
        }
      }
    }
    // console.log(this.matrix);
  }
}

function drawSimulation(ctx, sim) {
  ctx.fillStyle = `rgb(255,255,255)`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (var y = 0; y < sim.height; y++) {
    for (var x = 0; x < sim.width; x++) {
      var alpha = sim.matrix[y][x];

      ctx.fillStyle = `rgb(${PARTICLE_COLOR['r']},${PARTICLE_COLOR['g']},${
        PARTICLE_COLOR['b']
      },${alpha})`;
      ctx.fillRect(x * CELLSIZE, HEIGHT - y * CELLSIZE, CELLSIZE, CELLSIZE);
    }
  }
}

function startDrawing() {
  var sim = new Simulation(SIMWIDTH, SIMWIDTH);
  var canvas = document.getElementById("myCanvas");


  var inputStaticChance = document.getElementById(
    "element_CHANCE_PARTICLE_STATIC"
  );
  var inputSustainChance = document.getElementById(
    "element_CHANCE_PARTICLE_SUSTAIN"
  );
  var inputResurrectChance = document.getElementById(
    "element_CHANCE_PARTICLE_RESURRECT"
  );
  var inputRGB = document.getElementById("element_PARTICLE_COLOR");
  // start UI loop
  setInterval(() => {
    CHANCE_PARTICLE_STATIC = inputStaticChance.value;
    CHANCE_PARTICLE_SUSTAIN = inputSustainChance.value;
    CHANCE_PARTICLE_RESURRECT = inputResurrectChance.value;
    PARTICLE_COLOR = hexToRgb(inputRGB.value);
  }, 100);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = WIDTH;
    ctx.canvas.height = HEIGHT;
    setInterval(() => {
      sim.step();
      drawSimulation(ctx, sim);
      //   draw(ctx);
    }, 50);
  } else {
    console.log("Browser does not support canvas???");
  }
}

function draw(ctx) {
  var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);
  //   console.log(`rgb(${r},${g},${b})`);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 50, 50);
}
