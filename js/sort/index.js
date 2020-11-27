(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawPseudoCode(  
`
function bubbleSort(A, n) {
  for (let last = n; last <= 2; last--)
    for (let i = 1; i <= last - 1; i++)
      if (A[i] > A[i + 1])
        swap(A[i],A[i+1])
}`
    )
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
        blocks[j].setColorSelected();
        blocks[j + 1].setColorSelected();

       
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
          this.codeDefault();

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});
        
        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();

        this.codeHighlight(5);
        this.setDescription(`${value1}과 ${value2} 비교`);
        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        if (value1 > value2) {
          this.codeHighlight(6);
          this.setDescription(`${value1}과 ${value2} 변경`);
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
      blocks[n - i - 1].setColorSorted();
      this.setDescription(`${blocks[n-i-1].getValue()} 블록 정렬 완료`);
      i += 1
    }
    blocks[0].setColorSorted();
    this.isSortRunning = false;
  }
}

module.exports = BubbleSort;

},{"../sort/Sort":7}],2:[function(require,module,exports){
const Sort = require("../sort/Sort");

class InsertionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);

    this.drawPseudoCode(
`
function insertionSort(A, n) {
  for (let i = 2; i <= n; i++) {
    let key = A[i]
    let j = 0
    while (j < i && A[j] < key)
      j++
    shift(A,j,i) 
    A[j] = key 
  }
}`);
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

    blocks[0].setColorSorted();

    for (let i = 1; i < n;) {
      blocks[i].setColorSelected();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorSelected();

        this.setDescription(`${blocks[i].getValue()} 블록이 들어갈 위치를 탐색`);

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          this.codeDefault();
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

        this.codeHighlight(6,7);

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorSorted();
        if (value > target) {
          destIndex = j;
          break;
        }
        j+=1;
      }
      if (i != destIndex) {
        this.codeHighlight(8);
        blocks[destIndex].setColorSelected();

        await this.shift(destIndex, i);

        this.codeHighlight(9);
        if (destIndex != 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex-1].getValue()} 블록과 ${blocks[destIndex].getValue()} 블록의 사이에 삽입`);
        else if (destIndex == 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex].getValue()} 블록의 위치에 삽입`);

        await this.insertAt(blocks[i], destIndex);
        
        blocks[destIndex].setColorSorted();
      }
      else
        this.setDescription(`${blocks[i].getValue()} 블록의 위치 변경 없음`);
      blocks[i].setColorSorted();
      this.refreshBlocks();
      i += 1;
    }
    this.isSortRunning = false;
  }
}

