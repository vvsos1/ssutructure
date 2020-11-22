const LinearProbing = require("../linear-probing/LinearProbing");
const QuadraticProbing = require("../quadratic-probing/QuadraticProbing");

const p5 = require("p5");

// 해시테이블 종류 Radio
const linearProbingRadio = document.getElementById("linear-probing-radio");
const quadraticProbingRadio = document.getElementById("quadratic-probing-radio");

// 함수 입력 컨테이너 
const linearContainerA = document.getElementById("linear-a-container");
const quadraticContainerA = document.getElementById("quadratic-a-container");
const quadraticContainerB = document.getElementById("quadratic-b-container");

// 데이터 입력 버튼
const DataAdd = document.getElementById("data-add");
const DataDelete = document.getElementById("data-delete");
const DataSearch = document.getElementById("data-search");
const DataAddBtn = document.getElementById("data-add-btn");
const DataDeleteBtn = document.getElementById("data-delete-btn");
const DataSearchBtn = document.getElementById("data-search-btn");

let hashtable = new LinearProbing();

// Quadratic Probing 라디오 버튼 클릭시 
quadraticProbingRadio.onchange = (e) => {
  console.log(`quadratic probing checked`);
  hashtable = new QuadraticProbing();
  linearContainerA.classList.remove("block");
  linearContainerA.classList.add("d-none");
  quadraticContainerA.classList.remove("d-none");
  quadraticContainerA.classList.add("block");
  quadraticContainerB.classList.remove("d-none");
  quadraticContainerB.classList.add("block");
};

// Linear Probing 라디오 버튼 클릭시
linearProbingRadio.onchange = (e) => {
  console.log(`linear probing checked`);
  hashtable = new LinearProbing();
  linearContainerA.classList.remove("d-none");
  linearContainerA.classList.add("block");
  quadraticContainerA.classList.remove("block");
  quadraticContainerA.classList.add("d-none");
  quadraticContainerB.classList.remove("block");
  quadraticContainerB.classList.add("d-none");
};

let searchedIndex = null;

// 에러 메세지 전달 팝업창 함수 
function modalPopUp(error) {
  const modelBody = document.querySelector('#model-body')
  modelBody.querySelector('p').innerText = error
  $('#errorModel').modal()
}

// 시각화 함수
function setting(p) {

  function clearAndRedraw() {
    p.clear();
    p.stroke("rosybrown");
    p.redraw();
  }

  // 해시테이블의 위치 지정 함수
  function getCirclePosition(index) {
    return Object.freeze({
      x: p.displayWidth / 4,
      y: DataDelete.getBoundingClientRect().left +
        20 + (p.windowHeight / (hashtable.tableSize * 1.2)) * index,
    });
  }


  function setup() {
    p.createCanvas(p.displayWidth / 2, p.windowHeight);

    // 데이터 Add 버튼 클릭 이벤트 함수

    DataAddBtn.onclick = function() {
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

    // 데이터 Delete 버튼 클릭 이벤트 함수
    DataDeleteBtn.onclick = function() {
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

    // 데이터 Search 버튼 클릭 이벤트 함수
    // searchedIndex에 key값의 인덱스 저장
    DataSearchBtn.onclick = function() {
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

      // 삭제에 성공하였을 경우 (채우기)
      if (key === null) {
        key = "DEL";
        p.fill("#ff9fb3");
      }

      // 삽입에 성공하였을 경우(테두리)
      if (key !== undefined) p.stroke("#ff9fb3");

      // 검색에 성공하였을 경우 (테두리)
      if (searchedIndex === i) p.stroke("#9f70f1");

      c = getCirclePosition(i);

      // 해시테이블의 circle 크기 지정
      p.circle(c.x, c.y, 60);

      // 글자색 채우기
      if (key !== undefined) {
        if (key == "DEL") p.fill(255);
        else if (i === searchedIndex) p.fill("#9f70f1");
        else p.fill("#ff9fb3");
        p.text(key, c.x, c.y);
        p.fill(255);
        p.stroke("rosybrown"); //연갈색
      }
    }
  }

  p.setup = setup;
  p.draw = draw;
}

new p5(setting, document.getElementById('container'));