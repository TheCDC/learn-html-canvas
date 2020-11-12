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
        if(random()){}
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
  layerSarah = createGraphics(WIDTH, HEIGHT);
  layerJoe = createGraphics(WIDTH, HEIGHT);
  layerWyatt = createGraphics(WIDTH, HEIGHT);
}

function setup() {
    frameRate(30);
  createCanvas(640, 480);
  imageMode(CENTER);
}

function draw() {
  // background(255, 255, 0, 255);
  // ===== write to static layers
  ///middle figure layer
  blendMode(REPLACE);
  layerSarah.imageMode(CORNERS);
  //   layerSarah.background(64, 0, 0);
  layerSarah.image(imgSarah, 0, 0);
  ///left figure layer
  layerJoe.imageMode(CORNERS);
  //   layerJoe.background(0, 64, 0);
  layerJoe.image(imgJoe, 0, 0);
  ///right figure layer
  layerWyatt.imageMode(CORNERS);
  //   layerWyatt.background(0, 0, 64);
  layerWyatt.image(imgWyatt, 0, 0);

  ///flashlight spot 1 layer
  var yOffset = (300 * (mouseY - HEIGHT / 2)) / 480;
  var xOffset = (200 * abs(mouseX - WIDTH / 2)) / (WIDTH / 2);
  layerFlashlightSarah = createFlashlightLayer(0, 0);
  layerFlashlightJoe = createFlashlightLayer(-xOffset, yOffset);
  layerFlashlightWyatt = createFlashlightLayer(xOffset, yOffset);

  //blend middle figure and flashlight spot 1

  let maskedSarah = maskGraphicsByGraphics(layerFlashlightSarah, layerSarah);
  let maskedJoe = maskGraphicsByGraphics(layerFlashlightJoe, layerJoe);
  let maskedWyatt = maskGraphicsByGraphics(layerFlashlightWyatt, layerWyatt);

  imageMode(CORNERS);
  blendMode(REPLACE);
  background(0);
  blendMode(ADD);
  image(maskedWyatt, 0, 0);
  image(maskedSarah, 0, 0);
  image(maskedJoe, 0, 0);

  layerFlashlightSarah.remove();
  layerFlashlightJoe.remove();
  layerFlashlightWyatt.remove();
  maskedSarah.reset();
  maskedJoe.reset();
  maskedWyatt.reset();
}

function createFlashlightLayer(xoffset, yoffset) {
  let layer = createGraphics(WIDTH, HEIGHT);
  layer.imageMode(CENTER);
  layer.background(0, 0, 0, 64);
  layer.image(imgGradient, mouseX + xoffset, mouseY + yoffset);
  return layer;
}

function maskGraphicsByGraphics(target, mask) {
  let masked = target.get();
  masked.mask(mask.get());
  return masked;
}
