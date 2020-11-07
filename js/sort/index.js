(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;

    for (let i = 0; i < n - 1; i += 1) {

      await this.waitSimple();

      for (let j = 0; j < n - i - 1; j += 1) {       
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorRed();
        blocks[j + 1].setColorRed();

         // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
         await this.waitDetail();

        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();

        if (value1 > value2) {
          // swap 함수로 두 블록의 위치를 바꿈; await은 swap 이 끝날 때 까지 기다리겠다는 의미
          await this.swap(blocks[j], blocks[j + 1]);

          // 두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
          blocks = this.getBlocks();
        }

        // 선택이 끝났으므로 블록의 색을 원래 색으로 바꿈
        blocks[j].setColorDefault();
        blocks[j + 1].setColorDefault();
      }

      // 정렬이 끝난 블록의 색을 Green으로 바꿈
      blocks[n - i - 1].setColorGreen();
    }
    blocks[0].setColorGreen();
  }
}

module.exports = BubbleSort;

},{"../sort/Sort":5}],2:[function(require,module,exports){
const Sort = require("../sort/Sort");

class InsertionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;

    blocks[0].setColorGreen();

    await this.waitSimple();

    for (let i = 1; i < n; i += 1) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i; j++) {
        blocks[j].setColorRed();

        await this.waitDetail();

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorGreen();
        if (value > target) {
          destIndex = j;
          break;
        }
      }
      if (i != destIndex) {
        blocks[destIndex].setColorRed();
        // await this.waitDetail();

        await this.insertAt(blocks[i], destIndex);

        blocks[destIndex].setColorGreen();
      }
      blocks[i].setColorGreen();
      blocks = this.getBlocks();
      await this.waitSimple();
    }
  }
}

