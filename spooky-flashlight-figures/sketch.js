let img;
let imgMask;
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

function preload() {
    imgSarah = loadImage('img/outline-sarah.png');
    imgJoe = loadImage('img/outline-joe.png');
    imgWyatt = loadImage('img/outline-wyatt.png');
    imgGradient = loadImage('img/gradient.png');
    imgMask = loadImage('img/gradient.png');
    layerSarah = createGraphics(WIDTH, HEIGHT);
    layerJoe = createGraphics(WIDTH, HEIGHT);
    layerWyatt = createGraphics(WIDTH, HEIGHT);
    layer2 = createGraphics(WIDTH, HEIGHT);


}

function setup() {
    createCanvas(640, 480);
    imageMode(CENTER);
}

function draw() {
    // ===== write to static layers
    ///middle figure layer
    layerSarah.imageMode(CORNERS);
    layerSarah.background(0);
    layerSarah.image(imgSarah, 0, 0);
    ///left figure layer
    layerJoe.imageMode(CORNERS);
    layerJoe.background(0);
    layerJoe.image(imgJoe, 0, 0);
    ///right figure layer
    layerWyatt.imageMode(CORNERS);
    layerWyatt.background(0);
    layerWyatt.image(imgWyatt, 0, 0);

    ///flashlight spot 1 layer
    layerFlashlightSarah = createFlashlightLayer(0, 0);
    layerFlashlightJoe = createFlashlightLayer(30, 30);
    layerFlashlightWyatt = createFlashlightLayer(-30, 30);

    //blend middle figure and flashlight spot 1

    let maskedSarah = maskGraphicsByGraphics(layerSarah, layerFlashlightSarah);
    let maskedJoe = maskGraphicsByGraphics(layerJoe, layerFlashlightJoe);
    let maskedWyatt = maskGraphicsByGraphics(layerWyatt, layerFlashlightWyatt);

    background(0, 0, 0, 255);
    imageMode(CORNERS);
    // blendMode(MULTIPLY);
    image(maskedJoe, 0, 0);
    image(maskedWyatt, 0, 0);
    image(maskedSarah, 0, 0);

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
    layer.image(imgGradient, mouseX + xoffset, mouseY + yoffset);
    return layer;
}

function maskGraphicsByGraphics(target, mask) {
    let masked = target.get();
    masked.mask(mask.get())
    return masked;
}