const LinearProbing = require("../linear-probing/LinearProbing");
const QuadraticProbing = require("../quadratic-probing/QuadraticProbing");

const p5 = require("p5");

// 해시테이블 종류 Radio
const linearProbingRadio = document.getElementById("linear-probing-radio");
const quadraticProbingRadio = document.getElementById("quadratic-probing-radio");

// 데이터 입력 
const DataAdd = document.getElementById("data-add");
const DataDelete = document.getElementById("data-delete");
const DataSearch = document.getElementById("data-search");
const DataAddBtn = document.getElementById("data-add-btn");
const DataDeleteBtn = document.getElementById("data-delete-btn");
const DataSearchBtn = document.getElementById("data-search-btn");

let hashtable = new LinearProbing();

quadraticProbingRadio.onchange = (e) => {
    console.log(`quadratic probing checked`);
    hashtable = new QuadraticProbing();
};

let searchedIndex = null;

function modalPopUp(error) {
    const modelBody = document.querySelector('#model-body')
    modelBody.querySelector('p').innerText = error
    $('#errorModel').modal()
}

function setting(p) {
  function clearAndRedraw() {
    p.clear();
    p.redraw();
  }
  function getCirclePosition(index) {
    return Object.freeze({
      x:
	p.displayWidth/4,
      y: 
	DataDelete.getBoundingClientRect().left +
        20 + (p.windowHeight / (hashtable.tableSize * 1.2)) * index,
    });
  }
  function setup() {
    p.createCanvas(p.displayWidth/2, p.windowHeight);

    DataAddBtn.onclick = function () {
      searchedIndex = null;
      const key = DataAdd.value;
      if (key) {
          try {
              console.log(`DataAddBtn click; data : ${key}`);
              hashtable.insert(key);
              DataAdd.value = "";
          } catch (error) {
	      console.error(error);
	      modalPopUp(error);
	  }
      }
      clearAndRedraw();
    };

    DataDeleteBtn.onclick = function () {
      searchedIndex = null;
      const key = DataDelete.value;
      if (key) {
	  try {
              hashtable.delete(key);
              DataDelete.value = "";
          } catch (error) {
	      console.error(error);
	      modalPopUp(error);
	  }
      }
      clearAndRedraw();
    };

    DataSearchBtn.onclick = function () {
      searchedIndex = null;
      const key = DataSearch.value;
      if (key) {
	  try {
       	      searchedIndex = hashtable.search(key);
              DataSearch.value = "";
          } catch (error) {
              console.error(error);
              modalPopUp(error);
          }
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
    for (let i = 0; i < hashtable.tableSize; ++i) {
      let key = hashtable.hashTable[i];
      if (key === null) {
        key = "DEL";
        p.fill("orange");
      }
      c = getCirclePosition(i);
      if (key !== undefined) p.stroke("orange");
      if (searchedIndex === i) p.stroke("#bbdeed");
      p.circle(c.x, c.y, 60);
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