module.exports = InsertionSort;

},{"../sort/Sort":5}],3:[function(require,module,exports){
const Sort = require("../sort/Sort");

class SelectionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;
    let min;

    for (let i = 0; i < n - 1; i += 1) {
      min = i;
      await this.waitSimple();
      blocks[i].setColorRed(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n; j += 1) {
        blocks[j].setColorRed(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        // delay만큼 기다림//
        await new Promise(resolve => setTimeout(resolve, this.delay));
        let value1 = blocks[min].getValue(); //변수 설정
        let value2 = blocks[j].getValue();
        if (value1 >= value2) min = j;
        if (i != min && j == n - 1) {
          await this.waitDetail();
          await this.swap(blocks[min], blocks[i]); // 블럭 체인지
          min = i; // min값초기화
          blocks[min].setColorDefault(); // 위치가 바뀌는  대상블록색깔 파란색으로
          blocks = this.getBlocks(); //두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
        }
        await this.waitDetail();
        blocks[j].setColorDefault(); // 빨간색 블럭을 다시 파란색으로
      }
      blocks[i].setColorGreen();
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorGreen();
  }
}
module.exports = SelectionSort;

},{"../sort/Sort":5}],4:[function(require,module,exports){
class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container) {
    // value:Number, container:DOM
    const blockCount = container.childElementCount;

    const block = document.createElement("div");
    block.classList.add("block");
    block.style.height = `${value * 3}px`;
    block.style.transform = `translateX(${blockCount * 30}px)`;

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");
    blockLabel.innerHTML = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
    return new Block(block, container);
  }

  constructor(dom, container) {
    this.dom = dom;
    this.container = container;
  }

  setColorYellow(){
    this.dom.style.backgroundColor = "#FFFF00";
  }

  // block을 선택된 블록의 색으로 바꾸는 함수
  setColorRed() {
    this.dom.style.backgroundColor = "#FF4949";
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.dom.style.backgroundColor = "#58B7FF";
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorGreen() {
    this.dom.style.backgroundColor = "#13CE66";
  }
  // block의 value를 반환하는 함수
  getValue() {
    return Number(this.dom.childNodes[0].innerHTML);
  }
}

module.exports = Block;

},{}],5:[function(require,module,exports){
// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  // 세부적으로 모든 단계 표시
  static STEP_DETAIL = Symbol.for('STEP_DETAIL');
  // 블록 위치가 바뀌는 단계만 표시
  static STEP_SIMPLE = Symbol.for('STEP_SIMPLE');
  
  constructor(container, blocks, delay = 200, animationDelay = 250) {
    // 정렬할 대상인 블록들
    this.blocks = blocks;
    // 블록을 시각화 할 컨테이너 DOM
    this.container = container;
    // 정렬 스텝 사이 딜레이
    this.delay = delay;
    // 정렬이 멈춘 상태
    this.isStop = false;

    this.stepType = Sort.STEP_DETAIL;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);
  }

  // 추상 메소드
  sort() {}

  
  waitDetail() {
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_DETAIL) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveDetail = resolve;
      } else {
        resolve();
      }
    });
  }

  waitSimple(){
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_SIMPLE) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveSimple = resolve;
      } else {
        resolve();
      }
    });
  }

  stop() {
    this.isStop = true;
  }

  continue() {
    this.isStop = false;
    this.step();
  }

  step() {
      if (this.resolveDetail != null && this.resolveDetail != undefined){
        this.resolveDetail();
        this.resolveDetail = null;
      } else if (this.resolveSimple != null && this.resolveSimple != undefined) {
        this.resolveSimple();
        this.resolveSimple = null;
      }
    
  }

  setStepTypeDetail(){
    this.stepType = Sort.STEP_DETAIL;
  }
  setStepTypeSimple(){
    this.stepType = Sort.STEP_SIMPLE;
  }

  shuffle() {
    let blocks = this.blocks;
    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 미만의 무작위 인덱스
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // 셔플
    }

    blocks.map((block, index) => {
      block.setColorDefault();  // 블록 색 초기화

      const prevTransitionDuration = window.getComputedStyle(block.dom)
        .transitionDuration;
      block.dom.transitionDuration = 0 + "ms";

      block.dom.style.transform = `translateX(${index * 30}px)`;  // 블록의 화면상 위치 조정

      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.dom.transitionDuration = prevTransitionDuration;
    });

    this.blocks = blocks;
  }

  setBlockWidth(width, blockMargin = 2) {
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (width + margin) + "px";

    this.getBlocks().map((block, index) => {
      const dom = block.dom;

      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevTransitionDuration = dom.style.transitionDuration;
      dom.style.transitionDuration = 0 + "ms";

      const transX = index * (width + blockMargin);
      dom.style.transform = `translateX(${transX}px)`;

      // 블록의 너비 조정
      dom.style.width = width + "px";

      // 애니메이션 속도를 원래대로 조정
      dom.style.transitionDuration = prevTransitionDuration;
    });
  }

  addBlock(block) {
    this.blocks.push(block);
    const prevWidth = Number(
      window
        .getComputedStyle(this.container)
        .getPropertyValue("width")
        .replace("px", "")
    );

    this.container.style.width = prevWidth + 30 + "px";
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.map(
      block => (block.dom.style.transitionDuration = this.animationDelay + "ms")
    );
  }

  // 모든 block들을 시각화되고있는 순서에 맞게 리턴하는 함수
  getBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));

    return this.blocks;
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  swap(block1, block2) {
    // block1: Block, block2: Block
    return new Promise(resolve => {
      const style1 = window.getComputedStyle(block1.dom);
      const style2 = window.getComputedStyle(block2.dom);

      const transform1 = style1.getPropertyValue("transform");
      const transform2 = style2.getPropertyValue("transform");

      block1.dom.style.transform = transform2;
      block2.dom.style.transform = transform1;

      const nextOfTarget1 = block1.dom.nextSibling;
      const nextOfTarget2 = block2.dom.nextSibling;

      // 애니메이션이 끝나기를 기다림.
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(block1.dom, nextOfTarget2);
          this.container.insertBefore(block2.dom, nextOfTarget1);
          resolve();
        }, this.animationDelay);
      });
    });
  }

  // target을 destIndex 자리에 넣고 원래 destIndex의 element부터 한 칸씩 뒤로 미는 함수
  // target은 항상 destIndex보다 뒤에 있어야함
  insertAt(block, destIndex) {
    return new Promise(resolve => {
      const arr = Array.from(document.querySelectorAll(".block"));

      // target의 인덱스
      const targetIndex = arr.indexOf(block.dom);

      // destInde와 target 사이에 있는 블록들
      const betweens = arr.filter((_, i) => destIndex <= i && i < targetIndex);

      const style1 = window.getComputedStyle(block.dom);
      const styleRest = betweens.map(dom => window.getComputedStyle(dom));

      const transform1 = style1.getPropertyValue("transform");
      const transformRest = styleRest.map(style =>
        style.getPropertyValue("transform")
      );

      block.dom.style.transform = transformRest[0];
      for (let i = 0; i < betweens.length - 1; i++) {
        betweens[i].style.transform = transformRest[i + 1];
      }
      betweens[betweens.length - 1].style.transform = transform1;

      // 애니메이션이 끝나기를 기다림.
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(block.dom, betweens[0]);
          resolve();
        }, this.animationDelay);
      });
    });
  }
}

