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
    // TODO
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
          console.log('successfully inserted', item, '@', currentNode)
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
    // TODO

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
  TREE.insert('a', 0, 0)
  for (var ii = 0; ii < 128; ii++) {

    TREE.insert(ii, random(16), random(16))
  }

}


function draw() {
}
