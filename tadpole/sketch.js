var MOVERSTATES = Object.freeze({
  MOVING: 1,
  SPINNING: 2,
});
const SEEDMAX = 30000;
class Mover {
  constructor(canvas) {
    this.hsvColor = random(255);
    this.seed = random(SEEDMAX);
    this.lastTransitionTime = millis();
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };

    this.state = MOVERSTATES.MOVING;
    this.canvas = canvas;
    this.destination = {
      x: random(canvas.width),
      y: random(canvas.height),
    };

    this.speed = 3;
  }

  update() {
    // this.destination = {
    // 	x: mouseX,
    // 	y: mouseY
    // };

    if (this.state === MOVERSTATES.MOVING) {
      //traveling to destination
      if (
        this.position.x != this.destination.x ||
        this.position.y != this.destination.y
      ) {
        var xdiff = this.destination.x - this.position.x;
        var ydiff = this.destination.y - this.position.y;

        // text(xdiff + " " + ydiff, 10, 10);
        var posdiff = pow(pow(xdiff, 2) + pow(ydiff, 2), 0.5);
        if (posdiff < this.speed) {
          this.position = this.destination;
          this.state = MOVERSTATES.SPINNING;
        } else {
          var ang = atan2(ydiff, xdiff);
          this.position.x += this.speed * cos(ang);
          this.position.y += this.speed * sin(ang);
        }
      } else {
        //at destination
        this.state = MOVERSTATES.SPINNING;
      }
    } else if (this.state === MOVERSTATES.SPINNING) {
      if (millis() - this.lastTransitionTime > this.seed) {
        //go to moving state after a random delay
        this.lastTransitionTime = millis();
        this.state = MOVERSTATES.MOVING;
        this.destination = {
          x: random(canvas.width),
          y: random(canvas.height),
        };
        this.seed = random(SEEDMAX);
        this.speed = random(7);
      }
    } else {
    }
  }

  draw() {
    push();
    colorMode(HSL, 255);
    fill(this.hsvColor, 128, 128);

    if (this.state === MOVERSTATES.MOVING) {
      ellipse(this.position.x, this.position.y, 10, 10);
    } else if (this.state === MOVERSTATES.SPINNING) {
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
  var maximum_distance = 40;
  var grid_cell_side_length = 40;
  var grid = [];
  var numrows = ceil(canvas.height / grid_cell_side_length);
  var numcols = ceil(canvas.width / grid_cell_side_length);
  for (var rs = 0; rs < numrows; rs++) {
    var row = [];
    for (var cs = 0; cs < numcols; cs++) {
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
    var grid_row = int(
      mover_to_place_in_grid.object.position.y / grid_cell_side_length
    );
    var grid_col = int(
      mover_to_place_in_grid.object.position.x / grid_cell_side_length
    );
    grid[grid_row][grid_col].push(mover_to_place_in_grid);
  });
  //iterate over cells and draw lines between units that are close enough
  grid.forEach((row, y) => {
    row.forEach((col, x) => {
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
      grid[y][x].forEach((cell_container) => {
        if (!cell_container.flag) {
          cell_container.flag = true;
          relevant_units.forEach((other_cell_container) => {
            var obj_a = cell_container.object;
            var obj_b = other_cell_container.object;
            var d = dist(
              obj_a.position.x,
              obj_a.position.y,
              obj_b.position.x,
              obj_b.position.y
            );
            if (d < maximum_distance) {
              var opacity = (d * 255) / maximum_distance;
              push();
              var weight =
                (8 * max(maximum_distance - d, 0)) / maximum_distance;
              strokeWeight(weight);
              stroke(255, 255, 255, opacity);
              line(
                obj_a.position.x,
                obj_a.position.y,
                obj_b.position.x,
                obj_b.position.y
              );
              pop();
            }
          });
        }
      });
    });
  });
}
var movers = [];
var CANVAS;

function setup() {
  CANVAS = createCanvas(600, 600);
  for (var i = 0; i < 200; i++) {
    movers.push(new Mover(CANVAS));
  }
}

function draw() {
  background(20);
  movers.forEach((el) => {
    el.update();
    el.draw();
  });

  drawWebLines(movers, CANVAS);
}
