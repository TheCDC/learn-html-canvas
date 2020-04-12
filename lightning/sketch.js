const WIDTH = 600;
const HEIGHT = 600;
class Lightning {
  constructor(x, y, angle, size, hue, lifetime) {
    this.createdAt = millis();
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.segments = [];
    this.size = size;
    this.hue = hue;
    this.lifetime = lifetime;
    this.hasSpawned = false;
    this.colorVolatility = random();
    var numToCreate = random(Math.ceil(Math.pow(size / 2, 1 / 2)));
    /*
    var numToCreate =
      Math.min(20, random(Math.ceil(Math.pow(size / 2, 1 / 2))));
      */
    for (var i = 0; i < numToCreate; i++) {
      var angleDiff = (Math.pow(random(), 4) * random([-1, 1]) * PI) / 4;
      var newAngle = this.angle + angleDiff;
      var dist = random() * this.size;
      var segment = {
        xi: x,
        yi: y,
        xf: this.x + dist * cos(newAngle),
        yf: this.y + dist * sin(newAngle),
        angle: newAngle,
      };
      //console.log(angleDiff, newAngle, dist, segment);

      this.segments.push(segment);
    }
  }

  createChildren() {
    if (this.hasSpawned) {
      return [];
    }
    if (Math.pow(random(), 1) > (millis() - this.createdAt) / this.lifetime) {
      return [];
    }
    if (this.size < 50) {
      return [];
    }
    this.hasSpawned = true;

    this.hue += this.colorVolatility * (random() - 0.5) * 25;

    var children = [];
    this.segments.forEach((segment) => {
      children.push(
        new Lightning(
          segment.xf,
          segment.yf,
          segment.angle,
          random() * this.size * 1.01,
          this.hue,
          this.lifetime
        )
      );
    });
    return children;
  }

  draw() {
    colorMode(HSB, 255);

    stroke(this.hue, 255, 255, 128 + 64);

    strokeWeight(Math.pow(this.size / 50, 2));

    //stroke(255, 255, 255);
    this.segments.forEach((segment) => {
      //  console.log(segment);
      //strokeWeight(Math.sqrt(this.size)*10);

      line(segment.xi, segment.yi, segment.xf, segment.yf);
    });
  }
}
var entities = [];
var cnv;
function setup() {
  createP("Click to create lightning!");

  frameRate(30);

  //colorMode(HSB, 255);
  entities.push(new Lightning(200, 200, 0, 50, 100, 50));
  cnv = createCanvas(400, 400);
  cnv.mouseClicked(canvasClicked);
}

function canvasClicked() {
  entities.push(
    new Lightning(
      mouseX, //x
      mouseY, //y
      random() * 2 * PI, //angle
      random(150), //size
      random(0, 255), //hue
      Math.pow(random(), 2) * 3000 //lifetime (millis)
    )
  );
}
function draw() {
  if (random() < 0.2) {
    entities.push(
      new Lightning(
        random(WIDTH), //x
        random(HEIGHT), //y
        random() * 2 * PI, //angle
        random(150), //size
        random(0, 255), //hue
        Math.pow(random(), 2) * 3000 //lifetime (millis)
      )
    );
  }

  blendMode(DIFFERENCE);
  background(32, 32, 32, 64 * 3);
  blendMode(BLEND);

  entities.forEach((ent) => {
    // console.log(ent);

    //console.log(ent.hue)
    ent.draw();
  });
  var newEntities = [];
  entities.forEach((ent) => {
    newEntities = [...newEntities, ...ent.createChildren()];
  });
  entities = [...entities, ...newEntities];

  for (var i = entities.length - 1; i >= 0; i--) {
    var aliveFor = millis() - entities[i].createdAt;
    if (aliveFor > entities[i].lifetime) {
      entities.splice(i, 1);
    }
  }
}
