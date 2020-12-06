const p5 = require("p5");
const Color = require('../hashtable/Color');

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
    this.setHashFunction(key => key % this.tableSize);
    this.drawDescription(
`
Chaining은 hash collision을 해결하기 위해 충돌이 발생하면 기존 값과 충돌 값을 연결해 저장하는 방법입니다.
한정된 저장소를 효율적으로 활용할 수 있고 hash function를 선택하는 중요성이 낮아지는 장점이 있습니다.
하지만 한 hash에 값이 계속 쏠린다면 검색 효율이 낮아질 수 있습니다.
`
    );

    const setting = (p) => {
      const hashtable = this;
      let SunFlower;
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

      function preload() {
        SunFlower = p.loadFont('font/Sunflower-Medium.ttf');
      }

      function setup() {
        const containerWidth = document.getElementById("visualize-section-wrapper").getBoundingClientRect().width*(3/4);
        p.createCanvas(containerWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(30);
        p.ellipseMode(p.CENTER);
        p.strokeWeight(3);
        p.noLoop();
      }

      const draw = () => {
        p.textFont(SunFlower);
        for (let i = 0; i < hashtable.tableSize; i++) {
          let node = hashtable.hashTable[i];

          if (node === undefined || node === null) p.stroke(Color.defaultBorder);
          else if (node === this.searchedNode && node !== null) p.stroke(Color.searchedNodeBorder);
          else if (node == this.insertedNode) p.stroke(Color.insertedNodeBorder);

          const c = getCirclePosition(i);

          p.circle(c.x, c.y, 60)
          
          p.stroke(Color.defaultBorder);

          const lineLength = 50;
          const nodeSize = 55;
          const nodeMargin = 30;

          for (let j = 0; node !== undefined && node !== null; j++) {

            if (node == this.insertedNode) p.stroke(Color.insertedNodeBorder);
            else if (node === this.searchedNode && node !== null) p.stroke(Color.searchedNodeBorder);

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
              if (node === this.searchedNode && node !== null) p.fill(Color.searchedNodeText);
              else if (node === this.insertedNode) p.fill(Color.insertedNodeText);
              else p.fill(Color.defaultText);
              p.text(node.data, nodeStartX + nodeSize / 2, c.y);
              p.fill(255);
              p.stroke(Color.defaultBorder);
            }
            node = node.next;
          }
        }
        this.searchedNode = null;
        this.insertedNode = null;
      };

      p.preload = preload;
      p.setup = setup;
      p.draw = draw;

      this.remove = () => p.remove();
      this.draw = clearAndRedraw;
    };

    new p5(setting, document.getElementById("container"));
  }

  setHashFunction(fn = i => i) {
    this.hashFunction = key =>  {
      let hashedKey = fn(key);

      let key_p;
      let key_t;
      if (key < 0) {
        key_p = key * -1;
        for (key_t = 0; key_t < this.tableSize; key_t++) {
          if ((key_p + key_t) % this.tableSize == 0) break ;
        }
        hashedKey = fn(key_t);
      }
    
      return hashedKey % this.tableSize; 
    }
  }

  insert(key) {

    key = parseInt(key);

    if (isNaN(key)) 
        throw "Invalid Key!"

    let hashedKey = this.hashFunction(key);

    let node = this.hashTable[hashedKey];
    
    for (let i = 0; node !== undefined && node !== null; i++) {

      if (node.data == key) {
        this.insertedNode = node;
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

    this.hashTable = new Array(this.tableSize);
    this.draw();
  }

  //설명 그리기
  drawDescription(description) {
    const descriptionContainer = document.querySelector(".description-container");
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach(child => child.remove());
    descriptionContainer.innerHTML = "";

    // 줄별로
    description.split('\n').map(line => {
        descriptionContainer.innerHTML += `<div>${line}</div>${'\n'}`
    })
  }
}

module.exports = Chaining;
