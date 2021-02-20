USERIMAGE = null;
WIDTH = 800;
HEIGHT = 450;
MAXLINES = 100

function drawSimulation(ctx) {
    // black background
    ctx.fillStyle = `rgb(0,0,0)`;
    var WIDTH = ctx.canvas.width;
    var HEIGHT = ctx.canvas.height;
    const MINDIM = Math.min(WIDTH, HEIGHT)
    radiusMin = MINDIM / 4;
    radiusMax = MINDIM;
    CENTER = {
        x: WIDTH / 2,
        y: HEIGHT / 2,
    }
    console.log(WIDTH, HEIGHT)
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // user image
    if (USERIMAGE != null) {
        var scalingFactor = HEIGHT / USERIMAGE.height;
        var targetDimensions = {
            x: USERIMAGE.width * scalingFactor,
            y: USERIMAGE.height * scalingFactor,
        }
        ctx.drawImage(USERIMAGE, WIDTH / 2 - targetDimensions.x / 2, 0, targetDimensions.x, targetDimensions.y);
    }
    // speed lines
    var numLines = Math.round(Math.random() * MAXLINES);
    for (var i = 0; i < numLines; i++) {
        var point_angle = 2 * Math.PI * Math.random();
        var angular_width = Math.random() * (2 / 100) * 2 * Math.PI
        var point_radius = Math.random() * (radiusMax - radiusMin) + radiusMin;
        var center_point = {
            x: point_radius * Math.cos(point_angle) + CENTER.x,
            y: point_radius * Math.sin(point_angle) + CENTER.y
        }
        var left_corner = {
            x: WIDTH * Math.cos(point_angle - angular_width / 2) + center_point.x,
            y: WIDTH * Math.sin(point_angle - angular_width / 2) + center_point.y
        };
        var right_corner = {
                x: WIDTH * Math.cos(point_angle + angular_width / 2) + center_point.x,
                y: WIDTH * Math.sin(point_angle + angular_width / 2) + center_point.y
            }
            // console.log(center_point)
        ctx.fillStyle = `rgb(255,255,255)`;
        ctx.beginPath();
        ctx.moveTo(center_point.x, center_point.y);
        ctx.lineTo(left_corner.x, left_corner.y);
        ctx.lineTo(right_corner.x, right_corner.y);
        ctx.closePath();
        ctx.fill();

    }
}

function startDrawing() {
    var canvas = document.getElementById("myCanvas");
    const urlParams = new URLSearchParams(window.location.search);
    const setWidth = urlParams.get('width');
    const setHeight = urlParams.get('height');
    const setMaxLines = urlParams.get('maxLines');
    if (setWidth) {
        canvas.width = setWidth
    }
    if (setHeight) {
        canvas.height = setHeight
    }
    if (setMaxLines) {
        MAXLINES = setMaxLines
    }
    var canvas = document.getElementById("myCanvas");

    var e = document.getElementById("imgUploadField");

    function handleFiles(e) {

        var img = new Image;
        img.src = URL.createObjectURL(e.target.files[0])
        USERIMAGE = img
    }
    e.addEventListener("change", handleFiles);


    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        setInterval(() => {
            drawSimulation(ctx);
            //   draw(ctx);
        }, 50);
    } else {
        console.log("Browser does not support canvas???");
    }
}

function draw(ctx) {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    //   console.log(`rgb(${r},${g},${b})`);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 50, 50);
}