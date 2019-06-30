var WIDTH = 300;
var HEIGHT = 300;
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
          if (Math.random() < 0.01) {
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
            if (Math.random() < 0.25) {
              this.matrix[y][x] = this.matrix[y - 1][x];
            }
            //   sparks
            if (this.matrix[y - 1][x] > 0.05) {
              if (Math.random() < 0.005) {
                this.matrix[y][x] = 1;
              }
            }
          }
        }
      }
    }
    // console.log(this.matrix);
  }
}

function drawSimulation(ctx, sim) {
  var cellSize = 10;
  ctx.fillStyle = `rgb(255,255,255)`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (var y = 0; y < sim.height; y++) {
    for (var x = 0; x < sim.width; x++) {
      var alpha = sim.matrix[y][x];
      ctx.fillStyle = `rgb(255,0,0,${alpha})`;
      ctx.fillRect(x * cellSize, HEIGHT - y * cellSize, cellSize, cellSize);
    }
  }
}

function startDrawing() {
  var sim = new Simulation(30, 30);
  var canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
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
