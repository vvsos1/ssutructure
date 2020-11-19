
const LinearProbing = require("../linear-probing/LinearProbing");
const QuadraticProbing = require("../quadratic-probing/QuadraticProbing");
const Chaining = require("../chaining/Chaining");

// 해시테이블 종류 Radio
const linearProbingRadio = document.getElementById("linear-probing-radio");
const quadraticProbingRadio = document.getElementById("quadratic-probing-radio");
const chainingRadio = document.getElementById("chaining-radio");

// 함수 입력 컨테이너 
const linearContainerA = document.getElementById("linear-a-container");
const quadraticContainerA = document.getElementById("quadratic-a-container");
const quadraticContainerB = document.getElementById("quadratic-b-container");
const chainingContainer = document.getElementById("chaining-container");

// 데이터 입력 버튼
const DataAdd = document.getElementById("data-add");
const DataDelete = document.getElementById("data-delete");
const DataSearch = document.getElementById("data-search");
const DataAddBtn = document.getElementById("data-add-btn");
const DataDeleteBtn = document.getElementById("data-delete-btn");
const DataSearchBtn = document.getElementById("data-search-btn");

let hashtable = new LinearProbing();

// Linear Probing 라디오 버튼 클릭시
linearProbingRadio.onchange = (e) => {
  console.log(`linear probing checked`);
  // 기존의 시각화된 테이블 삭제
  hashtable.remove();
  hashtable = new LinearProbing();
  linearContainerA.classList.remove("d-none");
  quadraticContainerA.classList.add("d-none");
  quadraticContainerB.classList.add("d-none");
  chainingContainer.classList.add("d-none");
};

// Quadratic Probing 라디오 버튼 클릭시 
quadraticProbingRadio.onchange = (e) => {
    console.log(`quadratic probing checked`);
    // 기존의 시각화된 테이블 삭제
    hashtable.remove();
    hashtable = new QuadraticProbing();
    linearContainerA.classList.add("d-none");
    quadraticContainerA.classList.remove("d-none");
    quadraticContainerB.classList.remove("d-none");
    chainingContainer.classList.add("d-none");
};

// Chaining 라디오 버튼 클릭시
chainingRadio.onchange = (e) => {
  console.log(`chaining checked`);
  // 기존의 시각화된 테이블 삭제
  hashtable.remove();
  hashtable = new Chaining();
  linearContainerA.classList.add("d-none");
  quadraticContainerA.classList.add("d-none");
  quadraticContainerB.classList.add("d-none");
  chainingContainer.classList.remove("d-none");
};

// 에러 메세지 전달 팝업창 함수 
function modalPopUp(error) {
  const modelBody = document.querySelector('#model-body')
  modelBody.querySelector('p').innerText = error
  $('#errorModel').modal()
}


DataAddBtn.onclick = e => {
    const key = DataAdd.value;
    try {
          hashtable.insert(key);
    } catch (error) {
      modalPopUp(error);
    }
};

DataDeleteBtn.onclick = e => {
    const key = DataDelete.value;
    try {
          hashtable.delete(key);
    } catch (error) {
      modalPopUp(error);
    }
};

DataSearchBtn.onclick = e => {
    const key = DataSearch.value;
    try {
          hashtable.search(key);
    } catch (error) {
      modalPopUp(error);
    }
};