module.exports = Sort;

},{}],6:[function(require,module,exports){
const Block = require("../sort/Block");
const BubbleSort = require("../bubble-sort/BubbleSort");
const InsertionSort = require("../insertion-sort/InsertionSort");
const SelectionSort = require("../selection-sort/SelectionSort");

// 정렬이 시각화 될 container
const container = document.querySelector(".data-container");

// 정렬 종류 Radio
const bubbleSortRadio = document.getElementById("bubble-sort-radio");
const insertionSortRadio = document.getElementById("insertion-sort-radio");
const selectionSortRadio = document.getElementById("selection-sort-radio");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

// 애니메이션 딜레이 Input
const delayInput = document.getElementById("new-delay-input");
// 애니메이션 딜레이 Input Button
const delayInputBtn = document.getElementById("new-delay-input-btn");

// 시각화 블록 크기 Range
const sizeRange = document.getElementById("size-range");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById("new-data-input");
// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");

// 정렬 시작 Button
const sortBtn = document.getElementById("sort-btn");

// 정렬 중지 Button
const sortStopBtn = document.getElementById("sort-stop-btn");

// 정렬 진행 Button
const sortContinueBtn = document.getElementById("sort-continue-btn");

// 정렬 스텝 Button
const sortStepBtn = document.getElementById("sort-step-btn");

// 블록 섞기 Button
const blockShuffleBtn = document.getElementById("block-shuffle-btn");

// 스텝 타입 Radio
const stepDetailRadio = document.getElementById('step-detail-radio');
const stepSimpleRadio = document.getElementById('step-simple-radio');

function generateUniqueBlocks(num = 20, container) {
  const values = [];
  while (values.length < num) {
    const value = Math.floor(Math.random() * 100);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values.map(value => Block.createNewBlock(value, container));
}

// sort type radio로 부터 값을 읽어서 Sort Algorithm을 결정
function getSortAlgorithm() {
  let SortAlgorithm;
  if (insertionSortRadio.checked) {
    SortAlgorithm = InsertionSort;
  }else if (selectionSortRadio.checked) {
    SortAlgorithm = SelectionSort;
  }  else if (bubbleSortRadio.checked) {
    SortAlgorithm = BubbleSort;
  }
  return SortAlgorithm;
}

const blocks = generateUniqueBlocks(20, container);

let sort = new (getSortAlgorithm())(container, blocks, 250, 250);

delayRange.oninput = e => {
  const delay = Number(e.target.value);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);

 
  // delayInput.value = Number(delayRange.max) + Number(delayRange.min)- delay; // delayInput과 값 동기화
};

// delayInput.oninput = e => {
//   const delay = Number(delayRange.max) - Number(e.target.value);

//   sort.setAnimationDelay(delay);
//   sort.setDelay(delay);
//   // delayRange와 값 동기화
//   delayRange.value = delay;
// }


delayInputBtn.onclick = e => {

  // 입력값이 범위를 넘어서면 경계값으로 설정
  if (Number(delayInput.value) > Number(delayRange.max)){
    delayInput.value = delayRange.max;
  } else  if (Number(delayInput.value) < Number(delayRange.min)){
    delayInput.value = delayRange.min;
  } 

  const delay = Number(delayRange.max) + Number(delayRange.min) - Number(delayInput.value);
  console.log(`delayInputBtn click; delay : ${delay}ms`);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);

}

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
  const size = Number(e.target.value);
  console.log("size: " + size);
  sort.setBlockWidth(size);
};

