var cnv;
const RADIUSRATE = 0.2;

class SmoothCursor {
  constructor(pixelsPerSecond) {
    this.x = 0;
    this.y = 0;
    this.speedLimit = pixelsPerSecond;
  }
  update(timeDelta) {
    let toTravel = (this.speedLimit * timeDelta) / 1000;
    let targetDist = dist(this.x, this.y, mouseX, mouseY);
    let angle = atan2(mouseY - this.y, mouseX - this.x);
    let actualDist = min(toTravel, targetDist);
    this.x += actualDist * cos(angle);
    this.y += actualDist * sin(angle);

    this.x = min(max(this.x, 0), cnv.width);
    this.y = min(max(this.y, 0), cnv.height);
  }

  draw() {
    stroke(255, 0, 0);
    circle(this.x, this.y, 10);
    line(this.x, this.y, mouseX, mouseY);
  }
}

function nextCircle(c, fr, ftheta) {
  let xi = c.x;
  let yi = c.y;
  let ri = c.r;
  let thetai = c.theta;

  let dtheta = ftheta(thetai);
  let dr = fr(ri);
  let rf = dr;
  let thetaf = dtheta;
  let slide = (rf - ri) / 2;
  let xf = slide * cos(thetaf + PI) + xi;
  let yf = slide * sin(thetaf + PI) + yi;

  return {
    x: xf,
    y: yf,
    r: rf,
    theta: thetaf,
  };
}

var smoothCursor;
var colorOffset = 0;

function canvasClicked() {}

function setup() {
  createP("Move the mouse!");
  cnv = createCanvas(400, 400);
  //colorMode(RGB, 255, 255, 255, 255);
  smoothCursor = new SmoothCursor(100);
  cnv.mouseClicked(canvasClicked);
}

function draw() {
  background(255);

  smoothCursor.update(deltaTime);
  smoothCursor.draw();

  var c = {
    x: cnv.width / 2,
    y: cnv.height / 2,
    r: 5,
    theta: frameCount / 100,
  };
  fill(255, 0);
  var iter = 128;

  var step = 1;

  function nextTheta(t) {
    return t + (PI / 16) * (max(2, smoothCursor.x) / (cnv.width / 10));
  }

  function nextR(r) {
    return (r * 1.01 * smoothCursor.y) / (cnv.height / 4);
  }

  stroke(0);
  let circles = [];
  var numCirclesTooBig = 0;
  for (var i = 0; i < iter; i++) {
    colorMode(HSB, 255);

    stroke(colorOffset, 255, 128);
    if (numCirclesTooBig > 1) {
      stroke(0, 255, 0);
    }
    circle(c.x, c.y, c.r);
    let next = nextCircle(c, nextR, nextTheta);
    //line(c.y, c.y, next.x, next.y);
    // line(c.x, c.x, next.x, next.y);
    //line(c.y, c.y, next.x, next.y);
    //line(c.x, c.y, next.x , next.y);
    circle(
      c.x + (c.r / 2) * cos(c.theta),
      c.y + (c.r / 2) * sin(c.theta),
      smoothCursor.y / 20
    );
    //text(next.angle,next.x,next.y);

    //line(c.x, c.y, next.x + next.r*cos(next.theta), next.y + next.r*sin(next.theta));
    //line(c.x, c.y, c.x + c.r * cos(c.theta), c.y + c.r * sin(c.theta));

    c = next;
    if (numCirclesTooBig > 1) {
      break;
    }
    var halfr = c.r / 2;
    if (
      dist(0, 0, c.x, c.y) < halfr &&
      dist(0, cnv.height, c.x, c.y) < halfr &&
      dist(cnv.width, 0, c.x, c.y) < halfr &&
      dist(cnv.width, cnv.height, c.x, c.y) < halfr
    ) {
      //console.log(c);
      numCirclesTooBig++;
    }
  }

  if (colorOffset % 2 === 0) {
    if (random() < 0.1) {
      colorOffset = (colorOffset + 1) % 255;
    }
  } else {
    if (random() < 0.5) {
      colorOffset = (colorOffset + 1) % 255;
    }
  }
}
