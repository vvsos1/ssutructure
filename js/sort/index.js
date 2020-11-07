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
  static createNewBlock(value, container,blockWidth=28,blockMargin=2) {
    // value:Number, container:DOM
    const blockCount = container.childElementCount;

    // 블록의 최대 높이는 컨테이너의 높이
    const maxBlockHight = Number(window.getComputedStyle(container).height.replace('px',''));

    const block = document.createElement("div");
    block.classList.add("block");

    let blockHight = value * 3;
    if (blockHight > maxBlockHight)
      blockHight = maxBlockHight;
    block.style.height = `${blockHight}px`;
    block.style.width = `${blockWidth}px`;
    
    block.style.transform = `translateX(${blockCount * (blockWidth+blockMargin)}px)`;

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");
    blockLabel.innerHTML = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
    return new Block(block,value);
  }

  constructor(dom,value) {
    this.dom = dom;
    this.value = value;
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
  
  constructor(container, blocks, delay = 200, animationDelay = 250,blockWidth = 28,blockMargin = 2) {
    // 정렬할 대상인 블록들
    this.blocks = blocks;
    // 블록을 시각화 할 컨테이너 DOM
    this.container = container;
    // 정렬 스텝 사이 딜레이
    this.delay = delay;
    // 정렬이 멈춘 상태
    this.isStop = false;
    // 블록의 너비
    this.blockWidth = blockWidth;
    // 블록 사이 간격
    this.blockMargin = blockMargin;

    // Step을 상세히 보여줌
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

      const transX = index * (this.blockWidth+this.blockMargin);

      block.dom.style.transform = `translateX(${transX}px)`;  // 블록의 화면상 위치 조정
      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.dom.transitionDuration = prevTransitionDuration;
    });

    this.blocks = blocks;
  }

  setBlockWidth(blockWidth, blockMargin = 2) {
    this.blockWidth = blockWidth;
    this.blockMargin =blockMargin;
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (blockWidth + blockMargin) + "px";

    this.getBlocks().map((block, index) => {
      const dom = block.dom;

      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevTransitionDuration = window.getComputedStyle(dom).transitionDuration;
      dom.style.transitionDuration = 0 + "ms";

      const transX = index * (blockWidth + blockMargin);
      dom.style.transform = `translateX(${transX}px)`;

      // 블록의 너비 조정
      dom.style.width = blockWidth + "px";

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

    this.container.style.width = prevWidth + (this.blockWidth+this.blockMargin) + "px";
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
    const value = Math.floor(Math.random() * 165 + 1);
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

  // 블록의 개수를 30개로 제한 
  if (sort.blocks.length >= 30){
    return;
  }

  const value = Number(newDataInput.value);

  const newBlock = Block.createNewBlock(value,container,Number(sizeRange.value));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuXHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7IGogKz0gMSkgeyAgICAgICBcclxuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgICAgLy8g7IKs7Jqp7J6Q6rCAIOuLpOydjCDsiqTthZ3snLzroZwg64SY7Ja06rCA6riwIOyghCDquYzsp4AodGhpcy5jb250aW51ZSgpIG9yIHRoaXMuc3RlcCgpKSDquLDri6TrprxcclxuICAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcblxyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlMSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlMiA9IGJsb2Nrc1tqICsgMV0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xyXG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuXHJcbiAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB9XHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XHJcblxyXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIC8vIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcclxuXHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuICAgIGxldCBtaW47XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XHJcbiAgICAgIG1pbiA9IGk7XHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTsgLy9p67KI7Ke467iU65+tIOu5qOqwhOyDieycvOuhnFxyXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcclxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XHJcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXHJcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcclxuICAgICAgICAgIGJsb2Nrc1ttaW5dLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsnITsuZjqsIAg67CU64CM64qUICDrjIDsg4HruJTroZ3sg4nquZQg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu5qOqwhOyDiSDruJTrn63snYQg64uk7IucIO2MjOuegOyDieycvOuhnFxyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cclxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XHJcbiIsImNsYXNzIEJsb2NrIHtcclxuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxyXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLGJsb2NrV2lkdGg9MjgsYmxvY2tNYXJnaW49Mikge1xyXG4gICAgLy8gdmFsdWU6TnVtYmVyLCBjb250YWluZXI6RE9NXHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xyXG5cclxuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbRcclxuICAgIGNvbnN0IG1heEJsb2NrSGlnaHQgPSBOdW1iZXIod2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZSgncHgnLCcnKSk7XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG5cclxuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xyXG4gICAgaWYgKGJsb2NrSGlnaHQgPiBtYXhCbG9ja0hpZ2h0KVxyXG4gICAgICBibG9ja0hpZ2h0ID0gbWF4QmxvY2tIaWdodDtcclxuICAgIGJsb2NrLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHR9cHhgO1xyXG4gICAgYmxvY2suc3R5bGUud2lkdGggPSBgJHtibG9ja1dpZHRofXB4YDtcclxuICAgIFxyXG4gICAgYmxvY2suc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtibG9ja0NvdW50ICogKGJsb2NrV2lkdGgrYmxvY2tNYXJnaW4pfXB4KWA7XHJcblxyXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuICAgIGJsb2NrTGFiZWwuaW5uZXJIVE1MID0gdmFsdWU7XHJcblxyXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayx2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihkb20sdmFsdWUpIHtcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JZZWxsb3coKXtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkYwMFwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yUmVkKCkge1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNThCN0ZGXCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yR3JlZW4oKSB7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjtcclxuICB9XHJcbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gIGdldFZhbHVlKCkge1xyXG4gICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCIvLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgLy8g7IS467aA7KCB7Jy866GcIOuqqOuToCDri6jqs4Qg7ZGc7IucXHJcbiAgc3RhdGljIFNURVBfREVUQUlMID0gU3ltYm9sLmZvcignU1RFUF9ERVRBSUwnKTtcclxuICAvLyDruJTroZ0g7JyE7LmY6rCAIOuwlOuAjOuKlCDri6jqs4Trp4wg7ZGc7IucXHJcbiAgc3RhdGljIFNURVBfU0lNUExFID0gU3ltYm9sLmZvcignU1RFUF9TSU1QTEUnKTtcclxuICBcclxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXkgPSAyMDAsIGFuaW1hdGlvbkRlbGF5ID0gMjUwLGJsb2NrV2lkdGggPSAyOCxibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgIC8vIOu4lOuhneydhCDsi5zqsIHtmZQg7ZWgIOy7qO2FjOydtOuEiCBET01cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XHJcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIC8vIOu4lOuhneydmCDrhIjruYRcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG5cclxuICAgIC8vIFN0ZXDsnYQg7IOB7IS47Z6IIOuztOyXrOykjFxyXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XHJcblxyXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcclxuICB9XHJcblxyXG4gIC8vIOy2lOyDgSDrqZTshozrk5xcclxuICBzb3J0KCkge31cclxuXHJcbiAgXHJcbiAgd2FpdERldGFpbCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTdG9wICYmIHRoaXMuc3RlcFR5cGUgPT0gU29ydC5TVEVQX0RFVEFJTCkge1xyXG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gcmVzb2x2ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgd2FpdFNpbXBsZSgpe1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfU0lNUExFKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgY29udGludWUoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zdGVwKCk7XHJcbiAgfVxyXG5cclxuICBzdGVwKCkge1xyXG4gICAgICBpZiAodGhpcy5yZXNvbHZlRGV0YWlsICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlRGV0YWlsICE9IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsKCk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gbnVsbDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc29sdmVTaW1wbGUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVTaW1wbGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlKCk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICBzZXRTdGVwVHlwZURldGFpbCgpe1xyXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XHJcbiAgfVxyXG4gIHNldFN0ZXBUeXBlU2ltcGxlKCl7XHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX1NJTVBMRTtcclxuICB9XHJcblxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICBmb3IgKGxldCBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTsgLy8gMCDsnbTsg4EgaSDrr7jrp4zsnZgg66y07J6R7JyEIOyduOuNseyKpFxyXG4gICAgICBbYmxvY2tzW2ldLCBibG9ja3Nbal1dID0gW2Jsb2Nrc1tqXSwgYmxvY2tzW2ldXTsgLy8g7IWU7ZSMXHJcbiAgICB9XHJcbiAgICBibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgYmxvY2suc2V0Q29sb3JEZWZhdWx0KCk7ICAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxyXG5cclxuICAgICAgY29uc3QgcHJldlRyYW5zaXRpb25EdXJhdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSlcclxuICAgICAgICAudHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gICAgICBibG9jay5kb20udHJhbnNpdGlvbkR1cmF0aW9uID0gMCArIFwibXNcIjtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCt0aGlzLmJsb2NrTWFyZ2luKTtcclxuXHJcbiAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zWH1weClgOyAgLy8g67iU66Gd7J2YIO2ZlOuptOyDgSDsnITsuZgg7KGw7KCVXHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG51bGwpOyAvLyDruJTroZ3snZggRE9N7J2EIOy7qO2FjOydtOuEiOydmCDrp6gg64Gd7Jy866GcIOydtOuPmVxyXG5cclxuICAgICAgYmxvY2suZG9tLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICB9XHJcblxyXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7XHJcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9YmxvY2tNYXJnaW47XHJcbiAgICAvLyB3aWR0aDpOdW1iZXJcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XHJcblxyXG4gICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG5cclxuICAgIHRoaXMuZ2V0QmxvY2tzKCkubWFwKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgZG9tID0gYmxvY2suZG9tO1xyXG5cclxuICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxyXG4gICAgICBjb25zdCBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tKS50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgXCJtc1wiO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcclxuICAgICAgZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNYfXB4KWA7XHJcblxyXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxyXG4gICAgICBkb20uc3R5bGUud2lkdGggPSBibG9ja1dpZHRoICsgXCJweFwiO1xyXG5cclxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXHJcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRCbG9jayhibG9jaykge1xyXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXHJcbiAgICAgIHdpbmRvd1xyXG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxyXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcclxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCt0aGlzLmJsb2NrTWFyZ2luKSArIFwicHhcIjtcclxuICB9XHJcblxyXG4gIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcclxuICB9XHJcblxyXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgIHRoaXMuYmxvY2tzLm1hcChcclxuICAgICAgYmxvY2sgPT4gKGJsb2NrLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0aGlzLmFuaW1hdGlvbkRlbGF5ICsgXCJtc1wiKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIOuqqOuToCBibG9ja+uTpOydhCDsi5zqsIHtmZTrkJjqs6DsnojripQg7Iic7ISc7JeQIOunnuqyjCDrpqzthLTtlZjripQg7ZWo7IiYXHJcbiAgZ2V0QmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxyXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICBzd2FwKGJsb2NrMSwgYmxvY2syKSB7XHJcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xyXG4gICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xyXG4gICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcblxyXG4gICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcclxuICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2sxLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcclxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBjb25zdCBhcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG5cclxuICAgICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxyXG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IGFyci5pbmRleE9mKGJsb2NrLmRvbSk7XHJcblxyXG4gICAgICAvLyBkZXN0SW5kZeyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcclxuICAgICAgY29uc3QgYmV0d2VlbnMgPSBhcnIuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xyXG5cclxuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKTtcclxuICAgICAgY29uc3Qgc3R5bGVSZXN0ID0gYmV0d2VlbnMubWFwKGRvbSA9PiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtUmVzdCA9IHN0eWxlUmVzdC5tYXAoc3R5bGUgPT5cclxuICAgICAgICBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBiZXR3ZWVuc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0W2kgKyAxXTtcclxuICAgICAgfVxyXG4gICAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xyXG5cclxuICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xyXG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XHJcbmNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKFwiLi4vaW5zZXJ0aW9uLXNvcnQvSW5zZXJ0aW9uU29ydFwiKTtcclxuY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IFJhbmdlXHJcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcclxuXHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXRcclxuY29uc3QgZGVsYXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0XCIpO1xyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0IEJ1dHRvblxyXG5jb25zdCBkZWxheUlucHV0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXQtYnRuXCIpO1xyXG5cclxuLy8g7Iuc6rCB7ZmUIOu4lOuhnSDtgazquLAgUmFuZ2VcclxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaXplLXJhbmdlXCIpO1xyXG5cclxuLy8g7IKs7Jqp7J6Q66Gc67aA7YSwIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7J6F66Cl67Cb64qUIElucHV0IFRleHRcclxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1pbnB1dFwiKTtcclxuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXHJcbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWFkZC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxyXG5jb25zdCBzb3J0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDspJHsp4AgQnV0dG9uXHJcbmNvbnN0IHNvcnRTdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0b3AtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cclxuY29uc3Qgc29ydENvbnRpbnVlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWNvbnRpbnVlLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXHJcbmNvbnN0IHNvcnRTdGVwQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYnRuXCIpO1xyXG5cclxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cclxuY29uc3QgYmxvY2tTaHVmZmxlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9jay1zaHVmZmxlLWJ0blwiKTtcclxuXHJcbi8vIOyKpO2FnSDtg4DsnoUgUmFkaW9cclxuY29uc3Qgc3RlcERldGFpbFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0ZXAtZGV0YWlsLXJhZGlvJyk7XHJcbmNvbnN0IHN0ZXBTaW1wbGVSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGVwLXNpbXBsZS1yYWRpbycpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVCbG9ja3MobnVtID0gMjAsIGNvbnRhaW5lcikge1xyXG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xyXG4gIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgbnVtKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2NSArIDEpO1xyXG4gICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXModmFsdWUpKSB7XHJcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikpO1xyXG59XHJcblxyXG4vLyBzb3J0IHR5cGUgcmFkaW/roZwg67aA7YSwIOqwkuydhCDsnb3slrTshJwgU29ydCBBbGdvcml0aG3snYQg6rKw7KCVXHJcbmZ1bmN0aW9uIGdldFNvcnRBbGdvcml0aG0oKSB7XHJcbiAgbGV0IFNvcnRBbGdvcml0aG07XHJcbiAgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gSW5zZXJ0aW9uU29ydDtcclxuICB9ZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xyXG4gIH0gIGVsc2UgaWYgKGJ1YmJsZVNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gQnViYmxlU29ydDtcclxuICB9XHJcbiAgcmV0dXJuIFNvcnRBbGdvcml0aG07XHJcbn1cclxuXHJcbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlVW5pcXVlQmxvY2tzKDIwLCBjb250YWluZXIpO1xyXG5cclxubGV0IHNvcnQgPSBuZXcgKGdldFNvcnRBbGdvcml0aG0oKSkoY29udGFpbmVyLCBibG9ja3MsIDI1MCwgMjUwKTtcclxuXHJcbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xyXG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuXHJcbiBcclxuICAvLyBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcclxufTtcclxuXHJcbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xyXG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcblxyXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxuLy8gfVxyXG5cclxuXHJcbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICAvLyDsnoXroKXqsJLsnbQg67KU7JyE66W8IOuEmOyWtOyEnOuptCDqsr3qs4TqsJLsnLzroZwg7ISk7KCVXHJcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpe1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWF4O1xyXG4gIH0gZWxzZSAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA8IE51bWJlcihkZWxheVJhbmdlLm1pbikpe1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xyXG4gIH0gXHJcblxyXG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSk7XHJcbiAgY29uc29sZS5sb2coYGRlbGF5SW5wdXRCdG4gY2xpY2s7IGRlbGF5IDogJHtkZWxheX1tc2ApO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG5cclxufVxyXG5cclxuLy8gVE9ETzogU29ydC5zZXRCbG9ja1dpZHRoIOyZhOyEse2VnCDrkqQgc2l6ZSByYW5nZeydmCBpbnZpc2libGUg7ZKA6riwXHJcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xyXG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIGNvbnNvbGUubG9nKFwic2l6ZTogXCIgKyBzaXplKTtcclxuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn07XHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoaXNTb3J0UnVubmluZykgIC8vIOygleugrCDspJHsnbTrnbzrqbQg642w7J207YSwIOy2lOqwgCDrtojqsIDriqVcclxuICAgIHJldHVybjtcclxuXHJcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcclxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcclxuXHJcbiAgLy8g67iU66Gd7J2YIOqwnOyImOulvCAzMOqwnOuhnCDsoJztlZwgXHJcbiAgaWYgKHNvcnQuYmxvY2tzLmxlbmd0aCA+PSAzMCl7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICBjb25zdCBuZXdCbG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLGNvbnRhaW5lcixOdW1iZXIoc2l6ZVJhbmdlLnZhbHVlKSk7XHJcbiAgc29ydC5hZGRCbG9jayhuZXdCbG9jayk7XHJcbn07XHJcblxyXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXHJcbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG5cclxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcclxuZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpe1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcblxyXG5zb3J0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoaXNTb3J0UnVubmluZykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpc1NvcnRSdW5uaW5nID0gdHJ1ZTsgXHJcbiAgZGlzYWJsZUlucHV0cygpOy8vIOygleugrOydtCDsi5zsnpHrkKAg65WMIOu5hO2ZnOyEse2ZlFxyXG5cclxuICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xyXG5cclxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXHJcbiAgICBjb250YWluZXIsXHJcbiAgICBzb3J0LmdldEJsb2NrcygpLFxyXG4gICAgc29ydC5kZWxheSxcclxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXlcclxuICApO1xyXG5cclxuICBzb3J0LmdldEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG4gIHNvcnQuc29ydCgpLnRoZW4oXyA9PiB7XHJcbiAgICBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgICBlbmFibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOuBneuCnCDrkqQg7Zmc7ISx7ZmUXHJcbiAgfSk7XHJcbn07XHJcblxyXG5zb3J0U3RvcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdG9wKCk7XHJcbn07XHJcblxyXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuY29udGludWUoKTtcclxufTtcclxuXHJcbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoc3RlcERldGFpbFJhZGlvLmNoZWNrZWQpXHJcbiAgICBzb3J0LnNldFN0ZXBUeXBlRGV0YWlsKCk7XHJcbiAgZWxzZSBpZiAoc3RlcFNpbXBsZVJhZGlvLmNoZWNrZWQpXHJcbiAgICBzb3J0LnNldFN0ZXBUeXBlU2ltcGxlKCk7XHJcblxyXG4gIHNvcnQuc3RlcCgpO1xyXG59O1xyXG5cclxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoaXNTb3J0UnVubmluZylcclxuICAgIHJldHVybjtcclxuICBzb3J0LnNodWZmbGUoKTtcclxufVxyXG4iXX0=
