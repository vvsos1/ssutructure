const p5 = require("p5");

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

    const setting = (p) => {
      const hashtable = this;
      function clearAndRedraw() {
        p.clear();
        p.redraw();
      }

      // 해시테이블의 위치 지정 함수
      function getCirclePosition(index) {
        return Object.freeze({
          x: p.displayWidth / 4,
          y: 20 + (p.windowHeight / (hashtable.tableSize * 1.2)) * index,
        });
      }

      function setup() {
        p.createCanvas(p.displayWidth / 2, p.windowHeight);

        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(30);
        p.ellipseMode(p.CENTER);
        p.strokeWeight(3);
        p.noLoop();
      }

      const draw = () => {
        for (let i = 0; i < hashtable.tableSize; ++i) {
          let node = hashtable.hashTable[i];

          // 삽입에 성공하였을 경우(테두리)
          if (node !== undefined) p.stroke("orange");

          // 검색에 성공하였을 경우 (테두리)
          // if (searchedIndex === i) p.stroke("#bbdeed");

          const c = getCirclePosition(i);

          // 해시테이블의 circle 크기 지정
          p.circle(c.x, c.y, 60);

          // // 채우기
          // if (key !== undefined) {
          //   if (key == "DEL") p.fill(255);
          //   else if (i === searchedIndex) p.fill("#bbdeed");
          //   else p.fill("orange");
          //   p.text(key, c.x, c.y);
          // p.fill(255);
          //   p.stroke("black");
          // }

          const lineLength = 50;
          const nodeSize = 50;
          const nodeMargin = 30;

          for (let i = 0; node !== undefined && node !== null; i++) {
            const deltaX = i * (lineLength + nodeSize + nodeMargin);
            const lineStartX = c.x + deltaX;
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
            p.text(node.data, nodeStartX + nodeSize / 2, c.y);

            node = node.next;
          }
        }
      };

      p.setup = setup;
      p.draw = draw;

      this.draw = clearAndRedraw;
    };

    new p5(setting, document.getElementById("container"));
  }

  // quadratic probing hash 함수
  hashFunction(key) {
    return key % this.tableSize;
  }

  // 삽입 함수
  insert(key) {
    key = parseInt(key);

    // 잘못된 입력인 경우 입력 오류 메세지 출력
    if (isNaN(key)) throw "Invalid Key!";

    // 해시 함수값의 인덱스에 있는 값이 undefined나 null일 경우 해당 인덱스에 키값 삽입
    let hashedKey = this.hashFunction(key);
    const next = this.hashTable[hashedKey] ?? null;

    const newNode = new Node(key, next);

    this.hashTable[hashedKey] = newNode;
  }

  // 검색 함수
  search(key) {
    key = parseInt(key);

    // 잘못된 입력일 경우 오류 메세지 출력
    if (isNaN(key)) throw "Invalid Key!";

    // 해시함수 값과 키값이 같으면 해당 인덱스 반환
    for (let i = 0; i < this.tableSize; ++i) {
      let hashedKey = this.hashFunction(key, i);

      if (this.hashTable[hashedKey] == key) return hashedKey;
    }
    // 검색 실패시 해당 키 값이 없음으로 판단하여 검색 오류 메세지 출력
    throw "Key Not Found!";
  }

  // 삭제 함수
  // 검색 함수를 이용하여 키의 위치를 찾아내어 해당 위치의 값을 null로 변
  delete(key) {
    let hashedKey = this.search(key);

    this.hashTable[hashedKey] = null;

    return hashedKey;
  }
}

module.exports = Chaining;
