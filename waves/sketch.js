class Wave {
  constructor(canvas, fx) {
    this.fx = fx;
    this.canvas = canvas;
    this.color = color(random(255), random(255), random(255));
  }
  draw() {
    var lastpoint = {
      x: 0,
      y: this.fx(0),
    };
    colorMode(HSB);
    //stroke(frameCount%255,(frameCount/255)%255,255);

    noFill();
    beginShape();
    vertex(lastpoint.x, this.canvas.height / 2 + lastpoint.y);

    for (var x = 0; x < this.canvas.width; x += 3) {
      var y = this.fx(x);
      //stroke(255, 255, 255);
      stroke((frameCount / 50) % 255, 255, 255);

      vertex(x, this.canvas.height / 2 + y);

      lastpoint = {
        x: x,
        y: y,
      };
    }
    colorMode(RGB);

    endShape();
  }
}
var waves = [];
var canvas;
var amplitude = 100;
var rate_of_procession_divisor = 2000;
var wavelength = 1000;
var deviation_between_waves = 2;
var flop_rate_divisor = 100;
var deviation_rate = 1;

// SLIDERS
var slider_amplitude;
var slider_rate_of_procession_divisor;
var slider_wavelength;
var slider_deviation_between_waves;
var slider_flop_rate_divisor;
var slider_deviation_rate = 1;

function reset() {
  amplitude = slider_amplitude.value();
  rate_of_procession_divisor = slider_rate_of_procession_divisor.value();
  wavelength = slider_wavelength.value();
  deviation_between_waves = slider_deviation_between_waves.value();
  flop_rate_divisor = slider_flop_rate_divisor.value();
  deviation_rate = slider_deviation_rate.value();
  let nmax = 10;
  waves = [];
  for (let n = 0; n < nmax; n++) {
    var e = 1;
    var ndev = (deviation_rate * n) / nmax;
    //ndev = dev;
    let na = deviate(amplitude, ndev);
    let nb = deviate(rate_of_procession_divisor, ndev);
    let nc = deviate(wavelength, ndev);
    let nd = deviate(deviation_between_waves, ndev * 2);
    let ne = deviate(e, ndev);
    let func = genfunc(na, nb, nc, nd, ne, flop_rate_divisor, ndev);

    wave = new Wave(canvas, (x) => func(x), 0, 0);

    waves.push(wave);
  }
}
function setup() {
  //Create elements
  canvas = createCanvas(800, 800);

  createP("slider_amplitude");
  slider_amplitude = createSlider(1, 2000, 100);
  createP("slider_rate_of_procession_divisor");
  slider_rate_of_procession_divisor = createSlider(1, 2000, 2000);
  createP("slider_wavelength");
  slider_wavelength = createSlider(1, 2000, 1000);
  createP("slider_deviation_between_waves");
  slider_deviation_between_waves = createSlider(0.1, 10, 2, 0.01);
  createP("slider_flop_rate_divisor");
  slider_flop_rate_divisor = createSlider(1, 2000, 100);
  createP("slider_deviation_rate");
  slider_deviation_rate = createSlider(0.1, 10, 1);
  var reset_button = createButton("apply");
  reset_button.mousePressed(reset);
  colorMode(RGB);

  background(32, 32, 32, 25);
  reset();
}

function draw() {
  //ellipse(mouseX, mouseY, 20, 20);
  blendMode(DIFFERENCE);
  var fadeRate = 16 / 255;
  background(fadeRate * 255, fadeRate * 255, fadeRate * 255, 64 * 2);

  blendMode(BLEND);
  waves.forEach((w) => w.draw());
}

function deviate(val, deviation) {
  let ret = (random() - 0.5) * deviation * val + val;
  return ret;
}

function genfunc(a, b, c, d, e, f, dev) {
  return function (x) {
    return (
      a *
      sin(frameCount / b) *
      (Math.sin(e + x / c + frameCount / f) +
        Math.sin(e + (d * x) / c + frameCount / f))
    );
  };
}
