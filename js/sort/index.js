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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBhd2FpdCB0aGlzLndhaXRTaW1wbGUoKTtcclxuXHJcbiAgICBcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICBcclxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xyXG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgais9IDE7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIGkgKz0gMVxyXG4gICAgfVxyXG4gICAgYmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOykge1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xyXG5cclxuICAgICAgY29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqKz0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgLy8gYXdhaXQgdGhpcy53YWl0RGV0YWlsKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xyXG5cclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgUXVpY2tTb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQobGVmdCA9IDAsIHJpZ2h0ID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZykgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICBsZXQgbHN0YWNrID0gW107XHJcbiAgICBsZXQgcnN0YWNrID0gW107XHJcblxyXG4gICAgbHN0YWNrLnB1c2gobGVmdCk7XHJcbiAgICByc3RhY2sucHVzaChyaWdodCk7XHJcblxyXG4gICAgd2hpbGUgKGxzdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICBsZXQgcGwgPSAobGVmdCA9IGxzdGFjay5wb3AoKSk7IC8vIOyZvOyqvSDsu6TshJxcclxuICAgICAgbGV0IHByID0gKHJpZ2h0ID0gcnN0YWNrLnBvcCgpKTsgLy8g7Jik66W47Kq9IOy7pOyEnFxyXG4gICAgICBsZXQgcGl2b3RJZHggPSBNYXRoLmNlaWwoKGxlZnQgKyByaWdodCkgLyAyKTtcclxuICAgICAgbGV0IHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTsgLy8g7ZS867KXXHJcblxyXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJIOuzgOqyvVxyXG4gICAgICBibG9ja3NcclxuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcclxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XHJcbiAgICAgIC8vIO2UvOuyl+ydmCDsg4kg67OA6rK9XHJcbiAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcclxuXHJcbiAgICAgIGF3YWl0IHRoaXMud2FpdFNpbXBsZSgpO1xyXG5cclxuICAgICAgZG8ge1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcHJdLmdldFZhbHVlKCkgPiBwaXZvdC5nZXRWYWx1ZSgpKSBwci0tO1xyXG5cclxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW3ByXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIC8vIHBsIOuYkOuKlCBwcuydtCBwaXZvdOqzvCDqsrnss5Drj4QgcGl2b3TsnZgg7IOJ7J2EIOycoOyngFxyXG4gICAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB0eXBlLCBtZW1lbnRvIH0gPSBhd2FpdCB0aGlzLndhaXREZXRhaWwoKTtcclxuXHJcbiAgICAgICAgLy8g7IOB7YOcIOuzteq1rFxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIikge1xyXG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTtcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIO2YhOyerCDsg4Htg5zrpbwg7Iqk7YOd7JeQIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe1xyXG4gICAgICAgICAgcGwsXHJcbiAgICAgICAgICBwcixcclxuICAgICAgICAgIHBpdm90SWR4LFxyXG4gICAgICAgICAgbGVmdCxcclxuICAgICAgICAgIHJpZ2h0LFxyXG4gICAgICAgICAgbHN0YWNrOiBbLi4ubHN0YWNrLCBwbF0sXHJcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcclxuICAgICAgICAgIGJsb2NrczogWy4uLmJsb2Nrc10ubWFwKChibG9jaykgPT4gKHsgLi4uYmxvY2sgfSkpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocGwgPD0gcHIpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbcGwrK10sIGJsb2Nrc1twci0tXSk7XHJcbiAgICAgICAgICAvLyBzd2FwKGJsb2NrcywgcGwrKywgcHItLSk7XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW3BsIC0gMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICAgIGJsb2Nrc1twciArIDFdLnNldENvbG9yQm91bmRhcnkoKTtcclxuICAgICAgfSB3aGlsZSAocGwgPD0gcHIpO1xyXG5cclxuICAgICAgaWYgKGxlZnQgPCBwcikge1xyXG4gICAgICAgIGxzdGFjay5wdXNoKGxlZnQpO1xyXG4gICAgICAgIHJzdGFjay5wdXNoKHByKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocGwgPCByaWdodCkge1xyXG4gICAgICAgIGxzdGFjay5wdXNoKHBsKTtcclxuICAgICAgICByc3RhY2sucHVzaChyaWdodCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDieydhCDsm5DrnpjrjIDroZwg67OA6rK9XHJcbiAgICAgIGJsb2Nrc1xyXG4gICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gbGVmdCA8PSBpZHggJiYgaWR4IDw9IHJpZ2h0KVxyXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBRdWlja1NvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuICAgIGxldCBtaW47XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcclxuICAgICAgbWluID0gaTtcclxuICAgICAgYXdhaXQgdGhpcy53YWl0U2ltcGxlKCk7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7IC8vIGkrMeuyiOu2gO2EsG4tMeuyiOq5jOyngOydmCDruJTrn63snYQg7LCo66GA64yA66GcIOu5qOqwhOyDieycvOuhnFxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdERldGFpbCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcclxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XHJcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTsgLy8g67iU65+tIOyytOyduOyngFxyXG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXHJcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCAg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruajqsITsg4kg67iU65+t7J2EIOuLpOyLnCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICBqICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XHJcbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0O1xyXG4iLCJjbGFzcyBCbG9jayB7XHJcbiAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcclxuICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lciwgYmxvY2tXaWR0aCA9IDI4LCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XHJcblxyXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgXHJcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xyXG5cclxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgIHRoaXMuc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcclxuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcblxyXG4gICAgLy8g7ZmU66m07JeQIOu4lOuhnSDtkZzsi5xcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgfVxyXG4gIHN3YXBCbG9jayhibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSB0aGlzLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jay5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG5leHRPZlRhcmdldDEpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluc2VydEJlZm9yZShibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgYmxvY2suZG9tKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XHJcbiAgICB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiA9IG1pbGxpcztcclxuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3RoaXMudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcclxuICB9XHJcblxyXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgIC8vIHJldHVybiBOdW1iZXIoXHJcbiAgICAvLyAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS50cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgMClcclxuICAgIC8vICk7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgfVxyXG5cclxuICBzZXRYUG9zaXRpb24oeCkge1xyXG4gICAgdGhpcy54UG9zaXRpb24gPSB4O1xyXG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLnhQb3NpdGlvbn1weClgO1xyXG4gIH1cclxuXHJcbiAgZ2V0WFBvc2l0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xyXG4gICAgLy8gY29uc3QgcmVnRXhwVHJhbnNYID0gL1tcXHddK1xcKFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT8oW1xcZF0rKVsgXT8sWyBdP1tcXGRdK1sgXT9cXCkvO1xyXG4gICAgLy8gY29uc3QgdHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zZm9ybTtcclxuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGgocHgpIHtcclxuICAgIHRoaXMud2lkdGggPSBweDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gYCR7dGhpcy53aWR0aH1weGA7XHJcbiAgfVxyXG4gIGdldFdpZHRoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcihjb2xvcikge1xyXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgfVxyXG5cclxuICBnZXRDb2xvcigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JZZWxsb3coKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGRjAwXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRkZGMDBcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclJlZCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNCNjlBRTdcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0I2OUFFN1wiOyAvL+yEoO2DneuQnCDruJTroZ0gOiDruajqsJUgLT4g7Jew67O06528XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGOUZCM1wiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY5RkIzXCI7IC8v6riw67O4IOu4lOuhnTog7YyM656RIC0+IOyXsO2Vke2BrFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckdyZWVuKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGNkM3N1wiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY2Qzc3XCI7IC8v7KCV66CsIOuBneuCnCDruJTroZ06IOq3uOumsCjstIjroZ0pIC0+IOywkO2Vke2BrFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQgUGl2b3Qg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JQaXZvdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiM5RjcwRjFcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzlGNzBGMVwiOyAvL+2UvOuylyDruJTroZ0gOiDtmJXqtJEg7ZWR7YGsIC0+ICDssJDrs7TrnbxcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOqyveqzhOulvCDrgpjtg4DrgrTripQg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JCb3VuZGFyeSgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNGNUUzNDhcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0Y1RTM0OFwiOyAvLyDruJTrn60g6rK96rOEIDog67O06528IC0+IOuFuOuekSBcclxuICB9XHJcblxyXG4gIHNldFZhbHVlKHZhbHVlKXtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XHJcbiAgICBjb25zdCBtYXhIaWdodCA9XHJcbiAgICAgIE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSAyNDtcclxuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gYCR7YmxvY2tIaWdodCA8IG1heEhpZ2h0ID8gYmxvY2tIaWdodCA6IG1heEhpZ2h0fXB4YDtcclxuXHJcbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gIGdldFZhbHVlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuL0Jsb2NrXCIpO1xyXG5cclxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXHJcbmNsYXNzIFNvcnQge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29udGFpbmVyLFxyXG4gICAgYmxvY2tzID0gW10sXHJcbiAgICBkZWxheSA9IDIwMCxcclxuICAgIGFuaW1hdGlvbkRlbGF5ID0gMjUwLFxyXG4gICAgYmxvY2tXaWR0aCA9IDI4LFxyXG4gICAgYmxvY2tNYXJnaW4gPSAyXHJcbiAgKSB7XHJcbiAgICAvLyDsoJXroKztlaAg64yA7IOB7J24IOu4lOuhneuTpFxyXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIC8vIOygleugrCDsiqTthZ0g7IKs7J20IOuUnOugiOydtFxyXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG4gICAgLy8g7KCV66Cs7J20IOupiOy2mCDsg4Htg5xcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICAvLyDruJTroZ3snZgg64SI67mEXHJcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xyXG4gICAgLy8g67iU66GdIOyCrOydtCDqsITqsqlcclxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcclxuXHJcbiAgICAvLyDsoJXroKzsnbQg7ZiE7J6sIOyLpO2WieykkeyduCDsg4Htg5xcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8vIFN0ZXDsnYQg7IOB7IS47Z6IIOuztOyXrOykjFxyXG4gICAgdGhpcy5zdGVwVHlwZSA9IFNvcnQuU1RFUF9ERVRBSUw7XHJcblxyXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcclxuXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgfVxyXG5cclxuICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgc29ydCgpIHt9XHJcblxyXG4gIHdhaXREZXRhaWwoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU3RvcCAmJiB0aGlzLnN0ZXBUeXBlID09IFNvcnQuU1RFUF9ERVRBSUwpIHtcclxuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxyXG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCA9IHJlc29sdmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSh7IHR5cGU6IFwiY29udGludWVcIiB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB3YWl0U2ltcGxlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3AgJiYgdGhpcy5zdGVwVHlwZSA9PSBTb3J0LlNURVBfU0lNUExFKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnRpbnVlKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RlcCgpO1xyXG4gIH1cclxuXHJcbiAgc3RlcCgpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmVEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVEZXRhaWwgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZURldGFpbCh7IHR5cGU6IFwic3RlcFwiIH0pO1xyXG4gICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnJlc29sdmVTaW1wbGUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmVTaW1wbGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSh7IHR5cGU6IFwic3RlcFwiIH0pO1xyXG4gICAgICB0aGlzLnJlc29sdmVTaW1wbGUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RlcEJhY2soKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvbHZlRGV0YWlsICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlRGV0YWlsICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZURldGFpbCh7XHJcbiAgICAgICAgICB0eXBlOiBcImJhY2tcIixcclxuICAgICAgICAgIG1lbWVudG86IHRoaXMubWVtZXRvU3RhY2sucG9wKClcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc29sdmVEZXRhaWwgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVzb2x2ZVNpbXBsZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZVNpbXBsZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgLy8gVE9ETyA6IGRldGFpbCDrsKnsi53snZggc29ydCByb2xsYmFjayDqtaztmIRcclxuICAgICAgLy8gbGV0IG1lbWVudG87XHJcbiAgICAgIC8vIGRvIHtcclxuICAgICAgLy8gICBtZW1lbnRvID0gdGhpcy5tZW1ldG9TdGFjay5wb3AoKTtcclxuICAgICAgLy8gfSB3aGlsZSAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCAmJiBtZW1lbnRvLnR5cGUgIT0gXCJzaW1wbGVcIik7XHJcblxyXG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSh7IHR5cGU6IFwiYmFja1wiLCBtZW1lbnRvOiBtZW1lbnRvIH0pO1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZVNpbXBsZSA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1c2hNZW1lbnRvKCBtZW1lbnRvKSB7XHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrLnB1c2gobWVtZW50byk7XHJcbiAgfVxyXG5cclxuICBzZXRTdGVwVHlwZURldGFpbCgpIHtcclxuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfREVUQUlMO1xyXG4gIH1cclxuICBzZXRTdGVwVHlwZVNpbXBsZSgpIHtcclxuICAgIHRoaXMuc3RlcFR5cGUgPSBTb3J0LlNURVBfU0lNUExFO1xyXG4gIH1cclxuXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXHJcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcclxuICAgIH1cclxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67iU66GdIOyDiSDstIjquLDtmZRcclxuXHJcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKTtcclxuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHRyYW5zWCk7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG51bGwpOyAvLyDruJTroZ3snZggRE9N7J2EIOy7qO2FjOydtOuEiOydmCDrp6gg64Gd7Jy866GcIOydtOuPmVxyXG5cclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICB9XHJcblxyXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7XHJcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG4gICAgLy8gd2lkdGg6TnVtYmVyXHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKSArIFwicHhcIjtcclxuXHJcbiAgICAvLyDruJTroZ0g7YGs6riwIOuwlOq+uOq4sFxyXG4gICAgdGhpcy5ibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxyXG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xyXG5cclxuICAgICAgY29uc3QgbmV3WCA9IGluZGV4ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XHJcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbihuZXdYKTtcclxuXHJcbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXHJcbiAgICAgIGJsb2NrLnNldFdpZHRoKGJsb2NrV2lkdGgpO1xyXG5cclxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRCbG9jayhibG9ja1ZhbHVlKSB7XHJcbiAgICAvLyDruJTroZ0g6rCc7IiYIOygnO2VnFxyXG4gICAgaWYgKHRoaXMuYmxvY2tzLmxlbmd0aCA+IDMwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayhcclxuICAgICAgYmxvY2tWYWx1ZSxcclxuICAgICAgdGhpcy5jb250YWluZXIsXHJcbiAgICAgIHRoaXMuYmxvY2tXaWR0aCxcclxuICAgICAgdGhpcy5ibG9ja01hcmdpblxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcclxuICAgICAgd2luZG93XHJcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXHJcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPVxyXG4gICAgICBwcmV2V2lkdGggKyAodGhpcy5ibG9ja1dpZHRoICsgdGhpcy5ibG9ja01hcmdpbikgKyBcInB4XCI7XHJcbiAgfVxyXG5cclxuICBzZXREZWxheShtaWxsaXMpIHtcclxuICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XHJcbiAgfVxyXG5cclxuICBzZXRBbmltYXRpb25EZWxheShtaWxsaXMpIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbih0aGlzLmFuaW1hdGlvbkRlbGF5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcclxuICByZWZyZXNoQmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcclxuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xyXG5cclxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xyXG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XHJcblxyXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcclxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxyXG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSBibG9ja3MuaW5kZXhPZihibG9jayk7XHJcblxyXG4gICAgLy8gZGVzdEluZGV47JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgY29uc3QgYmV0d2VlbnMgPSBibG9ja3MuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xyXG5cclxuICAgIC8vIHgg7KKM7ZGcXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrLmdldFhQb3NpdGlvbigpO1xyXG4gICAgY29uc3QgeFJlc3QgPSBiZXR3ZWVucy5tYXAoYiA9PiBiLmdldFhQb3NpdGlvbigpKTtcclxuXHJcbiAgICBibG9jay5zZXRYUG9zaXRpb24oeFJlc3RbMF0pO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XHJcbiAgICB9XHJcbiAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zZXRYUG9zaXRpb24oeDEpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2suaW5zZXJ0QmVmb3JlKGJldHdlZW5zWzBdKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIOyEuOu2gOyggeycvOuhnCDrqqjrk6Ag64uo6rOEIO2RnOyLnFxyXG5Tb3J0LlNURVBfREVUQUlMID0gU3ltYm9sLmZvcihcIlNURVBfREVUQUlMXCIpO1xyXG4vLyDruJTroZ0g7JyE7LmY6rCAIOuwlOuAjOuKlCDri6jqs4Trp4wg7ZGc7IucXHJcblNvcnQuU1RFUF9TSU1QTEUgPSBTeW1ib2wuZm9yKFwiU1RFUF9TSU1QTEVcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XHJcbmNvbnN0IEJ1YmJsZVNvcnQgPSByZXF1aXJlKFwiLi4vYnViYmxlLXNvcnQvQnViYmxlU29ydFwiKTtcclxuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0XCIpO1xyXG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XHJcbmNvbnN0IFF1aWNrU29ydCA9IHJlcXVpcmUoXCIuLi9xdWljay1zb3J0L1F1aWNrU29ydFwiKTtcclxuXHJcbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxyXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGEtY29udGFpbmVyXCIpO1xyXG5cclxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xyXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1YmJsZS1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBpbnNlcnRpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2VydGlvbi1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBxdWlja1NvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVpY2stc29ydC1yYWRpb1wiKTtcclxuXHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcclxuY29uc3QgZGVsYXlSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0aW9uLWRlbGF5LXJhbmdlXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dFxyXG5jb25zdCBkZWxheUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXRcIik7XHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXQgQnV0dG9uXHJcbmNvbnN0IGRlbGF5SW5wdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dC1idG5cIik7XHJcblxyXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxyXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XHJcblxyXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxyXG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xyXG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cclxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsi5zsnpEgQnV0dG9uXHJcbmNvbnN0IHNvcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOykkeyngCBCdXR0b25cclxuY29uc3Qgc29ydFN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RvcC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KeE7ZaJIEJ1dHRvblxyXG5jb25zdCBzb3J0Q29udGludWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtY29udGludWUtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyKpO2FnSBCdXR0b25cclxuY29uc3Qgc29ydFN0ZXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg65Kk66GcIOyKpO2FnSBCdXR0b25cclxuY29uc3Qgc29ydFN0ZXBCYWNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYmFjay1idG5cIik7XHJcblxyXG4vLyDruJTroZ0g7ISe6riwIEJ1dHRvblxyXG5jb25zdCBibG9ja1NodWZmbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2NrLXNodWZmbGUtYnRuXCIpO1xyXG5cclxuLy8g7Iqk7YWdIO2DgOyehSBSYWRpb1xyXG5jb25zdCBzdGVwRGV0YWlsUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXAtZGV0YWlsLXJhZGlvXCIpO1xyXG5jb25zdCBzdGVwU2ltcGxlUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXAtc2ltcGxlLXJhZGlvXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoY291bnQgPSAyMCkge1xyXG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xyXG4gIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgY291bnQpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY1ICsgMSk7XHJcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdmFsdWVzO1xyXG59XHJcblxyXG4vLyBzb3J0IHR5cGUgcmFkaW/roZwg67aA7YSwIOqwkuydhCDsnb3slrTshJwgU29ydCBBbGdvcml0aG3snYQg6rKw7KCVXHJcbmZ1bmN0aW9uIGdldFNvcnRBbGdvcml0aG0oKSB7XHJcbiAgbGV0IFNvcnRBbGdvcml0aG07XHJcbiAgaWYgKGJ1YmJsZVNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gQnViYmxlU29ydDtcclxuICB9IGVsc2UgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gSW5zZXJ0aW9uU29ydDtcclxuICB9IGVsc2UgaWYgKHNlbGVjdGlvblNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gU2VsZWN0aW9uU29ydDtcclxuICB9IGVsc2UgaWYgKHF1aWNrU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBRdWlja1NvcnQ7XHJcbiAgfVxyXG4gIHJldHVybiBTb3J0QWxnb3JpdGhtO1xyXG59XHJcblxyXG5cclxubGV0IHNvcnQgPSBuZXcgKGdldFNvcnRBbGdvcml0aG0oKSkoY29udGFpbmVyKTtcclxuZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoKS5mb3JFYWNoKHZhbHVlID0+IHNvcnQuYWRkQmxvY2sodmFsdWUpKTtcclxuXHJcbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xyXG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuXHJcbiAgZGVsYXlJbnB1dC52YWx1ZSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pLSBkZWxheTsgLy8gZGVsYXlJbnB1dOqzvCDqsJIg64+Z6riw7ZmUXHJcbn07XHJcblxyXG4vLyBkZWxheUlucHV0Lm9uaW5wdXQgPSBlID0+IHtcclxuLy8gICBjb25zdCBkZWxheSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgLSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG5cclxuLy8gICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuLy8gICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuLy8gICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcclxuLy8gICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XHJcbi8vIH1cclxuXHJcbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcclxuICBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpID4gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSkge1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWF4O1xyXG4gIH0gZWxzZSBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSkge1xyXG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGVsYXkgPVxyXG4gICAgTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSk7XHJcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbiAgc29ydC5zZXREZWxheShkZWxheSk7XHJcbiAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXHJcbiAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xyXG59O1xyXG5cclxuLy8gVE9ETzogU29ydC5zZXRCbG9ja1dpZHRoIOyZhOyEse2VnCDrkqQgc2l6ZSByYW5nZeydmCBpbnZpc2libGUg7ZKA6riwXHJcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xyXG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIGNvbnNvbGUubG9nKFwic2l6ZTogXCIgKyBzaXplKTtcclxuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn07XHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxyXG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICBzb3J0LmFkZEJsb2NrKHZhbHVlKTtcclxufTtcclxuXHJcbi8vIGlzU29ydFJ1bm5pbmfsnYAg7ZiE7J6sIOygleugrOydtCDsp4TtlonspJHsnbjsp4Ag7ZGc7Iuc7ZWY64qUIOuzgOyImC4gdHJ1ZeydtOuptCBzb3J0U3RhcnRCdG7snbQg64+Z7J6R7ZWY7KeAIOyViuuKlOuLpC5cclxubGV0IGlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuXHJcbi8vIOygleugrCDrj4TspJHsl5QgSW5wdXTrk6TsnYQg67mE7Zmc7ISx7ZmUXHJcbmZ1bmN0aW9uIGRpc2FibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICBzaXplUmFuZ2UuZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHNvcnRCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGJsb2NrU2h1ZmZsZUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbn1cclxuLy8g7KCV66Cs7J20IOuBneuCnCDtm4QgSW5wdXTrk6TsnYQg7Zmc7ISx7ZmUXHJcbmZ1bmN0aW9uIGVuYWJsZUlucHV0cygpIHtcclxuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICBzaXplUmFuZ2UuZGlzYWJsZWQgPSBmYWxzZTtcclxuICBzb3J0QnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGJsb2NrU2h1ZmZsZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG59XHJcblxyXG5zb3J0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuXHJcbiAgZGlzYWJsZUlucHV0cygpOyAvLyDsoJXroKzsnbQg7Iuc7J6R65CgIOuVjCDruYTtmZzshLHtmZRcclxuXHJcbiAgY29uc3QgU29ydEFsZ29yaXRobSA9IGdldFNvcnRBbGdvcml0aG0oKTtcclxuXHJcbiAgc29ydCA9IG5ldyBTb3J0QWxnb3JpdGhtKFxyXG4gICAgc29ydC5jb250YWluZXIsXHJcbiAgICBzb3J0LmJsb2NrcyxcclxuICAgIHNvcnQuZGVsYXksXHJcbiAgICBzb3J0LmFuaW1hdGlvbkRlbGF5LFxyXG4gICAgc29ydC5ibG9ja1dpZHRoLFxyXG4gICAgc29ydC5ibG9ja01hcmdpblxyXG4gICk7XHJcblxyXG4gIHNvcnQuc29ydCgpLnRoZW4oZW5hYmxlSW5wdXRzKVxyXG59O1xyXG5cclxuc29ydFN0b3BCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RvcCgpO1xyXG59O1xyXG5cclxuc29ydENvbnRpbnVlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LmNvbnRpbnVlKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgaWYgKHN0ZXBEZXRhaWxSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlRGV0YWlsKCk7XHJcbiAgZWxzZSBpZiAoc3RlcFNpbXBsZVJhZGlvLmNoZWNrZWQpIHNvcnQuc2V0U3RlcFR5cGVTaW1wbGUoKTtcclxuXHJcbiAgc29ydC5zdGVwKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJhY2tCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIGlmIChzdGVwRGV0YWlsUmFkaW8uY2hlY2tlZCkgc29ydC5zZXRTdGVwVHlwZURldGFpbCgpO1xyXG4gIGVsc2UgaWYgKHN0ZXBTaW1wbGVSYWRpby5jaGVja2VkKSBzb3J0LnNldFN0ZXBUeXBlU2ltcGxlKCk7XHJcbiAgc29ydC5zdGVwQmFjaygpO1xyXG59XHJcblxyXG5ibG9ja1NodWZmbGVCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc2h1ZmZsZSgpO1xyXG59O1xyXG4iXX0=
