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

},{"../sort/Sort":6}],2:[function(require,module,exports){
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

},{"../sort/Sort":6}],3:[function(require,module,exports){
const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }
  async sort(p = 0, r = this.blocks.length - 1) {
    if (p < r) {
      const blocks = this.getBlocks();
      const q = await this.partition(p, r);

    //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(p, q - 1);

    //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(q + 1, r);
    }
  }

  async partition(p, r) {
    let blocks = this.blocks;
    let pivot = blocks[p].getValue();
    let small = p;
    let big = r + 1;

    blocks
      .filter((_, i) => p <= i && i <= r)
      .forEach(block => block.setColorBoundary());

    blocks[p].setColorPivot();

    do {
      do {
        small++;
      } while (small <= r && blocks[small].getValue() <= pivot);
      do {
        big--;
      } while (big >= p && blocks[big].getValue() > pivot);
      if (small < big) {
        blocks[small].setColorRed();
        blocks[big].setColorRed();

        await this.waitDetail();
        await this.swap(blocks[small], blocks[big]);
        blocks[small].setColorBoundary();
        blocks[big].setColorBoundary();
        this.blocks = this.getBlocks();
      }
    } while (small < big);

    blocks[big].setColorRed();
    await this.waitDetail();
    await this.waitSimple();
    await this.swap(blocks[p], blocks[big]);

    this.blocks = this.getBlocks();

    blocks
    .filter((_, i) => p <= i && i <= r)
    .forEach(block => block.setColorDefault());

    return big;
  }

}

module.exports = QuickSort;

},{"../sort/Sort":6}],4:[function(require,module,exports){
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

},{"../sort/Sort":6}],5:[function(require,module,exports){
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

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot(){
    this.dom.style.backgroundColor = "#FF009D";  
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary(){
    this.dom.style.backgroundColor = "#800080"; // 보라
  }

  // block의 value를 반환하는 함수
  getValue() {
    return Number(this.dom.childNodes[0].innerHTML);
  }
}

module.exports = Block;

},{}],6:[function(require,module,exports){
// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
 
  
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


 // 세부적으로 모든 단계 표시
 Sort.STEP_DETAIL = Symbol.for('STEP_DETAIL');
 // 블록 위치가 바뀌는 단계만 표시
 Sort.STEP_SIMPLE = Symbol.for('STEP_SIMPLE');

module.exports = Sort;

},{}],7:[function(require,module,exports){
const Block = require("../sort/Block");
const BubbleSort = require("../bubble-sort/BubbleSort");
const InsertionSort = require("../insertion-sort/InsertionSort");
const SelectionSort = require("../selection-sort/SelectionSort");
const QuickSort = require("../quick-sort/QuickSort");

// 정렬이 시각화 될 container
const container = document.querySelector(".data-container");

// 정렬 종류 Radio
const bubbleSortRadio = document.getElementById("bubble-sort-radio");
const insertionSortRadio = document.getElementById("insertion-sort-radio");
const selectionSortRadio = document.getElementById("selection-sort-radio");
const quickSortRadio = document.getElementById("quick-sort-radio");

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
const stepDetailRadio = document.getElementById("step-detail-radio");
const stepSimpleRadio = document.getElementById("step-simple-radio");

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
  if (bubbleSortRadio.checked) {
    SortAlgorithm = BubbleSort;
  } else if (insertionSortRadio.checked) {
    SortAlgorithm = InsertionSort;
  } else if (selectionSortRadio.checked) {
    SortAlgorithm = SelectionSort;
  } else if (quickSortRadio.checked) {
    SortAlgorithm = QuickSort;
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
  if (Number(delayInput.value) > Number(delayRange.max)) {
    delayInput.value = delayRange.max;
  } else if (Number(delayInput.value) < Number(delayRange.min)) {
    delayInput.value = delayRange.min;
  }

  const delay =
    Number(delayRange.max) + Number(delayRange.min) - Number(delayInput.value);
  console.log(`delayInputBtn click; delay : ${delay}ms`);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);
};

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
  const size = Number(e.target.value);
  console.log("size: " + size);
  sort.setBlockWidth(size);
};

newDataAddBtn.onclick = e => {
  if (isSortRunning)
    // 정렬 중이라면 데이터 추가 불가능
    return;

  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  // 블록의 개수를 30개로 제한
  if (sort.blocks.length >= 30) {
    return;
  }

  const value = Number(newDataInput.value);

  const newBlock = Block.createNewBlock(
    value,
    container,
    Number(sizeRange.value)
  );
  sort.addBlock(newBlock);
};

