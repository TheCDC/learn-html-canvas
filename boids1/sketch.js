function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const height = urlParams.get("height");
  const width = urlParams.get("width");
  const QUAD_TREE_DEPTH = urlParams.get("QUAD_TREE_DEPTH");
  const BOID_SENSE_RANGE = urlParams.get("BOID_SENSE_RANGE");
  const BOID_SPACING_MINIMUM = urlParams.get("BOID_SPACING_MINIMUM");
  const NUM_BOIDS = urlParams.get("NUM_BOIDS");
  const DISABLE_DRAW_OBJECTS = urlParams.get("DISABLE_DRAW_OBJECTS");
  const DRAW_LINES_TO_NEIGHBORS = urlParams.get("DRAW_LINES_TO_NEIGHBORS");
  return {
    height: height ? Number(height) : 512,
    width: width ? Number(width) : 512,
    QUAD_TREE_DEPTH: QUAD_TREE_DEPTH ? Number(QUAD_TREE_DEPTH) : 4,
    BOID_SENSE_RANGE: BOID_SENSE_RANGE ? Number(BOID_SENSE_RANGE) : 64,
    BOID_SPACING_MINIMUM: BOID_SPACING_MINIMUM
      ? Number(BOID_SPACING_MINIMUM)
      : 16,
    NUM_BOIDS: NUM_BOIDS ? Number(NUM_BOIDS) : 128,
    DISABLE_DRAW_OBJECTS: DISABLE_DRAW_OBJECTS !== "0",
    DRAW_LINES_TO_NEIGHBORS: DRAW_LINES_TO_NEIGHBORS !== "0",
  };
}
function normalizeAngle(ang) {
  // => [0,2pi]
  ang = ang % TWO_PI;
  if (ang < 0) {
    ang = TWO_PI + ang;
  }
  return ang;
}
function squareIntersectsWithCircle(
  squareX,
  squareY,
  squareSideLength,
  circleX,
  circleY,
  circleRadius
) {
  circleDistance_x = Math.abs(circleX - squareX);
  circleDistance_y = Math.abs(circleY - squareY);

  if (circleDistance_x > squareSideLength / 2 + circleRadius) {
    return false;
  }
  if (circleDistance_y > squareSideLength / 2 + circleRadius) {
    return false;
  }

  if (circleDistance_x <= squareSideLength / 2) {
    return true;
  }
  if (circleDistance_y <= squareSideLength / 2) {
    return true;
  }

  cornerDistance_sq =
    Math.pow(circleDistance_x - squareSideLength / 2, 2) +
    Math.pow(circleDistance_y - squareSideLength / 2, 2);

  return cornerDistance_sq <= Math.pow(circleRadius, 2);
}
function minimumAngleBetween(source, target) {
  source = normalizeAngle(source);
  target = normalizeAngle(target);

  const b = (target - source) % TWO_PI;
  const a = (source - target) % TWO_PI;
  if (a < b) {
    return -a;
  }
  return b;
  // const L = target - source;
  // const a = L;
  // const b = L - TWO_PI;
  // const c = L + TWO_PI;
  // const smallest = Math.min(Math.abs(a), Math.abs(b), Math.abs(c));
  // if (Math.abs(a) === smallest) return a;
  // if (Math.abs(b) === smallest) return b;
  // if (Math.abs(c) === smallest) return c;

  // return ((target - source + (TWO_PI * 540) / 360) % TWO_PI) - HALF_PI;
}

function squareIntersectsWithSquare(x1, y1, height1, x2, y2, height2) {
  // if (x1 + height1 < x2 && y1 + height1 < y2) {
  //   return false;
  // }

  // if (x2 + height2 < x1 && y2 + height2 < y1) {
  //   return false;
  // }

  // return true;

  if (x2 <= x1 + height1 && y2 <= y1 + height1) {
    return true;
  }
  if (x1 <= x2 + height2 && y1 <= y2 + height2) {
    return true;
  }
  return false;
}