module.exports = InsertionSort;

},{"../sort/Sort":7}],3:[function(require,module,exports){
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

        blocks[pl].setColorSelected();
        blocks[pr].setColorSelected();
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

},{"../sort/Sort":7}],4:[function(require,module,exports){
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
      blocks[i].setColorSelected(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n;) {
        blocks[j].setColorSelected(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        

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
      blocks[i].setColorSorted();
      i += 1;
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorSorted();

    this.isSortRunning = false;
  }
}
module.exports = SelectionSort;

},{"../sort/Sort":7}],5:[function(require,module,exports){
const Color = require('./Color');

class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container, blockWidth = 28, blockMargin = 2) {
    const blockCount = Array.from(container.children).filter(dom => dom.classList.contains('block')).length;
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

  // block을 선택된 블록의 색으로 바꾸는 함수
  setColorSelected() {
    this.color = Color.selected;
    this.dom.style.backgroundColor = this.color; //선택된 블록 : 빨강 -> 연보라
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.color = Color.defaultColor;
    this.dom.style.backgroundColor = this.color; //기본 블록: 파랑 -> 연핑크
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorSorted() {
    this.color = Color.sorted;
    this.dom.style.backgroundColor = this.color; //정렬 끝난 블록: 그린(초록) -> 찐핑크
  }

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot() {
    this.color = Color.pivot;
    this.dom.style.backgroundColor = this.color; //피벗 블록 : 형광 핑크 ->  찐보라
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary() {
    this.color = Color.boundary;
    this.dom.style.backgroundColor = this.color; // 블럭 경계 : 보라 -> 노랑 
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

},{"./Color":6}],6:[function(require,module,exports){


// 기본 블록 색상
const defaultColor = "#FF9FB3";

// 블록이 선택되었을 때 색상
const selected = "#B69AE7";

// 정렬이 끝난 블록의 색상
const sorted = "#FF6C77";

// Pivot 블록의 색상 (Quick Sort에서의 Pivot)
const pivot = "#9F70F1";

// Quick Sort에서 Partition 함수의 대상인 블록들의 색상
const boundary = "#F5E348";

module.exports = {
    defaultColor,
    selected,
    sorted,
    pivot,
    boundary
}
},{}],7:[function(require,module,exports){
const Block = require("./Block");

// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(
    container,
    blocks = [],
    delay = 200,
    animationDelay = 250,
    blockWidth = 28,
    blockMargin = 2,
    description
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

    this.description = description;

    // 정렬이 현재 실행중인 상태
    this.isSortRunning = false;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);

    this.memetoStack = [];
  }

  // 수도 코드 문자열을 받아서 시각화 컨테이너 우측에 보여줌
  drawPseudoCode(pseudoCode){
    const pseudoCodeContainer = document.querySelector(".pseudo-code-container");
    // 기존에 있던 수도코드 삭제
    Array.from(pseudoCodeContainer.children).forEach(child=>child.remove());
    pseudoCodeContainer.innerHTML = "";
    
    // 줄별로
    pseudoCode.split('\n').map(line => {
      pseudoCodeContainer.innerHTML += `<code>${line}</code>${'\n'}`
    })

  }

  // 추상 메소드
  sort() {}

  wait() {
    return new Promise((resolve) => {
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
          memento: this.memetoStack.pop(),
        });
        this.resolve = null;
      }
    }
  }

  // 시각화된 수도 코드의 하이라이트를 없앰
  codeDefault(){
    const pseudoCodeContainer = document.querySelector(".pseudo-code-container");

    const children = pseudoCodeContainer.children;

    for(let i = 0; i < children.length; i++) {
      children[i].style.color = '';
    }
  }

  // 시각화된 수도 코드의 특정 줄을 하이라이트
  codeHighlight(...line) {
    const pseudoCodeContainer = document.querySelector(".pseudo-code-container");

    const children = pseudoCodeContainer.children;

    for(let i = 0; i < children.length; i++) {
      children[i].style.color = '';
    }

    for (let mango = 0; mango < line.length; mango++) {
      const codeElement = children[line[mango]-1];
      codeElement.style.color = "#B69AE7";
    }
  }

  pushMemento(memento) {
    this.memetoStack.push(memento);
  }

  shuffle() {

    this.setDescription("");
    
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

  // 현재 시각화되는 단계의 설명 설정
  // 시각화 컨테이너 하단에 표시됨
  setDescription(text) {
    if (this.description === undefined) {
      this.description = document.createElement("div");
      this.description.classList.add("sort-description");
      this.container.appendChild(this.description);
    }
    
    this.description.innerHTML = "";
    this.description.innerHTML = text;
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
    this.blocks.forEach((block) =>
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

  // target을 destIndex 자리에 넣는 함수 
  // target은 항상 destIndex보다 뒤에 있어야함
  async insertAt(block, destIndex) {
    const blocks = this.blocks;

    block.setXPosition(destIndex *  (this.blockWidth+this.blockMargin));

    // 애니메이션이 끝나기를 기다림.
    await block.insertBefore(blocks[destIndex]);
  }

  // start 인덱스부터 end 인덱스까지 block 한 칸씩 미는 함수 
  async shift (start, end) {
    const blocks = this.blocks;

    const betweens = blocks.filter((_, i) => start <= i && i < end);

    const  xRest = betweens.map(b => b.getXPosition());
    for (let i = 0; i < betweens.length - 1; i++) {
      betweens[i].setXPosition(xRest[i + 1]);
    }
    blocks[end-1].setXPosition(blocks[end].getXPosition());
    

    await new Promise(res => setTimeout(res, blocks[0].getTransitionDuration()));
  }
}


module.exports = Sort;

},{"./Block":5}],8:[function(require,module,exports){
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

// Sort 알고리즘 클래스를 받아서 정렬을 시
const makeSortRadioOnchange = SortAlgorithm => () => {
  sort = new SortAlgorithm(
    sort.container,
    sort.blocks,
    sort.delay,
    sort.animationDelay,
    sort.blockWidth,
    sort.blockMargin,
    sort.description
  );
};


bubbleSortRadio.onchange = makeSortRadioOnchange(BubbleSort);
insertionSortRadio.onchange = makeSortRadioOnchange(InsertionSort);
selectionSortRadio.onchange = makeSortRadioOnchange(SelectionSort);
quickSortRadio.onchange = makeSortRadioOnchange(QuickSort);


let sort = new BubbleSort(container);
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

delayInput.onkeydown = e => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // delayInputBtn에 click 이벤트 트리거
    delayInputBtn.click();
}
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

newDataInput.onkeydown = e => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // newDataAddBtn에 click 이벤트 트리거
    newDataAddBtn.click();
}

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

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../quick-sort/QuickSort":3,"../selection-sort/SelectionSort":4,"../sort/Block":5}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvQ29sb3IuanMiLCJzcmMvc29ydC9Tb3J0LmpzIiwic3JjL3NvcnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcclxuYFxyXG5mdW5jdGlvbiBidWJibGVTb3J0KEEsIG4pIHtcclxuICBmb3IgKGxldCBsYXN0ID0gbjsgbGFzdCA8PSAyOyBsYXN0LS0pXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBsYXN0IC0gMTsgaSsrKVxyXG4gICAgICBpZiAoQVtpXSA+IEFbaSArIDFdKVxyXG4gICAgICAgIHN3YXAoQVtpXSxBW2krMV0pXHJcbn1gXHJcbiAgICApXHJcbiAgfVxyXG4gIFxyXG4gIFxyXG5cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcblxyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgLy8g7IKs7Jqp7J6Q6rCAIOuLpOydjCDsiqTthZ3snLzroZwg64SY7Ja06rCA6riwIOyghCDquYzsp4AodGhpcy5jb250aW51ZSgpIG9yIHRoaXMuc3RlcCgpKSDquLDri6TrprxcclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5jb2RlRGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg1KTtcclxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOu5hOq1kGApO1xyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcclxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcclxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7dmFsdWUxfeqzvCAke3ZhbHVlMn0g67OA6rK9YCk7XHJcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG4gICAgICAgICAgLy8g65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ydhCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBqKz0gMTtcclxuICAgICAgfVxyXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yU29ydGVkKCk7XHJcbiAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW24taS0xXS5nZXRWYWx1ZSgpfSDruJTroZ0g7KCV66CsIOyZhOujjGApO1xyXG4gICAgICBpICs9IDFcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvclNvcnRlZCgpO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgSW5zZXJ0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcblxyXG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZShcclxuYFxyXG5mdW5jdGlvbiBpbnNlcnRpb25Tb3J0KEEsIG4pIHtcclxuICBmb3IgKGxldCBpID0gMjsgaSA8PSBuOyBpKyspIHtcclxuICAgIGxldCBrZXkgPSBBW2ldXHJcbiAgICBsZXQgaiA9IDBcclxuICAgIHdoaWxlIChqIDwgaSAmJiBBW2pdIDwga2V5KVxyXG4gICAgICBqKytcclxuICAgIHNoaWZ0KEEsaixpKSBcclxuICAgIEFbal0gPSBrZXkgXHJcbiAgfVxyXG59YCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG5cclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvclNvcnRlZCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjspIHtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yU2VsZWN0ZWQoKTtcclxuXHJcbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xyXG5cclxuICAgICAgY29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yU2VsZWN0ZWQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J20IOuTpOyWtOqwiCDsnITsuZjrpbwg7YOQ7IOJYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNiw3KTtcclxuXHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yU29ydGVkKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGorPTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGkgIT0gZGVzdEluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDgpO1xyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yU2VsZWN0ZWQoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaGlmdChkZXN0SW5kZXgsIGkpO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XHJcbiAgICAgICAgaWYgKGRlc3RJbmRleCAhPSAwKVxyXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleC0xXS5nZXRWYWx1ZSgpfSDruJTroZ3qs7wgJHtibG9ja3NbZGVzdEluZGV4XS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7IKs7J207JeQIOyCveyehWApO1xyXG4gICAgICAgIGVsc2UgaWYgKGRlc3RJbmRleCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleF0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOychOy5mOyXkCDsgr3snoVgKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JTb3J0ZWQoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOychOy5mCDrs4Dqsr0g7JeG7J2MYCk7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNvcnRlZCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgUXVpY2tTb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQobGVmdCA9IDAsIHJpZ2h0ID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZykgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICBsZXQgbHN0YWNrID0gW107XHJcbiAgICBsZXQgcnN0YWNrID0gW107XHJcblxyXG4gICAgbHN0YWNrLnB1c2gobGVmdCk7XHJcbiAgICByc3RhY2sucHVzaChyaWdodCk7XHJcblxyXG4gICAgd2hpbGUgKGxzdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICBsZXQgcGwgPSAobGVmdCA9IGxzdGFjay5wb3AoKSk7IC8vIOyZvOyqvSDsu6TshJxcclxuICAgICAgbGV0IHByID0gKHJpZ2h0ID0gcnN0YWNrLnBvcCgpKTsgLy8g7Jik66W47Kq9IOy7pOyEnFxyXG4gICAgICBsZXQgcGl2b3RJZHggPSBNYXRoLmNlaWwoKGxlZnQgKyByaWdodCkgLyAyKTtcclxuICAgICAgbGV0IHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTsgLy8g7ZS867KXXHJcblxyXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJIOuzgOqyvVxyXG4gICAgICBibG9ja3NcclxuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcclxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XHJcbiAgICAgIC8vIO2UvOuyl+ydmCDsg4kg67OA6rK9XHJcbiAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcclxuXHJcbiAgICAgIGRvIHtcclxuICAgICAgICB3aGlsZSAoYmxvY2tzW3BsXS5nZXRWYWx1ZSgpIDwgcGl2b3QuZ2V0VmFsdWUoKSkgcGwrKztcclxuICAgICAgICB3aGlsZSAoYmxvY2tzW3ByXS5nZXRWYWx1ZSgpID4gcGl2b3QuZ2V0VmFsdWUoKSkgcHItLTtcclxuXHJcbiAgICAgICAgYmxvY2tzW3BsXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcbiAgICAgICAgYmxvY2tzW3ByXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcbiAgICAgICAgLy8gcGwg65iQ64qUIHBy7J20IHBpdm906rO8IOqyueyzkOuPhCBwaXZvdOydmCDsg4nsnYQg7Jyg7KeAXHJcbiAgICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHR5cGUsIG1lbWVudG8gfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG5cclxuICAgICAgICAvLyDsg4Htg5wg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiKSB7XHJcbiAgICAgICAgICAoeyBsc3RhY2ssIHJzdGFjaywgcGwsIHByLCBsZWZ0LCByaWdodCwgcGl2b3RJZHggfSA9IG1lbWVudG8pO1xyXG4gICAgICAgICAgcGl2b3QgPSBibG9ja3NbcGl2b3RJZHhdO1xyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IGNvbG9yLCB4UG9zaXRpb24sIHZhbHVlLCB3aWR0aCB9ID0gcHJldkJsb2NrO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g7ZiE7J6sIOyDge2DnOulvCDsiqTtg53sl5Ag7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7XHJcbiAgICAgICAgICBwbCxcclxuICAgICAgICAgIHByLFxyXG4gICAgICAgICAgcGl2b3RJZHgsXHJcbiAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgICAgcmlnaHQsXHJcbiAgICAgICAgICBsc3RhY2s6IFsuLi5sc3RhY2ssIHBsXSxcclxuICAgICAgICAgIHJzdGFjazogWy4uLnJzdGFjaywgcHJdLFxyXG4gICAgICAgICAgYmxvY2tzOiBbLi4uYmxvY2tzXS5tYXAoKGJsb2NrKSA9PiAoeyAuLi5ibG9jayB9KSksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChwbCA8PSBwcikge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1twbCsrXSwgYmxvY2tzW3ByLS1dKTtcclxuICAgICAgICAgIC8vIHN3YXAoYmxvY2tzLCBwbCsrLCBwci0tKTtcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBibG9ja3NbcGwgLSAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgICAgYmxvY2tzW3ByICsgMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICB9IHdoaWxlIChwbCA8PSBwcik7XHJcblxyXG4gICAgICBpZiAobGVmdCA8IHByKSB7XHJcbiAgICAgICAgbHN0YWNrLnB1c2gobGVmdCk7XHJcbiAgICAgICAgcnN0YWNrLnB1c2gocHIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwbCA8IHJpZ2h0KSB7XHJcbiAgICAgICAgbHN0YWNrLnB1c2gocGwpO1xyXG4gICAgICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJ7J2EIOybkOuemOuMgOuhnCDrs4Dqsr1cclxuICAgICAgYmxvY2tzXHJcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXHJcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG5cclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBsZXQgbWluO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7KSB7XHJcbiAgICAgIG1pbiA9IGk7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNlbGVjdGVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbjspIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcclxuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcclxuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xyXG4gICAgICAgICAgLy8gVE9ETzogXHJcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XHJcblxyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvC8vXHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTsgLy/rs4DsiJgg7ISk7KCVXHJcbiAgICAgICAgbGV0IHZhbHVlMiA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZTEgPj0gdmFsdWUyKSBtaW4gPSBqO1xyXG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7IC8vIOu4lOufrSDssrTsnbjsp4BcclxuICAgICAgICAgIG1pbiA9IGk7IC8vIG1pbuqwkuy0iOq4sO2ZlFxyXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQgIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3Prpbwg7JeF642w7J207Yq4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67mo6rCE7IOJIOu4lOufreydhCDri6Tsi5wg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgICAgaiArPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNvcnRlZCgpO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cclxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JTb3J0ZWQoKTtcclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0O1xyXG4iLCJjb25zdCBDb2xvciA9IHJlcXVpcmUoJy4vQ29sb3InKTtcclxuXHJcbmNsYXNzIEJsb2NrIHtcclxuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxyXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLCBibG9ja1dpZHRoID0gMjgsIGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkcmVuKS5maWx0ZXIoZG9tID0+IGRvbS5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrJykpLmxlbmd0aDtcclxuICAgIGNvbnN0IHhQb3NpdGlvbiA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEJsb2NrKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgYmxvY2tXaWR0aCk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcih2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sICB3aWR0aCx0cmFuc2l0aW9uRHVyYXRpb249MjAwKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcblxyXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuXHJcbiAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcclxuICBcclxuICAgIHRoaXMuZG9tID0gYmxvY2s7XHJcblxyXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB0aGlzLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgdGhpcy5zZXRUcmFuc2l0aW9uRHVyYXRpb24odHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgdGhpcy5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuXHJcbiAgICAvLyDtmZTrqbTsl5Ag67iU66GdIO2RnOyLnFxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcclxuICB9XHJcbiAgc3dhcEJsb2NrKGJsb2NrKSB7XHJcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IHRoaXMuZG9tLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrLmRvbS5uZXh0U2libGluZztcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIG5leHRPZlRhcmdldDIpO1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0QmVmb3JlKGJsb2NrKSB7XHJcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBibG9jay5kb20pO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFRyYW5zaXRpb25EdXJhdGlvbihtaWxsaXMpIHtcclxuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gbWlsbGlzO1xyXG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xyXG4gIH1cclxuXHJcbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkge1xyXG4gICAgLy8gcmV0dXJuIE51bWJlcihcclxuICAgIC8vICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCAwKVxyXG4gICAgLy8gKTtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICB9XHJcblxyXG4gIHNldFhQb3NpdGlvbih4KSB7XHJcbiAgICB0aGlzLnhQb3NpdGlvbiA9IHg7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RoaXMueFBvc2l0aW9ufXB4KWA7XHJcbiAgfVxyXG5cclxuICBnZXRYUG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy54UG9zaXRpb247XHJcbiAgICAvLyBjb25zdCByZWdFeHBUcmFuc1ggPSAvW1xcd10rXFwoWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdPyhbXFxkXSspWyBdPyxbIF0/W1xcZF0rWyBdP1xcKS87XHJcbiAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNmb3JtO1xyXG4gICAgLy8gcmV0dXJuIHJlZ0V4cFRyYW5zWC5leGVjKHRyYW5zZm9ybSlbMV07XHJcbiAgfVxyXG5cclxuICBzZXRXaWR0aChweCkge1xyXG4gICAgdGhpcy53aWR0aCA9IHB4O1xyXG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcclxuICB9XHJcbiAgZ2V0V2lkdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICB9XHJcblxyXG4gIHNldENvbG9yKGNvbG9yKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICB9XHJcblxyXG4gIGdldENvbG9yKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JTZWxlY3RlZCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBDb2xvci5zZWxlY3RlZDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7ISg7YOd65CcIOu4lOuhnSA6IOu5qOqwlSAtPiDsl7Drs7TrnbxcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckRlZmF1bHQoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gQ29sb3IuZGVmYXVsdENvbG9yO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy/quLDrs7gg67iU66GdOiDtjIzrnpEgLT4g7Jew7ZWR7YGsXHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yU29ydGVkKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnNvcnRlZDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7KCV66CsIOuBneuCnCDruJTroZ06IOq3uOumsCjstIjroZ0pIC0+IOywkO2Vke2BrFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQgUGl2b3Qg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JQaXZvdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBDb2xvci5waXZvdDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7ZS867KXIOu4lOuhnSA6IO2Yleq0kSDtlZHtgawgLT4gIOywkOuztOudvFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6rK96rOE66W8IOuCmO2DgOuCtOuKlCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckJvdW5kYXJ5KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IENvbG9yLmJvdW5kYXJ5O1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy8g67iU65+tIOqyveqzhCA6IOuztOudvCAtPiDrhbjrnpEgXHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAvLyDruJTroZ3snZgg7LWc64yAIOuGkuydtOuKlCDsu6jthYzsnbTrhIjsnZgg64aS7J20IC0gMjRweFxyXG4gICAgY29uc3QgbWF4SGlnaHQgPVxyXG4gICAgICBOdW1iZXIod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpLmhlaWdodC5yZXBsYWNlKFwicHhcIiwgXCJcIikpIC0gMjQ7XHJcbiAgICBsZXQgYmxvY2tIaWdodCA9IHZhbHVlICogMztcclxuICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHQgPCBtYXhIaWdodCA/IGJsb2NrSGlnaHQgOiBtYXhIaWdodH1weGA7XHJcblxyXG4gICAgdGhpcy5kb20uZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcclxuICBnZXRWYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiXHJcblxyXG4vLyDquLDrs7gg67iU66GdIOyDieyDgVxyXG5jb25zdCBkZWZhdWx0Q29sb3IgPSBcIiNGRjlGQjNcIjtcclxuXHJcbi8vIOu4lOuhneydtCDshKDtg53rkJjsl4jsnYQg65WMIOyDieyDgVxyXG5jb25zdCBzZWxlY3RlZCA9IFwiI0I2OUFFN1wiO1xyXG5cclxuLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7IOBXHJcbmNvbnN0IHNvcnRlZCA9IFwiI0ZGNkM3N1wiO1xyXG5cclxuLy8gUGl2b3Qg67iU66Gd7J2YIOyDieyDgSAoUXVpY2sgU29ydOyXkOyEnOydmCBQaXZvdClcclxuY29uc3QgcGl2b3QgPSBcIiM5RjcwRjFcIjtcclxuXHJcbi8vIFF1aWNrIFNvcnTsl5DshJwgUGFydGl0aW9uIO2VqOyImOydmCDrjIDsg4Hsnbgg67iU66Gd65Ok7J2YIOyDieyDgVxyXG5jb25zdCBib3VuZGFyeSA9IFwiI0Y1RTM0OFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBkZWZhdWx0Q29sb3IsXHJcbiAgICBzZWxlY3RlZCxcclxuICAgIHNvcnRlZCxcclxuICAgIHBpdm90LFxyXG4gICAgYm91bmRhcnlcclxufSIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XHJcblxyXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBjb250YWluZXIsXHJcbiAgICBibG9ja3MgPSBbXSxcclxuICAgIGRlbGF5ID0gMjAwLFxyXG4gICAgYW5pbWF0aW9uRGVsYXkgPSAyNTAsXHJcbiAgICBibG9ja1dpZHRoID0gMjgsXHJcbiAgICBibG9ja01hcmdpbiA9IDIsXHJcbiAgICBkZXNjcmlwdGlvblxyXG4gICkge1xyXG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAvLyDsoJXroKwg7Iqk7YWdIOyCrOydtCDrlJzroIjsnbRcclxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcclxuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIC8vIOu4lOuhnSDsgqzsnbQg6rCE6rKpXHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XHJcblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG5cclxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcclxuXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgfVxyXG5cclxuICAvLyDsiJjrj4Qg7L2U65OcIOusuOyekOyXtOydhCDrsJvslYTshJwg7Iuc6rCB7ZmUIOy7qO2FjOydtOuEiCDsmrDsuKHsl5Ag67O07Jes7KSMXHJcbiAgZHJhd1BzZXVkb0NvZGUocHNldWRvQ29kZSl7XHJcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XHJcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyImOuPhOy9lOuTnCDsgq3soJxcclxuICAgIEFycmF5LmZyb20ocHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbikuZm9yRWFjaChjaGlsZD0+Y2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgXHJcbiAgICAvLyDspITrs4TroZxcclxuICAgIHBzZXVkb0NvZGUuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcclxuICAgICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxjb2RlPiR7bGluZX08L2NvZGU+JHsnXFxuJ31gXHJcbiAgICB9KVxyXG5cclxuICB9XHJcblxyXG4gIC8vIOy2lOyDgSDrqZTshozrk5xcclxuICBzb3J0KCkge31cclxuXHJcbiAgd2FpdCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3ApIHtcclxuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSh7IHR5cGU6IFwiY29udGludWVcIiB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdG9wKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgY29udGludWUoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zdGVwKCk7XHJcbiAgfVxyXG5cclxuICBzdGVwKCkge1xyXG4gICAgaWYgKHRoaXMucmVzb2x2ZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlKHsgdHlwZTogXCJzdGVwXCIgfSk7XHJcbiAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGVwQmFjaygpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlKHtcclxuICAgICAgICAgIHR5cGU6IFwiYmFja1wiLFxyXG4gICAgICAgICAgbWVtZW50bzogdGhpcy5tZW1ldG9TdGFjay5wb3AoKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDsi5zqsIHtmZTrkJwg7IiY64+EIOy9lOuTnOydmCDtlZjsnbTrnbzsnbTtirjrpbwg7JeG7JWwXHJcbiAgY29kZURlZmF1bHQoKXtcclxuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW47XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDsi5zqsIHtmZTrkJwg7IiY64+EIOy9lOuTnOydmCDtirnsoJUg7KSE7J2EIO2VmOydtOudvOydtO2KuFxyXG4gIGNvZGVIaWdobGlnaHQoLi4ubGluZSkge1xyXG4gICAgY29uc3QgcHNldWRvQ29kZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHNldWRvLWNvZGUtY29udGFpbmVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gcHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbjtcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY2hpbGRyZW5baV0uc3R5bGUuY29sb3IgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBtYW5nbyA9IDA7IG1hbmdvIDwgbGluZS5sZW5ndGg7IG1hbmdvKyspIHtcclxuICAgICAgY29uc3QgY29kZUVsZW1lbnQgPSBjaGlsZHJlbltsaW5lW21hbmdvXS0xXTtcclxuICAgICAgY29kZUVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNCNjlBRTdcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1c2hNZW1lbnRvKG1lbWVudG8pIHtcclxuICAgIHRoaXMubWVtZXRvU3RhY2sucHVzaChtZW1lbnRvKTtcclxuICB9XHJcblxyXG4gIHNodWZmbGUoKSB7XHJcblxyXG4gICAgdGhpcy5zZXREZXNjcmlwdGlvbihcIlwiKTtcclxuICAgIFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgZm9yIChsZXQgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcclxuICAgICAgW2Jsb2Nrc1tpXSwgYmxvY2tzW2pdXSA9IFtibG9ja3Nbal0sIGJsb2Nrc1tpXV07IC8vIOyFlO2UjFxyXG4gICAgfVxyXG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIGJsb2NrLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxyXG5cclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24odHJhbnNYKTtcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXHJcblxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gIH1cclxuXHJcbiAgLy8g7ZiE7J6sIOyLnOqwge2ZlOuQmOuKlCDri6jqs4TsnZgg7ISk66qFIOyEpOyglVxyXG4gIC8vIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7ZWY64uo7JeQIO2RnOyLnOuQqFxyXG4gIHNldERlc2NyaXB0aW9uKHRleHQpIHtcclxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZChcInNvcnQtZGVzY3JpcHRpb25cIik7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb24pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgfVxyXG5cclxuICBzZXRCbG9ja1dpZHRoKGJsb2NrV2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcclxuICAgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XHJcblxyXG4gICAgLy8g67iU66GdIO2BrOq4sCDrsJTqvrjquLBcclxuICAgIHRoaXMuYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24obmV3WCk7XHJcblxyXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRXaWR0aChibG9ja1dpZHRoKTtcclxuXHJcbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQmxvY2soYmxvY2tWYWx1ZSkge1xyXG4gICAgLy8g67iU66GdIOqwnOyImCDsoJztlZxcclxuICAgIGlmICh0aGlzLmJsb2Nrcy5sZW5ndGggPiAzMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2soXHJcbiAgICAgIGJsb2NrVmFsdWUsXHJcbiAgICAgIHRoaXMuY29udGFpbmVyLFxyXG4gICAgICB0aGlzLmJsb2NrV2lkdGgsXHJcbiAgICAgIHRoaXMuYmxvY2tNYXJnaW5cclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXHJcbiAgICAgIHdpbmRvd1xyXG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxyXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcclxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID1cclxuICAgICAgcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbih0aGlzLmFuaW1hdGlvbkRlbGF5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcclxuICByZWZyZXNoQmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcclxuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xyXG5cclxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xyXG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XHJcblxyXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPripQg7ZWo7IiYIFxyXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcclxuICBhc3luYyBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XHJcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuXHJcbiAgICBibG9jay5zZXRYUG9zaXRpb24oZGVzdEluZGV4ICogICh0aGlzLmJsb2NrV2lkdGgrdGhpcy5ibG9ja01hcmdpbikpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2suaW5zZXJ0QmVmb3JlKGJsb2Nrc1tkZXN0SW5kZXhdKTtcclxuICB9XHJcblxyXG4gIC8vIHN0YXJ0IOyduOuNseyKpOu2gO2EsCBlbmQg7J24642x7Iqk6rmM7KeAIGJsb2NrIO2VnCDsubjslKkg66+464qUIO2VqOyImCBcclxuICBhc3luYyBzaGlmdCAoc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgY29uc3QgYmV0d2VlbnMgPSBibG9ja3MuZmlsdGVyKChfLCBpKSA9PiBzdGFydCA8PSBpICYmIGkgPCBlbmQpO1xyXG5cclxuICAgIGNvbnN0ICB4UmVzdCA9IGJldHdlZW5zLm1hcChiID0+IGIuZ2V0WFBvc2l0aW9uKCkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XHJcbiAgICB9XHJcbiAgICBibG9ja3NbZW5kLTFdLnNldFhQb3NpdGlvbihibG9ja3NbZW5kXS5nZXRYUG9zaXRpb24oKSk7XHJcbiAgICBcclxuXHJcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGJsb2Nrc1swXS5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKSkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcclxuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XHJcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cclxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XHJcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxyXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsp4TtlokgQnV0dG9uXHJcbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDrkqTroZwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcclxuXHJcbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXHJcbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcclxuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbi8vIFNvcnQg7JWM6rOg66as7KaYIO2BtOuemOyKpOulvCDrsJvslYTshJwg7KCV66Cs7J2EIOyLnFxyXG5jb25zdCBtYWtlU29ydFJhZGlvT25jaGFuZ2UgPSBTb3J0QWxnb3JpdGhtID0+ICgpID0+IHtcclxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXHJcbiAgICBzb3J0LmNvbnRhaW5lcixcclxuICAgIHNvcnQuYmxvY2tzLFxyXG4gICAgc29ydC5kZWxheSxcclxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXHJcbiAgICBzb3J0LmJsb2NrV2lkdGgsXHJcbiAgICBzb3J0LmJsb2NrTWFyZ2luLFxyXG4gICAgc29ydC5kZXNjcmlwdGlvblxyXG4gICk7XHJcbn07XHJcblxyXG5cclxuYnViYmxlU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEJ1YmJsZVNvcnQpO1xyXG5pbnNlcnRpb25Tb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoSW5zZXJ0aW9uU29ydCk7XHJcbnNlbGVjdGlvblNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShTZWxlY3Rpb25Tb3J0KTtcclxucXVpY2tTb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoUXVpY2tTb3J0KTtcclxuXHJcblxyXG5sZXQgc29ydCA9IG5ldyBCdWJibGVTb3J0KGNvbnRhaW5lcik7XHJcbmdlbmVyYXRlVW5pcXVlVmFsdWVzKCkuZm9yRWFjaCh2YWx1ZSA9PiBzb3J0LmFkZEJsb2NrKHZhbHVlKSk7XHJcblxyXG5kZWxheVJhbmdlLm9uaW5wdXQgPSBlID0+IHtcclxuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbiAgc29ydC5zZXREZWxheShkZWxheSk7XHJcblxyXG4gIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxyXG59O1xyXG5cclxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XHJcbi8vICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpIC0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuXHJcbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbi8vICAgc29ydC5zZXREZWxheShkZWxheSk7XHJcbi8vICAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXHJcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xyXG4vLyB9XHJcblxyXG5kZWxheUlucHV0Lm9ua2V5ZG93biA9IGUgPT4ge1xyXG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXHJcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXHJcbiAgICAvLyBkZWxheUlucHV0QnRu7JeQIGNsaWNrIOydtOuypO2KuCDtirjrpqzqsbBcclxuICAgIGRlbGF5SW5wdXRCdG4uY2xpY2soKTtcclxufVxyXG5kZWxheUlucHV0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDsnoXroKXqsJLsnbQg67KU7JyE66W8IOuEmOyWtOyEnOuptCDqsr3qs4TqsJLsnLzroZwg7ISk7KCVXHJcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcclxuICB9IGVsc2UgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA8IE51bWJlcihkZWxheVJhbmdlLm1pbikpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRlbGF5ID1cclxuICAgIE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pIC0gTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4gIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4gIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxufTtcclxuXHJcbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxyXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcclxuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn07XHJcblxyXG5uZXdEYXRhSW5wdXQub25rZXlkb3duID0gZSA9PiB7XHJcbiAgLy8g7JeU7YSw7YKk66W8IOuIhOuluCDqsr3smrBcclxuICBpZiAoZS5rZXlDb2RlID09PSAxMylcclxuICAgIC8vIG5ld0RhdGFBZGRCdG7sl5AgY2xpY2sg7J2067Kk7Yq4IO2KuOumrOqxsFxyXG4gICAgbmV3RGF0YUFkZEJ0bi5jbGljaygpO1xyXG59XHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxyXG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICBzb3J0LmFkZEJsb2NrKHZhbHVlKTtcclxufTtcclxuXHJcblxyXG4vLyDsoJXroKwg64+E7KSR7JeUIElucHV065Ok7J2EIOu5hO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXHJcblxyXG4gIHNvcnQuc29ydCgpLnRoZW4oZW5hYmxlSW5wdXRzKVxyXG59O1xyXG5cclxuc29ydFN0b3BCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RvcCgpO1xyXG59O1xyXG5cclxuc29ydENvbnRpbnVlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LmNvbnRpbnVlKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdGVwKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJhY2tCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RlcEJhY2soKTtcclxufVxyXG5cclxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnNodWZmbGUoKTtcclxufTtcclxuIl19
