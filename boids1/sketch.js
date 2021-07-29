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
  const L = target - source;
  const a = L;
  const b = L + PI;
  const c = L - PI;
  const smallest = Math.min(Math.abs(a), Math.abs(b), Math.abs(c));
  if (Math.abs(a) === smallest) return a;
  if (Math.abs(b) === smallest) return b;
  if (Math.abs(c) === smallest) return c;

  return ((target - source + (TWO_PI * 540) / 360) % TWO_PI) - HALF_PI;
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
  const sideLength = 16

  for (var depth = 1; depth < 5; depth++) {
    var items = [];

    const t = new QuadTree(depth, 16);
    for (var offset = 0; offset < sideLength; offset++) {

      const i1 = { id: items.length, position: { x: offset, y: offset } }
      items.push(i1)
      t.insert(i1, i1.position.x, i1.position.y)
    }
    for (i of items) {
      t.deleteItem(i, i.position.x, i.position.y)
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
    this.parent = parent
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
    return (this.x <= x && this.x + this.sideLength < x && this.y <= y && this.y + this.sideLength < y)
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
      currentNode = this.root
    }
    if (currentNode.isLeaf) {
      if (currentNode.items.some(x => x.id === item.id)) {

        currentNode.items = currentNode.items.filter(i => i.id !== item.id)
      }
      else {
        // reached where the item should be but it was never inserted into the tree
        return null;

      }
    }
    else {
      for (const key in currentNode.childNodes) {
        const child = currentNode.childNodes[key]
        if (child && child.containsPoint(x, y)) {
          const deletedFrom = this.deleteItem(item, x, y, child)
          if (child.items.length === 0) {
            currentNode.childNodes[key] = null
          }
          return deletedFrom;
        }
      }
      // console.error('somehow reached a leaf node that does not contain the cords')
    }

  }
  findContainingNode(item, x, y) {

  }
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
        squareIntersectsWithCircle(
          currentNode.x,
          currentNode.y,
          currentNode.sideLength,
          x,
          y,
          r
        )
        // squareIntersectsWithSquare(
        //   x - r,
        //   y - r,
        //   r,
        //   currentNode.x,
        //   currentNode.y,
        //   currentNode.sideLength
        // )
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
    this.species = random([1, 2, 3]);
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };
    colorMode(HSB);

    this.color = color(this.species * 4 * 16, 100, 100, 1);
    this.direction = 0;
  }
}

const WIDTH = 512;
const HEIGHT = WIDTH;
var DRAW_GEO_CENTER = false;
var DRAW_SENSE_RANGE = false;
var DRAW_LINES_TO_NEIGHBORS = true;
var TREE;
var CANVAS;
var ITEMS = [];
var QUAD_TREE_DRAW_GRID = true;
const QUAD_TREE_DEPTH = 4;
const BOID_SENSE_RANGE = 32;
const BOID_TURN_RATE = 0.1;
const BOID_SPEED = 2;
const BOID_SPACING_MINIMUM = 4;
const BOID_DRAW_PROXIMITY_ALARM = true;

var NUM_BOIDS = 512;
var frameTimePrev = 0;
var frameTimeDebugDrawPrevious = 0;
function setup() {
  // ===== TESTS
  testQuadTreeDelete()
  CANVAS = createCanvas(WIDTH, HEIGHT);

  for (var ii = 0; ii < NUM_BOIDS; ii++) {
    const x = random(WIDTH);
    const y = random(HEIGHT);
    const b = new Boid(ii, CANVAS);
    const item = { name: ii, position: { x: x, y: y } };
    ITEMS.push(b);
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
          if (DRAW_SENSE_RANGE) {
            stroke(item.color);
            circle(item.position.x, item.position.y, BOID_SENSE_RANGE);
          }
          sumX += n.position.x;
          sumY += n.position.y;
          sumSinDirection += sin(n.direction);
          sumCosDirection += cos(n.direction);
          const angBetween = minimumAngleBetween(item.direction, n.direction);
          sumDirectionDiff += angBetween;
        }

        var angleToTarget = sumDirectionDiff / neighborsSameSpecies.length;
        var myTurnRate = BOID_TURN_RATE;
        // turn to get away from nearest boid
        if (
          neighborClosest &&
          distNeighborClosest &&
          distNeighborClosest < BOID_SPACING_MINIMUM
        ) {
          const angleEscape = atan2(
            neighborClosest.position.y - item.position.y,
            neighborClosest.position.x - item.position.x
          ) + PI;
          angleToTarget = angleEscape;
          myTurnRate *= 3;
          if (BOID_DRAW_PROXIMITY_ALARM) {
            fill(30, 100, 100);
            stroke(0, 100, 100);
            line(
              item.position.x,
              item.position.y,
              item.position.x + 16 * cos(angleEscape),
              item.position.y + 16 * sin(angleEscape)
            );
            circle(item.position.x - 8, item.position.y, 4);
          }
        }
        const angleDiff = angleToTarget;
        const turnAmount = myTurnRate * random(1);
        const direction = Math.sign(angleDiff);

        // not in "get away" mode
        if (Math.abs(angleDiff) < turnAmount) {
          item.direction += angleToTarget;
        } else {
          item.direction += direction * turnAmount;
        }

        const geoCenter = {
          x: sumX / neighborsSameSpecies.length,
          y: sumY / neighborsSameSpecies.length,
        };
        if (DRAW_GEO_CENTER === true) {
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
  textSize(32);
  fill(100, 0, 100);
  stroke(100, 0, 0);
  text((1 / (deltaTime / 1000)).toFixed(2), 0, 32);
}
