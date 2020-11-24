
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
const hashSizeContainer = document.getElementById("hashsize-container");

// 버튼
const dataAdd = document.getElementById("data-add");
const dataDelete = document.getElementById("data-delete");
const dataSearch = document.getElementById("data-search");
const dataAddBtn = document.getElementById("data-add-btn");
const dataDeleteBtn = document.getElementById("data-delete-btn");
const dataSearchBtn = document.getElementById("data-search-btn");
const tableSizeBtn = document.getElementById("hashsize-btn");
const tableSize = document.getElementById("hashsize-input");
const dataClearBtn = document.getElementById("data-clear-btn");
const functionInput = document.getElementById("chaining-function");
const functionBtn = document.getElementById("chaining-btn");

let hashtable = new LinearProbing();
let check = null;

// Linear Probing 라디오 버튼 클릭시
linearProbingRadio.onchange = (e) => {
  console.log(`linear probing checked`);
  // 기존의 시각화된 테이블 삭제
  hashtable.remove();
  hashtable = new LinearProbing();
  check = null;
  linearContainerA.classList.remove("d-none");
  quadraticContainerA.classList.add("d-none");
  quadraticContainerB.classList.add("d-none");
  chainingContainer.classList.add("d-none");
  hashSizeContainer.classList.add("d-none");
};

// Quadratic Probing 라디오 버튼 클릭시 
quadraticProbingRadio.onchange = (e) => {
    console.log(`quadratic probing checked`);
    // 기존의 시각화된 테이블 삭제
    hashtable.remove();
    hashtable = new QuadraticProbing();
    check = null;
    linearContainerA.classList.add("d-none");
    quadraticContainerA.classList.remove("d-none");
    quadraticContainerB.classList.remove("d-none");
    chainingContainer.classList.add("d-none");
    hashSizeContainer.classList.add("d-none");
};

// Chaining 라디오 버튼 클릭시
chainingRadio.onchange = (e) => {
  console.log(`chaining checked`);
  // 기존의 시각화된 테이블 삭제
  hashtable.remove();
  hashtable = new Chaining();
  check = "chaining"
  linearContainerA.classList.add("d-none");
  quadraticContainerA.classList.add("d-none");
  quadraticContainerB.classList.add("d-none");
  chainingContainer.classList.remove("d-none");
  hashSizeContainer.classList.remove("d-none");
};

// 에러 메세지 전달 팝업창 함수 
function modalPopUp(error) {
  const modelBody = document.querySelector('#model-body')
  modelBody.querySelector('p').innerText = error
  $('#errorModel').modal()
}

dataAddBtn.onclick = e => {

  const key = dataAdd.value;
  
  if (check == "chaining") {
    try {
      hashtable.insert(key);
    } catch(error) {
      modalPopUp(error);
    }
  } else {
    hashtable.insert(key)
    .catch(error => modalPopUp(error));
  }
  dataAdd.value = "";
};

dataSearchBtn.onclick = e => {

  const key = dataSearch.value;
  
  if (check == "chaining") {
    try {
      hashtable.search(key);
    } catch(error) {
      modalPopUp(error);
    }
  } else {
    hashtable.search(key)
    .catch(error => modalPopUp(error));
  }
  dataSearch.value = "";
};

dataDeleteBtn.onclick = e => {

  const key = dataDelete.value;

  try {
    hashtable.delete(key);
  } catch(error) {
    modalPopUp(error);
  }
  dataDelete.value = "";
};

tableSizeBtn.onclick = e => {
  size = tableSize.value;
  hashtable.tableSize = size;
  hashtable.draw();
};

dataClearBtn.onclick = e => {
  hashtable.clear();
};

functionBtn.onclick = e => {
  const hashFunction = eval(functionInput.value);
  hashtable.setHashFunction?.(hashFunction);
};

