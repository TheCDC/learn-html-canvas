p5.Graphics.prototype.mask = function(inputMask) {

    if (inputMask === undefined) {
        inputMask = graphics;
    }
    const currBlend = graphics.drawingContext.globalCompositeOperation;

    let scaleFactor = 1;
    if (inputMask instanceof p5.Renderer) {
        scaleFactor = inputMask._pInst._pixelDensity;
    }

    const copyArgs = [
        inputMask,
        0,
        0,
        scaleFactor * inputMask.width,
        scaleFactor * inputMask.height,
        0,
        0,
        graphics.width,
        graphics.height
    ];

    this.drawingContext.globalCompositeOperation = 'destination-in';
    p5.Renderer2D.prototype.copy.apply(this, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;

}

function maskGraphicsByGraphics(graphics, inputMask) {


    if (inputMask === undefined) {
        inputMask = graphics;
    }
    const currBlend = graphics.drawingContext.globalCompositeOperation;

    let scaleFactor = 1;
    if (inputMask instanceof p5.Renderer) {
        scaleFactor = inputMask._pInst._pixelDensity;
    }

    const copyArgs = [
        inputMask,
        0,
        0,
        scaleFactor * inputMask.width,
        scaleFactor * inputMask.height,
        0,
        0,
        graphics.width,
        graphics.height
    ];

    this.drawingContext.globalCompositeOperation = 'destination-in';
    p5.Renderer2D.prototype.copy.apply(this, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;
}


let img;
let imgMask;
let layerFigureMiddle;
let HEIGHT = 480;
let WIDTH = 640;

function preload() {
    imgFigureMiddle = loadImage('img/figure-middle.png');
    imgGradient = loadImage('img/gradient.png');
    img = loadImage('img/figure-middle.png');
    imgMask = loadImage('img/gradient.png');
    layerFigureMiddle = createGraphics(WIDTH, HEIGHT);
    layerFlashlight1 = createGraphics(WIDTH, HEIGHT);
    layer2 = createGraphics(WIDTH, HEIGHT);
}

function setup() {
    createCanvas(640, 480);
    imageMode(CENTER);
}

function draw() {
    layerFigureMiddle.background(0, 102, 153);
    // image(img, width / 2, height / 2);
    // image(img, mouseX, mouseY);
    ///middle figure layer
    layerFigureMiddle.imageMode(CORNERS);
    layerFigureMiddle.image(imgFigureMiddle, 0, 0);
    ///flashlight spot 1 layer
    layerFlashlight1.background(0, 0, 0);
    layerFlashlight1.imageMode(CENTER);
    layerFlashlight1.image(imgGradient, mouseX, mouseY);
    //blend middle figure and flashlight spot 1

    imageMode(CORNERS);
    let masked;
    (masked = layerFigureMiddle.get()).mask(layerFlashlight1.get());
    image(masked, 0, 0);
    image(layerFlashlight1, 0, 0);
    // maskGraphicsByGraphics(layerFigureMiddle, layerFlashlight1);
    // layerFigureMiddle.mask(layerFlashlight1);
    // image(img, 0, 0);
    // image(layerFlashlight1, 0, 0)
    // image(layerFigureMiddle, 0, 0);
    // image(layerFlashlight, 0, 0);
}