function pointInsideCircle(x, y, cx, cy, cr) {
  const a = cx - x;
  const b = cy - y;
  return a * a + b * b <= cr * cr;
}
function testQuadTreeNode() {
  console.debug("testQuadTreeNode");
  const depth = 2;
  const width = 16;
  const n1 = new QuadTreeNode(null, width, 0, 0, [], 0);
  const i1 = { position: { x: 0, y: 0 } };
  const n2 = n1.insert(i1, i1.position.x, i1.position.y, depth);
  if (n2 === null) {
    console.error(testQuadTreeNode, n1, n2);
  }

  const found1 = n1.getWithinRadius(0, 0, 1);
  if (found1.length !== 1) {
    console.error("getWithinRadius", found1);
  }

  const i2 = { position: { x: width, y: width } };
  const n3 = n1.insert(i2, i1.position.x, i1.position.y, depth);
  if (n3 === null) {
    console.error(testQuadTreeNode, n1, n2);
  }

  const found2 = n1.getWithinRadius(width, width, 1);
  if (found2.length !== 1) {
    console.error("getWithinRadius", found2);
  }
}
function testQuadTreeDelete() {
  const sideLength = 16;

  for (var depth = 1; depth < 5; depth++) {
    var items = [];

    const t = new QuadTree(depth, 16);
    for (var offset = 0; offset < sideLength; offset++) {
      const i1 = { id: items.length, position: { x: offset, y: offset } };
      items.push(i1);
      t.insert(i1, i1.position.x, i1.position.y);
    }
    for (i of items) {
      t.deleteItem(i, i.position.x, i.position.y);
    }
  }
}

function testQuadTreeUpsert() {
  const sideLength = 16;

  for (var depth = 1; depth < 5; depth++) {
    var items = [];

    const t = new QuadTree(depth, 16);
    for (var offset = 0; offset < sideLength; offset++) {
      const i1 = { id: items.length, position: { x: offset, y: offset } };
      items.push(i1);
      t.insert(i1, i1.position.x, i1.position.y);
    }
    for (var item of items) {
      item.x = random(sideLength);
      item.y = random(sideLength);
      t.upsert(item, item.position.x, item.position.y);
    }
    for (i of items) {
      t.deleteItem(i, i.position.x, i.position.y);
    }
  }
}
class QuadTreeNode {
  constructor(parent, sideLength, x, y, items, depth) {
    this.parent = parent;
    this.sideLength = sideLength;
    this.x = x;
    this.y = y;
    this.items = items;
    this.depth = depth;
    // 0,0 1,0
    // 0,1 1,1
    this.childNodes = {
      0b00: null,
      0b01: null,
      0b10: null,
      0b11: null,
    };
  }
  containsPoint(x, y) {
    return (
      this.x <= x &&
      x < this.x + this.sideLength &&
      this.y <= y &&
      y < this.y + this.sideLength
    );
  }

  childContains(bits, x, y) {
    const xOffset = bits >> 1;
    const yOffset = bits & 1;
    const sideLengthNew = this.sideLength / 2;
    const xNew = this.x + xOffset * sideLengthNew;
    const yNew = this.y + yOffset * sideLengthNew;
    return (
      xNew <= x &&
      x < xNew + sideLengthNew &&
      yNew <= y &&
      y < yNew + sideLengthNew
    );
  }
  createChild(bits) {
    const xOffset = bits >> 1;
    const yOffset = bits & 1;

    const sideLengthNew = this.sideLength / 2;
    const xNew = this.x + xOffset * sideLengthNew;
    const yNew = this.y + yOffset * sideLengthNew;

    const newNode = new QuadTreeNode(
      this,
      this.sideLength / 2,
      xNew,
      yNew,
      [],
      this.depth + 1
    );
    return newNode;
  }

