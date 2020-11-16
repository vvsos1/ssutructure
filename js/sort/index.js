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

      await this.waitSimple();

      do {
        while (blocks[pl].getValue() < pivot.getValue()) pl++;
        while (blocks[pr].getValue() > pivot.getValue()) pr--;

        blocks[pl].setColorRed();
        blocks[pr].setColorRed();
        // pl 또는 pr이 pivot과 겹쳐도 pivot의 색을 유지
        pivot.setColorPivot();

        const { type, memento } = await this.waitDetail();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcblxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcblxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7KSB7XG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcblxuICAgIFxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgIFxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xuXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlMSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcbiAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwgYmxvY2tz7J2EIOyXheuNsOydtO2KuFxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgIGorPSAxO1xuICAgICAgfVxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxuICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgaSArPSAxXG4gICAgfVxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG4gICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47KSB7XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XG5cbiAgICAgIGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7KSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcbiAgICAgICAgICAvLyBUT0RPOiBcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xuICAgICAgICAgIGRlc3RJbmRleCA9IGo7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgais9MTtcbiAgICAgIH1cbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xuICAgICAgICAvLyBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcblxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG5cbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgUXVpY2tTb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQobGVmdCA9IDAsIHJpZ2h0ID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKSByZXR1cm47XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcblxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIGxldCBsc3RhY2sgPSBbXTtcbiAgICBsZXQgcnN0YWNrID0gW107XG5cbiAgICBsc3RhY2sucHVzaChsZWZ0KTtcbiAgICByc3RhY2sucHVzaChyaWdodCk7XG5cbiAgICB3aGlsZSAobHN0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICBsZXQgcGwgPSAobGVmdCA9IGxzdGFjay5wb3AoKSk7IC8vIOyZvOyqvSDsu6TshJxcbiAgICAgIGxldCBwciA9IChyaWdodCA9IHJzdGFjay5wb3AoKSk7IC8vIOyYpOuluOyqvSDsu6TshJxcbiAgICAgIGxldCBwaXZvdElkeCA9IE1hdGguY2VpbCgobGVmdCArIHJpZ2h0KSAvIDIpO1xuICAgICAgbGV0IHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTsgLy8g7ZS867KXXG5cbiAgICAgIC8vIO2YhOyerCDslYzqs6DrpqzsppjsnbQg67CU652867O064qUIOu4lOuhneuTpOydmCDsg4kg67OA6rK9XG4gICAgICBibG9ja3NcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JCb3VuZGFyeSgpKTtcbiAgICAgIC8vIO2UvOuyl+ydmCDsg4kg67OA6rK9XG4gICAgICBwaXZvdC5zZXRDb2xvclBpdm90KCk7XG5cbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xuICAgICAgICB3aGlsZSAoYmxvY2tzW3ByXS5nZXRWYWx1ZSgpID4gcGl2b3QuZ2V0VmFsdWUoKSkgcHItLTtcblxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGJsb2Nrc1twcl0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgLy8gcGwg65iQ64qUIHBy7J20IHBpdm906rO8IOqyueyzkOuPhCBwaXZvdOydmCDsg4nsnYQg7Jyg7KeAXG4gICAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcblxuICAgICAgICBjb25zdCB7IHR5cGUsIG1lbWVudG8gfSA9IGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xuXG4gICAgICAgIC8vIOyDge2DnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiKSB7XG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcbiAgICAgICAgICBwaXZvdCA9IGJsb2Nrc1twaXZvdElkeF07XG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDtmITsnqwg7IOB7YOc66W8IOyKpO2DneyXkCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7XG4gICAgICAgICAgcGwsXG4gICAgICAgICAgcHIsXG4gICAgICAgICAgcGl2b3RJZHgsXG4gICAgICAgICAgbGVmdCxcbiAgICAgICAgICByaWdodCxcbiAgICAgICAgICBsc3RhY2s6IFsuLi5sc3RhY2ssIHBsXSxcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcbiAgICAgICAgICBibG9ja3M6IFsuLi5ibG9ja3NdLm1hcCgoYmxvY2spID0+ICh7IC4uLmJsb2NrIH0pKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsIDw9IHByKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1twbCsrXSwgYmxvY2tzW3ByLS1dKTtcbiAgICAgICAgICAvLyBzd2FwKGJsb2NrcywgcGwrKywgcHItLSk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzW3BsIC0gMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xuICAgICAgICBibG9ja3NbcHIgKyAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XG4gICAgICB9IHdoaWxlIChwbCA8PSBwcik7XG5cbiAgICAgIGlmIChsZWZ0IDwgcHIpIHtcbiAgICAgICAgbHN0YWNrLnB1c2gobGVmdCk7XG4gICAgICAgIHJzdGFjay5wdXNoKHByKTtcbiAgICAgIH1cbiAgICAgIGlmIChwbCA8IHJpZ2h0KSB7XG4gICAgICAgIGxzdGFjay5wdXNoKHBsKTtcbiAgICAgICAgcnN0YWNrLnB1c2gocmlnaHQpO1xuICAgICAgfVxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDieydhCDsm5DrnpjrjIDroZwg67OA6rK9XG4gICAgICBibG9ja3NcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXG4gICAgICByZXR1cm47XG4gICAgXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcblxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG5cbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuICAgIGxldCBtaW47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xuICAgICAgbWluID0gaTtcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcblxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTsgLy/rs4DsiJgg7ISk7KCVXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQgIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTsgLy/rkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICB9XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67mo6rCE7IOJIOu4lOufreydhCDri6Tsi5wg7YyM656A7IOJ7Jy866GcXG4gICAgICAgIGogKz0gMTtcbiAgICAgIH1cbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICBpICs9IDE7XG4gICAgfVxuXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcblxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjbGFzcyBCbG9jayB7XG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLCBibG9ja1dpZHRoID0gMjgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XG4gICAgY29uc3QgeFBvc2l0aW9uID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG5cbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcblxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xuICBcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xuXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICB0aGlzLnNldFRyYW5zaXRpb25EdXJhdGlvbih0cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG5cbiAgICAvLyDtmZTrqbTsl5Ag67iU66GdIO2RnOyLnFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XG4gIH1cbiAgc3dhcEJsb2NrKGJsb2NrKSB7XG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gdGhpcy5kb20ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrLmRvbS5uZXh0U2libGluZztcblxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluc2VydEJlZm9yZShibG9jaykge1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBibG9jay5kb20pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPSBtaWxsaXM7XG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkge1xuICAgIC8vIHJldHVybiBOdW1iZXIoXG4gICAgLy8gICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIDApXG4gICAgLy8gKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XG4gIH1cblxuICBzZXRYUG9zaXRpb24oeCkge1xuICAgIHRoaXMueFBvc2l0aW9uID0geDtcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RoaXMueFBvc2l0aW9ufXB4KWA7XG4gIH1cblxuICBnZXRYUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xuICAgIC8vIGNvbnN0IHJlZ0V4cFRyYW5zWCA9IC9bXFx3XStcXChbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/KFtcXGRdKylbIF0/LFsgXT9bXFxkXStbIF0/XFwpLztcbiAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNmb3JtO1xuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xuICB9XG5cbiAgc2V0V2lkdGgocHgpIHtcbiAgICB0aGlzLndpZHRoID0gcHg7XG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcbiAgfVxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gIH1cblxuICBzZXRDb2xvclllbGxvdygpIHtcbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGRjAwXCI7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRjAwXCI7XG4gIH1cblxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yUmVkKCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiNCNjlBRTdcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNCNjlBRTdcIjsgLy/shKDtg53rkJwg67iU66GdIDog67mo6rCVIC0+IOyXsOuztOudvFxuICB9XG5cbiAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGOUZCM1wiO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGOUZCM1wiOyAvL+q4sOuzuCDruJTroZ06IO2MjOuekSAtPiDsl7DtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yR3JlZW4oKSB7XG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGNkM3N1wiO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNkM3N1wiOyAvL+ygleugrCDrgZ3rgpwg67iU66GdOiDqt7jrprAo7LSI66GdKSAtPiDssJDtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIFBpdm90IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclBpdm90KCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiM5RjcwRjFcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM5RjcwRjFcIjsgLy/tlLzrspcg67iU66GdIDog7ZiV6rSRIO2Vke2BrCAtPiAg7LCQ67O06528XG4gIH1cblxuICAvLyBibG9ja+ydhCDqsr3qs4Trpbwg64KY7YOA64K064qUIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckJvdW5kYXJ5KCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiNGNUUzNDhcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGNUUzNDhcIjsgLy8g67iU65+tIOqyveqzhCA6IOuztOudvCAtPiDrhbjrnpEgXG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZSl7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XG4gICAgY29uc3QgbWF4SGlnaHQgPVxuICAgICAgTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpKSAtIDI0O1xuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xuICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHQgPCBtYXhIaWdodCA/IGJsb2NrSGlnaHQgOiBtYXhIaWdodH1weGA7XG5cbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xuICB9XG5cbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgY29udGFpbmVyLFxuICAgIGJsb2NrcyA9IFtdLFxuICAgIGRlbGF5ID0gMjAwLFxuICAgIGFuaW1hdGlvbkRlbGF5ID0gMjUwLFxuICAgIGJsb2NrV2lkdGggPSAyOCxcbiAgICBibG9ja01hcmdpbiA9IDJcbiAgKSB7XG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcbiAgICAvLyDruJTroZ3snZgg64SI67mEXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcblxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuXG4gICAgLy8gU3RlcOydhCDsg4HshLjtnogg67O07Jes7KSMXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XG5cbiAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcbiAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcblxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcbiAgfVxuXG4gIC8vIOy2lOyDgSDrqZTshozrk5xcbiAgc29ydCgpIHt9XG5cbiAgd2FpdERldGFpbCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfREVUQUlMKSB7XG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IHJlc29sdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgd2FpdFNpbXBsZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfU0lNUExFKSB7XG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IHJlc29sdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XG4gIH1cblxuICBjb250aW51ZSgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xuICAgIHRoaXMuc3RlcCgpO1xuICB9XG5cbiAgc3RlcCgpIHtcbiAgICBpZiAodGhpcy5yZXNvbHZlRGV0YWlsICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlRGV0YWlsICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXNvbHZlRGV0YWlsKHsgdHlwZTogXCJzdGVwXCIgfSk7XG4gICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yZXNvbHZlU2ltcGxlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlU2ltcGxlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXNvbHZlU2ltcGxlKHsgdHlwZTogXCJzdGVwXCIgfSk7XG4gICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0ZXBCYWNrKCkge1xuICAgIGlmICh0aGlzLnJlc29sdmVEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVEZXRhaWwgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwoe1xuICAgICAgICAgIHR5cGU6IFwiYmFja1wiLFxuICAgICAgICAgIG1lbWVudG86IHRoaXMubWVtZXRvU3RhY2sucG9wKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnJlc29sdmVTaW1wbGUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVTaW1wbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBUT0RPIDogZGV0YWlsIOuwqeyLneydmCBzb3J0IHJvbGxiYWNrIOq1rO2YhFxuICAgICAgLy8gbGV0IG1lbWVudG87XG4gICAgICAvLyBkbyB7XG4gICAgICAvLyAgIG1lbWVudG8gPSB0aGlzLm1lbWV0b1N0YWNrLnBvcCgpO1xuICAgICAgLy8gfSB3aGlsZSAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCAmJiBtZW1lbnRvLnR5cGUgIT0gXCJzaW1wbGVcIik7XG5cbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSh7IHR5cGU6IFwiYmFja1wiLCBtZW1lbnRvOiBtZW1lbnRvIH0pO1xuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1c2hNZW1lbnRvKCBtZW1lbnRvKSB7XG4gICAgdGhpcy5tZW1ldG9TdGFjay5wdXNoKG1lbWVudG8pO1xuICB9XG5cbiAgc2V0U3RlcFR5cGVEZXRhaWwoKSB7XG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XG4gIH1cbiAgc2V0U3RlcFR5cGVTaW1wbGUoKSB7XG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9TSU1QTEU7XG4gIH1cblxuICBzaHVmZmxlKCkge1xuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICBmb3IgKGxldCBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcbiAgICB9XG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67iU66GdIOyDiSDstIjquLDtmZRcblxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XG5cbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pO1xuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHRyYW5zWCk7XG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBudWxsKTsgLy8g67iU66Gd7J2YIERPTeydhCDsu6jthYzsnbTrhIjsnZgg66eoIOuBneycvOuhnCDsnbTrj5lcblxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgfVxuXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7XG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XG4gICAgLy8gd2lkdGg6TnVtYmVyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcblxuICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XG5cbiAgICAvLyDruJTroZ0g7YGs6riwIOuwlOq+uOq4sFxuICAgIHRoaXMuYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcblxuICAgICAgY29uc3QgbmV3WCA9IGluZGV4ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XG4gICAgICBibG9jay5zZXRYUG9zaXRpb24obmV3WCk7XG5cbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXG4gICAgICBibG9jay5zZXRXaWR0aChibG9ja1dpZHRoKTtcblxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEJsb2NrKGJsb2NrVmFsdWUpIHtcbiAgICAvLyDruJTroZ0g6rCc7IiYIOygnO2VnFxuICAgIGlmICh0aGlzLmJsb2Nrcy5sZW5ndGggPiAzMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayhcbiAgICAgIGJsb2NrVmFsdWUsXG4gICAgICB0aGlzLmNvbnRhaW5lcixcbiAgICAgIHRoaXMuYmxvY2tXaWR0aCxcbiAgICAgIHRoaXMuYmxvY2tNYXJnaW5cbiAgICApO1xuXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XG4gICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKFxuICAgICAgd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcbiAgICApO1xuXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPVxuICAgICAgcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xuICB9XG5cbiAgc2V0RGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcbiAgfVxuXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xuICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PlxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRoaXMuYW5pbWF0aW9uRGVsYXkpXG4gICAgKTtcbiAgfVxuXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcbiAgcmVmcmVzaEJsb2NrcygpIHtcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG4gIH1cblxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxuICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXG5cbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcbiAgICBjb25zdCB4MiA9IGJsb2NrMi5nZXRYUG9zaXRpb24oKTtcblxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xuICAgIGJsb2NrMi5zZXRYUG9zaXRpb24oeDEpO1xuXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgYXdhaXQgYmxvY2sxLnN3YXBCbG9jayhibG9jazIpO1xuICB9XG5cbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxuICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYmxvY2tzLmluZGV4T2YoYmxvY2spO1xuXG4gICAgLy8gZGVzdEluZGV47JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxuICAgIGNvbnN0IGJldHdlZW5zID0gYmxvY2tzLmZpbHRlcigoXywgaSkgPT4gZGVzdEluZGV4IDw9IGkgJiYgaSA8IHRhcmdldEluZGV4KTtcblxuICAgIC8vIHgg7KKM7ZGcXG4gICAgY29uc3QgeDEgPSBibG9jay5nZXRYUG9zaXRpb24oKTtcbiAgICBjb25zdCB4UmVzdCA9IGJldHdlZW5zLm1hcChiID0+IGIuZ2V0WFBvc2l0aW9uKCkpO1xuXG4gICAgYmxvY2suc2V0WFBvc2l0aW9uKHhSZXN0WzBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XG4gICAgfVxuICAgIGJldHdlZW5zW2JldHdlZW5zLmxlbmd0aCAtIDFdLnNldFhQb3NpdGlvbih4MSk7XG5cbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICBhd2FpdCBibG9jay5pbnNlcnRCZWZvcmUoYmV0d2VlbnNbMF0pO1xuICB9XG59XG5cbi8vIOyEuOu2gOyggeycvOuhnCDrqqjrk6Ag64uo6rOEIO2RnOyLnFxuU29ydC5TVEVQX0RFVEFJTCA9IFN5bWJvbC5mb3IoXCJTVEVQX0RFVEFJTFwiKTtcbi8vIOu4lOuhnSDsnITsuZjqsIAg67CU64CM64qUIOuLqOqzhOunjCDtkZzsi5xcblNvcnQuU1RFUF9TSU1QTEUgPSBTeW1ib2wuZm9yKFwiU1RFUF9TSU1QTEVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XG5jb25zdCBRdWlja1NvcnQgPSByZXF1aXJlKFwiLi4vcXVpY2stc29ydC9RdWlja1NvcnRcIik7XG5cbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcblxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWJibGUtc29ydC1yYWRpb1wiKTtcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xuY29uc3QgcXVpY2tTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1aWNrLXNvcnQtcmFkaW9cIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcblxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dFxuY29uc3QgZGVsYXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0XCIpO1xuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cbmNvbnN0IGRlbGF5SW5wdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dC1idG5cIik7XG5cbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XG5cbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XG5cbi8vIOygleugrCDspJHsp4AgQnV0dG9uXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcblxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XG5cbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcblxuLy8g7KCV66CsIOuSpOuhnCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcblxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XG5cbi8vIOyKpO2FnSDtg4DsnoUgUmFkaW9cbmNvbnN0IHN0ZXBEZXRhaWxSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RlcC1kZXRhaWwtcmFkaW9cIik7XG5jb25zdCBzdGVwU2ltcGxlUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXAtc2ltcGxlLXJhZGlvXCIpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuLy8gc29ydCB0eXBlIHJhZGlv66GcIOu2gO2EsCDqsJLsnYQg7J297Ja07IScIFNvcnQgQWxnb3JpdGht7J2EIOqysOyglVxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcbiAgbGV0IFNvcnRBbGdvcml0aG07XG4gIGlmIChidWJibGVTb3J0UmFkaW8uY2hlY2tlZCkge1xuICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0O1xuICB9IGVsc2UgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcbiAgICBTb3J0QWxnb3JpdGhtID0gU2VsZWN0aW9uU29ydDtcbiAgfSBlbHNlIGlmIChxdWlja1NvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IFF1aWNrU29ydDtcbiAgfVxuICByZXR1cm4gU29ydEFsZ29yaXRobTtcbn1cblxuXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIpO1xuZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoKS5mb3JFYWNoKHZhbHVlID0+IHNvcnQuYWRkQmxvY2sodmFsdWUpKTtcblxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuXG4gIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxufTtcblxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG5cbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuLy8gICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xuLy8gfVxuXG5kZWxheUlucHV0QnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgLy8g7J6F66Cl6rCS7J20IOuylOychOulvCDrhJjslrTshJzrqbQg6rK96rOE6rCS7Jy866GcIOyEpOyglVxuICBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpID4gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSkge1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcbiAgfSBlbHNlIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPCBOdW1iZXIoZGVsYXlSYW5nZS5taW4pKSB7XG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xuICB9XG5cbiAgY29uc3QgZGVsYXkgPVxuICAgIE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pIC0gTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpO1xuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbiAgc29ydC5zZXREZWxheShkZWxheSk7XG4gIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxuICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XG59O1xuXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgY29uc29sZS5sb2coXCJzaXplOiBcIiArIHNpemUpO1xuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XG59O1xuXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcbiAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSBcIlwiKSByZXR1cm47XG5cbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcblxuICBzb3J0LmFkZEJsb2NrKHZhbHVlKTtcbn07XG5cbi8vIGlzU29ydFJ1bm5pbmfsnYAg7ZiE7J6sIOygleugrOydtCDsp4TtlonspJHsnbjsp4Ag7ZGc7Iuc7ZWY64qUIOuzgOyImC4gdHJ1ZeydtOuptCBzb3J0U3RhcnRCdG7snbQg64+Z7J6R7ZWY7KeAIOyViuuKlOuLpC5cbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XG5cbi8vIOygleugrCDrj4TspJHsl5QgSW5wdXTrk6TsnYQg67mE7Zmc7ISx7ZmUXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xufVxuLy8g7KCV66Cs7J20IOuBneuCnCDtm4QgSW5wdXTrk6TsnYQg7Zmc7ISx7ZmUXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XG5cbiAgZGlzYWJsZUlucHV0cygpOyAvLyDsoJXroKzsnbQg7Iuc7J6R65CgIOuVjCDruYTtmZzshLHtmZRcblxuICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xuXG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcbiAgICBzb3J0LmNvbnRhaW5lcixcbiAgICBzb3J0LmJsb2NrcyxcbiAgICBzb3J0LmRlbGF5LFxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXG4gICAgc29ydC5ibG9ja1dpZHRoLFxuICAgIHNvcnQuYmxvY2tNYXJnaW5cbiAgKTtcblxuICBzb3J0LnNvcnQoKS50aGVuKGVuYWJsZUlucHV0cylcbn07XG5cbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zdG9wKCk7XG59O1xuXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LmNvbnRpbnVlKCk7XG59O1xuXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIGlmIChzdGVwRGV0YWlsUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZURldGFpbCgpO1xuICBlbHNlIGlmIChzdGVwU2ltcGxlUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZVNpbXBsZSgpO1xuXG4gIHNvcnQuc3RlcCgpO1xufTtcblxuc29ydFN0ZXBCYWNrQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKHN0ZXBEZXRhaWxSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlRGV0YWlsKCk7XG4gIGVsc2UgaWYgKHN0ZXBTaW1wbGVSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlU2ltcGxlKCk7XG4gIHNvcnQuc3RlcEJhY2soKTtcbn1cblxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zaHVmZmxlKCk7XG59O1xuIl19
