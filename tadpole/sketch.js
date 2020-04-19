var MOUSE_DISTURB_RADIUS = 50;

var MOVER_STATES = Object.freeze({
  MOVING: 1,
  SPINNING: 2,
});
const SEED_MAXIMUM = 30000;
class Mover {
  constructor(canvas) {
    this.hsvColor = random(255);
    this.seed = random(SEED_MAXIMUM);
    this.lastTransitionTime = millis();
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };

    this.orbitPosition = { x: random(-10, 10), y: random(-10, 10) };

    this.state = MOVER_STATES.MOVING;
    this.canvas = canvas;
    this.destination = {
      x: random(this.canvas.width),
      y: random(this.canvas.height),
    };

    this.speed = 3;
  }
  updateOrbit() {
    var e = 25;
    this.orbitPosition.x = random(-e, e);
    this.orbitPosition.y = random(-e, e);
  }

  update() {
    if (random() <= 0.1) {
      this.updateOrbit();
    }
    // this.destination = {
    // 	x: mouseX,
    // 	y: mouseY
    // };

    if (this.state === MOVER_STATES.MOVING) {
      //traveling to destination
      if (
        this.position.x != this.destination.x ||
        this.position.y != this.destination.y
      ) {
        var diff_x = this.destination.x - this.position.x;
        var diff_y = this.destination.y - this.position.y;

        var distance = pow(pow(diff_x, 2) + pow(diff_y, 2), 0.5);
        if (distance < this.speed) {
          this.position = this.destination;
          this.transitionToSpinning();
        } else {
          var ang = atan2(diff_y, diff_x);
          this.position.x += this.speed * cos(ang);
          this.position.y += this.speed * sin(ang);
        }
      } else {
        //at destination
        this.state = MOVER_STATES.SPINNING;
      }
    } else if (this.state === MOVER_STATES.SPINNING) {
      //the mouse being near a particle forces it to get going.
      var mouseDist = dist(this.position.x, this.position.y, mouseX, mouseY);
      if (mouseDist < MOUSE_DISTURB_RADIUS) {
        this.transitionToMoving();
      }
      //time also triggers the transition to moving
      if (millis() - this.lastTransitionTime > this.seed) {
        this.transitionToMoving();
      }
    } else {
    }
  }
  transitionToSpinning() {
    this.state = MOVER_STATES.SPINNING;
  }
  transitionToMoving() {
    //go to moving state after a random delay
    this.lastTransitionTime = millis();
    this.state = MOVER_STATES.MOVING;

    this.destination = {
      x: random(this.canvas.width),
      y: random(this.canvas.height),
    };

    this.seed = random(SEED_MAXIMUM);
    this.speed = random(1, 10);
  }

  draw() {
    push();
    colorMode(HSL, 255);

    if (this.state === MOVER_STATES.MOVING) {
      fill(this.hsvColor, 32, 128);

      ellipse(this.position.x, this.position.y, 10, 10);
    } else if (this.state === MOVER_STATES.SPINNING) {
      fill(this.hsvColor, 128 + 64, 128);

      var freq = 0.05;
      var rad = 20;
      circle(
        this.position.x,
        this.position.y,
        (rad * (sin((frameCount + this.seed) * freq) + 1)) / 2
      );
    }

    let opacity = min(
      (255 *
        dist(
          this.position.x,
          this.position.y,
          this.destination.x,
          this.destination.y
        )) /
        200,
      255
    );
    colorMode(RGB);
    stroke(255, 0, 0, opacity);
    pop();
  }
}