newDataAddBtn.onclick = e => {
  if (isSortRunning)  // 정렬 중이라면 데이터 추가 불가능
    return;

  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  const newBlock = Block.createNewBlock(value, container);
  sort.addBlock(newBlock);
};

// isSortRunning은 현재 정렬이 진행중인지 표시하는 변수. true이면 sortStartBtn이 동작하지 않는다.
let isSortRunning = false;


// 정렬 도중엔 Input들을 비활성화
function disableInputs(){
  bubbleSortRadio.disabled = true;
  insertionSortRadio.disabled = true;
  selectionSortRadio.disabled = true;

  sortBtn.disabled = true;
  newDataAddBtn.disabled = true;
  blockShuffleBtn.disabled = true;
}
// 정렬이 끝난 후 Input들을 활성화
function enableInputs() {
  bubbleSortRadio.disabled = false;
  insertionSortRadio.disabled = false;
  selectionSortRadio.disabled = false;

  sortBtn.disabled = false;
  newDataAddBtn.disabled = false;
  blockShuffleBtn.disabled = false;
}


sortBtn.onclick = e => {
  if (isSortRunning) {
    return;
  }
  
  isSortRunning = true; 
  disableInputs();// 정렬이 시작될 때 비활성화

  const SortAlgorithm = getSortAlgorithm();

  sort = new SortAlgorithm(
    container,
    sort.getBlocks(),
    sort.delay,
    sort.animationDelay
  );

  sort.getBlocks().forEach(block => block.setColorDefault());
  sort.sort().then(_ => {
    isSortRunning = false;
    enableInputs(); // 정렬이 끝난 뒤 활성화
  });
};

sortStopBtn.onclick = e => {
  sort.stop();
};

sortContinueBtn.onclick = e => {
  sort.continue();
};

sortStepBtn.onclick = e => {
  if (stepDetailRadio.checked)
    sort.setStepTypeDetail();
  else if (stepSimpleRadio.checked)
    sort.setStepTypeSimple();

  sort.step();
};

