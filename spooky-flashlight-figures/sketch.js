let layerSarah;
let lyaerJoe;
let LayerWyatt;
let layerFlashlightSarah;
let layerFlashlightJoe;
let layerFlashlightWyatt;
let imgSarah;
let imgWyatt;
let imgJoe;
let imgGradient;
let imgLaCroix;
let HEIGHT = 480;
let WIDTH = 640;

class RandomMover {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.target = { x: 0, y: 0 };
    this.state = 0;
    this.speed = 5;
    this.chooseNewTarget();
  }

  update() {
    //homing
    if (this.state === 0) {
      if (
        abs(this.x - this.target.x) >= 1 &&
        abs(this.y - this.target.y) >= 1
      ) {
        this.state = 1;
      }
      if (abs(this.x - this.target.x) >= this.speed) {
        this.x = this.target.x;
      } else {
        this.x += speed * sign((this.x = this.target.x));
      }
      if (abs(this.y - this.target.y) >= this.speed) {
        this.y = this.target.y;
      } else {
        this.y += speed * sign((this.y = this.target.y));
      }
    } else if (this.state === 1) {
      if (random()) {
      }
    }
  }

  chooseNewTarget() {
    this.target = { x: this.x + random(width), y: this.y + random(height) };
  }
}

function preload() {
  imgSarah = loadImage("img/outline-sarah.png");
  imgJoe = loadImage("img/outline-joe.png");
  imgWyatt = loadImage("img/outline-wyatt.png");
  imgGradient = loadImage("img/gradient.png");
  imgLaCroix = loadImage("img/lacroix.jpg");
  layerSarah = createGraphics(WIDTH, HEIGHT);
  layerJoe = createGraphics(WIDTH, HEIGHT);
  layerWyatt = createGraphics(WIDTH, HEIGHT);
}

function setup() {
  createCanvas(640, 480);
  imageMode(CENTER);
}

function draw() {
  // ===== write to static layers
  layerSarah.imageMode(CORNERS);
  layerSarah.image(imgSarah, 0, 0);
  layerJoe.imageMode(CORNERS);
  layerJoe.image(imgJoe, 0, 0);
  layerWyatt.imageMode(CORNERS);
  layerWyatt.image(imgWyatt, 0, 0);

  // ===== flashlight layers
  let boxRadius = 100;
  let timeIndex = millis() / 5000;
  let xBase = map(
    noise(timeIndex * 5, 0),
    0,
    1,
    WIDTH / 2 - boxRadius,
    WIDTH / 2 + boxRadius
  );
  let yBase =
    map(
      noise(timeIndex, 10),
      0,
      1,
      HEIGHT / 2 - boxRadius,
      HEIGHT / 2 + boxRadius
    ) +
    noise(timeIndex * 50) * 20;

  var yOffset = (300 * (yBase - HEIGHT / 2)) / 480;
  var xOffset = (300 * abs(xBase - WIDTH / 2)) / (WIDTH / 2);
  layerFlashlightSarah = createFlashlightLayer(xBase, yBase, (layer) => {
    layer.imageMode(CORNERS);
    layer.blendMode(ADD);
    layer.image(imgLaCroix, 0, 0);
    layer.blendMode(SCREEN);
    layer.background((cos(millis() / (500 * 3)) / 2 + 0.5) * 255);
    layer.blendMode(ADD);
    // layer.tint(255, 255, 0);
  });
  layerFlashlightJoe = createFlashlightLayer(
    xBase - xOffset,
    yBase + yOffset,
    (layer) => {
      layer.imageMode(CORNERS);
      layer.blendMode(ADD);
      layer.image(imgLaCroix, -500, -100);
      layer.blendMode(SCREEN);
      layer.background((cos(millis() / (500 * 5)) / 2 + 0.5) * 255);
      layer.blendMode(ADD);
      // layer.tint(0, 255, 255);
    }
  );
  layerFlashlightWyatt = createFlashlightLayer(
    xBase + xOffset,
    yBase + yOffset,
    (layer) => {
      layer.imageMode(CORNERS);
      layer.blendMode(ADD);
      layer.image(imgLaCroix, -200, -500);
      layer.blendMode(SCREEN);
      layer.background((cos(millis() / (500 * 7)) / 2 + 0.5) * 255);
      layer.blendMode(ADD);
      // layer.tint(255, 0, 255);
    }
  );

  // ===== blend figures and flashlights

  let maskedSarah = maskGraphicsByGraphics(layerFlashlightSarah, layerSarah);
  let maskedJoe = maskGraphicsByGraphics(layerFlashlightJoe, layerJoe);
  let maskedWyatt = maskGraphicsByGraphics(layerFlashlightWyatt, layerWyatt);
  // ===== Final pass, bring layers together
  imageMode(CORNERS);
  blendMode(REPLACE);
  background(0);
  blendMode(ADD);
  image(maskedWyatt, 0, 0);
  image(maskedSarah, 0, 0);
  image(maskedJoe, 0, 0);
  stroke(255);
  // line(WIDTH / 2 - boxRadius, HEIGHT / 2 - boxRadius, WIDTH / 2 + boxRadius, HEIGHT / 2 + boxRadius);
  /// ===== cleanup, delete unused layers
  layerFlashlightSarah.remove();
  layerFlashlightJoe.remove();
  layerFlashlightWyatt.remove();
  maskedSarah.reset();
  maskedJoe.reset();
  maskedWyatt.reset();
}

function createFlashlightLayer(xoffset, yoffset, preloadFunc) {
  let layer = createGraphics(WIDTH, HEIGHT);
  if (preloadFunc !== null) {
    preloadFunc(layer);
  }
  let fLayer = createGraphics(WIDTH, HEIGHT);
  fLayer.imageMode(CENTER);
  fLayer.image(imgGradient, xoffset, yoffset);
  let pre = layer.get();
  pre.mask(fLayer.get());
  fLayer.remove();
  layer.blendMode(REPLACE);
  layer.imageMode(CORNERS);
  layer.image(pre, 0, 0);
  pre.rest();

  return layer;
}

function maskGraphicsByGraphics(target, mask) {
  let masked = target.get();
  masked.mask(mask.get());
  return masked;
}
