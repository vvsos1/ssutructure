(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
  }

  async sort() {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    this.isSortRunning = true;

    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());
    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;
    for (let i = 0; i < n - 1;) {
      await this.waitSimple();

    
      for (let j = 0; j < n - i - 1;) {
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorRed();
        blocks[j + 1].setColorRed();

       
        // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
        const {type,memento} = await this.waitDetail();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          console.log(`type : back, i : ${i}, j : ${j}}`);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setColor(color);
            block.setXPosition(xPosition);
          });

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});

        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();
        if (value1 > value2) {
          // swap 함수로 두 블록의 위치를 바꿈; await은 swap 이 끝날 때 까지 기다리겠다는 의미
          await this.swap(blocks[j], blocks[j + 1]);
          // 두 블록의 위치가 바뀌었으므로 blocks을 업데이트
          this.refreshBlocks();
        }
        // 선택이 끝났으므로 블록의 색을 원래 색으로 바꿈
        blocks[j].setColorDefault();
        blocks[j + 1].setColorDefault();
        j+= 1;
      }
      // 정렬이 끝난 블록의 색을 Green으로 바꿈
      blocks[n - i - 1].setColorGreen();
      i += 1
    }
    blocks[0].setColorGreen();
    this.isSortRunning = false;
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
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    this.isSortRunning = true;

    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
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
      this.refreshBlocks();
      await this.waitSimple();
    }

    this.isSortRunning = false;
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
    // 초기 호출이고 이미 정렬 중인 경우 바로 리턴
    if (p === 0 && r === this.blocks.length - 1 && this.isSortRunning) return;
    // 초기 호출일 경우
    if (p === 0 && r === this.blocks.length - 1) {
      this.isSortRunning = true;
      // 블록 색상을 기본으로 변경
      this.blocks.forEach(block => block.setColorDefault());
    }

    if (p < r) {
      const q = await this.partition(p, r);

      //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(p, q - 1);

      //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(q + 1, r);
    }

    // 초기 호출일 경우
    if (p === 0 && r === this.blocks.length - 1) this.isSortRunning = false;
  }

  async partition(p, r) {
    let pivot = this.blocks[p].getValue();
    let small = p;
    let big = r + 1;

    this.blocks
      .filter((_, i) => p <= i && i <= r)
      .forEach(block => block.setColorBoundary());

      this.blocks[p].setColorPivot();

    do {
      do {
        small++;
      } while (small <= r && this.blocks[small].getValue() <= pivot);
      do {
        big--;
      } while (big >= p && this.blocks[big].getValue() > pivot);
      if (small < big) {
        this.blocks[small].setColorRed();
        this.blocks[big].setColorRed();

        await this.waitDetail();
        await this.swap(this.blocks[small], this.blocks[big]);
        this.blocks[small].setColorBoundary();
        this.blocks[big].setColorBoundary();
        this.refreshBlocks();
      }
    } while (small < big);

    this.blocks[big].setColorRed();
    await this.waitDetail();
    await this.waitSimple();
    await this.swap(this.blocks[p], this.blocks[big]);

    this.refreshBlocks();

    this.blocks
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
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    
    this.isSortRunning = true;

    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
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
          this.refreshBlocks(); //두 블록의 위치가 바뀌었으므로 blocks를 업데이트
        }
        await this.waitDetail();
        blocks[j].setColorDefault(); // 빨간색 블럭을 다시 파란색으로
      }
      blocks[i].setColorGreen();
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorGreen();

    this.isSortRunning = false;
  }
}
module.exports = SelectionSort;

},{"../sort/Sort":6}],5:[function(require,module,exports){
class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container, blockWidth = 28, blockMargin = 2) {
    const blockCount = container.childElementCount;
    const xPosition = blockCount * (blockWidth + blockMargin);

    return new Block(value, container, xPosition, blockWidth);
  }

  constructor(value, container, xPosition,  width,transitionDuration=200) {
    this.value = value;
    this.container = container;

    const block = document.createElement("div");
    block.classList.add("block");

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");

    block.appendChild(blockLabel);
  
    this.dom = block;

    this.setValue(value);
    this.setColorDefault();
    this.setTransitionDuration(transitionDuration);
    this.setWidth(width);
    this.setXPosition(xPosition);

    // 화면에 블록 표시
    container.appendChild(block);
  }
  swapBlock(block) {
    const animationDelay = this.getTransitionDuration();
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          const nextOfTarget1 = this.dom.nextSibling;
          const nextOfTarget2 = block.dom.nextSibling;

          this.container.insertBefore(this.dom, nextOfTarget2);
          this.container.insertBefore(block.dom, nextOfTarget1);
          resolve();
        }, animationDelay);
      });
    });
  }

  insertBefore(block) {
    const animationDelay = this.getTransitionDuration();
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(this.dom, block.dom);
          resolve();
        }, animationDelay);
      });
    });
  }

  setTransitionDuration(millis) {
    this.transitionDuration = millis;
    this.dom.style.transitionDuration = `${this.transitionDuration}ms`;
  }

  getTransitionDuration() {
    // return Number(
    //   window.getComputedStyle(this.dom).transitionDuration.replace("s", 0)
    // );
    return this.transitionDuration;
  }

  setXPosition(x) {
    this.xPosition = x;
    this.dom.style.transform = `translateX(${this.xPosition}px)`;
  }

  getXPosition() {
    return this.xPosition;
    // const regExpTransX = /[\w]+\([ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?([\d]+)[ ]?,[ ]?[\d]+[ ]?\)/;
    // const transform = window.getComputedStyle(this.dom).transform;
    // return regExpTransX.exec(transform)[1];
  }

  setWidth(px) {
    this.width = px;
    this.dom.style.width = `${this.width}px`;
  }
  getWidth() {
    return this.width;
  }

  setColor(color) {
    this.color = color;
    this.dom.style.backgroundColor = color;
  }

  getColor() {
    return this.color;
  }

  setColorYellow() {
    this.color = "#FFFF00";
    this.dom.style.backgroundColor = "#FFFF00";
  }

  // block을 선택된 블록의 색으로 바꾸는 함수
  setColorRed() {
    this.color = "#FF4949";
    this.dom.style.backgroundColor = "#FF4949";
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.color = "#58B7FF";
    this.dom.style.backgroundColor = "#58B7FF";
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorGreen() {
    this.color = "#13CE66";
    this.dom.style.backgroundColor = "#13CE66";
  }

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot() {
    this.color = "#FF009D";
    this.dom.style.backgroundColor = "#FF009D";
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary() {
    this.color = "#800080";
    this.dom.style.backgroundColor = "#800080"; // 보라
  }

  setValue(value){
    this.value = value;
    // 블록의 최대 높이는 컨테이너의 높이 - 24px
    const maxHight =
      Number(window.getComputedStyle(this.container).height.replace("px", "")) - 24;
    let blockHight = value * 3;
    this.dom.style.height = `${blockHight < maxHight ? blockHight : maxHight}px`;

    this.dom.firstChild.innerHTML = value;
  }

  // block의 value를 반환하는 함수
  getValue() {
    return this.value;
  }
}

module.exports = Block;

},{}],6:[function(require,module,exports){
const Block = require("./Block");

// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(
    container,
    blocks = [],
    delay = 200,
    animationDelay = 250,
    blockWidth = 28,
    blockMargin = 2
  ) {
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

    // 정렬이 현재 실행중인 상태
    this.isSortRunning = false;

    // Step을 상세히 보여줌
    this.stepType = Sort.STEP_DETAIL;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);

    this.memetoStack = [];
  }

  // 추상 메소드
  sort() {}

  waitDetail() {
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_DETAIL) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveDetail = resolve;
      } else {
        resolve({ type: "continue" });
      }
    });
  }

  waitSimple() {
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_SIMPLE) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveSimple = resolve;
      } else {
        resolve({ type: "continue" });
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
    if (this.resolveDetail != null && this.resolveDetail != undefined) {
      this.resolveDetail({ type: "step" });
      this.resolveDetail = null;
    } else if (this.resolveSimple != null && this.resolveSimple != undefined) {
      this.resolveSimple({ type: "step" });
      this.resolveSimple = null;
    }
  }

  stepBack() {
    if (this.resolveDetail != null && this.resolveDetail != undefined) {
      if (this.memetoStack.length != 0) {
        this.resolveDetail({
          type: "back",
          memento: this.memetoStack.pop()
        });
        this.resolveDetail = null;
      }
    } else if (this.resolveSimple != null && this.resolveSimple != undefined) {
      // TODO : detail 방식의 sort rollback 구현
      // let memento;
      // do {
      //   memento = this.memetoStack.pop();
      // } while (this.memetoStack.length != 0 && memento.type != "simple");

      if (this.memetoStack.length != 0) {
        this.resolveSimple({ type: "back", memento: memento });
        this.resolveSimple = null;
      }
    }
  }

  pushMemento( memento) {
    this.memetoStack.push(memento);
  }

  setStepTypeDetail() {
    this.stepType = Sort.STEP_DETAIL;
  }
  setStepTypeSimple() {
    this.stepType = Sort.STEP_SIMPLE;
  }

  shuffle() {
    let blocks = this.blocks;
    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 미만의 무작위 인덱스
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // 셔플
    }
    blocks.map((block, index) => {
      block.setColorDefault(); // 블록 색 초기화

      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const transX = index * (this.blockWidth + this.blockMargin);
      block.setXPosition(transX);
      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.setTransitionDuration(prevDuration);
    });

    this.blocks = blocks;
  }

  setBlockWidth(blockWidth, blockMargin = 2) {
    this.blockWidth = blockWidth;
    this.blockMargin = blockMargin;
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (blockWidth + blockMargin) + "px";

    // 블록 크기 바꾸기
    this.blocks.map((block, index) => {
      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const newX = index * (blockWidth + blockMargin);
      block.setXPosition(newX);

      // 블록의 너비 조정
      block.setWidth(blockWidth);

      // 애니메이션 속도를 원래대로 조정
      block.setTransitionDuration(prevDuration);
    });
  }

  addBlock(blockValue) {
    // 블록 개수 제한
    if (this.blocks.length > 30) return;

    const block = Block.createNewBlock(
      blockValue,
      this.container,
      this.blockWidth,
      this.blockMargin
    );

    this.blocks.push(block);
    const prevWidth = Number(
      window
        .getComputedStyle(this.container)
        .getPropertyValue("width")
        .replace("px", "")
    );

    this.container.style.width =
      prevWidth + (this.blockWidth + this.blockMargin) + "px";
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.forEach(block =>
      block.setTransitionDuration(this.animationDelay)
    );
  }

  // this.blocks를 시각화되고있는 순서에 맞게 정렬하는 함수
  refreshBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  async swap(block1, block2) {
    // block1: Block, block2: Block

    const x1 = block1.getXPosition();
    const x2 = block2.getXPosition();

    block1.setXPosition(x2);
    block2.setXPosition(x1);

    // 애니메이션이 끝나기를 기다림.
    await block1.swapBlock(block2);
  }

  // target을 destIndex 자리에 넣고 원래 destIndex의 element부터 한 칸씩 뒤로 미는 함수
  // target은 항상 destIndex보다 뒤에 있어야함
  async insertAt(block, destIndex) {
    const blocks = this.blocks;

    // target의 인덱스
    const targetIndex = blocks.indexOf(block);

    // destIndex와 target 사이에 있는 블록들
    const betweens = blocks.filter((_, i) => destIndex <= i && i < targetIndex);

    // x 좌표
    const x1 = block.getXPosition();
    const xRest = betweens.map(b => b.getXPosition());

    block.setXPosition(xRest[0]);
    for (let i = 0; i < betweens.length - 1; i++) {
      betweens[i].setXPosition(xRest[i + 1]);
    }
    betweens[betweens.length - 1].setXPosition(x1);

    // 애니메이션이 끝나기를 기다림.
    await block.insertBefore(betweens[0]);
  }
}

