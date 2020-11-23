const p5 = require("p5");

class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class Chaining {

  constructor(tableSize = 5) {
    this.tableSize = tableSize;
    this.hashTable = new Array(tableSize);
    this.searchedNode = null;
    this.insertedNode = null;
    this.hashFunction = key => key % this.tableSize;

    const setting = (p) => {
      const hashtable = this;
      function clearAndRedraw() {
        p.clear();
        p.redraw();
      }

      function getCirclePosition(index) {
        return Object.freeze({
          x: 
              p.displayWidth / 10,
          y: 
              50 + (p.windowHeight / (hashtable.tableSize * 1.2)) * index,
        });
      }

      function setup() {
        p.createCanvas(p.displayWidth/1.4, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(30);
        p.ellipseMode(p.CENTER);
        p.strokeWeight(3);
        p.noLoop();
      }

      const draw = () => {
        for (let i = 0; i < hashtable.tableSize; i++) {
          let node = hashtable.hashTable[i];

          if (node === undefined || node === null) p.stroke("black");
          else if (node === this.searchedNode && node !== null) p.stroke("#bbdeed");
          else if (node == this.insertedNode) p.stroke("orange");

          const c = getCirclePosition(i);

          p.circle(c.x, c.y, 60).stroke("black");

          const lineLength = 50;
          const nodeSize = 55;
          const nodeMargin = 30;

          for (let j = 0; node !== undefined && node !== null; j++) {

            if (node == this.insertedNode) p.stroke("orange");
            else if (node === this.searchedNode && node !== null) p.stroke("#bbdeed");

            const deltaX = j * (lineLength + nodeSize + nodeMargin);
            const lineStartX = c.x + deltaX + 45;

            p.line(lineStartX, c.y, lineStartX + lineLength, c.y);

            p.triangle(
              lineStartX,
              c.y,
              lineStartX + 15,
              c.y + 10,
              lineStartX + 15,
              c.y - 10
            );

            const nodeStartX = lineStartX + lineLength + 15;

            p.rect(nodeStartX, c.y - nodeSize / 2, nodeSize, nodeSize);

            if (node !== undefined) {
              if (node === this.searchedNode && node !== null) p.fill("#bbdeed");
              else if (node === this.insertedNode) p.fill("orange");
              else p.fill("black");
              p.text(node.data, nodeStartX + nodeSize / 2, c.y);
              p.fill(255);
              p.stroke("black");
            }
            node = node.next;
          }
        }
        this.searchedNode = null;
        this.insertedNode = null;
      };

      p.setup = setup;
      p.draw = draw;

      this.remove = () => p.remove();
      this.draw = clearAndRedraw;
    };

    new p5(setting, document.getElementById("container"));
  }

  setHashFunction(fn = i => i) {
    this.hashFunction = key => fn(key) & this.tableSize; 
  }

  insert(key) {

    key = parseInt(key);

    if (isNaN(key)) 
        throw "Invalid Key!"

    let hashedKey = this.hashFunction(key);

    let node = this.hashTable[hashedKey];
    
    for (let i = 0; node !== undefined && node !== null; i++) {

      if (node.data == key) {
        this.searchedNode = node;
        throw "Duplicate Key!";
      }

      node = node.next;
    }

    const next = this.hashTable[hashedKey] ?? null;

    const newNode = new Node(key, next);

    this.hashTable[hashedKey] = newNode;
    this.insertedNode = this.hashTable[hashedKey];

    this.draw();
  }


  search(key) {

    key = parseInt(key);

    if (isNaN(key)) throw "Invalid Key!"

    let hashedKey = this.hashFunction(key); 
    let node = this.hashTable[hashedKey];
    
    for (let i = 0; node !== undefined && node !== null; i++) {

      if (node.data == key) {
        this.searchedNode = node;
        this.draw();
        return;
      }

      node = node.next;
    }
    throw "Key Not Found!";
  }

  delete(key) {
    if (isNaN(key)) throw "Invalid Key!";

    let hashedKey = this.hashFunction(key);
    let node = this.hashTable[hashedKey];
    
    // 맨 첫번째 노드에 있을 경우
    if (node.data == key) {
      this.hashTable[hashedKey] = node.next;
      this.draw();
      return;
    }

    // 두 번째 이후 노드에 있을 경우 
    for (let i = 0; node !== undefined && node !== null; i++) {
      if (node.next.data == key) {
        node.next = node.next.next;
        this.draw();
        return;
      }
      node = node.next;
    }
    throw "Key Not Found!";
  }

  clear () {

    for (let i = 0; i < this.tableSize; i++) {
      let node = this.hashTable[i];

      for (let j = 0; node !== undefined && node !== null; j++) {
        if (node.data != null) this.delete(node.data);
        node = node.next;
      }
    }
    this.draw();
  }

}

module.exports = Chaining;