function drawWebLines(movers_array, canvas) {
  //generate grid cells based on max distance
  //and put each unit in its corresponding cell
  //grid is 3d array
  //create empty grid
  var maximum_distance = 60;
  var grid_cell_side_length = maximum_distance;
  var grid = [];
  var num_grid_rows = ceil(canvas.height / grid_cell_side_length);
  var num_grid_cols = ceil(canvas.width / grid_cell_side_length);
  for (var rs = 0; rs < num_grid_rows; rs++) {
    var row = [];
    for (var cs = 0; cs < num_grid_cols; cs++) {
      row.push([]);
    }
    grid.push(row);
  }
  //pack units into a container that can flag whether the unit has been processed
  var containers = movers_array.map((unit) => {
    return { object: unit, flag: false };
  });
  //populate grid
  containers.forEach((mover_to_place_in_grid) => {
    var obj = mover_to_place_in_grid.object;
    var pos = mover_to_place_in_grid.object.position;
    if (
      pos.x < obj.canvas.width &&
      pos.x > 0 &&
      pos.y < obj.canvas.height &&
      pos.y > 0
    ) {
      var grid_row = min(
        num_grid_rows,
        floor(mover_to_place_in_grid.object.position.y / grid_cell_side_length)
      );
      var grid_col = min(
        num_grid_cols,
        floor(mover_to_place_in_grid.object.position.x / grid_cell_side_length)
      );
      var target_cell = grid[grid_row][grid_col];
      target_cell.push(mover_to_place_in_grid);
    }
  });
  //iterate over cells and draw lines between units that are close enough
  movers_array.forEach((unit) => {
    var y = int(unit.position.y / grid_cell_side_length);
    var x = int(unit.position.x / grid_cell_side_length);

    push();
    fill(255);
    stroke(0);
    //text(grid[y][x].length, x * maximum_distance, y * maximum_distance + 10);
    pop();
    var relevant_units = new Set();
    for (var neighbor_y = y - 1; neighbor_y <= y + 1; neighbor_y++) {
      for (var neighbor_x = x - 1; neighbor_x <= x + 1; neighbor_x++) {
        var row = grid[neighbor_y];
        if (row === undefined) {
          continue;
        }
        var target = row[neighbor_x];
        if (target !== undefined) {
          relevant_units = new Set([...relevant_units, ...target]);
        } else {
          //nop
        }
      }
    }
    grid[y][x].forEach((each_object_container) => {
      if (!each_object_container.flag) {
        each_object_container.flag = true;
        relevant_units.forEach((other_cell_container) => {
          var obj_a = each_object_container.object;
          var obj_b = other_cell_container.object;
          var d = dist(
            obj_a.position.x,
            obj_a.position.y,
            obj_b.position.x,
            obj_b.position.y
          );
          if (d <= maximum_distance) {
            var opacity = (d * 255) / maximum_distance;
            push();
            var weight =
              0.5 + (7 * max(maximum_distance - d, 0)) / maximum_distance;

            strokeWeight(weight);
            stroke(255, 255, 255, opacity);
            noFill();
            //have a chance of not drawing an arc

            beginShape();
            vertex(obj_a.position.x, obj_a.position.y);
            var e = 2;

            bezierVertex(
              obj_a.position.x + obj_a.orbitPosition.x + random(-e, e),
              obj_a.position.y + obj_a.orbitPosition.y + random(-e, e),
              obj_b.position.x + obj_b.orbitPosition.x + random(-e, e),
              obj_b.position.y + obj_b.orbitPosition.y + random(-e, e),
              obj_b.position.x,
              obj_b.position.y
            );
            endShape();
            // line(
            //   obj_a.position.x,
            //   obj_a.position.y,
            //   obj_b.position.x,
            //   obj_b.position.y
            // );
            pop();
          }
        });
      }
    });
  });
  grid.forEach((row, y) => {
    row.forEach((col, x) => {});
  });
}
var movers = [];
var CANVAS;

function addParticle() {
  movers.push(new Mover(CANVAS));
}

function subtractParticle() {
  movers.pop();
}

function setup() {
  frameRate(60);
  CANVAS = createCanvas(800, 800);
  var resetButton = createButton("Reset");
  resetButton.mousePressed(InitializeSimulation);
  var addParticleButton = createButton("Add One");
  addParticleButton.mousePressed(addParticle);
  var removeParticleButton = createButton("Remove one");
  removeParticleButton.mousePressed(subtractParticle);
  InitializeSimulation();
}

function InitializeSimulation() {
  movers = [];
  for (var i = 0; i < 100; i++) {
    movers.push(new Mover(CANVAS));
  }
}

function draw() {
  background(20);
  var mouseBGOpacityTemporalPeriod = 128;
  fill(
    255,
    255,
    255,
    64 +
      64 *
        0.5 *
        (1 + sin(frameCount / (mouseBGOpacityTemporalPeriod / (2 * PI))))
  );
  circle(mouseX, mouseY, MOUSE_DISTURB_RADIUS * 2);
  movers.forEach((el) => {
    el.update();
    el.draw();
  });
  try {
    drawWebLines(movers, CANVAS);
  } catch (err) {
    console.error(err);
  }
}
