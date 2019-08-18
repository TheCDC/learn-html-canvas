WIDTH = 800;
HEIGHT = 450;
CENTER = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
}
radiusMin = 300;
radiusMax = 600;
function drawSimulation(ctx) {
  ctx.fillStyle = `rgb(0,0,0)`;
  var WIDTH = ctx.canvas.width;
  var HEIGHT = ctx.canvas.height;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  var numLines = Math.round(Math.random() * 100);
  // console.log(numLines)
  for (var i = 0; i < numLines; i++) {
    var point_radius = Math.random() * (radiusMax - radiusMin) + radiusMin;
    var point_angle = 2 * Math.PI * Math.random();
    var angular_width = Math.random() * (2 / 100) * 2 * Math.PI
    var center_point = {
      x: point_radius * Math.cos(point_angle) + CENTER.x,
      y: point_radius * Math.sin(point_angle) + CENTER.y
    }
    var left_corner = {
      x: radiusMax * Math.cos(point_angle - angular_width / 2) + center_point.x,
      y: radiusMax * Math.sin(point_angle - angular_width / 2) + center_point.y
    };
    var right_corner = {
      x: radiusMax * Math.cos(point_angle + angular_width / 2) + center_point.x,
      y: radiusMax * Math.sin(point_angle + angular_width / 2) + center_point.y
    }
    // console.log(center_point)
    ctx.fillStyle = `rgb(255,255,255)`;
    ctx.beginPath();
    ctx.moveTo(center_point.x, center_point.y);
    ctx.lineTo(left_corner.x, left_corner.y);
    ctx.lineTo(right_corner.x, right_corner.y);
    ctx.closePath();
    ctx.fill();

  }
}

function startDrawing() {
  var canvas = document.getElementById("myCanvas");



  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    setInterval(() => {
      drawSimulation(ctx);
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
