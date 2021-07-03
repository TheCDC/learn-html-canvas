var cnv;

function setup() {
  cnv = createCanvas(400, 400);
}

function draw() {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(255,255,255)`;
  var WIDTH = ctx.canvas.width;
  var HEIGHT = ctx.canvas.height;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  var scale = 50;
  var numLines = 10;
  var lineHeight = ctx.canvas.height / numLines;
  for (var iLine = 0; iLine < 10; iLine++) {
    var time = ((iLine + 1) * millis()) / 1000;
    for (var i = 0; i < cnv.width; i++) {
      var xIn = i / 50;
      var noiseVal = (noise(xIn + time, iLine) + noise(xIn + time/iLine, iLine)) / 2;
      var x = i;
      var y = noiseVal * lineHeight + (iLine * ctx.canvas.height) / numLines;
      // var r = Math.round(Math.random() * 255);
      // var g = Math.round(Math.random() * 255);
      // var b = Math.round(Math.random() * 255);
      var r = 0;
      var g = 0;
      var b = 0;

      //   console.log(`rgb(${r},${g},${b})`);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}