// 세부적으로 모든 단계 표시
Sort.STEP_DETAIL = Symbol.for("STEP_DETAIL");
// 블록 위치가 바뀌는 단계만 표시
Sort.STEP_SIMPLE = Symbol.for("STEP_SIMPLE");

module.exports = Sort;

},{"./Block":5}],7:[function(require,module,exports){
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

// 정렬 뒤로 스텝 Button
const sortStepBackBtn = document.getElementById("sort-step-back-btn");

// 블록 섞기 Button
const blockShuffleBtn = document.getElementById("block-shuffle-btn");

// 스텝 타입 Radio
const stepDetailRadio = document.getElementById("step-detail-radio");
const stepSimpleRadio = document.getElementById("step-simple-radio");

function generateUniqueValues(count = 20) {
  const values = [];
  while (values.length < count) {
    const value = Math.floor(Math.random() * 165 + 1);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values;
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


let sort = new (getSortAlgorithm())(container);
generateUniqueValues().forEach(value => sort.addBlock(value));

delayRange.oninput = e => {
  const delay = Number(e.target.value);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);

  delayInput.value = Number(delayRange.max) + Number(delayRange.min)- delay; // delayInput과 값 동기화
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
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);
  // delayRange와 값 동기화
  delayRange.value = delay;
};

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
  const size = Number(e.target.value);
  console.log("size: " + size);
  sort.setBlockWidth(size);
};

newDataAddBtn.onclick = e => {
  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  sort.addBlock(value);
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

  disableInputs(); // 정렬이 시작될 때 비활성화

  const SortAlgorithm = getSortAlgorithm();

  sort = new SortAlgorithm(
    sort.container,
    sort.blocks,
    sort.delay,
    sort.animationDelay,
    sort.blockWidth,
    sort.blockMargin
  );

  sort.sort().then(enableInputs)
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

sortStepBackBtn.onclick = e => {
  if (stepDetailRadio.checked) sort.setStepTypeDetail();
  else if (stepSimpleRadio.checked) sort.setStepTypeSimple();
  sort.stepBack();
}

blockShuffleBtn.onclick = e => {
  sort.shuffle();
};

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../quick-sort/QuickSort":3,"../selection-sort/SelectionSort":4,"../sort/Block":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuXHJcbiAgICBcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICBcclxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGB0eXBlIDogYmFjaywgaSA6ICR7aX0sIGogOiAke2p9fWApO1xyXG4gICAgICAgICAgLy8gVE9ETzogXHJcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWV9ID0gcHJldkJsb2NrO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xyXG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgais9IDE7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIGkgKz0gMVxyXG4gICAgfVxyXG4gICAgYmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XHJcblxyXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIC8vIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcclxuXHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBRdWlja1NvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuICBhc3luYyBzb3J0KHAgPSAwLCByID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgLy8g7LSI6riwIO2YuOy2nOydtOqzoCDsnbTrr7gg7KCV66CsIOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHAgPT09IDAgJiYgciA9PT0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSAmJiB0aGlzLmlzU29ydFJ1bm5pbmcpIHJldHVybjtcclxuICAgIC8vIOy0iOq4sCDtmLjstpzsnbwg6rK97JqwXHJcbiAgICBpZiAocCA9PT0gMCAmJiByID09PSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcbiAgICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocCA8IHIpIHtcclxuICAgICAgY29uc3QgcSA9IGF3YWl0IHRoaXMucGFydGl0aW9uKHAsIHIpO1xyXG5cclxuICAgICAgLy8gICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgICAgLy8gICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuICAgICAgYXdhaXQgdGhpcy5zb3J0KHAsIHEgLSAxKTtcclxuXHJcbiAgICAgIC8vICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgIC8vICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMuc29ydChxICsgMSwgcik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g7LSI6riwIO2YuOy2nOydvCDqsr3smrBcclxuICAgIGlmIChwID09PSAwICYmIHIgPT09IHRoaXMuYmxvY2tzLmxlbmd0aCAtIDEpIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcGFydGl0aW9uKHAsIHIpIHtcclxuICAgIGxldCBwaXZvdCA9IHRoaXMuYmxvY2tzW3BdLmdldFZhbHVlKCk7XHJcbiAgICBsZXQgc21hbGwgPSBwO1xyXG4gICAgbGV0IGJpZyA9IHIgKyAxO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzXHJcbiAgICAgIC5maWx0ZXIoKF8sIGkpID0+IHAgPD0gaSAmJiBpIDw9IHIpXHJcbiAgICAgIC5mb3JFYWNoKGJsb2NrID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XHJcblxyXG4gICAgICB0aGlzLmJsb2Nrc1twXS5zZXRDb2xvclBpdm90KCk7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgc21hbGwrKztcclxuICAgICAgfSB3aGlsZSAoc21hbGwgPD0gciAmJiB0aGlzLmJsb2Nrc1tzbWFsbF0uZ2V0VmFsdWUoKSA8PSBwaXZvdCk7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICBiaWctLTtcclxuICAgICAgfSB3aGlsZSAoYmlnID49IHAgJiYgdGhpcy5ibG9ja3NbYmlnXS5nZXRWYWx1ZSgpID4gcGl2b3QpO1xyXG4gICAgICBpZiAoc21hbGwgPCBiaWcpIHtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tzbWFsbF0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tiaWddLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc3dhcCh0aGlzLmJsb2Nrc1tzbWFsbF0sIHRoaXMuYmxvY2tzW2JpZ10pO1xyXG4gICAgICAgIHRoaXMuYmxvY2tzW3NtYWxsXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5ibG9ja3NbYmlnXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgIH1cclxuICAgIH0gd2hpbGUgKHNtYWxsIDwgYmlnKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrc1tiaWddLnNldENvbG9yUmVkKCk7XHJcbiAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgYXdhaXQgdGhpcy5zd2FwKHRoaXMuYmxvY2tzW3BdLCB0aGlzLmJsb2Nrc1tiaWddKTtcclxuXHJcbiAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrc1xyXG4gICAgICAuZmlsdGVyKChfLCBpKSA9PiBwIDw9IGkgJiYgaSA8PSByKVxyXG4gICAgICAuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgcmV0dXJuIGJpZztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIFxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgbGV0IG1pbjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuICAgICAgbWluID0gaTtcclxuICAgICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxyXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikgbWluID0gajtcclxuICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7IC8vIOu4lOufrSDssrTsnbjsp4BcclxuICAgICAgICAgIG1pbiA9IGk7IC8vIG1pbuqwkuy0iOq4sO2ZlFxyXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQgIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3Prpbwg7JeF642w7J207Yq4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67mo6rCE7IOJIOu4lOufreydhCDri6Tsi5wg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxyXG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcblxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcclxuIiwiY2xhc3MgQmxvY2sge1xyXG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXHJcbiAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIsIGJsb2NrV2lkdGggPSAyOCwgYmxvY2tNYXJnaW4gPSAyKSB7XHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xyXG4gICAgY29uc3QgeFBvc2l0aW9uID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG5cclxuICAgIHJldHVybiBuZXcgQmxvY2sodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCBibG9ja1dpZHRoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgIHdpZHRoLHRyYW5zaXRpb25EdXJhdGlvbj0yMDApIHtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuXHJcbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xyXG5cclxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xyXG4gIFxyXG4gICAgdGhpcy5kb20gPSBibG9jaztcclxuXHJcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcclxuICAgIHRoaXMuc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICB0aGlzLnNldFRyYW5zaXRpb25EdXJhdGlvbih0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgdGhpcy5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICB0aGlzLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG5cclxuICAgIC8vIO2ZlOuptOyXkCDruJTroZ0g7ZGc7IucXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gIH1cclxuICBzd2FwQmxvY2soYmxvY2spIHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gdGhpcy5kb20ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2suZG9tLm5leHRTaWJsaW5nO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBuZXh0T2ZUYXJnZXQxKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbnNlcnRCZWZvcmUoYmxvY2spIHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIGJsb2NrLmRvbSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0VHJhbnNpdGlvbkR1cmF0aW9uKG1pbGxpcykge1xyXG4gICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPSBtaWxsaXM7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHt0aGlzLnRyYW5zaXRpb25EdXJhdGlvbn1tc2A7XHJcbiAgfVxyXG5cclxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb24oKSB7XHJcbiAgICAvLyByZXR1cm4gTnVtYmVyKFxyXG4gICAgLy8gICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIDApXHJcbiAgICAvLyApO1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gIH1cclxuXHJcbiAgc2V0WFBvc2l0aW9uKHgpIHtcclxuICAgIHRoaXMueFBvc2l0aW9uID0geDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dGhpcy54UG9zaXRpb259cHgpYDtcclxuICB9XHJcblxyXG4gIGdldFhQb3NpdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3NpdGlvbjtcclxuICAgIC8vIGNvbnN0IHJlZ0V4cFRyYW5zWCA9IC9bXFx3XStcXChbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/KFtcXGRdKylbIF0/LFsgXT9bXFxkXStbIF0/XFwpLztcclxuICAgIC8vIGNvbnN0IHRyYW5zZm9ybSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS50cmFuc2Zvcm07XHJcbiAgICAvLyByZXR1cm4gcmVnRXhwVHJhbnNYLmV4ZWModHJhbnNmb3JtKVsxXTtcclxuICB9XHJcblxyXG4gIHNldFdpZHRoKHB4KSB7XHJcbiAgICB0aGlzLndpZHRoID0gcHg7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IGAke3RoaXMud2lkdGh9cHhgO1xyXG4gIH1cclxuICBnZXRXaWR0aCgpIHtcclxuICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3IoY29sb3IpIHtcclxuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sb3IoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2xvcjtcclxuICB9XHJcblxyXG4gIHNldENvbG9yWWVsbG93KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGRkYwMFwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRjAwXCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JSZWQoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkY0OTQ5XCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjQ5NDlcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckRlZmF1bHQoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjNThCN0ZGXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JHcmVlbigpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiMxM0NFNjZcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQgUGl2b3Qg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JQaXZvdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNGRjAwOURcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGMDA5RFwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6rK96rOE66W8IOuCmO2DgOuCtOuKlCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckJvdW5kYXJ5KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiIzgwMDA4MFwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODAwMDgwXCI7IC8vIOuztOudvFxyXG4gIH1cclxuXHJcbiAgc2V0VmFsdWUodmFsdWUpe1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgLy8g67iU66Gd7J2YIOy1nOuMgCDrhpLsnbTripQg7Luo7YWM7J2064SI7J2YIOuGkuydtCAtIDI0cHhcclxuICAgIGNvbnN0IG1heEhpZ2h0ID1cclxuICAgICAgTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpKSAtIDI0O1xyXG4gICAgbGV0IGJsb2NrSGlnaHQgPSB2YWx1ZSAqIDM7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBgJHtibG9ja0hpZ2h0IDwgbWF4SGlnaHQgPyBibG9ja0hpZ2h0IDogbWF4SGlnaHR9cHhgO1xyXG5cclxuICAgIHRoaXMuZG9tLmZpcnN0Q2hpbGQuaW5uZXJIVE1MID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXHJcbiAgZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XHJcblxyXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBjb250YWluZXIsXHJcbiAgICBibG9ja3MgPSBbXSxcclxuICAgIGRlbGF5ID0gMjAwLFxyXG4gICAgYW5pbWF0aW9uRGVsYXkgPSAyNTAsXHJcbiAgICBibG9ja1dpZHRoID0gMjgsXHJcbiAgICBibG9ja01hcmdpbiA9IDJcclxuICApIHtcclxuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgIC8vIOu4lOuhneydhCDsi5zqsIHtmZQg7ZWgIOy7qO2FjOydtOuEiCBET01cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XHJcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIC8vIOu4lOuhneydmCDrhIjruYRcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG5cclxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgLy8gU3RlcOydhCDsg4HshLjtnogg67O07Jes7KSMXHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX0RFVEFJTDtcclxuXHJcbiAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcclxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xyXG5cclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICB9XHJcblxyXG4gIC8vIOy2lOyDgSDrqZTshozrk5xcclxuICBzb3J0KCkge31cclxuXHJcbiAgd2FpdERldGFpbCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTdG9wICYmIHRoaXMuc3RlcFR5cGUgPT0gU29ydC5TVEVQX0RFVEFJTCkge1xyXG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gcmVzb2x2ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHdhaXRTaW1wbGUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU3RvcCAmJiB0aGlzLnN0ZXBUeXBlID09IFNvcnQuU1RFUF9TSU1QTEUpIHtcclxuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxyXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IHJlc29sdmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSh7IHR5cGU6IFwiY29udGludWVcIiB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgY29udGludWUoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zdGVwKCk7XHJcbiAgfVxyXG5cclxuICBzdGVwKCkge1xyXG4gICAgaWYgKHRoaXMucmVzb2x2ZURldGFpbCAhPSBudWxsICYmIHRoaXMucmVzb2x2ZURldGFpbCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsKHsgdHlwZTogXCJzdGVwXCIgfSk7XHJcbiAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVzb2x2ZVNpbXBsZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZVNpbXBsZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlKHsgdHlwZTogXCJzdGVwXCIgfSk7XHJcbiAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGVwQmFjaygpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmVEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVEZXRhaWwgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsKHtcclxuICAgICAgICAgIHR5cGU6IFwiYmFja1wiLFxyXG4gICAgICAgICAgbWVtZW50bzogdGhpcy5tZW1ldG9TdGFjay5wb3AoKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvbHZlU2ltcGxlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlU2ltcGxlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAvLyBUT0RPIDogZGV0YWlsIOuwqeyLneydmCBzb3J0IHJvbGxiYWNrIOq1rO2YhFxyXG4gICAgICAvLyBsZXQgbWVtZW50bztcclxuICAgICAgLy8gZG8ge1xyXG4gICAgICAvLyAgIG1lbWVudG8gPSB0aGlzLm1lbWV0b1N0YWNrLnBvcCgpO1xyXG4gICAgICAvLyB9IHdoaWxlICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwICYmIG1lbWVudG8udHlwZSAhPSBcInNpbXBsZVwiKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlKHsgdHlwZTogXCJiYWNrXCIsIG1lbWVudG86IG1lbWVudG8gfSk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVzaE1lbWVudG8oIG1lbWVudG8pIHtcclxuICAgIHRoaXMubWVtZXRvU3RhY2sucHVzaChtZW1lbnRvKTtcclxuICB9XHJcblxyXG4gIHNldFN0ZXBUeXBlRGV0YWlsKCkge1xyXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XHJcbiAgfVxyXG4gIHNldFN0ZXBUeXBlU2ltcGxlKCkge1xyXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9TSU1QTEU7XHJcbiAgfVxyXG5cclxuICBzaHVmZmxlKCkge1xyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgZm9yIChsZXQgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcclxuICAgICAgW2Jsb2Nrc1tpXSwgYmxvY2tzW2pdXSA9IFtibG9ja3Nbal0sIGJsb2Nrc1tpXV07IC8vIOyFlO2UjFxyXG4gICAgfVxyXG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIGJsb2NrLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxyXG5cclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24odHJhbnNYKTtcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXHJcblxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gIH1cclxuXHJcbiAgc2V0QmxvY2tXaWR0aChibG9ja1dpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XHJcbiAgICAvLyB3aWR0aDpOdW1iZXJcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XHJcblxyXG4gICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG5cclxuICAgIC8vIOu4lOuhnSDtgazquLAg67CU6r646riwXHJcbiAgICB0aGlzLmJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XHJcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XHJcblxyXG4gICAgICBjb25zdCBuZXdYID0gaW5kZXggKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcclxuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKG5ld1gpO1xyXG5cclxuICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcclxuICAgICAgYmxvY2suc2V0V2lkdGgoYmxvY2tXaWR0aCk7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEJsb2NrKGJsb2NrVmFsdWUpIHtcclxuICAgIC8vIOu4lOuhnSDqsJzsiJgg7KCc7ZWcXHJcbiAgICBpZiAodGhpcy5ibG9ja3MubGVuZ3RoID4gMzApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBibG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKFxyXG4gICAgICBibG9ja1ZhbHVlLFxyXG4gICAgICB0aGlzLmNvbnRhaW5lcixcclxuICAgICAgdGhpcy5ibG9ja1dpZHRoLFxyXG4gICAgICB0aGlzLmJsb2NrTWFyZ2luXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKFxyXG4gICAgICB3aW5kb3dcclxuICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcilcclxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoXCJweFwiLCBcIlwiKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9XHJcbiAgICAgIHByZXZXaWR0aCArICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKSArIFwicHhcIjtcclxuICB9XHJcblxyXG4gIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcclxuICB9XHJcblxyXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT5cclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRoaXMuYW5pbWF0aW9uRGVsYXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gdGhpcy5ibG9ja3Prpbwg7Iuc6rCB7ZmU65CY6rOg7J6I64qUIOyInOyEnOyXkCDrp57qsowg7KCV66Cs7ZWY64qUIO2VqOyImFxyXG4gIHJlZnJlc2hCbG9ja3MoKSB7XHJcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSwgYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcclxuICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXHJcbiAgYXN5bmMgc3dhcChibG9jazEsIGJsb2NrMikge1xyXG4gICAgLy8gYmxvY2sxOiBCbG9jaywgYmxvY2syOiBCbG9ja1xyXG5cclxuICAgIGNvbnN0IHgxID0gYmxvY2sxLmdldFhQb3NpdGlvbigpO1xyXG4gICAgY29uc3QgeDIgPSBibG9jazIuZ2V0WFBvc2l0aW9uKCk7XHJcblxyXG4gICAgYmxvY2sxLnNldFhQb3NpdGlvbih4Mik7XHJcbiAgICBibG9jazIuc2V0WFBvc2l0aW9uKHgxKTtcclxuXHJcbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgIGF3YWl0IGJsb2NrMS5zd2FwQmxvY2soYmxvY2syKTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxyXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcclxuICBhc3luYyBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XHJcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuXHJcbiAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXHJcbiAgICBjb25zdCB0YXJnZXRJbmRleCA9IGJsb2Nrcy5pbmRleE9mKGJsb2NrKTtcclxuXHJcbiAgICAvLyBkZXN0SW5kZXjsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXHJcbiAgICBjb25zdCBiZXR3ZWVucyA9IGJsb2Nrcy5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XHJcblxyXG4gICAgLy8geCDsooztkZxcclxuICAgIGNvbnN0IHgxID0gYmxvY2suZ2V0WFBvc2l0aW9uKCk7XHJcbiAgICBjb25zdCB4UmVzdCA9IGJldHdlZW5zLm1hcChiID0+IGIuZ2V0WFBvc2l0aW9uKCkpO1xyXG5cclxuICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UmVzdFswXSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICBiZXR3ZWVuc1tpXS5zZXRYUG9zaXRpb24oeFJlc3RbaSArIDFdKTtcclxuICAgIH1cclxuICAgIGJldHdlZW5zW2JldHdlZW5zLmxlbmd0aCAtIDFdLnNldFhQb3NpdGlvbih4MSk7XHJcblxyXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICBhd2FpdCBibG9jay5pbnNlcnRCZWZvcmUoYmV0d2VlbnNbMF0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8g7IS467aA7KCB7Jy866GcIOuqqOuToCDri6jqs4Qg7ZGc7IucXHJcblNvcnQuU1RFUF9ERVRBSUwgPSBTeW1ib2wuZm9yKFwiU1RFUF9ERVRBSUxcIik7XHJcbi8vIOu4lOuhnSDsnITsuZjqsIAg67CU64CM64qUIOuLqOqzhOunjCDtkZzsi5xcclxuU29ydC5TVEVQX1NJTVBMRSA9IFN5bWJvbC5mb3IoXCJTVEVQX1NJTVBMRVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcclxuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XHJcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cclxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XHJcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxyXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsp4TtlokgQnV0dG9uXHJcbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDrkqTroZwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcclxuXHJcbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXHJcbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XHJcblxyXG4vLyDsiqTthZ0g7YOA7J6FIFJhZGlvXHJcbmNvbnN0IHN0ZXBEZXRhaWxSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1kZXRhaWwtcmFkaW9cIik7XHJcbmNvbnN0IHN0ZXBTaW1wbGVSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1zaW1wbGUtcmFkaW9cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcclxuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbi8vIHNvcnQgdHlwZSByYWRpb+uhnCDrtoDthLAg6rCS7J2EIOydveyWtOyEnCBTb3J0IEFsZ29yaXRobeydhCDqsrDsoJVcclxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcclxuICBsZXQgU29ydEFsZ29yaXRobTtcclxuICBpZiAoYnViYmxlU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xyXG4gIH0gZWxzZSBpZiAoaW5zZXJ0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBJbnNlcnRpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAocXVpY2tTb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IFF1aWNrU29ydDtcclxuICB9XHJcbiAgcmV0dXJuIFNvcnRBbGdvcml0aG07XHJcbn1cclxuXHJcblxyXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIpO1xyXG5nZW5lcmF0ZVVuaXF1ZVZhbHVlcygpLmZvckVhY2godmFsdWUgPT4gc29ydC5hZGRCbG9jayh2YWx1ZSkpO1xyXG5cclxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XHJcbiAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG5cclxuICBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcclxufTtcclxuXHJcbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xyXG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcblxyXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxuLy8gfVxyXG5cclxuZGVsYXlJbnB1dEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7J6F66Cl6rCS7J20IOuylOychOulvCDrhJjslrTshJzrqbQg6rK96rOE6rCS7Jy866GcIOyEpOyglVxyXG4gIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPiBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XHJcbiAgfSBlbHNlIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPCBOdW1iZXIoZGVsYXlSYW5nZS5taW4pKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5taW47XHJcbiAgfVxyXG5cclxuICBjb25zdCBkZWxheSA9XHJcbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcclxuICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XHJcbn07XHJcblxyXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcclxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XHJcbiAgY29uc3Qgc2l6ZSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgY29uc29sZS5sb2coXCJzaXplOiBcIiArIHNpemUpO1xyXG4gIHNvcnQuc2V0QmxvY2tXaWR0aChzaXplKTtcclxufTtcclxuXHJcbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XHJcbiAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSBcIlwiKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XHJcblxyXG4gIHNvcnQuYWRkQmxvY2sodmFsdWUpO1xyXG59O1xyXG5cclxuLy8gaXNTb3J0UnVubmluZ+ydgCDtmITsnqwg7KCV66Cs7J20IOynhO2WieykkeyduOyngCDtkZzsi5ztlZjripQg67OA7IiYLiB0cnVl7J2066m0IHNvcnRTdGFydEJ0buydtCDrj5nsnpHtlZjsp4Ag7JWK64qU64ukLlxyXG5sZXQgaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG5cclxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcclxuZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcclxuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxufVxyXG4vLyDsoJXroKzsnbQg64Gd64KcIO2bhCBJbnB1dOuTpOydhCDtmZzshLHtmZRcclxuZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcbnNvcnRCdG4ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICBkaXNhYmxlSW5wdXRzKCk7IC8vIOygleugrOydtCDsi5zsnpHrkKAg65WMIOu5hO2ZnOyEse2ZlFxyXG5cclxuICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xyXG5cclxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXHJcbiAgICBzb3J0LmNvbnRhaW5lcixcclxuICAgIHNvcnQuYmxvY2tzLFxyXG4gICAgc29ydC5kZWxheSxcclxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXHJcbiAgICBzb3J0LmJsb2NrV2lkdGgsXHJcbiAgICBzb3J0LmJsb2NrTWFyZ2luXHJcbiAgKTtcclxuXHJcbiAgc29ydC5zb3J0KCkudGhlbihlbmFibGVJbnB1dHMpXHJcbn07XHJcblxyXG5zb3J0U3RvcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdG9wKCk7XHJcbn07XHJcblxyXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuY29udGludWUoKTtcclxufTtcclxuXHJcbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoc3RlcERldGFpbFJhZGlvLmNoZWNrZWQpIHNvcnQuc2V0U3RlcFR5cGVEZXRhaWwoKTtcclxuICBlbHNlIGlmIChzdGVwU2ltcGxlUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZVNpbXBsZSgpO1xyXG5cclxuICBzb3J0LnN0ZXAoKTtcclxufTtcclxuXHJcbnNvcnRTdGVwQmFja0J0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgaWYgKHN0ZXBEZXRhaWxSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlRGV0YWlsKCk7XHJcbiAgZWxzZSBpZiAoc3RlcFNpbXBsZVJhZGlvLmNoZWNrZWQpIHNvcnQuc2V0U3RlcFR5cGVTaW1wbGUoKTtcclxuICBzb3J0LnN0ZXBCYWNrKCk7XHJcbn1cclxuXHJcbmJsb2NrU2h1ZmZsZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zaHVmZmxlKCk7XHJcbn07XHJcbiJdfQ==
