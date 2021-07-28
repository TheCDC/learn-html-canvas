function squareIntersectsWithCircle(squareX, squareY, squareSideLength, circleX, circleY, circleRadius) {
  circleDistance_x = Math.abs(circleX - squareX);
  circleDistance_y = Math.abs(circleY - squareY);

  if (circleDistance_x > (squareSideLength / 2 + circleRadius)) { return false; }
  if (circleDistance_y > (squareSideLength / 2 + circleRadius)) { return false; }

  if (circleDistance_x <= (squareSideLength / 2)) { return true; }
  if (circleDistance_y <= (squareSideLength / 2)) { return true; }

  cornerDistance_sq = Math.pow((circleDistance_x - squareSideLength / 2), 2) +
    Math.pow(circleDistance_y - squareSideLength / 2, 2);

  return (cornerDistance_sq <= (Math.pow(circleRadius, 2)));
}

function pointInsideCircle(x, y, cx, cy, cr) {
  return Math.pow(Math.pow(cx - x, 2) + Math.pow(cy - y, 2), 0.5) <= cr
}
class QuadTreeNode {
  constructor(sideLength, x, y, items, isLeaf, depth) {
    this.sideLength = sideLength
    this.x = x
    this.y = y
    this.items = items
    this.isLeaf = isLeaf
    this.depth = depth
    // 0,0 1,0
    // 0,1 1,1
    this.childNodes = {
      0b00: null, 0b10: null,
      0b01: null, 0b11: null
    }

  }
}

class QuadTree {
  constructor(maxDepth, sideLength) {
    if (maxDepth === undefined) {
      maxDepth = 3
    }
    this.maxDepth = maxDepth;
    this.root = new QuadTreeNode(sideLength, 0, 0, [], true, 0)
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

        if (currentNode.x <= x && x < currentNode.x + currentNode.sideLength
          && currentNode.y <= y && y < currentNode.y + currentNode.sideLength) {
          currentNode.items.push(item)
          console.log('successfully inserted', item, x, y, '@', currentNode)
          break;

        }
        else {
          // console.error('Hit depth but missed right node', x, y, currentNode)
        }
      }

      // else we need to dig deeper
      const xHalfway = currentNode.x + (currentNode.sideLength) / 2
      const yHalfway = currentNode.y + (currentNode.sideLength) / 2
      const xoff = x < xHalfway ? 0 : 1
      const yoff = y < yHalfway ? 0 : 1
      const nodeChildCoord = xoff << 1 | yoff
      const childNode = currentNode.childNodes[nodeChildCoord];
      if (childNode === null) {
        // create new child node
        const newSideLength = currentNode.sideLength / 2;
        const newX = currentNode.x + xoff * newSideLength
        const newY = currentNode.y + yoff * newSideLength
        const newNode = new QuadTreeNode(newSideLength, newX, newY, [],
          true, currentNode.depth + 1)
        currentNode.childNodes[nodeChildCoord] = newNode
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
      let currentNode = queue.pop()
      if (currentNode === null) {
        continue;
      }
      if (squareIntersectsWithCircle(currentNode.x, currentNode.y, currentNode.sideLength, x, y, r)) {
        if (currentNode.depth === this.maxDepth) {
          matchedLeaves.push(currentNode)
        }
        else {
          queue.push(currentNode.childNodes[0b00])
          queue.push(currentNode.childNodes[0b10])
          queue.push(currentNode.childNodes[0b01])
          queue.push(currentNode.childNodes[0b11])
        }
      }
    }
    let results = [];
    for (const node of matchedLeaves) {
      console.log(node)
      for (const item of node.items) {
        if (pointInsideCircle(item.position.x, item.position.y, x, y, r)) {
          results.push(item)
        }
      }
    }
    return results;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas

  }
}

class Boid {
  constructor(canvas) {
    this.canvas = canvas
    this.species = 0;
    this.position = {
      x: random(canvas.width),
      y: random(canvas.height),
    };


  }
}

const TREE = new QuadTree(3, 16)
function setup() {
  let x = 0;
  TREE.insert({ name: 'a', position: { x: 0, y: 0 } }, 0, 0)
  TREE.insert({ name: 'b', position: { x: 1, y: 1 } }, 1, 1)
  TREE.insert({ name: 'c', position: { x: 0, y: 1 } }, 0, 1)

  for (var ii = 0; ii < 128; ii++) {

    const x = random(16)
    const y = random(16)
    TREE.insert({ name: ii, position: { x: x, y: y } }, x, y)
  }

  console.log(TREE.getWithinRadius(0, 0, 1))

}


function draw() {
}