  insert(item, x, y, maxDepth) {
    if (!this.containsPoint(x, y)) {
      if (this.parent === null) {
        console.error("no parent and does not contain point");
      }
      return this.parent.insert(item, x, y, maxDepth);
    }

    if (this.depth === maxDepth) {
      this.items.push(item);
      return this;
    } else {
      for (const addressBits in this.childNodes) {
        if (this.childContains(addressBits, x, y)) {
          const c = this.childNodes[addressBits];
          if (c === null) {
            const newNode = this.createChild(addressBits);
            this.childNodes[addressBits] = newNode;
            return newNode.insert(item, x, y, maxDepth);
          }
          return c.insert(item, x, y, maxDepth);
        }
      }
    }
  }
  getWithinRadius(x, y, r) {
    if (
      !squareIntersectsWithSquare(
        this.x,
        this.y,
        this.sideLength,
        x - r,
        y - r,
        r
      )
    ) {
      if (this.parent !== null) {
        return this.parent.getWithinRadius(x, y, r);
      }
      return [];
    }
    const resultMine = [];
    if (this.items.length > 0) {
      for (const item of this.items) {
        if (pointInsideCircle(item.position.x, item.position.y, x, y, r)) {
          resultMine.push(item);
        }
      }
    }
    let resultChild = [];
    for (const addressBits in this.childNodes) {
      const n = this.childNodes[addressBits];
      if (n !== null) {
        if (
          squareIntersectsWithSquare(n.x, n.y, n.sideLength, x - r, y - r, r)
        ) {
          resultChild = resultChild.concat(n.getWithinRadius(x, y, r));
        }
      }
    }
    return resultMine.concat(resultChild);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
  }
}

class Boid {
  constructor(id, canvas) {
    this.id = id;
    this.canvas = canvas;
    this.weight = 1 + Math.pow(random(1), 4) * 15;
    this.species = random([1]);
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };
    colorMode(HSB);

    this.color = color(this.species * 4 * 16, 100, 100, 1);
    this.direction = PI / 2;
  }
}
const BUTTON_FUNCTIONS = {
  DRAW_GEO_CENTER: {
    text: "DRAW_GEO_CENTER",
    action: () => (DRAW_GEO_CENTER = !DRAW_GEO_CENTER),
  },
  DRAW_SENSE_RANGE: {
    text: "DRAW_SENSE_RANGE",
    action: () => (DRAW_SENSE_RANGE = !DRAW_SENSE_RANGE),
  },
  BOID_DRAW_PROXIMITY_ALARM: {
    text: "BOID_DRAW_PROXIMITY_ALARM",
    action: () => (BOID_DRAW_PROXIMITY_ALARM = !BOID_DRAW_PROXIMITY_ALARM),
  },
  DRAW_LINES_TO_NEIGHBORS: {
    text: "DRAW_LINES_TO_NEIGHBORS",
    action: () => (DRAW_LINES_TO_NEIGHBORS = !DRAW_LINES_TO_NEIGHBORS),
  },
  QUAD_TREE_DRAW_GRID: {
    text: "QUAD_TREE_DRAW_GRID",
    action: () => (QUAD_TREE_DRAW_GRID = !QUAD_TREE_DRAW_GRID),
  },
  RANDOMIZE_DIRECTIONS: {
    text: "RANDOMIZE_DIRECTIONS()",
    action: () => ITEMS.map((i) => (i.direction = random() * 2 * PI)),
  },
};

function tests() {
  testQuadTreeNode();
  // testQuadTreeDelete();
  // testQuadTreeUpsert();
}
var DRAW_GEO_CENTER = true;
var DRAW_ALIGNMENT_ANGLE = true;
var DRAW_SENSE_RANGE = false;
var DRAW_LINES_TO_NEIGHBORS = true;
var QUAD_TREE_DRAW_GRID = true;
var BOID_DRAW_PROXIMITY_ALARM = false;
var BOID_DRAW_LEADER = true;
var TREE;
var CANVAS;
var ITEMS = [];
var WIDTH = 512;
var HEIGHT = WIDTH;
var QUAD_TREE_DEPTH = 4;
var BOID_SENSE_RANGE = 64;
var BOID_RANDOM_TURNS = false;
const BOID_TURN_RATE = 0.2;
const BOID_SPEED = 2;
var BOID_SPACING_MINIMUM = 16;
var NUM_BOIDS = 128;

