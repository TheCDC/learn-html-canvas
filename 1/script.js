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
          if (x > 1) {
            this.matrix[y][x] += this.matrix[y - 1][x - 1] / 3;
          }
          this.matrix[y][x] += this.matrix[y - 1][x] / 3;
          if (x < this.width) {
            this.matrix[y][x] += this.matrix[y - 1][x + 1] / 3;
          }
        }
      }
    }
    console.log(this.matrix);
  }
}

function startDrawing() {
  var sim = new Simulation(10, 10);
  var canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    setInterval(() => {
      sim.step();
      draw(ctx);
    }, 1000);
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
  Math.random() * 300;
  ctx.fillRect(Math.random() * 300, Math.random() * 300, 50, 50);
}
