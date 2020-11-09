(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
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
  constructor(...args) {
    super(...args);
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
  constructor(...args) {
    super(...args);
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
  constructor(...args) {
    super(...args);
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

      console.log(`i : ${index}, value:${block.getValue()}, this.blockWidth:${this.blockWidth}, this.blockMargin :${this.blockMargin}`);
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
    sort.animationDelay,
    sort.blockWidth,
    sort.blockMargin
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XG5cbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTsgaiArPSAxKSB7ICAgICAgIFxuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yUmVkKCk7XG5cbiAgICAgICAgIC8vIOyCrOyaqeyekOqwgCDri6TsnYwg7Iqk7YWd7Jy866GcIOuEmOyWtOqwgOq4sCDsoIQg6rmM7KeAKHRoaXMuY29udGludWUoKSBvciB0aGlzLnN0ZXAoKSkg6riw64uk66a8XG4gICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcblxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcblxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgfVxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG4gICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XG5cbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xuXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xuICAgICAgICAgIGRlc3RJbmRleCA9IGo7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xuICAgICAgICAvLyBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcblxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgUXVpY2tTb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuICBhc3luYyBzb3J0KHAgPSAwLCByID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xuICAgIGlmIChwIDwgcikge1xuICAgICAgY29uc3QgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAgIGNvbnN0IHEgPSBhd2FpdCB0aGlzLnBhcnRpdGlvbihwLCByKTtcblxuICAgIC8vICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG4gICAgICAvLyAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuICAgICAgYXdhaXQgdGhpcy5zb3J0KHAsIHEgLSAxKTtcblxuICAgIC8vICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG4gICAgICAvLyAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuICAgICAgYXdhaXQgdGhpcy5zb3J0KHEgKyAxLCByKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBwYXJ0aXRpb24ocCwgcikge1xuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICBsZXQgcGl2b3QgPSBibG9ja3NbcF0uZ2V0VmFsdWUoKTtcbiAgICBsZXQgc21hbGwgPSBwO1xuICAgIGxldCBiaWcgPSByICsgMTtcblxuICAgIGJsb2Nrc1xuICAgICAgLmZpbHRlcigoXywgaSkgPT4gcCA8PSBpICYmIGkgPD0gcilcbiAgICAgIC5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XG5cbiAgICBibG9ja3NbcF0uc2V0Q29sb3JQaXZvdCgpO1xuXG4gICAgZG8ge1xuICAgICAgZG8ge1xuICAgICAgICBzbWFsbCsrO1xuICAgICAgfSB3aGlsZSAoc21hbGwgPD0gciAmJiBibG9ja3Nbc21hbGxdLmdldFZhbHVlKCkgPD0gcGl2b3QpO1xuICAgICAgZG8ge1xuICAgICAgICBiaWctLTtcbiAgICAgIH0gd2hpbGUgKGJpZyA+PSBwICYmIGJsb2Nrc1tiaWddLmdldFZhbHVlKCkgPiBwaXZvdCk7XG4gICAgICBpZiAoc21hbGwgPCBiaWcpIHtcbiAgICAgICAgYmxvY2tzW3NtYWxsXS5zZXRDb2xvclJlZCgpO1xuICAgICAgICBibG9ja3NbYmlnXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xuICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3NtYWxsXSwgYmxvY2tzW2JpZ10pO1xuICAgICAgICBibG9ja3Nbc21hbGxdLnNldENvbG9yQm91bmRhcnkoKTtcbiAgICAgICAgYmxvY2tzW2JpZ10uc2V0Q29sb3JCb3VuZGFyeSgpO1xuICAgICAgICB0aGlzLmJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoc21hbGwgPCBiaWcpO1xuXG4gICAgYmxvY2tzW2JpZ10uc2V0Q29sb3JSZWQoKTtcbiAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcbiAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcbiAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3BdLCBibG9ja3NbYmlnXSk7XG5cbiAgICB0aGlzLmJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG5cbiAgICBibG9ja3NcbiAgICAuZmlsdGVyKChfLCBpKSA9PiBwIDw9IGkgJiYgaSA8PSByKVxuICAgIC5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIHJldHVybiBiaWc7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuICAgIGxldCBtaW47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcbiAgICAgIG1pbiA9IGk7XG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7IC8vIGkrMeuyiOu2gO2EsG4tMeuyiOq5jOyngOydmCDruJTrn63snYQg7LCo66GA64yA66GcIOu5qOqwhOyDieycvOuhnFxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTsgLy/rs4DsiJgg7ISk7KCVXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQgIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcbiAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu5qOqwhOyDiSDruJTrn63snYQg64uk7IucIO2MjOuegOyDieycvOuhnFxuICAgICAgfVxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcbiAgICB9XG5cbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjbGFzcyBCbG9jayB7XG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLGJsb2NrV2lkdGg9MjgsYmxvY2tNYXJnaW49Mikge1xuICAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XG5cbiAgICAvLyDruJTroZ3snZgg7LWc64yAIOuGkuydtOuKlCDsu6jthYzsnbTrhIjsnZgg64aS7J20XG4gICAgY29uc3QgbWF4QmxvY2tIaWdodCA9IE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjb250YWluZXIpLmhlaWdodC5yZXBsYWNlKCdweCcsJycpKTtcblxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG5cbiAgICBsZXQgYmxvY2tIaWdodCA9IHZhbHVlICogMztcbiAgICBpZiAoYmxvY2tIaWdodCA+IG1heEJsb2NrSGlnaHQpXG4gICAgICBibG9ja0hpZ2h0ID0gbWF4QmxvY2tIaWdodDtcbiAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHtibG9ja0hpZ2h0fXB4YDtcbiAgICBibG9jay5zdHlsZS53aWR0aCA9IGAke2Jsb2NrV2lkdGh9cHhgO1xuICAgIFxuICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIChibG9ja1dpZHRoK2Jsb2NrTWFyZ2luKX1weClgO1xuXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XG4gICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayx2YWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihkb20sdmFsdWUpIHtcbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBzZXRDb2xvclllbGxvdygpe1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkYwMFwiO1xuICB9XG5cbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclJlZCgpIHtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjQ5NDlcIjtcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xuICB9XG5cbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JHcmVlbigpIHtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjsgXG4gIH1cblxuICAvLyBibG9ja+ydhCBQaXZvdCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JQaXZvdCgpe1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGMDA5RFwiOyAgXG4gIH1cblxuICAvLyBibG9ja+ydhCDqsr3qs4Trpbwg64KY7YOA64K064qUIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckJvdW5kYXJ5KCl7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODAwMDgwXCI7IC8vIOuztOudvFxuICB9XG5cbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiBcbiAgXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSA9IDIwMCwgYW5pbWF0aW9uRGVsYXkgPSAyNTAsYmxvY2tXaWR0aCA9IDI4LGJsb2NrTWFyZ2luID0gMikge1xuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIC8vIOygleugrCDsiqTthZ0g7IKs7J20IOuUnOugiOydtFxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgLy8g67iU66GdIOyCrOydtCDqsITqsqlcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XG5cbiAgICAvLyBTdGVw7J2EIOyDgeyEuO2eiCDrs7Tsl6zspIxcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX0RFVEFJTDtcblxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xuICB9XG5cbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICBzb3J0KCkge31cblxuICBcbiAgd2FpdERldGFpbCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfREVUQUlMKSB7XG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IHJlc29sdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB3YWl0U2ltcGxlKCl7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNTdG9wICYmIHRoaXMuc3RlcFR5cGUgPT0gU29ydC5TVEVQX1NJTVBMRSkge1xuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSByZXNvbHZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XG4gIH1cblxuICBjb250aW51ZSgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xuICAgIHRoaXMuc3RlcCgpO1xuICB9XG5cbiAgc3RlcCgpIHtcbiAgICAgIGlmICh0aGlzLnJlc29sdmVEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVEZXRhaWwgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsKCk7XG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucmVzb2x2ZVNpbXBsZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZVNpbXBsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlKCk7XG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IG51bGw7XG4gICAgICB9XG4gICAgXG4gIH1cblxuICBzZXRTdGVwVHlwZURldGFpbCgpe1xuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfREVUQUlMO1xuICB9XG4gIHNldFN0ZXBUeXBlU2ltcGxlKCl7XG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9TSU1QTEU7XG4gIH1cblxuICBzaHVmZmxlKCkge1xuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICBmb3IgKGxldCBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcbiAgICB9XG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgIC8vIOu4lOuhnSDsg4kg7LSI6riw7ZmUXG5cbiAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pXG4gICAgICAgIC50cmFuc2l0aW9uRHVyYXRpb247XG4gICAgICBibG9jay5kb20udHJhbnNpdGlvbkR1cmF0aW9uID0gMCArIFwibXNcIjtcblxuICAgICAgY29uc29sZS5sb2coYGkgOiAke2luZGV4fSwgdmFsdWU6JHtibG9jay5nZXRWYWx1ZSgpfSwgdGhpcy5ibG9ja1dpZHRoOiR7dGhpcy5ibG9ja1dpZHRofSwgdGhpcy5ibG9ja01hcmdpbiA6JHt0aGlzLmJsb2NrTWFyZ2lufWApO1xuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAodGhpcy5ibG9ja1dpZHRoK3RoaXMuYmxvY2tNYXJnaW4pO1xuXG4gICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc1h9cHgpYDsgIC8vIOu4lOuhneydmCDtmZTrqbTsg4Eg7JyE7LmYIOyhsOyglVxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXG5cbiAgICAgIGJsb2NrLmRvbS50cmFuc2l0aW9uRHVyYXRpb24gPSBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gIH1cblxuICBzZXRCbG9ja1dpZHRoKGJsb2NrV2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgdGhpcy5ibG9ja01hcmdpbiA9YmxvY2tNYXJnaW47XG4gICAgLy8gd2lkdGg6TnVtYmVyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcblxuICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XG5cbiAgICB0aGlzLmdldEJsb2NrcygpLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkb20gPSBibG9jay5kb207XG5cbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcbiAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pLnRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgXCJtc1wiO1xuXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuICAgICAgZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNYfXB4KWA7XG5cbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXG4gICAgICBkb20uc3R5bGUud2lkdGggPSBibG9ja1dpZHRoICsgXCJweFwiO1xuXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkQmxvY2soYmxvY2spIHtcbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXG4gICAgICB3aW5kb3dcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcbiAgICAgICAgLnJlcGxhY2UoXCJweFwiLCBcIlwiKVxuICAgICk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHByZXZXaWR0aCArICh0aGlzLmJsb2NrV2lkdGgrdGhpcy5ibG9ja01hcmdpbikgKyBcInB4XCI7XG4gIH1cblxuICBzZXREZWxheShtaWxsaXMpIHtcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xuICB9XG5cbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcbiAgICB0aGlzLmJsb2Nrcy5tYXAoXG4gICAgICBibG9jayA9PiAoYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkgKyBcIm1zXCIpXG4gICAgKTtcbiAgfVxuXG4gIC8vIOuqqOuToCBibG9ja+uTpOydhCDsi5zqsIHtmZTrkJjqs6DsnojripQg7Iic7ISc7JeQIOunnuqyjCDrpqzthLTtlZjripQg7ZWo7IiYXG4gIGdldEJsb2NrcygpIHtcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ja3M7XG4gIH1cblxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxuICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXG4gIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XG4gICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcblxuICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XG4gICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG5cbiAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcbiAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcblxuICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXG4gICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XG5cbiAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XG4gICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xuXG4gICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PlxuICAgICAgICBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpXG4gICAgICApO1xuXG4gICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xuICAgICAgfVxuICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5cbiAvLyDshLjrtoDsoIHsnLzroZwg66qo65OgIOuLqOqzhCDtkZzsi5xcbiBTb3J0LlNURVBfREVUQUlMID0gU3ltYm9sLmZvcignU1RFUF9ERVRBSUwnKTtcbiAvLyDruJTroZ0g7JyE7LmY6rCAIOuwlOuAjOuKlCDri6jqs4Trp4wg7ZGc7IucXG4gU29ydC5TVEVQX1NJTVBMRSA9IFN5bWJvbC5mb3IoJ1NURVBfU0lNUExFJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XG5jb25zdCBRdWlja1NvcnQgPSByZXF1aXJlKFwiLi4vcXVpY2stc29ydC9RdWlja1NvcnRcIik7XG5cbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcblxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWJibGUtc29ydC1yYWRpb1wiKTtcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xuY29uc3QgcXVpY2tTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1aWNrLXNvcnQtcmFkaW9cIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcblxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dFxuY29uc3QgZGVsYXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0XCIpO1xuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cbmNvbnN0IGRlbGF5SW5wdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dC1idG5cIik7XG5cbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XG5cbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XG5cbi8vIOygleugrCDspJHsp4AgQnV0dG9uXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcblxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XG5cbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcblxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XG5cbi8vIOyKpO2FnSDtg4DsnoUgUmFkaW9cbmNvbnN0IHN0ZXBEZXRhaWxSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1kZXRhaWwtcmFkaW9cIik7XG5jb25zdCBzdGVwU2ltcGxlUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXAtc2ltcGxlLXJhZGlvXCIpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IG51bSkge1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY1ICsgMSk7XG4gICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpKTtcbn1cblxuLy8gc29ydCB0eXBlIHJhZGlv66GcIOu2gO2EsCDqsJLsnYQg7J297Ja07IScIFNvcnQgQWxnb3JpdGht7J2EIOqysOyglVxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcbiAgbGV0IFNvcnRBbGdvcml0aG07XG4gIGlmIChidWJibGVTb3J0UmFkaW8uY2hlY2tlZCkge1xuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xuICB9IGVsc2UgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcbiAgICBTb3J0QWxnb3JpdGhtID0gU2VsZWN0aW9uU29ydDtcbiAgfSBlbHNlIGlmIChxdWlja1NvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IFF1aWNrU29ydDtcbiAgfVxuICByZXR1cm4gU29ydEFsZ29yaXRobTtcbn1cblxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVVbmlxdWVCbG9ja3MoMjAsIGNvbnRhaW5lcik7XG5cbmxldCBzb3J0ID0gbmV3IChnZXRTb3J0QWxnb3JpdGhtKCkpKGNvbnRhaW5lciwgYmxvY2tzLCAyNTAsIDI1MCk7XG5cbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcblxuICAvLyBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcbn07XG5cbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xuLy8gICBjb25zdCBkZWxheSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgLSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuLy8gICBzb3J0LnNldERlbGF5KGRlbGF5KTtcbi8vICAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcbi8vIH1cblxuZGVsYXlJbnB1dEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XG4gIH0gZWxzZSBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSkge1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcbiAgfVxuXG4gIGNvbnN0IGRlbGF5ID1cbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcbiAgY29uc29sZS5sb2coYGRlbGF5SW5wdXRCdG4gY2xpY2s7IGRlbGF5IDogJHtkZWxheX1tc2ApO1xuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbiAgc29ydC5zZXREZWxheShkZWxheSk7XG59O1xuXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgY29uc29sZS5sb2coXCJzaXplOiBcIiArIHNpemUpO1xuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XG59O1xuXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKGlzU29ydFJ1bm5pbmcpXG4gICAgLy8g7KCV66CsIOykkeydtOudvOuptCDrjbDsnbTthLAg7LaU6rCAIOu2iOqwgOuKpVxuICAgIHJldHVybjtcblxuICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcblxuICAvLyDruJTroZ3snZgg6rCc7IiY66W8IDMw6rCc66GcIOygnO2VnFxuICBpZiAoc29ydC5ibG9ja3MubGVuZ3RoID49IDMwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcblxuICBjb25zdCBuZXdCbG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKFxuICAgIHZhbHVlLFxuICAgIGNvbnRhaW5lcixcbiAgICBOdW1iZXIoc2l6ZVJhbmdlLnZhbHVlKVxuICApO1xuICBzb3J0LmFkZEJsb2NrKG5ld0Jsb2NrKTtcbn07XG5cbi8vIGlzU29ydFJ1bm5pbmfsnYAg7ZiE7J6sIOygleugrOydtCDsp4TtlonspJHsnbjsp4Ag7ZGc7Iuc7ZWY64qUIOuzgOyImC4gdHJ1ZeydtOuptCBzb3J0U3RhcnRCdG7snbQg64+Z7J6R7ZWY7KeAIOyViuuKlOuLpC5cbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XG5cbi8vIOygleugrCDrj4TspJHsl5QgSW5wdXTrk6TsnYQg67mE7Zmc7ISx7ZmUXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xufVxuLy8g7KCV66Cs7J20IOuBneuCnCDtm4QgSW5wdXTrk6TsnYQg7Zmc7ISx7ZmUXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIGlmIChpc1NvcnRSdW5uaW5nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaXNTb3J0UnVubmluZyA9IHRydWU7XG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXG5cbiAgY29uc3QgU29ydEFsZ29yaXRobSA9IGdldFNvcnRBbGdvcml0aG0oKTtcblxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXG4gICAgY29udGFpbmVyLFxuICAgIHNvcnQuZ2V0QmxvY2tzKCksXG4gICAgc29ydC5kZWxheSxcbiAgICBzb3J0LmFuaW1hdGlvbkRlbGF5LFxuICAgIHNvcnQuYmxvY2tXaWR0aCxcbiAgICBzb3J0LmJsb2NrTWFyZ2luXG4gICk7XG5cbiAgc29ydC5nZXRCbG9ja3MoKS5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcbiAgc29ydC5zb3J0KCkudGhlbihfID0+IHtcbiAgICBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gICAgZW5hYmxlSW5wdXRzKCk7IC8vIOygleugrOydtCDrgZ3rgpwg65KkIO2ZnOyEse2ZlFxuICB9KTtcbn07XG5cbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zdG9wKCk7XG59O1xuXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LmNvbnRpbnVlKCk7XG59O1xuXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIGlmIChzdGVwRGV0YWlsUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZURldGFpbCgpO1xuICBlbHNlIGlmIChzdGVwU2ltcGxlUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZVNpbXBsZSgpO1xuXG4gIHNvcnQuc3RlcCgpO1xufTtcblxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKGlzU29ydFJ1bm5pbmcpIHJldHVybjtcbiAgc29ydC5zaHVmZmxlKCk7XG59O1xuIl19
