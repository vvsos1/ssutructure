// const LinearHash = require("./LinearHash");

// const p5 = require("p5");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const DataInput = document.getElementById("new-data-input");
// 새로운 데이터를 추가하는 Button
const DataAddBtn = document.getElementById("new-data-add-btn");

// 사용자로부터 삭제할 데이터를 입력받는 Delete Text
const DataDelete = document.getElementById("data-delete");
// 데이터를 삭제하는 Button
const DataDeleteBtn = document.getElementById("data-delete-btn");

// 사용자로부터 검색할 데이터를 입력받는 Search Text
const DataSearch = document.getElementById("data-search");
// 데이터를 검색하는 Button
const DataSearchBtn = document.getElementById("data-search-btn");

let searchedIndex = null;

let linear;

function setting(p) {
  function clearAndRedraw() {
    p.clear();
    p.redraw();
  }
  function getCirclePosition(index) {
    return Object.freeze({
      x:
        DataDelete.getBoundingClientRect().left +
        30 +
        ((p.displayWidth/2) / linear.tableSize) * index,
      // y: DataDelete.y + DataDelete.height + 50
      y: p.windowHeight / 2.25,
    });
  }
  function setup() {
    p.createCanvas(p.displayWidth/2, p.windowHeight);
    linear = new LinearHash();

    DataAddBtn.onclick = function () {
      searchedIndex = null;
      const key = DataInput.value;
      if (key) {
        console.log(`DataAddBtn click; data : ${key}`);
        linear.insert(key);
        DataInput.value = "";
      }
      clearAndRedraw();
    };

    DataDeleteBtn.onclick = function () {
      searchedIndex = null;
      const key = DataDelete.value;
      if (key) {
        linear.delete(key);
        DataDelete.value = "";
      }
      clearAndRedraw();
    };

    DataSearchBtn.onclick = function () {
      searchedIndex = null;
      const key = DataSearch.value;
      if (key) {
        linear.search(key);
        DataSearch.value = "";
      }
      clearAndRedraw();
    };

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(30);
    p.ellipseMode(p.CENTER);
    p.strokeWeight(3);
    p.noLoop();
  }

  function draw() {
    for (let i = 0; i < linear.tableSize; ++i) {
      let key = linear.hashTable[i];
      if (key === null) {
        key = "DEL";
        p.fill("orange");
      }
      c = getCirclePosition(i);
      if (key !== undefined) p.stroke("orange");
      if (searchedIndex === i) p.stroke("#bbdeed");
      p.circle(c.x, c.y, 70);
      if (key !== undefined) {
        if (key == "DEL") p.fill(255);
        else if (i === searchedIndex) p.fill("#bbdeed");
        else p.fill("orange");
        p.text(key, c.x, c.y);
        p.fill(255);
        p.stroke("black");
      }
    }
  }

  p.setup = setup;
  p.draw = draw;
}

new p5(setting,document.getElementById('container'));
