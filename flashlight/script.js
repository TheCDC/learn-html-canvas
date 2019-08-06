class Simulation {

    constructor() {
        this.startTime = (new Date()).getTime();
        this.on = true;
        this.brightness = 0;
        this.timeStep = 30; //milliseconds
        this.flickerChance = 1 / 10;
        // this.freq = 2;
        this.dBrightness = 0;
    }
    step() {
        this.brightness = Math.sin((new Date()).getTime()/(1000/this.freq)) >= 0.5 ? 1 : 0
        if (Math.random() <= this.flickerChance) {
            this.brightness = 0;
        }else{
            this.brightness = 1;
        }
    }
}

function drawSimulation(ctx, sim) {
    ctx.fillStyle = `rgb(0,0,0)`;
    ctx.fillRect(0, 0, 300, 300)
    var img = document.getElementById('img-flashlight')
    ctx.drawImage(img, 150, 150, 100, 50)
    // console.log(sim.brightness)
    var b = (sim.brightness + 1) *(0.5*255)
    ctx.fillStyle = `rgb(${b},${b},${b})`
    ctx.fillRect(0, 0, 50, 50)



}
function startDrawing() {
    var canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");


        var sim = new Simulation();
        // main loop
        setInterval(() => {
            sim.step();
            drawSimulation(ctx, sim);
        }, sim.timeStep)

    }
}