// isSortRunning은 현재 정렬이 진행중인지 표시하는 변수. true이면 sortStartBtn이 동작하지 않는다.
let isSortRunning = false;

// 정렬 도중엔 Input들을 비활성화
function disableInputs() {
  bubbleSortRadio.disabled = true;
  insertionSortRadio.disabled = true;
  selectionSortRadio.disabled = true;
  quickSortRadio.disabled = true;

  sizeRange.disabled = true;
  sortBtn.disabled = true;
  newDataAddBtn.disabled = true;
  blockShuffleBtn.disabled = true;
}
// 정렬이 끝난 후 Input들을 활성화
function enableInputs() {
  bubbleSortRadio.disabled = false;
  insertionSortRadio.disabled = false;
  selectionSortRadio.disabled = false;
  quickSortRadio.disabled = false;

  sizeRange.disabled = false;
  sortBtn.disabled = false;
  newDataAddBtn.disabled = false;
  blockShuffleBtn.disabled = false;
}

sortBtn.onclick = e => {
  if (isSortRunning) {
    return;
  }

  isSortRunning = true;
  disableInputs(); // 정렬이 시작될 때 비활성화

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
  if (stepDetailRadio.checked) sort.setStepTypeDetail();
  else if (stepSimpleRadio.checked) sort.setStepTypeSimple();

  sort.step();
};