blockShuffleBtn.onclick = e => {
  if (isSortRunning)
    return;
  sort.shuffle();
}

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../selection-sort/SelectionSort":3,"../sort/Block":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XG4gIH1cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xuXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7IGogKz0gMSkgeyAgICAgICBcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxuICAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG5cbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgIGNvbnN0IHZhbHVlMiA9IGJsb2Nrc1tqICsgMV0uZ2V0VmFsdWUoKTtcblxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1tqXSwgYmxvY2tzW2ogKyAxXSk7XG5cbiAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcbiAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxuICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xuICAgIH1cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcbiAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuXG4gICAgYmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcblxuICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpICs9IDEpIHtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICBsZXQgZGVzdEluZGV4ID0gaTtcblxuICAgICAgY29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcblxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgICBpZiAodmFsdWUgPiB0YXJnZXQpIHtcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgLy8gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XG5cbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgfVxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcbiAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG1pbjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xuICAgICAgbWluID0gaTtcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvC8vXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcbiAgICAgICAgbGV0IHZhbHVlMiA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikgbWluID0gajtcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7IC8vIOu4lOufrSDssrTsnbjsp4BcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCAg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIOq4sOyhtCBibG9ja3Prpbwg7JeF642w7J207Yq4XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67mo6rCE7IOJIOu4lOufreydhCDri6Tsi5wg7YyM656A7IOJ7Jy866GcXG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuICAgIH1cblxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvckdyZWVuKCk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcbiIsImNsYXNzIEJsb2NrIHtcbiAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcbiAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpIHtcbiAgICAvLyB2YWx1ZTpOdW1iZXIsIGNvbnRhaW5lcjpET01cbiAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xuXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbiAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xuICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIDMwfXB4KWA7XG5cbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcbiAgICBibG9ja0xhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICByZXR1cm4gbmV3IEJsb2NrKGJsb2NrLCBjb250YWluZXIpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZG9tLCBjb250YWluZXIpIHtcbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIHNldENvbG9yWWVsbG93KCl7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRjAwXCI7XG4gIH1cblxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yUmVkKCkge1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xuICB9XG5cbiAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNThCN0ZGXCI7XG4gIH1cblxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckdyZWVuKCkge1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xuICB9XG4gIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcbiIsIi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxuY2xhc3MgU29ydCB7XG4gIC8vIOyEuOu2gOyggeycvOuhnCDrqqjrk6Ag64uo6rOEIO2RnOyLnFxuICBzdGF0aWMgU1RFUF9ERVRBSUwgPSBTeW1ib2wuZm9yKCdTVEVQX0RFVEFJTCcpO1xuICAvLyDruJTroZ0g7JyE7LmY6rCAIOuwlOuAjOuKlCDri6jqs4Trp4wg7ZGc7IucXG4gIHN0YXRpYyBTVEVQX1NJTVBMRSA9IFN5bWJvbC5mb3IoJ1NURVBfU0lNUExFJyk7XG4gIFxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXkgPSAyMDAsIGFuaW1hdGlvbkRlbGF5ID0gMjUwKSB7XG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcblxuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfREVUQUlMO1xuXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXG4gICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XG4gIH1cblxuICAvLyDstpTsg4Eg66mU7IaM65OcXG4gIHNvcnQoKSB7fVxuXG4gIFxuICB3YWl0RGV0YWlsKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmICh0aGlzLmlzU3RvcCAmJiB0aGlzLnN0ZXBUeXBlID09IFNvcnQuU1RFUF9ERVRBSUwpIHtcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gcmVzb2x2ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdhaXRTaW1wbGUoKXtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfU0lNUExFKSB7XG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IHJlc29sdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnRpbnVlKCkge1xuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgdGhpcy5zdGVwKCk7XG4gIH1cblxuICBzdGVwKCkge1xuICAgICAgaWYgKHRoaXMucmVzb2x2ZURldGFpbCAhPSBudWxsICYmIHRoaXMucmVzb2x2ZURldGFpbCAhPSB1bmRlZmluZWQpe1xuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwoKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvbHZlU2ltcGxlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlU2ltcGxlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUoKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlID0gbnVsbDtcbiAgICAgIH1cbiAgICBcbiAgfVxuXG4gIHNldFN0ZXBUeXBlRGV0YWlsKCl7XG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XG4gIH1cbiAgc2V0U3RlcFR5cGVTaW1wbGUoKXtcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX1NJTVBMRTtcbiAgfVxuXG4gIHNodWZmbGUoKSB7XG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTsgLy8gMCDsnbTsg4EgaSDrr7jrp4zsnZgg66y07J6R7JyEIOyduOuNseyKpFxuICAgICAgW2Jsb2Nrc1tpXSwgYmxvY2tzW2pdXSA9IFtibG9ja3Nbal0sIGJsb2Nrc1tpXV07IC8vIOyFlO2UjFxuICAgIH1cblxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgYmxvY2suc2V0Q29sb3JEZWZhdWx0KCk7ICAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxuXG4gICAgICBjb25zdCBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKVxuICAgICAgICAudHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgYmxvY2suZG9tLnRyYW5zaXRpb25EdXJhdGlvbiA9IDAgKyBcIm1zXCI7XG5cbiAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2luZGV4ICogMzB9cHgpYDsgIC8vIOu4lOuhneydmCDtmZTrqbTsg4Eg7JyE7LmYIOyhsOyglVxuXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBudWxsKTsgLy8g67iU66Gd7J2YIERPTeydhCDsu6jthYzsnbTrhIjsnZgg66eoIOuBneycvOuhnCDsnbTrj5lcblxuICAgICAgYmxvY2suZG9tLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XG4gICAgfSk7XG5cbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgfVxuXG4gIHNldEJsb2NrV2lkdGgod2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIC8vIHdpZHRoOk51bWJlclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XG5cbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqICh3aWR0aCArIG1hcmdpbikgKyBcInB4XCI7XG5cbiAgICB0aGlzLmdldEJsb2NrcygpLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkb20gPSBibG9jay5kb207XG5cbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcbiAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDAgKyBcIm1zXCI7XG5cbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHdpZHRoICsgYmxvY2tNYXJnaW4pO1xuICAgICAgZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNYfXB4KWA7XG5cbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXG4gICAgICBkb20uc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXG4gICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gcHJldlRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEJsb2NrKGJsb2NrKSB7XG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XG4gICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKFxuICAgICAgd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcbiAgICApO1xuXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBwcmV2V2lkdGggKyAzMCArIFwicHhcIjtcbiAgfVxuXG4gIHNldERlbGF5KG1pbGxpcykge1xuICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XG4gIH1cblxuICBzZXRBbmltYXRpb25EZWxheShtaWxsaXMpIHtcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xuICAgIHRoaXMuYmxvY2tzLm1hcChcbiAgICAgIGJsb2NrID0+IChibG9jay5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5hbmltYXRpb25EZWxheSArIFwibXNcIilcbiAgICApO1xuICB9XG5cbiAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOumrO2EtO2VmOuKlCDtlajsiJhcbiAgZ2V0QmxvY2tzKCkge1xuICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xuXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcblxuICAgIHJldHVybiB0aGlzLmJsb2NrcztcbiAgfVxuXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcbiAgc3dhcChibG9jazEsIGJsb2NrMikge1xuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazEuZG9tKTtcbiAgICAgIGNvbnN0IHN0eWxlMiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMi5kb20pO1xuXG4gICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICBjb25zdCB0cmFuc2Zvcm0yID0gc3R5bGUyLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG5cbiAgICAgIGJsb2NrMS5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMjtcbiAgICAgIGJsb2NrMi5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IGJsb2NrMS5kb20ubmV4dFNpYmxpbmc7XG4gICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2syLmRvbS5uZXh0U2libGluZztcblxuICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMS5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazIuZG9tLCBuZXh0T2ZUYXJnZXQxKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcbiAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxuICBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3QgYXJyID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBhcnIuaW5kZXhPZihibG9jay5kb20pO1xuXG4gICAgICAvLyBkZXN0SW5kZeyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcbiAgICAgIGNvbnN0IGJldHdlZW5zID0gYXJyLmZpbHRlcigoXywgaSkgPT4gZGVzdEluZGV4IDw9IGkgJiYgaSA8IHRhcmdldEluZGV4KTtcblxuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKTtcbiAgICAgIGNvbnN0IHN0eWxlUmVzdCA9IGJldHdlZW5zLm1hcChkb20gPT4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tKSk7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybVJlc3QgPSBzdHlsZVJlc3QubWFwKHN0eWxlID0+XG4gICAgICAgIHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIilcbiAgICAgICk7XG5cbiAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgYmV0d2VlbnNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFtpICsgMV07XG4gICAgICB9XG4gICAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xuXG4gICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XG5cbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcblxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWJibGUtc29ydC1yYWRpb1wiKTtcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xuXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IFJhbmdlXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXRcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXQgQnV0dG9uXG5jb25zdCBkZWxheUlucHV0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXQtYnRuXCIpO1xuXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaXplLXJhbmdlXCIpO1xuXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1pbnB1dFwiKTtcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcblxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cbmNvbnN0IHNvcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtYnRuXCIpO1xuXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxuY29uc3Qgc29ydFN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RvcC1idG5cIik7XG5cbi8vIOygleugrCDsp4TtlokgQnV0dG9uXG5jb25zdCBzb3J0Q29udGludWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtY29udGludWUtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxuY29uc3Qgc29ydFN0ZXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1idG5cIik7XG5cbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXG5jb25zdCBibG9ja1NodWZmbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2NrLXNodWZmbGUtYnRuXCIpO1xuXG4vLyDsiqTthZ0g7YOA7J6FIFJhZGlvXG5jb25zdCBzdGVwRGV0YWlsUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RlcC1kZXRhaWwtcmFkaW8nKTtcbmNvbnN0IHN0ZXBTaW1wbGVSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGVwLXNpbXBsZS1yYWRpbycpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IG51bSkge1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikpO1xufVxuXG4vLyBzb3J0IHR5cGUgcmFkaW/roZwg67aA7YSwIOqwkuydhCDsnb3slrTshJwgU29ydCBBbGdvcml0aG3snYQg6rKw7KCVXG5mdW5jdGlvbiBnZXRTb3J0QWxnb3JpdGhtKCkge1xuICBsZXQgU29ydEFsZ29yaXRobTtcbiAgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XG4gIH1lbHNlIGlmIChzZWxlY3Rpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xuICB9ICBlbHNlIGlmIChidWJibGVTb3J0UmFkaW8uY2hlY2tlZCkge1xuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xuICB9XG4gIHJldHVybiBTb3J0QWxnb3JpdGhtO1xufVxuXG5jb25zdCBibG9ja3MgPSBnZW5lcmF0ZVVuaXF1ZUJsb2NrcygyMCwgY29udGFpbmVyKTtcblxubGV0IHNvcnQgPSBuZXcgKGdldFNvcnRBbGdvcml0aG0oKSkoY29udGFpbmVyLCBibG9ja3MsIDI1MCwgMjUwKTtcblxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuXG4gXG4gIC8vIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxufTtcblxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG5cbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuLy8gICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xuLy8gfVxuXG5cbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IGUgPT4ge1xuXG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpe1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcbiAgfSBlbHNlICBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSl7XG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xuICB9IFxuXG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSk7XG4gIGNvbnNvbGUubG9nKGBkZWxheUlucHV0QnRuIGNsaWNrOyBkZWxheSA6ICR7ZGVsYXl9bXNgKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuXG59XG5cbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuICBjb25zb2xlLmxvZyhcInNpemU6IFwiICsgc2l6ZSk7XG4gIHNvcnQuc2V0QmxvY2tXaWR0aChzaXplKTtcbn07XG5cbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IGUgPT4ge1xuICBpZiAoaXNTb3J0UnVubmluZykgIC8vIOygleugrCDspJHsnbTrnbzrqbQg642w7J207YSwIOy2lOqwgCDrtojqsIDriqVcbiAgICByZXR1cm47XG5cbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcbiAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSBcIlwiKSByZXR1cm47XG5cbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcblxuICBjb25zdCBuZXdCbG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpO1xuICBzb3J0LmFkZEJsb2NrKG5ld0Jsb2NrKTtcbn07XG5cbi8vIGlzU29ydFJ1bm5pbmfsnYAg7ZiE7J6sIOygleugrOydtCDsp4TtlonspJHsnbjsp4Ag7ZGc7Iuc7ZWY64qUIOuzgOyImC4gdHJ1ZeydtOuptCBzb3J0U3RhcnRCdG7snbQg64+Z7J6R7ZWY7KeAIOyViuuKlOuLpC5cbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XG5cblxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcbmZ1bmN0aW9uIGRpc2FibGVJbnB1dHMoKXtcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcblxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGJsb2NrU2h1ZmZsZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG59XG4vLyDsoJXroKzsnbQg64Gd64KcIO2bhCBJbnB1dOuTpOydhCDtmZzshLHtmZRcbmZ1bmN0aW9uIGVuYWJsZUlucHV0cygpIHtcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcblxuICBzb3J0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XG59XG5cblxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIGlmIChpc1NvcnRSdW5uaW5nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpc1NvcnRSdW5uaW5nID0gdHJ1ZTsgXG4gIGRpc2FibGVJbnB1dHMoKTsvLyDsoJXroKzsnbQg7Iuc7J6R65CgIOuVjCDruYTtmZzshLHtmZRcblxuICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xuXG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcbiAgICBjb250YWluZXIsXG4gICAgc29ydC5nZXRCbG9ja3MoKSxcbiAgICBzb3J0LmRlbGF5LFxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXlcbiAgKTtcblxuICBzb3J0LmdldEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuICBzb3J0LnNvcnQoKS50aGVuKF8gPT4ge1xuICAgIGlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcbiAgICBlbmFibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOuBneuCnCDrkqQg7Zmc7ISx7ZmUXG4gIH0pO1xufTtcblxuc29ydFN0b3BCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LnN0b3AoKTtcbn07XG5cbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuY29udGludWUoKTtcbn07XG5cbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKHN0ZXBEZXRhaWxSYWRpby5jaGVja2VkKVxuICAgIHNvcnQuc2V0U3RlcFR5cGVEZXRhaWwoKTtcbiAgZWxzZSBpZiAoc3RlcFNpbXBsZVJhZGlvLmNoZWNrZWQpXG4gICAgc29ydC5zZXRTdGVwVHlwZVNpbXBsZSgpO1xuXG4gIHNvcnQuc3RlcCgpO1xufTtcblxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKGlzU29ydFJ1bm5pbmcpXG4gICAgcmV0dXJuO1xuICBzb3J0LnNodWZmbGUoKTtcbn1cbiJdfQ==
