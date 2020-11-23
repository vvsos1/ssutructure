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
      

    
      for (let j = 0; j < n - i - 1;) {
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorRed();
        blocks[j + 1].setColorRed();

       
        // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
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

    for (let i = 1; i < n;) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorRed();

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
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

  async sort(left = 0, right = this.blocks.length - 1) {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning) return;
    this.isSortRunning = true;

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach((block) => block.setColorDefault());

    let blocks = this.blocks;
    let lstack = [];
    let rstack = [];

    lstack.push(left);
    rstack.push(right);

    while (lstack.length != 0) {
      let pl = (left = lstack.pop()); // 왼쪽 커서
      let pr = (right = rstack.pop()); // 오른쪽 커서
      let pivotIdx = Math.ceil((left + right) / 2);
      let pivot = blocks[pivotIdx]; // 피벗

      // 현재 알고리즘이 바라보는 블록들의 색 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorBoundary());
      // 피벗의 색 변경
      pivot.setColorPivot();

      do {
        while (blocks[pl].getValue() < pivot.getValue()) pl++;
        while (blocks[pr].getValue() > pivot.getValue()) pr--;

        blocks[pl].setColorRed();
        blocks[pr].setColorRed();
        // pl 또는 pr이 pivot과 겹쳐도 pivot의 색을 유지
        pivot.setColorPivot();

        const { type, memento } = await this.wait();

        // 상태 복구
        if (type === "back") {
          ({ lstack, rstack, pl, pr, left, right, pivotIdx } = memento);
          pivot = blocks[pivotIdx];
          memento.blocks.forEach((prevBlock, index) => {
            const { color, xPosition, value, width } = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });
          continue;
        }

        // 현재 상태를 스택에 저장
        this.pushMemento({
          pl,
          pr,
          pivotIdx,
          left,
          right,
          lstack: [...lstack, pl],
          rstack: [...rstack, pr],
          blocks: [...blocks].map((block) => ({ ...block })),
        });

        if (pl <= pr) {
          await this.swap(blocks[pl++], blocks[pr--]);
          // swap(blocks, pl++, pr--);
          this.refreshBlocks();
        }
        blocks[pl - 1].setColorBoundary();
        blocks[pr + 1].setColorBoundary();
      } while (pl <= pr);

      if (left < pr) {
        lstack.push(left);
        rstack.push(pr);
      }
      if (pl < right) {
        lstack.push(pl);
        rstack.push(right);
      }
      // 현재 알고리즘이 바라보는 블록들의 색을 원래대로 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorDefault());
    }
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
      blocks[i].setColorRed(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n;) {
        blocks[j].setColorRed(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
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
    this.color = "#B69AE7";
    this.dom.style.backgroundColor = "#B69AE7"; //선택된 블록 : 빨강 -> 연보라
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.color = "#FF9FB3";
    this.dom.style.backgroundColor = "#FF9FB3"; //기본 블록: 파랑 -> 연핑크
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorGreen() {
    this.color = "#FF6C77";
    this.dom.style.backgroundColor = "#FF6C77"; //정렬 끝난 블록: 그린(초록) -> 찐핑크
  }

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot() {
    this.color = "#9F70F1";
    this.dom.style.backgroundColor = "#9F70F1"; //피벗 블록 : 형광 핑크 ->  찐보라
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary() {
    this.color = "#F5E348";
    this.dom.style.backgroundColor = "#F5E348"; // 블럭 경계 : 보라 -> 노랑 
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

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);

    this.memetoStack = [];
  }

  // 추상 메소드
  sort() {}

  wait() {
    return new Promise(resolve => {
      if (this.isStop) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolve = resolve;
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
    if (this.resolve != null && this.resolve != undefined) {
      this.resolve({ type: "step" });
      this.resolve = null;
    } 
  }

  stepBack() {
    if (this.resolve != null && this.resolve != undefined) {
      if (this.memetoStack.length != 0) {
        this.resolve({
          type: "back",
          memento: this.memetoStack.pop()
        });
        this.resolve = null;
      }
    } 
  }

  pushMemento( memento) {
    this.memetoStack.push(memento);
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
  sort.setBlockWidth(size);
};

newDataAddBtn.onclick = e => {
  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  sort.addBlock(value);
};


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
  sort.step();
};

sortStepBackBtn.onclick = e => {
  sort.stepBack();
}

blockShuffleBtn.onclick = e => {
  sort.shuffle();
};

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../quick-sort/QuickSort":3,"../selection-sort/SelectionSort":4,"../sort/Block":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBcclxuXHJcbiAgICBcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICBcclxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xyXG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgais9IDE7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIGkgKz0gMVxyXG4gICAgfVxyXG4gICAgYmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOykge1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xyXG5cclxuICAgICAgY29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqKz0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgLy8gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xyXG5cclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBRdWlja1NvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydChsZWZ0ID0gMCwgcmlnaHQgPSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB7XHJcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XHJcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKSByZXR1cm47XHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG5cclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGxldCBsc3RhY2sgPSBbXTtcclxuICAgIGxldCByc3RhY2sgPSBbXTtcclxuXHJcbiAgICBsc3RhY2sucHVzaChsZWZ0KTtcclxuICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcclxuXHJcbiAgICB3aGlsZSAobHN0YWNrLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgIGxldCBwbCA9IChsZWZ0ID0gbHN0YWNrLnBvcCgpKTsgLy8g7Jm87Kq9IOy7pOyEnFxyXG4gICAgICBsZXQgcHIgPSAocmlnaHQgPSByc3RhY2sucG9wKCkpOyAvLyDsmKTrpbjsqr0g7Luk7IScXHJcbiAgICAgIGxldCBwaXZvdElkeCA9IE1hdGguY2VpbCgobGVmdCArIHJpZ2h0KSAvIDIpO1xyXG4gICAgICBsZXQgcGl2b3QgPSBibG9ja3NbcGl2b3RJZHhdOyAvLyDtlLzrspdcclxuXHJcbiAgICAgIC8vIO2YhOyerCDslYzqs6DrpqzsppjsnbQg67CU652867O064qUIOu4lOuhneuTpOydmCDsg4kg67OA6rK9XHJcbiAgICAgIGJsb2Nrc1xyXG4gICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gbGVmdCA8PSBpZHggJiYgaWR4IDw9IHJpZ2h0KVxyXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JCb3VuZGFyeSgpKTtcclxuICAgICAgLy8g7ZS867KX7J2YIOyDiSDrs4Dqsr1cclxuICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xyXG5cclxuICAgICAgZG8ge1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcHJdLmdldFZhbHVlKCkgPiBwaXZvdC5nZXRWYWx1ZSgpKSBwci0tO1xyXG5cclxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW3ByXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIC8vIHBsIOuYkOuKlCBwcuydtCBwaXZvdOqzvCDqsrnss5Drj4QgcGl2b3TsnZgg7IOJ7J2EIOycoOyngFxyXG4gICAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB0eXBlLCBtZW1lbnRvIH0gPSBhd2FpdCB0aGlzLndhaXQoKTtcclxuXHJcbiAgICAgICAgLy8g7IOB7YOcIOuzteq1rFxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIikge1xyXG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTtcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIO2YhOyerCDsg4Htg5zrpbwg7Iqk7YOd7JeQIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe1xyXG4gICAgICAgICAgcGwsXHJcbiAgICAgICAgICBwcixcclxuICAgICAgICAgIHBpdm90SWR4LFxyXG4gICAgICAgICAgbGVmdCxcclxuICAgICAgICAgIHJpZ2h0LFxyXG4gICAgICAgICAgbHN0YWNrOiBbLi4ubHN0YWNrLCBwbF0sXHJcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcclxuICAgICAgICAgIGJsb2NrczogWy4uLmJsb2Nrc10ubWFwKChibG9jaykgPT4gKHsgLi4uYmxvY2sgfSkpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocGwgPD0gcHIpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbcGwrK10sIGJsb2Nrc1twci0tXSk7XHJcbiAgICAgICAgICAvLyBzd2FwKGJsb2NrcywgcGwrKywgcHItLSk7XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW3BsIC0gMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICAgIGJsb2Nrc1twciArIDFdLnNldENvbG9yQm91bmRhcnkoKTtcclxuICAgICAgfSB3aGlsZSAocGwgPD0gcHIpO1xyXG5cclxuICAgICAgaWYgKGxlZnQgPCBwcikge1xyXG4gICAgICAgIGxzdGFjay5wdXNoKGxlZnQpO1xyXG4gICAgICAgIHJzdGFjay5wdXNoKHByKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocGwgPCByaWdodCkge1xyXG4gICAgICAgIGxzdGFjay5wdXNoKHBsKTtcclxuICAgICAgICByc3RhY2sucHVzaChyaWdodCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDieydhCDsm5DrnpjrjIDroZwg67OA6rK9XHJcbiAgICAgIGJsb2Nrc1xyXG4gICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gbGVmdCA8PSBpZHggJiYgaWR4IDw9IHJpZ2h0KVxyXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBRdWlja1NvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuICAgIGxldCBtaW47XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcclxuICAgICAgbWluID0gaTtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbjspIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxyXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikgbWluID0gajtcclxuICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXHJcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcclxuICAgICAgICAgIGJsb2Nrc1ttaW5dLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsnITsuZjqsIAg67CU64CM64qUICDrjIDsg4HruJTroZ3sg4nquZQg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTsgLy/rkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgIH1cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu5qOqwhOyDiSDruJTrn63snYQg64uk7IucIO2MjOuegOyDieycvOuhnFxyXG4gICAgICAgIGogKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cclxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XHJcbiIsImNsYXNzIEJsb2NrIHtcclxuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxyXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLCBibG9ja1dpZHRoID0gMjgsIGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcclxuICAgIGNvbnN0IHhQb3NpdGlvbiA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEJsb2NrKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgYmxvY2tXaWR0aCk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcih2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sICB3aWR0aCx0cmFuc2l0aW9uRHVyYXRpb249MjAwKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcblxyXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuXHJcbiAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcclxuICBcclxuICAgIHRoaXMuZG9tID0gYmxvY2s7XHJcblxyXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB0aGlzLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgdGhpcy5zZXRUcmFuc2l0aW9uRHVyYXRpb24odHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgdGhpcy5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuXHJcbiAgICAvLyDtmZTrqbTsl5Ag67iU66GdIO2RnOyLnFxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcclxuICB9XHJcbiAgc3dhcEJsb2NrKGJsb2NrKSB7XHJcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IHRoaXMuZG9tLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrLmRvbS5uZXh0U2libGluZztcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIG5leHRPZlRhcmdldDIpO1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0QmVmb3JlKGJsb2NrKSB7XHJcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBibG9jay5kb20pO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFRyYW5zaXRpb25EdXJhdGlvbihtaWxsaXMpIHtcclxuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gbWlsbGlzO1xyXG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xyXG4gIH1cclxuXHJcbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkge1xyXG4gICAgLy8gcmV0dXJuIE51bWJlcihcclxuICAgIC8vICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCAwKVxyXG4gICAgLy8gKTtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICB9XHJcblxyXG4gIHNldFhQb3NpdGlvbih4KSB7XHJcbiAgICB0aGlzLnhQb3NpdGlvbiA9IHg7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RoaXMueFBvc2l0aW9ufXB4KWA7XHJcbiAgfVxyXG5cclxuICBnZXRYUG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zaXRpb247XHJcbiAgICAvLyBjb25zdCByZWdFeHBUcmFuc1ggPSAvW1xcd10rXFwoWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdPyhbXFxkXSspWyBdPyxbIF0/W1xcZF0rWyBdP1xcKS87XHJcbiAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNmb3JtO1xyXG4gICAgLy8gcmV0dXJuIHJlZ0V4cFRyYW5zWC5leGVjKHRyYW5zZm9ybSlbMV07XHJcbiAgfVxyXG5cclxuICBzZXRXaWR0aChweCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHB4O1xyXG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcclxuICB9XHJcbiAgZ2V0V2lkdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICB9XHJcblxyXG4gIHNldENvbG9yKGNvbG9yKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICB9XHJcblxyXG4gIGdldENvbG9yKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvclllbGxvdygpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNGRkZGMDBcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkYwMFwiO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yUmVkKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0I2OUFFN1wiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjQjY5QUU3XCI7IC8v7ISg7YOd65CcIOu4lOuhnSA6IOu5qOqwlSAtPiDsl7Drs7TrnbxcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckRlZmF1bHQoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkY5RkIzXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjlGQjNcIjsgLy/quLDrs7gg67iU66GdOiDtjIzrnpEgLT4g7Jew7ZWR7YGsXHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yR3JlZW4oKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkY2Qzc3XCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjZDNzdcIjsgLy/soJXroKwg64Gd64KcIOu4lOuhnTog6re466awKOy0iOuhnSkgLT4g7LCQ7ZWR7YGsXHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCBQaXZvdCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclBpdm90KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiIzlGNzBGMVwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjOUY3MEYxXCI7IC8v7ZS867KXIOu4lOuhnSA6IO2Yleq0kSDtlZHtgawgLT4gIOywkOuztOudvFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6rK96rOE66W8IOuCmO2DgOuCtOuKlCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckJvdW5kYXJ5KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0Y1RTM0OFwiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRjVFMzQ4XCI7IC8vIOu4lOufrSDqsr3qs4QgOiDrs7TrnbwgLT4g64W4656RIFxyXG4gIH1cclxuXHJcbiAgc2V0VmFsdWUodmFsdWUpe1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgLy8g67iU66Gd7J2YIOy1nOuMgCDrhpLsnbTripQg7Luo7YWM7J2064SI7J2YIOuGkuydtCAtIDI0cHhcclxuICAgIGNvbnN0IG1heEhpZ2h0ID1cclxuICAgICAgTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpKSAtIDI0O1xyXG4gICAgbGV0IGJsb2NrSGlnaHQgPSB2YWx1ZSAqIDM7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBgJHtibG9ja0hpZ2h0IDwgbWF4SGlnaHQgPyBibG9ja0hpZ2h0IDogbWF4SGlnaHR9cHhgO1xyXG5cclxuICAgIHRoaXMuZG9tLmZpcnN0Q2hpbGQuaW5uZXJIVE1MID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXHJcbiAgZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XHJcblxyXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBjb250YWluZXIsXHJcbiAgICBibG9ja3MgPSBbXSxcclxuICAgIGRlbGF5ID0gMjAwLFxyXG4gICAgYW5pbWF0aW9uRGVsYXkgPSAyNTAsXHJcbiAgICBibG9ja1dpZHRoID0gMjgsXHJcbiAgICBibG9ja01hcmdpbiA9IDJcclxuICApIHtcclxuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgIC8vIOu4lOuhneydhCDsi5zqsIHtmZQg7ZWgIOy7qO2FjOydtOuEiCBET01cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XHJcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIC8vIOu4lOuhneydmCDrhIjruYRcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG5cclxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcclxuXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgfVxyXG5cclxuICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgc29ydCgpIHt9XHJcblxyXG4gIHdhaXQoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU3RvcCkge1xyXG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0b3AoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBjb250aW51ZSgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICB0aGlzLnN0ZXAoKTtcclxuICB9XHJcblxyXG4gIHN0ZXAoKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvbHZlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnJlc29sdmUoeyB0eXBlOiBcInN0ZXBcIiB9KTtcclxuICAgICAgdGhpcy5yZXNvbHZlID0gbnVsbDtcclxuICAgIH0gXHJcbiAgfVxyXG5cclxuICBzdGVwQmFjaygpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlKHtcclxuICAgICAgICAgIHR5cGU6IFwiYmFja1wiLFxyXG4gICAgICAgICAgbWVtZW50bzogdGhpcy5tZW1ldG9TdGFjay5wb3AoKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG5cclxuICBwdXNoTWVtZW50byggbWVtZW50bykge1xyXG4gICAgdGhpcy5tZW1ldG9TdGFjay5wdXNoKG1lbWVudG8pO1xyXG4gIH1cclxuXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXHJcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcclxuICAgIH1cclxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67iU66GdIOyDiSDstIjquLDtmZRcclxuXHJcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKTtcclxuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHRyYW5zWCk7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG51bGwpOyAvLyDruJTroZ3snZggRE9N7J2EIOy7qO2FjOydtOuEiOydmCDrp6gg64Gd7Jy866GcIOydtOuPmVxyXG5cclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICB9XHJcblxyXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7XHJcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG4gICAgLy8gd2lkdGg6TnVtYmVyXHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKSArIFwicHhcIjtcclxuXHJcbiAgICAvLyDruJTroZ0g7YGs6riwIOuwlOq+uOq4sFxyXG4gICAgdGhpcy5ibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxyXG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xyXG5cclxuICAgICAgY29uc3QgbmV3WCA9IGluZGV4ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XHJcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbihuZXdYKTtcclxuXHJcbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXHJcbiAgICAgIGJsb2NrLnNldFdpZHRoKGJsb2NrV2lkdGgpO1xyXG5cclxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRCbG9jayhibG9ja1ZhbHVlKSB7XHJcbiAgICAvLyDruJTroZ0g6rCc7IiYIOygnO2VnFxyXG4gICAgaWYgKHRoaXMuYmxvY2tzLmxlbmd0aCA+IDMwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayhcclxuICAgICAgYmxvY2tWYWx1ZSxcclxuICAgICAgdGhpcy5jb250YWluZXIsXHJcbiAgICAgIHRoaXMuYmxvY2tXaWR0aCxcclxuICAgICAgdGhpcy5ibG9ja01hcmdpblxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcclxuICAgICAgd2luZG93XHJcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXHJcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPVxyXG4gICAgICBwcmV2V2lkdGggKyAodGhpcy5ibG9ja1dpZHRoICsgdGhpcy5ibG9ja01hcmdpbikgKyBcInB4XCI7XHJcbiAgfVxyXG5cclxuICBzZXREZWxheShtaWxsaXMpIHtcclxuICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XHJcbiAgfVxyXG5cclxuICBzZXRBbmltYXRpb25EZWxheShtaWxsaXMpIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbih0aGlzLmFuaW1hdGlvbkRlbGF5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcclxuICByZWZyZXNoQmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcclxuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xyXG5cclxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xyXG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XHJcblxyXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcclxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxyXG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSBibG9ja3MuaW5kZXhPZihibG9jayk7XHJcblxyXG4gICAgLy8gZGVzdEluZGV47JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgY29uc3QgYmV0d2VlbnMgPSBibG9ja3MuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xyXG5cclxuICAgIC8vIHgg7KKM7ZGcXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrLmdldFhQb3NpdGlvbigpO1xyXG4gICAgY29uc3QgeFJlc3QgPSBiZXR3ZWVucy5tYXAoYiA9PiBiLmdldFhQb3NpdGlvbigpKTtcclxuXHJcbiAgICBibG9jay5zZXRYUG9zaXRpb24oeFJlc3RbMF0pO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XHJcbiAgICB9XHJcbiAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zZXRYUG9zaXRpb24oeDEpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2suaW5zZXJ0QmVmb3JlKGJldHdlZW5zWzBdKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcclxuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XHJcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cclxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XHJcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxyXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsp4TtlokgQnV0dG9uXHJcbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDrkqTroZwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcclxuXHJcbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXHJcbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XHJcblxyXG4vLyDsiqTthZ0g7YOA7J6FIFJhZGlvXHJcbmNvbnN0IHN0ZXBEZXRhaWxSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1kZXRhaWwtcmFkaW9cIik7XHJcbmNvbnN0IHN0ZXBTaW1wbGVSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1zaW1wbGUtcmFkaW9cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcclxuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbi8vIHNvcnQgdHlwZSByYWRpb+uhnCDrtoDthLAg6rCS7J2EIOydveyWtOyEnCBTb3J0IEFsZ29yaXRobeydhCDqsrDsoJVcclxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcclxuICBsZXQgU29ydEFsZ29yaXRobTtcclxuICBpZiAoYnViYmxlU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xyXG4gIH0gZWxzZSBpZiAoaW5zZXJ0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBJbnNlcnRpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xyXG4gIH0gZWxzZSBpZiAocXVpY2tTb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IFF1aWNrU29ydDtcclxuICB9XHJcbiAgcmV0dXJuIFNvcnRBbGdvcml0aG07XHJcbn1cclxuXHJcblxyXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIpO1xyXG5nZW5lcmF0ZVVuaXF1ZVZhbHVlcygpLmZvckVhY2godmFsdWUgPT4gc29ydC5hZGRCbG9jayh2YWx1ZSkpO1xyXG5cclxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XHJcbiAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG5cclxuICBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcclxufTtcclxuXHJcbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xyXG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcblxyXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxuLy8gfVxyXG5cclxuZGVsYXlJbnB1dEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7J6F66Cl6rCS7J20IOuylOychOulvCDrhJjslrTshJzrqbQg6rK96rOE6rCS7Jy866GcIOyEpOyglVxyXG4gIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPiBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XHJcbiAgfSBlbHNlIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPCBOdW1iZXIoZGVsYXlSYW5nZS5taW4pKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5taW47XHJcbiAgfVxyXG5cclxuICBjb25zdCBkZWxheSA9XHJcbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcclxuICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XHJcbn07XHJcblxyXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcclxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XHJcbiAgY29uc3Qgc2l6ZSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xyXG59O1xyXG5cclxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcclxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcclxuXHJcbiAgc29ydC5hZGRCbG9jayh2YWx1ZSk7XHJcbn07XHJcblxyXG5cclxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcclxuZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcclxuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxufVxyXG4vLyDsoJXroKzsnbQg64Gd64KcIO2bhCBJbnB1dOuTpOydhCDtmZzshLHtmZRcclxuZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcbnNvcnRCdG4ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICBkaXNhYmxlSW5wdXRzKCk7IC8vIOygleugrOydtCDsi5zsnpHrkKAg65WMIOu5hO2ZnOyEse2ZlFxyXG5cclxuICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xyXG5cclxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXHJcbiAgICBzb3J0LmNvbnRhaW5lcixcclxuICAgIHNvcnQuYmxvY2tzLFxyXG4gICAgc29ydC5kZWxheSxcclxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXHJcbiAgICBzb3J0LmJsb2NrV2lkdGgsXHJcbiAgICBzb3J0LmJsb2NrTWFyZ2luXHJcbiAgKTtcclxuXHJcbiAgc29ydC5zb3J0KCkudGhlbihlbmFibGVJbnB1dHMpXHJcbn07XHJcblxyXG5zb3J0U3RvcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdG9wKCk7XHJcbn07XHJcblxyXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuY29udGludWUoKTtcclxufTtcclxuXHJcbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0ZXAoKTtcclxufTtcclxuXHJcbnNvcnRTdGVwQmFja0J0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdGVwQmFjaygpO1xyXG59XHJcblxyXG5ibG9ja1NodWZmbGVCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc2h1ZmZsZSgpO1xyXG59O1xyXG4iXX0=