blockShuffleBtn.onclick = e => {
  if (isSortRunning) return;
  sort.shuffle();
};

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../quick-sort/QuickSort":3,"../selection-sort/SelectionSort":4,"../sort/Block":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xyXG5cclxuICAgICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTsgaiArPSAxKSB7ICAgICAgIFxyXG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XHJcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG5cclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgSW5zZXJ0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpICs9IDEpIHtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICBsZXQgZGVzdEluZGV4ID0gaTtcclxuXHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgLy8gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xyXG5cclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgUXVpY2tTb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XHJcbiAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcclxuICB9XHJcbiAgYXN5bmMgc29ydChwID0gMCwgciA9IHRoaXMuYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgIGlmIChwIDwgcikge1xyXG4gICAgICBjb25zdCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICBjb25zdCBxID0gYXdhaXQgdGhpcy5wYXJ0aXRpb24ocCwgcik7XHJcblxyXG4gICAgLy8gICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgICAgLy8gICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuICAgICAgYXdhaXQgdGhpcy5zb3J0KHAsIHEgLSAxKTtcclxuXHJcbiAgICAvLyAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAvLyAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgICBhd2FpdCB0aGlzLnNvcnQocSArIDEsIHIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgcGFydGl0aW9uKHAsIHIpIHtcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGxldCBwaXZvdCA9IGJsb2Nrc1twXS5nZXRWYWx1ZSgpO1xyXG4gICAgbGV0IHNtYWxsID0gcDtcclxuICAgIGxldCBiaWcgPSByICsgMTtcclxuXHJcbiAgICBibG9ja3NcclxuICAgICAgLmZpbHRlcigoXywgaSkgPT4gcCA8PSBpICYmIGkgPD0gcilcclxuICAgICAgLmZvckVhY2goYmxvY2sgPT4gYmxvY2suc2V0Q29sb3JCb3VuZGFyeSgpKTtcclxuXHJcbiAgICBibG9ja3NbcF0uc2V0Q29sb3JQaXZvdCgpO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHNtYWxsKys7XHJcbiAgICAgIH0gd2hpbGUgKHNtYWxsIDw9IHIgJiYgYmxvY2tzW3NtYWxsXS5nZXRWYWx1ZSgpIDw9IHBpdm90KTtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIGJpZy0tO1xyXG4gICAgICB9IHdoaWxlIChiaWcgPj0gcCAmJiBibG9ja3NbYmlnXS5nZXRWYWx1ZSgpID4gcGl2b3QpO1xyXG4gICAgICBpZiAoc21hbGwgPCBiaWcpIHtcclxuICAgICAgICBibG9ja3Nbc21hbGxdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2JpZ10uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1tzbWFsbF0sIGJsb2Nrc1tiaWddKTtcclxuICAgICAgICBibG9ja3Nbc21hbGxdLnNldENvbG9yQm91bmRhcnkoKTtcclxuICAgICAgICBibG9ja3NbYmlnXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChzbWFsbCA8IGJpZyk7XHJcblxyXG4gICAgYmxvY2tzW2JpZ10uc2V0Q29sb3JSZWQoKTtcclxuICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3BdLCBibG9ja3NbYmlnXSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG5cclxuICAgIGJsb2Nrc1xyXG4gICAgLmZpbHRlcigoXywgaSkgPT4gcCA8PSBpICYmIGkgPD0gcilcclxuICAgIC5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICByZXR1cm4gYmlnO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuICAgIGxldCBtaW47XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XHJcbiAgICAgIG1pbiA9IGk7XHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTsgLy9p67KI7Ke467iU65+tIOu5qOqwhOyDieycvOuhnFxyXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcclxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XHJcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXHJcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcclxuICAgICAgICAgIGJsb2Nrc1ttaW5dLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsnITsuZjqsIAg67CU64CM64qUICDrjIDsg4HruJTroZ3sg4nquZQg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu5qOqwhOyDiSDruJTrn63snYQg64uk7IucIO2MjOuegOyDieycvOuhnFxyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cclxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XHJcbiIsImNsYXNzIEJsb2NrIHtcclxuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxyXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLGJsb2NrV2lkdGg9MjgsYmxvY2tNYXJnaW49Mikge1xyXG4gICAgLy8gdmFsdWU6TnVtYmVyLCBjb250YWluZXI6RE9NXHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xyXG5cclxuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbRcclxuICAgIGNvbnN0IG1heEJsb2NrSGlnaHQgPSBOdW1iZXIod2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZSgncHgnLCcnKSk7XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG5cclxuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xyXG4gICAgaWYgKGJsb2NrSGlnaHQgPiBtYXhCbG9ja0hpZ2h0KVxyXG4gICAgICBibG9ja0hpZ2h0ID0gbWF4QmxvY2tIaWdodDtcclxuICAgIGJsb2NrLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHR9cHhgO1xyXG4gICAgYmxvY2suc3R5bGUud2lkdGggPSBgJHtibG9ja1dpZHRofXB4YDtcclxuICAgIFxyXG4gICAgYmxvY2suc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtibG9ja0NvdW50ICogKGJsb2NrV2lkdGgrYmxvY2tNYXJnaW4pfXB4KWA7XHJcblxyXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuICAgIGJsb2NrTGFiZWwuaW5uZXJIVE1MID0gdmFsdWU7XHJcblxyXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayx2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihkb20sdmFsdWUpIHtcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JZZWxsb3coKXtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkYwMFwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yUmVkKCkge1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNThCN0ZGXCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yR3JlZW4oKSB7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjsgXHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCBQaXZvdCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclBpdm90KCl7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjAwOURcIjsgIFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6rK96rOE66W8IOuCmO2DgOuCtOuKlCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckJvdW5kYXJ5KCl7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4MDAwODBcIjsgLy8g67O06528XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXHJcbiAgZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsIi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxyXG5jbGFzcyBTb3J0IHtcclxuIFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSA9IDIwMCwgYW5pbWF0aW9uRGVsYXkgPSAyNTAsYmxvY2tXaWR0aCA9IDI4LGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAvLyDsoJXroKwg7Iqk7YWdIOyCrOydtCDrlJzroIjsnbRcclxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcclxuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIC8vIOu4lOuhnSDsgqzsnbQg6rCE6rKpXHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XHJcblxyXG4gICAgLy8gU3RlcOydhCDsg4HshLjtnogg67O07Jes7KSMXHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX0RFVEFJTDtcclxuXHJcbiAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcclxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxyXG4gIHNvcnQoKSB7fVxyXG5cclxuICBcclxuICB3YWl0RGV0YWlsKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfREVUQUlMKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB3YWl0U2ltcGxlKCl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU3RvcCAmJiB0aGlzLnN0ZXBUeXBlID09IFNvcnQuU1RFUF9TSU1QTEUpIHtcclxuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxyXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IHJlc29sdmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0b3AoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBjb250aW51ZSgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICB0aGlzLnN0ZXAoKTtcclxuICB9XHJcblxyXG4gIHN0ZXAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc29sdmVEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVEZXRhaWwgIT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwoKTtcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSBudWxsO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb2x2ZVNpbXBsZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZVNpbXBsZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUoKTtcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHNldFN0ZXBUeXBlRGV0YWlsKCl7XHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX0RFVEFJTDtcclxuICB9XHJcbiAgc2V0U3RlcFR5cGVTaW1wbGUoKXtcclxuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfU0lNUExFO1xyXG4gIH1cclxuXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXHJcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcclxuICAgIH1cclxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgIC8vIOu4lOuhnSDsg4kg7LSI6riw7ZmUXHJcblxyXG4gICAgICBjb25zdCBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKVxyXG4gICAgICAgIC50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgIGJsb2NrLmRvbS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgXCJtc1wiO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAodGhpcy5ibG9ja1dpZHRoK3RoaXMuYmxvY2tNYXJnaW4pO1xyXG5cclxuICAgICAgYmxvY2suZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNYfXB4KWA7ICAvLyDruJTroZ3snZgg7ZmU66m07IOBIOychOy5mCDsobDsoJVcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXHJcblxyXG4gICAgICBibG9jay5kb20udHJhbnNpdGlvbkR1cmF0aW9uID0gcHJldlRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gIH1cclxuXHJcbiAgc2V0QmxvY2tXaWR0aChibG9ja1dpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID1ibG9ja01hcmdpbjtcclxuICAgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XHJcblxyXG4gICAgdGhpcy5nZXRCbG9ja3MoKS5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBkb20gPSBibG9jay5kb207XHJcblxyXG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XHJcbiAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDAgKyBcIm1zXCI7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG4gICAgICBkb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc1h9cHgpYDtcclxuXHJcbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXHJcbiAgICAgIGRvbS5zdHlsZS53aWR0aCA9IGJsb2NrV2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEJsb2NrKGJsb2NrKSB7XHJcbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcclxuICAgICAgd2luZG93XHJcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXHJcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBwcmV2V2lkdGggKyAodGhpcy5ibG9ja1dpZHRoK3RoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xyXG4gICAgdGhpcy5ibG9ja3MubWFwKFxyXG4gICAgICBibG9jayA9PiAoYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkgKyBcIm1zXCIpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOumrO2EtO2VmOuKlCDtlajsiJhcclxuICBnZXRCbG9ja3MoKSB7XHJcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSwgYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmJsb2NrcztcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcclxuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XHJcbiAgICAgIGNvbnN0IHN0eWxlMiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMi5kb20pO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICBjb25zdCB0cmFuc2Zvcm0yID0gc3R5bGUyLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XHJcblxyXG4gICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XHJcbiAgICAgIGJsb2NrMi5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcclxuXHJcbiAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xyXG4gICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2syLmRvbS5uZXh0U2libGluZztcclxuXHJcbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazIuZG9tLCBuZXh0T2ZUYXJnZXQxKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxyXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcclxuICBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXHJcbiAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcclxuXHJcbiAgICAgIC8vIGRlc3RJbmRl7JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XHJcblxyXG4gICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pO1xyXG4gICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PlxyXG4gICAgICAgIHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIilcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xyXG4gICAgICB9XHJcbiAgICAgIGJldHdlZW5zW2JldHdlZW5zLmxlbmd0aCAtIDFdLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIC8vIOyEuOu2gOyggeycvOuhnCDrqqjrk6Ag64uo6rOEIO2RnOyLnFxyXG4gU29ydC5TVEVQX0RFVEFJTCA9IFN5bWJvbC5mb3IoJ1NURVBfREVUQUlMJyk7XHJcbiAvLyDruJTroZ0g7JyE7LmY6rCAIOuwlOuAjOuKlCDri6jqs4Trp4wg7ZGc7IucXHJcbiBTb3J0LlNURVBfU0lNUExFID0gU3ltYm9sLmZvcignU1RFUF9TSU1QTEUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcclxuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XHJcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cclxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XHJcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxyXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsp4TtlokgQnV0dG9uXHJcbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcclxuXHJcbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXHJcbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XHJcblxyXG4vLyDsiqTthZ0g7YOA7J6FIFJhZGlvXHJcbmNvbnN0IHN0ZXBEZXRhaWxSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1kZXRhaWwtcmFkaW9cIik7XHJcbmNvbnN0IHN0ZXBTaW1wbGVSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1zaW1wbGUtcmFkaW9cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBudW0pIHtcclxuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY1ICsgMSk7XHJcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdmFsdWVzLm1hcCh2YWx1ZSA9PiBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyKSk7XHJcbn1cclxuXHJcbi8vIHNvcnQgdHlwZSByYWRpb+uhnCDrtoDthLAg6rCS7J2EIOydveyWtOyEnCBTb3J0IEFsZ29yaXRobeydhCDqsrDsoJVcclxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcclxuICBsZXQgU29ydEFsZ29yaXRobTtcclxuICBpZiAoYnViYmxlU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xyXG4gIH0gZWxzZSBpZiAoaW5zZXJ0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBJbnNlcnRpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAocXVpY2tTb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IFF1aWNrU29ydDtcclxuICB9XHJcbiAgcmV0dXJuIFNvcnRBbGdvcml0aG07XHJcbn1cclxuXHJcbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlVW5pcXVlQmxvY2tzKDIwLCBjb250YWluZXIpO1xyXG5cclxubGV0IHNvcnQgPSBuZXcgKGdldFNvcnRBbGdvcml0aG0oKSkoY29udGFpbmVyLCBibG9ja3MsIDI1MCwgMjUwKTtcclxuXHJcbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xyXG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuXHJcbiAgLy8gZGVsYXlJbnB1dC52YWx1ZSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pLSBkZWxheTsgLy8gZGVsYXlJbnB1dOqzvCDqsJIg64+Z6riw7ZmUXHJcbn07XHJcblxyXG4vLyBkZWxheUlucHV0Lm9uaW5wdXQgPSBlID0+IHtcclxuLy8gICBjb25zdCBkZWxheSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgLSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG5cclxuLy8gICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuLy8gICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuLy8gICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcclxuLy8gICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XHJcbi8vIH1cclxuXHJcbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcclxuICBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpID4gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSkge1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWF4O1xyXG4gIH0gZWxzZSBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSkge1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGVsYXkgPVxyXG4gICAgTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSk7XHJcbiAgY29uc29sZS5sb2coYGRlbGF5SW5wdXRCdG4gY2xpY2s7IGRlbGF5IDogJHtkZWxheX1tc2ApO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG59O1xyXG5cclxuLy8gVE9ETzogU29ydC5zZXRCbG9ja1dpZHRoIOyZhOyEse2VnCDrkqQgc2l6ZSByYW5nZeydmCBpbnZpc2libGUg7ZKA6riwXHJcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xyXG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIGNvbnNvbGUubG9nKFwic2l6ZTogXCIgKyBzaXplKTtcclxuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn07XHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoaXNTb3J0UnVubmluZylcclxuICAgIC8vIOygleugrCDspJHsnbTrnbzrqbQg642w7J207YSwIOy2lOqwgCDrtojqsIDriqVcclxuICAgIHJldHVybjtcclxuXHJcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcclxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcclxuXHJcbiAgLy8g67iU66Gd7J2YIOqwnOyImOulvCAzMOqwnOuhnCDsoJztlZxcclxuICBpZiAoc29ydC5ibG9ja3MubGVuZ3RoID49IDMwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICBjb25zdCBuZXdCbG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKFxyXG4gICAgdmFsdWUsXHJcbiAgICBjb250YWluZXIsXHJcbiAgICBOdW1iZXIoc2l6ZVJhbmdlLnZhbHVlKVxyXG4gICk7XHJcbiAgc29ydC5hZGRCbG9jayhuZXdCbG9jayk7XHJcbn07XHJcblxyXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXHJcbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4vLyDsoJXroKwg64+E7KSR7JeUIElucHV065Ok7J2EIOu5hO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgaWYgKGlzU29ydFJ1bm5pbmcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXHJcblxyXG4gIGNvbnN0IFNvcnRBbGdvcml0aG0gPSBnZXRTb3J0QWxnb3JpdGhtKCk7XHJcblxyXG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcclxuICAgIGNvbnRhaW5lcixcclxuICAgIHNvcnQuZ2V0QmxvY2tzKCksXHJcbiAgICBzb3J0LmRlbGF5LFxyXG4gICAgc29ydC5hbmltYXRpb25EZWxheVxyXG4gICk7XHJcblxyXG4gIHNvcnQuZ2V0QmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgc29ydC5zb3J0KCkudGhlbihfID0+IHtcclxuICAgIGlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICAgIGVuYWJsZUlucHV0cygpOyAvLyDsoJXroKzsnbQg64Gd64KcIOuSpCDtmZzshLHtmZRcclxuICB9KTtcclxufTtcclxuXHJcbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0b3AoKTtcclxufTtcclxuXHJcbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5jb250aW51ZSgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIGlmIChzdGVwRGV0YWlsUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZURldGFpbCgpO1xyXG4gIGVsc2UgaWYgKHN0ZXBTaW1wbGVSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlU2ltcGxlKCk7XHJcblxyXG4gIHNvcnQuc3RlcCgpO1xyXG59O1xyXG5cclxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoaXNTb3J0UnVubmluZykgcmV0dXJuO1xyXG4gIHNvcnQuc2h1ZmZsZSgpO1xyXG59O1xyXG4iXX0=
