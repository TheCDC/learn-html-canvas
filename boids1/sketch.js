function normalizeAngle(ang) {
  // => [0,2pi]
  ang = ang % PI;
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
  return Math.pow(cx - x, 2) + Math.pow(cy - y, 2) <= Math.pow(cr, 2);
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
class QuadTreeNode {
  constructor(sideLength, x, y, items, isLeaf, depth, parent) {
    this.sideLength = sideLength;
    this.x = x;
    this.y = y;
    this.items = items;
    this.isLeaf = isLeaf;
    this.depth = depth;
    this.parent = parent;
    // 0,0 1,0
    // 0,1 1,1
    this.childNodes = {
      0b00: null,
      0b10: null,
      0b01: null,
      0b11: null,
    };
  }
  containsPoint(x, y) {
    return (
      this.x <= x &&
      this.x + this.sideLength < x &&
      this.y <= y &&
      this.y + this.sideLength < y
    );
  }
}

class QuadTree {
  constructor(maxDepth, sideLength) {
    if (maxDepth === undefined) {
      maxDepth = 3;
    }
    this.maxDepth = maxDepth;
    this.root = new QuadTreeNode(sideLength, 0, 0, [], true, 0);
  }
  deleteItem(item, x, y, currentNode) {
    if (currentNode == null) {
      currentNode = this.root;
    }
    if (currentNode.isLeaf) {
      if (currentNode.items.some((x) => x.id === item.id)) {
        currentNode.items = currentNode.items.filter((i) => i.id !== item.id);
      } else {
        // reached where the item should be but it was never inserted into the tree
        return null;
      }
    } else {
      for (const key in currentNode.childNodes) {
        const child = currentNode.childNodes[key];
        if (child && child.containsPoint(x, y)) {
          const deletedFrom = this.deleteItem(item, x, y, child);
          if (child.items.length === 0) {
            currentNode.childNodes[key] = null;
          }
          return deletedFrom;
        }
      }
      // console.error('somehow reached a leaf node that does not contain the cords')
    }
  }
  findContainingNode(item, x, y) {}
  insert(item, x, y) {
    // console.log('insert', item, '@', x, y)
    let i = 0;
    let currentNode = this.root;
    while (true) {
      if (i > this.maxDepth) {
        // console.error('TOO DEEP', currentNode)
        break;
      }
      // console.log('algorithm reached', currentNode)

      // if this node is the max depth and its geometry bounds our items coords
      if (currentNode.depth === this.maxDepth) {
        if (
          currentNode.x <= x &&
          x < currentNode.x + currentNode.sideLength &&
          currentNode.y <= y &&
          y < currentNode.y + currentNode.sideLength
        ) {
          currentNode.items.push(item);
          // console.log("successfully inserted", item, x, y, "@", currentNode);
          break;
        } else {
          // console.error('Hit depth but missed right node', x, y, currentNode)
        }
      }

      // else we need to dig deeper
      const xHalfway = currentNode.x + currentNode.sideLength / 2;
      const yHalfway = currentNode.y + currentNode.sideLength / 2;
      const xOffset = x < xHalfway ? 0 : 1;
      const yOffset = y < yHalfway ? 0 : 1;
      const nodeChildCoordinate = (xOffset << 1) | yOffset;
      const childNode = currentNode.childNodes[nodeChildCoordinate];
      if (childNode === null) {
        // create new child node
        const newSideLength = currentNode.sideLength / 2;
        const newX = currentNode.x + xOffset * newSideLength;
        const newY = currentNode.y + yOffset * newSideLength;
        const newNode = new QuadTreeNode(
          newSideLength,
          newX,
          newY,
          [],
          true,
          currentNode.depth + 1
        );
        currentNode.childNodes[nodeChildCoordinate] = newNode;
        // currentNode is now a parent and not a leaf
        currentNode.isLeaf = false;
        // console.log('created node', newNode, 'under', currentNode, 'for', x, y)
        currentNode = newNode;
      } else {
        currentNode = childNode;
      }
      i++;
    }
  }
  getWithinRadius(x, y, r) {
    // traverse tree and examine all leaf nodes that contain at least one point in the target radius
    let matchedLeaves = [];
    let queue = [this.root];
    while (queue.length > 0) {
      let currentNode = queue.pop();
      if (currentNode === null) {
        continue;
      }
      if (
        // squareIntersectsWithCircle(
        //   currentNode.x,
        //   currentNode.y,
        //   currentNode.sideLength,
        //   x,
        //   y,
        //   r
        // )
        squareIntersectsWithSquare(
          x - r,
          y - r,
          r,
          currentNode.x,
          currentNode.y,
          currentNode.sideLength
        )
      ) {
        matchedLeaves.push(currentNode);
        queue.push(currentNode.childNodes[0b00]);
        queue.push(currentNode.childNodes[0b10]);
        queue.push(currentNode.childNodes[0b01]);
        queue.push(currentNode.childNodes[0b11]);
      }
    }
    let results = [];
    for (const node of matchedLeaves) {
      // console.log(node);
      for (const item of node.items) {
        if (pointInsideCircle(item.position.x, item.position.y, x, y, r)) {
          results.push(item);
        }
      }
    }
    return results;
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
    this.species = random([1, 2, 3, 4]);
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

var DRAW_GEO_CENTER = false;
var DRAW_SENSE_RANGE = false;
var DRAW_LINES_TO_NEIGHBORS = true;
var QUAD_TREE_DRAW_GRID = true;
var BOID_DRAW_PROXIMITY_ALARM = false;
var TREE;
var CANVAS;
var ITEMS = [];
const WIDTH = 512;
const HEIGHT = WIDTH;
const QUAD_TREE_DEPTH = 4;
const BOID_SENSE_RANGE = 64;
const BOID_TURN_RATE = 0.1;
const BOID_SPEED = 1;
const BOID_SPACING_MINIMUM = 16;
var NUM_BOIDS = 128;
var frameTimes = [];

function setup() {
  // ===== TESTS
  testQuadTreeDelete();
  CANVAS = createCanvas(WIDTH, HEIGHT);

  for (var ii = 0; ii < NUM_BOIDS; ii++) {
    const x = random(WIDTH);
    const y = random(HEIGHT);
    const b = new Boid(ii, CANVAS);
    ITEMS.push(b);
  }

  for (const key in BUTTON_FUNCTIONS) {
    const o = BUTTON_FUNCTIONS[key];
    console.log(key, o);
    const b = createButton(o.text);
    b.mousePressed(o.action);
  }
}

function draw() {
  frameRate(60);
  background(0, 0, 0, 1);
  angleMode(RADIANS);

  TREE = new QuadTree(QUAD_TREE_DEPTH, WIDTH);

  for (const item of ITEMS) {
    TREE.insert(item, item.position.x, item.position.y);
  }

  // ====== Draw QuadTree node bounds
  let queue = [TREE.root];
  while (queue.length > 0) {
    var currentNode = queue.pop();
    if (QUAD_TREE_DRAW_GRID) {
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
      if (neighborsSameSpecies.length > 0) {
        var sumX = 0;
        var sumY = 0;
        var sumSinDirection = 0;
        var sumCosDirection = 0;
        var sumDirectionDiff = 0;
        for (const n of neighborsSameSpecies) {
          if (DRAW_LINES_TO_NEIGHBORS) {
            stroke(item.color);

            line(item.position.x, item.position.y, n.position.x, n.position.y);
          }

          sumX += n.position.x;
          sumY += n.position.y;
          sumSinDirection += sin(n.direction);
          sumCosDirection += cos(n.direction);
          const angBetween = minimumAngleBetween(item.direction, n.direction);
          sumDirectionDiff += angBetween;
        }
        // turn to get away from nearest boid

        const proximityAlarm =
          neighborClosest &&
          distNeighborClosest &&
          distNeighborClosest < BOID_SPACING_MINIMUM;
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
        const angleDiffToTarget = proximityAlarm
          ? angleEscape
          : sumDirectionDiff / neighborsSameSpecies.length;
        const myTurnRate = proximityAlarm ? BOID_TURN_RATE * 2 : BOID_TURN_RATE;

        const turnAmount = myTurnRate * random(1);
        const direction = Math.sign(angleDiffToTarget);
        item.direction +=
          Math.abs(angleDiffToTarget) < turnAmount
            ? direction * angleDiffToTarget
            : direction * turnAmount;

        const geoCenter = {
          x: sumX / neighborsSameSpecies.length,
          y: sumY / neighborsSameSpecies.length,
        };

        if (proximityAlarm && BOID_DRAW_PROXIMITY_ALARM) {
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
        if (DRAW_GEO_CENTER) {
          // draw line to the point this boid is escaping
          stroke(80, 0, 100);
          line(item.position.x, item.position.y, geoCenter.x, geoCenter.y);
          circle(geoCenter.x, geoCenter.y, 4);
        }
      }
      // random turns
      if (random() < 0.001) {
        item.direction = random() * TWO_PI;
      }

      const cosDir = cos(item.direction);
      const sinDir = sin(item.direction);
      item.position.x += BOID_SPEED * cosDir;
      item.position.y += BOID_SPEED * sinDir;
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
      if (DRAW_SENSE_RANGE) {
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
      fill(item.color);
      stroke(0, 0, 0);
      circle(item.position.x, item.position.y, 8);
      const headingArrowLength = 16;
      stroke(item.color);
      line(
        item.position.x,
        item.position.y,
        item.position.x + headingArrowLength * cosDir,
        item.position.y + headingArrowLength * sinDir
      );
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
      stroke(60, 100, 100);
      // stroke(255)
      line(pos[0], pos[1], n.position.x, n.position.y);
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
