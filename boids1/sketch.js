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
class QuadTreeNode {
  constructor(sideLength, x, y, items, isLeaf, depth) {
    this.sideLength = sideLength;
    this.x = x;
    this.y = y;
    this.items = items;
    this.isLeaf = isLeaf;
    this.depth = depth;
    // 0,0 1,0
    // 0,1 1,1
    this.childNodes = {
      0b00: null,
      0b10: null,
      0b01: null,
      0b11: null,
    };
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
  insert(item, x, y) {
    // console.log('insert', item, '@', x, y)
    let i = 0;
    let currentNode = this.root;
    while (true) {
      if (i > this.maxDepth) {
        // console.error('TOO DEEP', currentNode)
        break;
      }
      // console.log('algo reached', currentNode)

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
      const xoff = x < xHalfway ? 0 : 1;
      const yoff = y < yHalfway ? 0 : 1;
      const nodeChildCoord = (xoff << 1) | yoff;
      const childNode = currentNode.childNodes[nodeChildCoord];
      if (childNode === null) {
        // create new child node
        const newSideLength = currentNode.sideLength / 2;
        const newX = currentNode.x + xoff * newSideLength;
        const newY = currentNode.y + yoff * newSideLength;
        const newNode = new QuadTreeNode(
          newSideLength,
          newX,
          newY,
          [],
          true,
          currentNode.depth + 1
        );
        currentNode.childNodes[nodeChildCoord] = newNode;
        // curentNode is now a parent and not a leaf
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
  constructor(canvas) {
    this.canvas = canvas;
    this.species = random(16);
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };
    colorMode(HSB);

    this.color = color(this.species * 16, 100, 100, 1);
  }
}

const WIDTH = 512;
const HEIGHT = WIDTH;

var TREE;
var CANVAS;
var ITEMS = [];
function setup() {
  CANVAS = createCanvas(WIDTH, HEIGHT);

  for (var ii = 0; ii < 128*4; ii++) {
    const x = random(WIDTH);
    const y = random(HEIGHT);
    const b = new Boid(CANVAS);
    const item = { name: ii, position: { x: x, y: y } };
    ITEMS.push(b);
  }
}

function draw() {
  TREE = new QuadTree(7, WIDTH);
  for (const item of ITEMS) {
  }

  for (const item of ITEMS) {
    TREE.insert(item, item.position.x, item.position.y);
  }

  background(0);

  // ====== Draw QuadTree node bounds
  let queue = [TREE.root];
  while (queue.length > 0) {
    var currentNode = queue.pop();

    noFill();
    // color(255*currentNode.depth/TREE.maxDepth);
    stroke(120, 100, 100, 0.5);
    // rect(
    //   currentNode.x,
    //   currentNode.y,
    //   currentNode.sideLength,
    //   currentNode.sideLength
    // );
    // ====== Draw items

    for (const item of currentNode.items) {
      // get close neighbors and draw lines to them
      const neighbors = TREE.getWithinRadius(
        item.position.x,
        item.position.y,
        32
      );
      if (neighbors.length > 1) {
        var sumX = 0;
        var sumY = 0;
        for (const n of neighbors) {
          // stroke(150, 100, 100, 1);
          // line(item.position.x, item.position.y, n.position.x, n.position.y);
          sumX += n.position.x;
          sumY += n.position.y;
        }
        var geoCenter = {
          x: sumX / neighbors.length,
          y: sumY / neighbors.length,
        };
        if (item.position.x < geoCenter.x) {
          item.position.x -= 2;
        } else {
          item.position.x++;
        }
        if (item.position.y < geoCenter.y) {
          item.position.y -= 2;
        } else {
          item.position.y++;
        }
// draw line to the point this boid is escaping
        stroke(60,0,100);
        line(item.position.x, item.position.y, geoCenter.x, geoCenter.y);
        circle(geoCenter.x, geoCenter.y, 4);
      } else {
        item.position.x++;
        item.position.y++;
      }
      if (item.position.x < 0) {
        item.position.x = WIDTH + item.position.x;
      }
      if (item.position.y < 0) {
        item.position.y = HEIGHT + item.position.y;
      }

      item.position.x = item.position.x % WIDTH;
      item.position.y = item.position.y % HEIGHT;

      fill(item.color);
      noStroke();
      circle(item.position.x, item.position.y, 8);
      fill(item.color + 180);
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
    [mouseX + 128, mouseY],
    [mouseX + 128, mouseY + 128],
    [mouseX, mouseY + 128],
  ];
  for (const pos of positions) {
    var neighbors = TREE.getWithinRadius(pos[0], pos[1], 64);
    for (const n of neighbors) {
      stroke(60, 100, 100);
      // stroke(255)
      line(pos[0], pos[1], n.position.x, n.position.y);
    }
  }
}
