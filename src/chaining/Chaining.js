const p5 = require("p5");

const FuncBtn = document.getElementById("chaining-btn");
const Func = document.getElementById("chaining-function");

let f;

FuncBtn.onclick = e => {
  f = eval(Func.value);
};


// Linked List's Node
class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class Chaining {
  // 해시 테이블 생성자 함수
  constructor(tableSize = 5) {
    this.tableSize = tableSize;
    this.hashTable = new Array(tableSize);
    this.searchedNode = null;

    const setting = (p) => {
      const hashtable = this;
      function clearAndRedraw() {
        p.clear();
        p.redraw();
      }

      // 해시테이블의 위치 지정 함수
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
        for (let i = 0; i < hashtable.tableSize; ++i) {
          let node = hashtable.hashTable[i];
          
          if (node !== undefined) p.stroke("orange");

          if (node === this.searchedNode && node !== null) p.stroke("#bbdeed");

          const c = getCirclePosition(i);

          // 해시테이블의 circle 크기, 색상 지정
          p.circle(c.x, c.y, 60).stroke("black");

          const lineLength = 50;
          const nodeSize = 55;
          const nodeMargin = 30;

          for (let j = 0; node !== undefined && node !== null; j++) {

            if (node !== undefined) p.stroke("orange");
            if (node === this.searchedNode && node !== null) p.stroke("#bbdeed");

            const deltaX = j * (lineLength + nodeSize + nodeMargin);
            const lineStartX = c.x + deltaX + 45;
            // 선 생성
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
              else p.fill("orange");
              p.text(node.data, nodeStartX + nodeSize / 2, c.y);
              p.fill(255);
              p.stroke("black");
            }
            node = node.next;
          }
        }
      };

      p.setup = setup;
      p.draw = draw;

      this.remove = () => p.remove();
      this.draw = clearAndRedraw;
    };

    new p5(setting, document.getElementById("container"));
  }

  // hash 함수
  hashFunction(key) {
    return f(key);
  }

  // 삽입 함수
  insert(key) {
    key = parseInt(key);

    // 잘못된 입력인 경우 입력 오류 메세지 출력
    if (isNaN(key)) throw "Invalid Key!";

    //let hashedKey = f(key);
    let hashedKey = this.hashFunction(key);

    // 중복 입력인 경우 중복 오류 메세지 출력 
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

    this.draw();
  }

  // 검색 함수
  search(key) {
    key = parseInt(key);

    if (isNaN(key)) throw "Invalid Key!";

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

  // 삭제 함수
  // 검색 함수를 이용하여 키의 위치를 찾아내어 해당 위치의 값을 null로 변경 
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
}

module.exports = Chaining;
