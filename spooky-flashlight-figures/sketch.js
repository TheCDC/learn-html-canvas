let img;
let imgMask;
let layerFigureMiddle;
let layerFlashlight1;
let layerFlashlight2;
let layerFlashlight3;
let imgSarah;
let imgWyatt;
let imgJoe;
let HEIGHT = 480;
let WIDTH = 640;

function preload() {
    imgSarah = loadImage('img/outline-sarah.png');
    imgWyatt = loadImage('img/outline-wyatt.png');
    imgJoe = loadImage('img/outline-joe.png');
    imgGradient = loadImage('img/gradient.png');
    imgMask = loadImage('img/gradient.png');
    layerFigureMiddle = createGraphics(WIDTH, HEIGHT);
    layer2 = createGraphics(WIDTH, HEIGHT);
}

function setup() {
    createCanvas(640, 480);
    imageMode(CENTER);
}

function draw() {
    ///middle figure layer
    layerFigureMiddle.imageMode(CORNERS);
    layerFigureMiddle.background(0);
    layerFigureMiddle.image(imgSarah, 0, 0);
    ///flashlight spot 1 layer
    layerFlashlight1 = createGraphics(WIDTH, HEIGHT);
    layerFlashlight1.imageMode(CENTER);
    layerFlashlight1.image(imgGradient, mouseX, mouseY);
    //blend middle figure and flashlight spot 1

    let masked;
    (masked = layerFigureMiddle.get()).mask(layerFlashlight1.get());
    // (masked = layerFlashlight1.get()).mask(layerFigureMiddle.get());
    background(0, 0, 0, 255);
    imageMode(CORNERS);
    image(masked, 0, 0);

    layerFlashlight1.remove();
}

function createFlashlightLayer(xoffset, yoffset) {
    let layer = createGraphics(WIDTH, HEIGHT);
    layer.imageMode(CENTER);
    layer.image(imgGradient, mouseX + xoffset, mouseY + yoffset);
    return layer;
}