var frameTimePrev = 0;
var frameTimeDebugDrawPrevious = 0;
var PARAMS;
var frameTimes = [];
var DISABLE_DRAW_OBJECTS = false;
function setup() {
  tests();
  const params = getUrlParams();
  QUAD_TREE_DEPTH = params.QUAD_TREE_DEPTH;
  NUM_BOIDS = params.NUM_BOIDS;
  DISABLE_DRAW_OBJECTS = params.DISABLE_DRAW_OBJECTS;
  DRAW_LINES_TO_NEIGHBORS = params.DRAW_LINES_TO_NEIGHBORS;
  BOID_SPACING_MINIMUM = params.BOID_SPACING_MINIMUM;
  BOID_SENSE_RANGE = params.BOID_SENSE_RANGE;
  WIDTH = params.width;
  HEIGHT = params.width;
  CANVAS = createCanvas(params.width, params.height);

  for (var ii = 0; ii < NUM_BOIDS; ii++) {
    const b = new Boid(ii, CANVAS, random() < 0.05);
    ITEMS.push(b);
  }

  for (const key in BUTTON_FUNCTIONS) {
    const o = BUTTON_FUNCTIONS[key];
    const b = createButton(o.text);
    b.mousePressed(o.action);
  }
}

function draw() {
  frameRate(60);
  background(0, 0, 0, 1);
  angleMode(RADIANS);

  TREE = new QuadTreeNode(null, WIDTH, 0, 0, [], 0);

  for (const item of ITEMS) {
    TREE.insert(item, item.position.x, item.position.y, QUAD_TREE_DEPTH);
  }

  // ====== Draw QuadTree node bounds
  let queue = [TREE];
  while (queue.length > 0) {
    var currentNode = queue.pop();
    if (!DISABLE_DRAW_OBJECTS && QUAD_TREE_DRAW_GRID) {
      noFill();
      // color(255*currentNode.depth/TREE.maxDepth);
      stroke(120, 100, 100, 0.75);
      rect(
        currentNode.x,
        currentNode.y,
        currentNode.sideLength,
        currentNode.sideLength
      );
    }
    // ====== Draw items
    for (const item of currentNode.items) {
      // get close neighbors and draw lines to them
      const neighborsAll = TREE.getWithinRadius(
        item.position.x,
        item.position.y,
        BOID_SENSE_RANGE
      ).filter((x) => x != item);
      const neighborsSameSpecies = neighborsAll.filter(
        (x) => x.species === item.species
      );
      var neighborClosest = null;
      var distNeighborClosest = null;
      if (neighborsAll.length > 1) {
        // find closest neighbor
        neighborClosest = neighborsAll[0];
        distNeighborClosest = dist(
          //initialize
          item.position.x,
          item.position.y,
          neighborsAll[0].position.x,
          neighborsAll[0].position.y
        );

        for (const o of neighborsAll) {
          const d = dist(
            item.position.x,
            item.position.y,
            o.position.x,
            o.position.y
          );
          if (d < distNeighborClosest) {
            neighborClosest = o;
            distNeighborClosest = d;
          }
        }
      }
      if (!DISABLE_DRAW_OBJECTS && DRAW_LINES_TO_NEIGHBORS) {
        for (const neighbor of neighborsSameSpecies) {
          stroke(item.color);

          line(
            item.position.x,
            item.position.y,
            neighbor.position.x,
            neighbor.position.y
          );
        }
      }
      const neighborInfo = neighborsSameSpecies.reduce(
        (accumulator, neighbor) => {
          const angleDiffBetween = minimumAngleBetween(
            item.direction,
            neighbor.direction
          );

          return {
            ...accumulator,
            sumDiffDirection: accumulator.sumDiffDirection + angleDiffBetween,
            sumWeightedDiffDirection:
              accumulator.sumDiffDirection + angleDiffBetween,
            sumWeightedNeighborX:
              accumulator.sumWeightedNeighborX +
              neighbor.position.x * neighbor.weight,
            sumWeightedNeighborY:
              accumulator.sumWeightedNeighborY +
              neighbor.position.y * neighbor.weight,
            sumNeighborWeight: accumulator.sumNeighborWeight + neighbor.weight,
          };
        },
        {
          sumDiffDirection: 0,
          sumWeightedDiffDirection: 0,
          sumWeight: 0,
          sumWeightedNeighborX: 0,
          sumWeightedNeighborY: 0,
          sumNeighborWeight: 0,
        }
      );

      const geoCenter = {
        x:
          neighborsSameSpecies.length === 0
            ? item.position.x
            : neighborInfo.sumWeightedNeighborX /
              neighborInfo.sumNeighborWeight,
        y:
          neighborsSameSpecies.length === 0
            ? item.position.y
            : neighborInfo.sumWeightedNeighborY /
              neighborInfo.sumNeighborWeight,
      };

      const angleDiffOfAlignment =
        neighborsSameSpecies.length === 0
          ? 0
          : neighborInfo.sumDiffDirection / neighborsSameSpecies.length;
      const angleToGeoCenter = atan2(
        geoCenter.y - item.position.y,
        geoCenter.x - item.position.x
      );
      const angleDiffOfCohesion = minimumAngleBetween(
        item.direction,
        angleToGeoCenter
      );
      const alignmentSpeedMultiplier = 1 - Math.abs(angleDiffOfAlignment) / PI;
      // const alignmentSpeedMultiplier = 1;
      // turn to get away from nearest boid

      const proximityAlarm =
        neighborClosest &&
        distNeighborClosest &&
        distNeighborClosest <= BOID_SPACING_MINIMUM;
      const angleEscapeProjectionDifferential = proximityAlarm
        ? minimumAngleBetween(
            item.direction,
            atan2(
              neighborClosest.position.y - item.position.y,
              neighborClosest.position.x - item.position.x
            )
          )
        : item.direction;
      const angleEscapeActualDifferential =
        PI - Math.abs(angleEscapeProjectionDifferential) < 0.1
          ? [PI / 2, -PI / 2][item.id % 2]
          : angleEscapeProjectionDifferential;
      const angleEscape = proximityAlarm ? angleEscapeActualDifferential : 0;
      // is this boid escaping or aligning?
      const angleDiffToTarget = proximityAlarm
        ? angleEscape
        : angleDiffOfAlignment * 0.5 + angleDiffOfCohesion * 0.5;
      const myTurnRate = proximityAlarm ? BOID_TURN_RATE * 2 : BOID_TURN_RATE;

      const turnAllowance = myTurnRate; //* (1 - Math.abs(angleDiffOfAlignment) / PI);
      const signAngleDiffToTarget = Math.sign(angleDiffToTarget);
      const myOldAngleThisFrame = item.direction;
      const myNewAngleThisFrame =
        item.direction +
        (Math.abs(angleDiffToTarget) < turnAllowance
          ? signAngleDiffToTarget * angleDiffToTarget
          : signAngleDiffToTarget * turnAllowance) /
          item.weight;

      item.direction = myNewAngleThisFrame;

      // random turns
      // if (BOID_RANDOM_TURNS && random() < 0.001) {
      //   item.direction = random() * TWO_PI;
      // }

      const cosOfMyDir = cos(item.direction);
      const sinOfMyDir = sin(item.direction);

      const mySpeedThisFrame = BOID_SPEED * alignmentSpeedMultiplier;
      item.position.x += mySpeedThisFrame * cosOfMyDir;
      item.position.y += mySpeedThisFrame * sinOfMyDir;
      // ==== BEGIN normalize boid vars
      // == position
      if (item.position.x < 0) {
        item.position.x = WIDTH + item.position.x;
      }
      if (item.position.y < 0) {
        item.position.y = HEIGHT + item.position.y;
      }

      item.position.x = item.position.x % WIDTH;
      item.position.y = item.position.y % HEIGHT;
      // == angle
      if (item.direction < 0) {
        item.direction = TWO_PI + item.direction;
      }
      if (item.direction > TWO_PI) {
        item.direction = item.direction % TWO_PI;
      }
      // ==== END normalize boid vars
      const boidRadius = 4 * Math.pow(item.weight, 0.5);
      if (DRAW_GEO_CENTER) {
        // draw line to the point this boid is escaping
        fill(80, 0, 100);
        stroke(80, 0, 100);
        line(item.position.x, item.position.y, geoCenter.x, geoCenter.y);
        circle(geoCenter.x, geoCenter.y, 4);
      }
      if (DRAW_ALIGNMENT_ANGLE) {
        fill(120, 100, 100);
        stroke(120, 100, 100);
        const xAlignment =
          item.position.x +
          boidRadius * cos(angleDiffOfAlignment + item.direction);
        const yAlignment =
          item.position.y +
          boidRadius * sin(angleDiffOfAlignment + item.direction);
        line(item.position.x, item.position.y, xAlignment, yAlignment);
        circle(xAlignment, yAlignment, 4);

        fill(180, 100, 100);
        stroke(180, 100, 100);
        const xCohesion =
          item.position.x +
          boidRadius * cos(angleDiffOfCohesion + item.direction);
        const yCohesion =
          item.position.y +
          boidRadius * sin(angleDiffOfCohesion + item.direction);
        line(item.position.x, item.position.y, xCohesion, yCohesion);
        circle(xCohesion, yCohesion, 4);
        const noop = true;
      }
      if (
        !DISABLE_DRAW_OBJECTS &&
        proximityAlarm &&
        BOID_DRAW_PROXIMITY_ALARM
      ) {
        fill(30, 100, 100);
        stroke(0, 100, 100);
        line(
          item.position.x,
          item.position.y,
          item.position.x + 16 * cos(angleEscape + item.direction),
          item.position.y + 16 * sin(angleEscape + item.direction)
        );
        circle(item.position.x - 8, item.position.y, 4);
      }

      if (!DISABLE_DRAW_OBJECTS) {
        fill(item.color);
        stroke(0, 0, 0);
        circle(item.position.x, item.position.y, boidRadius);
        stroke(item.color);
        line(
          item.position.x,
          item.position.y,
          item.position.x + boidRadius * cosOfMyDir,
          item.position.y + boidRadius * sinOfMyDir
        );
      }
      if (!DISABLE_DRAW_OBJECTS && DRAW_SENSE_RANGE) {
        noFill();
        stroke(
          hue(item.color),
          saturation(item.color),
          brightness(item.color),
          alpha(item.color) * 0.2
        );

        circle(item.position.x, item.position.y, BOID_SENSE_RANGE * 2);
        stroke(
          hue(item.color),
          saturation(item.color) * 0.2,
          brightness(item.color),
          alpha(item.color) * 0.2
        );
        circle(item.position.x, item.position.y, BOID_SPACING_MINIMUM * 2);
      }
    }

    for (const child in currentNode.childNodes) {
      var node = currentNode.childNodes[child];
      if (node !== null) {
        queue.push(node);
      }
    }
  }

  // ====== Draw items near mouse
  var positions = [
    [mouseX, mouseY],
    // [mouseX + 128, mouseY],
    // [mouseX + 128, mouseY + 128],
    // [mouseX, mouseY + 128],
  ];
  for (const pos of positions) {
    var neighbors = TREE.getWithinRadius(pos[0], pos[1], BOID_SENSE_RANGE);
    for (const n of neighbors) {
      if (!DISABLE_DRAW_OBJECTS) {
        stroke(60, 100, 100);
        // stroke(255)
        line(pos[0], pos[1], n.position.x, n.position.y);
      }
    }
  }

  frameTimes.push(deltaTime);
  while (frameTimes.length > 60) {
    frameTimes.splice(0, 1);
  }
  let frameTimeSum = frameTimes.reduce((s, v) => s + v, 0);

  textSize(24);
  fill(100, 0, 100);
  stroke(100, 0, 0);
  text((1 / (frameTimeSum / frameTimes.length / 1000)).toFixed(2), 0, 24);
}
