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

    // 상태 저장 스택 초기화
    this.memetoStack = [];

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

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;

    blocks[0].setColorGreen();

    await this.waitSimple();

    for (let i = 1; i < n;) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorRed();

        const {type,memento} = await this.waitDetail();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
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

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorGreen();
        if (value > target) {
          destIndex = j;
          break;
        }
        j+=1;
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
      i += 1;
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

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;
    let min;

    for (let i = 0; i < n - 1;) {
      min = i;
      await this.waitSimple();
      blocks[i].setColorRed(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n;) {
        blocks[j].setColorRed(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        

        const {type,memento} = await this.waitDetail();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
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

        // delay만큼 기다림//
        await new Promise(resolve => setTimeout(resolve, this.delay));
        let value1 = blocks[min].getValue(); //변수 설정
        let value2 = blocks[j].getValue();
        if (value1 >= value2) min = j;
        if (i != min && j == n - 1) {
          await this.swap(blocks[min], blocks[i]); // 블럭 체인지
          min = i; // min값초기화
          blocks[min].setColorDefault(); // 위치가 바뀌는  대상블록색깔 파란색으로
          this.refreshBlocks(); //두 블록의 위치가 바뀌었으므로 blocks를 업데이트
        }
        blocks[j].setColorDefault(); // 빨간색 블럭을 다시 파란색으로
        j += 1;
      }
      blocks[i].setColorGreen();
      i += 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuXHJcbiAgICBcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICBcclxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlfSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcclxuICAgICAgICAgIC8vIHN3YXAg7ZWo7IiY66GcIOuRkCDruJTroZ3snZgg7JyE7LmY66W8IOuwlOq/iDsgYXdhaXTsnYAgc3dhcCDsnbQg64Gd64KgIOuVjCDquYzsp4Ag6riw64uk66as6rKg64uk64qUIOydmOuvuFxyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1tqXSwgYmxvY2tzW2ogKyAxXSk7XHJcbiAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwgYmxvY2tz7J2EIOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGorPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieydhCBHcmVlbuycvOuhnCDrsJTqv4hcclxuICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICBpICs9IDFcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQoKSB7XHJcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XHJcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjspIHtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICBsZXQgZGVzdEluZGV4ID0gaTtcclxuXHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOykge1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZX0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XHJcblxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGorPTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGkgIT0gZGVzdEluZGV4KSB7XHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICAvLyBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XHJcblxyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgfVxyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBRdWlja1NvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuICBhc3luYyBzb3J0KHAgPSAwLCByID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgLy8g7LSI6riwIO2YuOy2nOydtOqzoCDsnbTrr7gg7KCV66CsIOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHAgPT09IDAgJiYgciA9PT0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSAmJiB0aGlzLmlzU29ydFJ1bm5pbmcpIHJldHVybjtcclxuICAgIC8vIOy0iOq4sCDtmLjstpzsnbwg6rK97JqwXHJcbiAgICBpZiAocCA9PT0gMCAmJiByID09PSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcbiAgICAgIFxyXG4gICAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHAgPCByKSB7XHJcbiAgICAgIGNvbnN0IHEgPSBhd2FpdCB0aGlzLnBhcnRpdGlvbihwLCByKTtcclxuXHJcbiAgICAgIC8vICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgIC8vICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMuc29ydChwLCBxIC0gMSk7XHJcblxyXG4gICAgICAvLyAgIGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAvLyAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgICBhd2FpdCB0aGlzLnNvcnQocSArIDEsIHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOy0iOq4sCDtmLjstpzsnbwg6rK97JqwXHJcbiAgICBpZiAocCA9PT0gMCAmJiByID09PSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHBhcnRpdGlvbihwLCByKSB7XHJcbiAgICBsZXQgcGl2b3QgPSB0aGlzLmJsb2Nrc1twXS5nZXRWYWx1ZSgpO1xyXG4gICAgbGV0IHNtYWxsID0gcDtcclxuICAgIGxldCBiaWcgPSByICsgMTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrc1xyXG4gICAgICAuZmlsdGVyKChfLCBpKSA9PiBwIDw9IGkgJiYgaSA8PSByKVxyXG4gICAgICAuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckJvdW5kYXJ5KCkpO1xyXG5cclxuICAgICAgdGhpcy5ibG9ja3NbcF0uc2V0Q29sb3JQaXZvdCgpO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHNtYWxsKys7XHJcbiAgICAgIH0gd2hpbGUgKHNtYWxsIDw9IHIgJiYgdGhpcy5ibG9ja3Nbc21hbGxdLmdldFZhbHVlKCkgPD0gcGl2b3QpO1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgYmlnLS07XHJcbiAgICAgIH0gd2hpbGUgKGJpZyA+PSBwICYmIHRoaXMuYmxvY2tzW2JpZ10uZ2V0VmFsdWUoKSA+IHBpdm90KTtcclxuICAgICAgaWYgKHNtYWxsIDwgYmlnKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3Nbc21hbGxdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgdGhpcy5ibG9ja3NbYmlnXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnN3YXAodGhpcy5ibG9ja3Nbc21hbGxdLCB0aGlzLmJsb2Nrc1tiaWddKTtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tzbWFsbF0uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICAgIHRoaXMuYmxvY2tzW2JpZ10uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChzbWFsbCA8IGJpZyk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3NbYmlnXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuICAgIGF3YWl0IHRoaXMuc3dhcCh0aGlzLmJsb2Nrc1twXSwgdGhpcy5ibG9ja3NbYmlnXSk7XHJcblxyXG4gICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3NcclxuICAgICAgLmZpbHRlcigoXywgaSkgPT4gcCA8PSBpICYmIGkgPD0gcilcclxuICAgICAgLmZvckVhY2goYmxvY2sgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG5cclxuICAgIHJldHVybiBiaWc7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQoKSB7XHJcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XHJcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxyXG4gICAgICByZXR1cm47XHJcbiAgICBcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgbGV0IG1pbjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBtaW4gPSBpO1xyXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbjspIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlfSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcclxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XHJcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTsgLy8g67iU65+tIOyytOyduOyngFxyXG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXHJcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCAg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruajqsITsg4kg67iU65+t7J2EIOuLpOyLnCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICBqICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XHJcbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0O1xyXG4iLCJjbGFzcyBCbG9jayB7XHJcbiAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcclxuICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lciwgYmxvY2tXaWR0aCA9IDI4LCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XHJcblxyXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgXHJcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xyXG5cclxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgIHRoaXMuc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcclxuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcblxyXG4gICAgLy8g7ZmU66m07JeQIOu4lOuhnSDtkZzsi5xcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgfVxyXG4gIHN3YXBCbG9jayhibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSB0aGlzLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jay5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG5leHRPZlRhcmdldDEpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluc2VydEJlZm9yZShibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgYmxvY2suZG9tKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XHJcbiAgICB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiA9IG1pbGxpcztcclxuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3RoaXMudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcclxuICB9XHJcblxyXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgIC8vIHJldHVybiBOdW1iZXIoXHJcbiAgICAvLyAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS50cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgMClcclxuICAgIC8vICk7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgfVxyXG5cclxuICBzZXRYUG9zaXRpb24oeCkge1xyXG4gICAgdGhpcy54UG9zaXRpb24gPSB4O1xyXG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLnhQb3NpdGlvbn1weClgO1xyXG4gIH1cclxuXHJcbiAgZ2V0WFBvc2l0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xyXG4gICAgLy8gY29uc3QgcmVnRXhwVHJhbnNYID0gL1tcXHddK1xcKFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT8oW1xcZF0rKVsgXT8sWyBdP1tcXGRdK1sgXT9cXCkvO1xyXG4gICAgLy8gY29uc3QgdHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zZm9ybTtcclxuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGgocHgpIHtcclxuICAgIHRoaXMud2lkdGggPSBweDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gYCR7dGhpcy53aWR0aH1weGA7XHJcbiAgfVxyXG4gIGdldFdpZHRoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcihjb2xvcikge1xyXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgfVxyXG5cclxuICBnZXRDb2xvcigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JZZWxsb3coKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGRjAwXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRkZGMDBcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclJlZCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNGRjQ5NDlcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yRGVmYXVsdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiM1OEI3RkZcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckdyZWVuKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiIzEzQ0U2NlwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCBQaXZvdCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclBpdm90KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGMDA5RFwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkYwMDlEXCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDqsr3qs4Trpbwg64KY7YOA64K064qUIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yQm91bmRhcnkoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjODAwMDgwXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4MDAwODBcIjsgLy8g67O06528XHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAvLyDruJTroZ3snZgg7LWc64yAIOuGkuydtOuKlCDsu6jthYzsnbTrhIjsnZgg64aS7J20IC0gMjRweFxyXG4gICAgY29uc3QgbWF4SGlnaHQgPVxyXG4gICAgICBOdW1iZXIod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpLmhlaWdodC5yZXBsYWNlKFwicHhcIiwgXCJcIikpIC0gMjQ7XHJcbiAgICBsZXQgYmxvY2tIaWdodCA9IHZhbHVlICogMztcclxuICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHQgPCBtYXhIaWdodCA/IGJsb2NrSGlnaHQgOiBtYXhIaWdodH1weGA7XHJcblxyXG4gICAgdGhpcy5kb20uZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcclxuICBnZXRWYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcclxuXHJcbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxyXG5jbGFzcyBTb3J0IHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGNvbnRhaW5lcixcclxuICAgIGJsb2NrcyA9IFtdLFxyXG4gICAgZGVsYXkgPSAyMDAsXHJcbiAgICBhbmltYXRpb25EZWxheSA9IDI1MCxcclxuICAgIGJsb2NrV2lkdGggPSAyOCxcclxuICAgIGJsb2NrTWFyZ2luID0gMlxyXG4gICkge1xyXG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAvLyDsoJXroKwg7Iqk7YWdIOyCrOydtCDrlJzroIjsnbRcclxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcclxuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIC8vIOu4lOuhnSDsgqzsnbQg6rCE6rKpXHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IO2YhOyerCDsi6TtlonspJHsnbgg7IOB7YOcXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBTdGVw7J2EIOyDgeyEuO2eiCDrs7Tsl6zspIxcclxuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfREVUQUlMO1xyXG5cclxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxyXG4gICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XHJcblxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxyXG4gIHNvcnQoKSB7fVxyXG5cclxuICB3YWl0RGV0YWlsKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfREVUQUlMKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgd2FpdFNpbXBsZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTdG9wICYmIHRoaXMuc3RlcFR5cGUgPT0gU29ydC5TVEVQX1NJTVBMRSkge1xyXG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlID0gcmVzb2x2ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0b3AoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBjb250aW51ZSgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICB0aGlzLnN0ZXAoKTtcclxuICB9XHJcblxyXG4gIHN0ZXAoKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvbHZlRGV0YWlsICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlRGV0YWlsICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnJlc29sdmVEZXRhaWwoeyB0eXBlOiBcInN0ZXBcIiB9KTtcclxuICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvbHZlU2ltcGxlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlU2ltcGxlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnJlc29sdmVTaW1wbGUoeyB0eXBlOiBcInN0ZXBcIiB9KTtcclxuICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0ZXBCYWNrKCkge1xyXG4gICAgaWYgKHRoaXMucmVzb2x2ZURldGFpbCAhPSBudWxsICYmIHRoaXMucmVzb2x2ZURldGFpbCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKHRoaXMubWVtZXRvU3RhY2subGVuZ3RoICE9IDApIHtcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwoe1xyXG4gICAgICAgICAgdHlwZTogXCJiYWNrXCIsXHJcbiAgICAgICAgICBtZW1lbnRvOiB0aGlzLm1lbWV0b1N0YWNrLnBvcCgpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnJlc29sdmVTaW1wbGUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVTaW1wbGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIC8vIFRPRE8gOiBkZXRhaWwg67Cp7Iud7J2YIHNvcnQgcm9sbGJhY2sg6rWs7ZiEXHJcbiAgICAgIC8vIGxldCBtZW1lbnRvO1xyXG4gICAgICAvLyBkbyB7XHJcbiAgICAgIC8vICAgbWVtZW50byA9IHRoaXMubWVtZXRvU3RhY2sucG9wKCk7XHJcbiAgICAgIC8vIH0gd2hpbGUgKHRoaXMubWVtZXRvU3RhY2subGVuZ3RoICE9IDAgJiYgbWVtZW50by50eXBlICE9IFwic2ltcGxlXCIpO1xyXG5cclxuICAgICAgaWYgKHRoaXMubWVtZXRvU3RhY2subGVuZ3RoICE9IDApIHtcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUoeyB0eXBlOiBcImJhY2tcIiwgbWVtZW50bzogbWVtZW50byB9KTtcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXNoTWVtZW50byggbWVtZW50bykge1xyXG4gICAgdGhpcy5tZW1ldG9TdGFjay5wdXNoKG1lbWVudG8pO1xyXG4gIH1cclxuXHJcbiAgc2V0U3RlcFR5cGVEZXRhaWwoKSB7XHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX0RFVEFJTDtcclxuICB9XHJcbiAgc2V0U3RlcFR5cGVTaW1wbGUoKSB7XHJcbiAgICB0aGlzLnN0ZXBUeXBlID0gU29ydC5TVEVQX1NJTVBMRTtcclxuICB9XHJcblxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICBmb3IgKGxldCBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTsgLy8gMCDsnbTsg4EgaSDrr7jrp4zsnZgg66y07J6R7JyEIOyduOuNseyKpFxyXG4gICAgICBbYmxvY2tzW2ldLCBibG9ja3Nbal1dID0gW2Jsb2Nrc1tqXSwgYmxvY2tzW2ldXTsgLy8g7IWU7ZSMXHJcbiAgICB9XHJcbiAgICBibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgYmxvY2suc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu4lOuhnSDsg4kg7LSI6riw7ZmUXHJcblxyXG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAodGhpcy5ibG9ja1dpZHRoICsgdGhpcy5ibG9ja01hcmdpbik7XHJcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih0cmFuc1gpO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBudWxsKTsgLy8g67iU66Gd7J2YIERPTeydhCDsu6jthYzsnbTrhIjsnZgg66eoIOuBneycvOuhnCDsnbTrj5lcclxuXHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgfVxyXG5cclxuICBzZXRCbG9ja1dpZHRoKGJsb2NrV2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcclxuICAgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XHJcblxyXG4gICAgLy8g67iU66GdIO2BrOq4sCDrsJTqvrjquLBcclxuICAgIHRoaXMuYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24obmV3WCk7XHJcblxyXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRXaWR0aChibG9ja1dpZHRoKTtcclxuXHJcbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQmxvY2soYmxvY2tWYWx1ZSkge1xyXG4gICAgLy8g67iU66GdIOqwnOyImCDsoJztlZxcclxuICAgIGlmICh0aGlzLmJsb2Nrcy5sZW5ndGggPiAzMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2soXHJcbiAgICAgIGJsb2NrVmFsdWUsXHJcbiAgICAgIHRoaXMuY29udGFpbmVyLFxyXG4gICAgICB0aGlzLmJsb2NrV2lkdGgsXHJcbiAgICAgIHRoaXMuYmxvY2tNYXJnaW5cclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXHJcbiAgICAgIHdpbmRvd1xyXG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxyXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcclxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID1cclxuICAgICAgcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PlxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24odGhpcy5hbmltYXRpb25EZWxheSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyB0aGlzLmJsb2Nrc+ulvCDsi5zqsIHtmZTrkJjqs6DsnojripQg7Iic7ISc7JeQIOunnuqyjCDsoJXroKztlZjripQg7ZWo7IiYXHJcbiAgcmVmcmVzaEJsb2NrcygpIHtcclxuICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxyXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICBhc3luYyBzd2FwKGJsb2NrMSwgYmxvY2syKSB7XHJcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXHJcblxyXG4gICAgY29uc3QgeDEgPSBibG9jazEuZ2V0WFBvc2l0aW9uKCk7XHJcbiAgICBjb25zdCB4MiA9IGJsb2NrMi5nZXRYUG9zaXRpb24oKTtcclxuXHJcbiAgICBibG9jazEuc2V0WFBvc2l0aW9uKHgyKTtcclxuICAgIGJsb2NrMi5zZXRYUG9zaXRpb24oeDEpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2sxLnN3YXBCbG9jayhibG9jazIpO1xyXG4gIH1cclxuXHJcbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXHJcbiAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxyXG4gIGFzeW5jIGluc2VydEF0KGJsb2NrLCBkZXN0SW5kZXgpIHtcclxuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG5cclxuICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcclxuICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYmxvY2tzLmluZGV4T2YoYmxvY2spO1xyXG5cclxuICAgIC8vIGRlc3RJbmRleOyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcclxuICAgIGNvbnN0IGJldHdlZW5zID0gYmxvY2tzLmZpbHRlcigoXywgaSkgPT4gZGVzdEluZGV4IDw9IGkgJiYgaSA8IHRhcmdldEluZGV4KTtcclxuXHJcbiAgICAvLyB4IOyijO2RnFxyXG4gICAgY29uc3QgeDEgPSBibG9jay5nZXRYUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IHhSZXN0ID0gYmV0d2VlbnMubWFwKGIgPT4gYi5nZXRYUG9zaXRpb24oKSk7XHJcblxyXG4gICAgYmxvY2suc2V0WFBvc2l0aW9uKHhSZXN0WzBdKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIGJldHdlZW5zW2ldLnNldFhQb3NpdGlvbih4UmVzdFtpICsgMV0pO1xyXG4gICAgfVxyXG4gICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc2V0WFBvc2l0aW9uKHgxKTtcclxuXHJcbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgIGF3YWl0IGJsb2NrLmluc2VydEJlZm9yZShiZXR3ZWVuc1swXSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyDshLjrtoDsoIHsnLzroZwg66qo65OgIOuLqOqzhCDtkZzsi5xcclxuU29ydC5TVEVQX0RFVEFJTCA9IFN5bWJvbC5mb3IoXCJTVEVQX0RFVEFJTFwiKTtcclxuLy8g67iU66GdIOychOy5mOqwgCDrsJTrgIzripQg64uo6rOE66eMIO2RnOyLnFxyXG5Tb3J0LlNURVBfU0lNUExFID0gU3ltYm9sLmZvcihcIlNURVBfU0lNUExFXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xyXG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XHJcbmNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKFwiLi4vaW5zZXJ0aW9uLXNvcnQvSW5zZXJ0aW9uU29ydFwiKTtcclxuY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0XCIpO1xyXG5jb25zdCBRdWlja1NvcnQgPSByZXF1aXJlKFwiLi4vcXVpY2stc29ydC9RdWlja1NvcnRcIik7XHJcblxyXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcclxuXHJcbi8vIOygleugrCDsooXrpZggUmFkaW9cclxuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWJibGUtc29ydC1yYWRpb1wiKTtcclxuY29uc3QgaW5zZXJ0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNlcnRpb24tc29ydC1yYWRpb1wiKTtcclxuY29uc3Qgc2VsZWN0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rpb24tc29ydC1yYWRpb1wiKTtcclxuY29uc3QgcXVpY2tTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1aWNrLXNvcnQtcmFkaW9cIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IFJhbmdlXHJcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcclxuXHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXRcclxuY29uc3QgZGVsYXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0XCIpO1xyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0IEJ1dHRvblxyXG5jb25zdCBkZWxheUlucHV0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXQtYnRuXCIpO1xyXG5cclxuLy8g7Iuc6rCB7ZmUIOu4lOuhnSDtgazquLAgUmFuZ2VcclxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaXplLXJhbmdlXCIpO1xyXG5cclxuLy8g7IKs7Jqp7J6Q66Gc67aA7YSwIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7J6F66Cl67Cb64qUIElucHV0IFRleHRcclxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1pbnB1dFwiKTtcclxuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXHJcbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWFkZC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxyXG5jb25zdCBzb3J0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDspJHsp4AgQnV0dG9uXHJcbmNvbnN0IHNvcnRTdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0b3AtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cclxuY29uc3Qgc29ydENvbnRpbnVlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWNvbnRpbnVlLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXHJcbmNvbnN0IHNvcnRTdGVwQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOuSpOuhnCDsiqTthZ0gQnV0dG9uXHJcbmNvbnN0IHNvcnRTdGVwQmFja0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJhY2stYnRuXCIpO1xyXG5cclxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cclxuY29uc3QgYmxvY2tTaHVmZmxlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9jay1zaHVmZmxlLWJ0blwiKTtcclxuXHJcbi8vIOyKpO2FnSDtg4DsnoUgUmFkaW9cclxuY29uc3Qgc3RlcERldGFpbFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGVwLWRldGFpbC1yYWRpb1wiKTtcclxuY29uc3Qgc3RlcFNpbXBsZVJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGVwLXNpbXBsZS1yYWRpb1wiKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlVmFsdWVzKGNvdW50ID0gMjApIHtcclxuICBjb25zdCB2YWx1ZXMgPSBbXTtcclxuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IGNvdW50KSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2NSArIDEpO1xyXG4gICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXModmFsdWUpKSB7XHJcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlcztcclxufVxyXG5cclxuLy8gc29ydCB0eXBlIHJhZGlv66GcIOu2gO2EsCDqsJLsnYQg7J297Ja07IScIFNvcnQgQWxnb3JpdGht7J2EIOqysOyglVxyXG5mdW5jdGlvbiBnZXRTb3J0QWxnb3JpdGhtKCkge1xyXG4gIGxldCBTb3J0QWxnb3JpdGhtO1xyXG4gIGlmIChidWJibGVTb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IEJ1YmJsZVNvcnQ7XHJcbiAgfSBlbHNlIGlmIChpbnNlcnRpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XHJcbiAgfSBlbHNlIGlmIChzZWxlY3Rpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IFNlbGVjdGlvblNvcnQ7XHJcbiAgfSBlbHNlIGlmIChxdWlja1NvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gUXVpY2tTb3J0O1xyXG4gIH1cclxuICByZXR1cm4gU29ydEFsZ29yaXRobTtcclxufVxyXG5cclxuXHJcbmxldCBzb3J0ID0gbmV3IChnZXRTb3J0QWxnb3JpdGhtKCkpKGNvbnRhaW5lcik7XHJcbmdlbmVyYXRlVW5pcXVlVmFsdWVzKCkuZm9yRWFjaCh2YWx1ZSA9PiBzb3J0LmFkZEJsb2NrKHZhbHVlKSk7XHJcblxyXG5kZWxheVJhbmdlLm9uaW5wdXQgPSBlID0+IHtcclxuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbiAgc29ydC5zZXREZWxheShkZWxheSk7XHJcblxyXG4gIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxyXG59O1xyXG5cclxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XHJcbi8vICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpIC0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuXHJcbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbi8vICAgc29ydC5zZXREZWxheShkZWxheSk7XHJcbi8vICAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXHJcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xyXG4vLyB9XHJcblxyXG5kZWxheUlucHV0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDsnoXroKXqsJLsnbQg67KU7JyE66W8IOuEmOyWtOyEnOuptCDqsr3qs4TqsJLsnLzroZwg7ISk7KCVXHJcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcclxuICB9IGVsc2UgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA8IE51bWJlcihkZWxheVJhbmdlLm1pbikpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRlbGF5ID1cclxuICAgIE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pIC0gTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4gIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4gIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxufTtcclxuXHJcbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxyXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcclxuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBjb25zb2xlLmxvZyhcInNpemU6IFwiICsgc2l6ZSk7XHJcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xyXG59O1xyXG5cclxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcclxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcclxuXHJcbiAgc29ydC5hZGRCbG9jayh2YWx1ZSk7XHJcbn07XHJcblxyXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXHJcbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4vLyDsoJXroKwg64+E7KSR7JeUIElucHV065Ok7J2EIOu5hO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXHJcblxyXG4gIGNvbnN0IFNvcnRBbGdvcml0aG0gPSBnZXRTb3J0QWxnb3JpdGhtKCk7XHJcblxyXG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcclxuICAgIHNvcnQuY29udGFpbmVyLFxyXG4gICAgc29ydC5ibG9ja3MsXHJcbiAgICBzb3J0LmRlbGF5LFxyXG4gICAgc29ydC5hbmltYXRpb25EZWxheSxcclxuICAgIHNvcnQuYmxvY2tXaWR0aCxcclxuICAgIHNvcnQuYmxvY2tNYXJnaW5cclxuICApO1xyXG5cclxuICBzb3J0LnNvcnQoKS50aGVuKGVuYWJsZUlucHV0cylcclxufTtcclxuXHJcbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0b3AoKTtcclxufTtcclxuXHJcbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5jb250aW51ZSgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIGlmIChzdGVwRGV0YWlsUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZURldGFpbCgpO1xyXG4gIGVsc2UgaWYgKHN0ZXBTaW1wbGVSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlU2ltcGxlKCk7XHJcblxyXG4gIHNvcnQuc3RlcCgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCYWNrQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBpZiAoc3RlcERldGFpbFJhZGlvLmNoZWNrZWQpIHNvcnQuc2V0U3RlcFR5cGVEZXRhaWwoKTtcclxuICBlbHNlIGlmIChzdGVwU2ltcGxlUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZVNpbXBsZSgpO1xyXG4gIHNvcnQuc3RlcEJhY2soKTtcclxufVxyXG5cclxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnNodWZmbGUoKTtcclxufTtcclxuIl19
