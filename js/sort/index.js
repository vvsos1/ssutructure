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
    this.drawPseudoCode(  
 `
function SelectionSort(A, n) {
  for(let i = 0; i < n-1; i++){
    min = i
    for(let j = i + 1; j < n; j++) {
      if(A[j] < A[min])
        min = j
    }
    if(min != i)
      swap(A[i],A[min])
  }
}`)
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
          this.codeDefault();

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});
        this.codeHighlight(6);
        // delay만큼 기다림//
        await new Promise(resolve => setTimeout(resolve, this.delay));
        let value1 = blocks[min].getValue(); //변수 설정
        let value2 = blocks[j].getValue();
        if(j<n-1){
          let vcmp = blocks[j+1].getValue();
          this.setDescription(`${value1}과 ${vcmp} 비교`);
        }
        if (value1 >= value2) {
          this.setDescription(` 현재 최솟값 : ${value2}`);
          min = j;
          this.codeHighlight(7);
        }
        if (i != min && j == n - 1) {
          this.codeHighlight(9);
          this.setDescription(`최솟값과 현재 값을 교환한다`);
          await this.swap(blocks[min], blocks[i]); // 블럭 체인지
          this.codeHighlight(10);
          min = i; // min값초기화
          blocks[min].setColorDefault(); // 위치가 바뀌는 대상블록색깔 파란색으로
          this.refreshBlocks(); //두 블록의 위치가 바뀌었으므로 blocks를 업데이트
        }
        blocks[j].setColorDefault(); // 원래 색깔로 되돌리기
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvQ29sb3IuanMiLCJzcmMvc29ydC9Tb3J0LmpzIiwic3JjL3NvcnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcbmBcbmZ1bmN0aW9uIGJ1YmJsZVNvcnQoQSwgbikge1xuICBmb3IgKGxldCBsYXN0ID0gbjsgbGFzdCA8PSAyOyBsYXN0LS0pXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbGFzdCAtIDE7IGkrKylcbiAgICAgIGlmIChBW2ldID4gQVtpICsgMV0pXG4gICAgICAgIHN3YXAoQVtpXSxBW2krMV0pXG59YFxuICAgIClcbiAgfVxuICBcbiAgXG5cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG5cbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG5cbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yU2VsZWN0ZWQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgICBcbiAgICAgICAgLy8g7IKs7Jqp7J6Q6rCAIOuLpOydjCDsiqTthZ3snLzroZwg64SY7Ja06rCA6riwIOyghCDquYzsp4AodGhpcy5jb250aW51ZSgpIG9yIHRoaXMuc3RlcCgpKSDquLDri6TrprxcbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg1KTtcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmFsdWUyfSDruYTqtZBgKTtcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOuzgOqyvWApO1xuICAgICAgICAgIC8vIHN3YXAg7ZWo7IiY66GcIOuRkCDruJTroZ3snZgg7JyE7LmY66W8IOuwlOq/iDsgYXdhaXTsnYAgc3dhcCDsnbQg64Gd64KgIOuVjCDquYzsp4Ag6riw64uk66as6rKg64uk64qUIOydmOuvuFxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgais9IDE7XG4gICAgICB9XG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3Nbbi1pLTFdLmdldFZhbHVlKCl9IOu4lOuhnSDsoJXroKwg7JmE66OMYCk7XG4gICAgICBpICs9IDFcbiAgICB9XG4gICAgYmxvY2tzWzBdLnNldENvbG9yU29ydGVkKCk7XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZShcbmBcbmZ1bmN0aW9uIGluc2VydGlvblNvcnQoQSwgbikge1xuICBmb3IgKGxldCBpID0gMjsgaSA8PSBuOyBpKyspIHtcbiAgICBsZXQga2V5ID0gQVtpXVxuICAgIGxldCBqID0gMFxuICAgIHdoaWxlIChqIDwgaSAmJiBBW2pdIDwga2V5KVxuICAgICAgaisrXG4gICAgc2hpZnQoQSxqLGkpIFxuICAgIEFbal0gPSBrZXkgXG4gIH1cbn1gKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG5cbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JTb3J0ZWQoKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjspIHtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xuXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOykge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydtCDrk6TslrTqsIgg7JyE7LmY66W8IO2DkOyDiWApO1xuXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2LDcpO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcblxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTb3J0ZWQoKTtcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBqKz0xO1xuICAgICAgfVxuICAgICAgaWYgKGkgIT0gZGVzdEluZGV4KSB7XG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg4KTtcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuc2hpZnQoZGVzdEluZGV4LCBpKTtcblxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XG4gICAgICAgIGlmIChkZXN0SW5kZXggIT0gMClcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snYQgJHtibG9ja3NbZGVzdEluZGV4LTFdLmdldFZhbHVlKCl9IOu4lOuhneqzvCAke2Jsb2Nrc1tkZXN0SW5kZXhdLmdldFZhbHVlKCl9IOu4lOuhneydmCDsgqzsnbTsl5Ag7IK97J6FYCk7XG4gICAgICAgIGVsc2UgaWYgKGRlc3RJbmRleCA9PSAwKVxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydhCAke2Jsb2Nrc1tkZXN0SW5kZXhdLmdldFZhbHVlKCl9IOu4lOuhneydmCDsnITsuZjsl5Ag7IK97J6FYCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XG4gICAgICAgIFxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7JyE7LmYIOuzgOqyvSDsl4bsnYxgKTtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBRdWlja1NvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICB9XG5cbiAgYXN5bmMgc29ydChsZWZ0ID0gMCwgcmlnaHQgPSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG5cbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgbGV0IGxzdGFjayA9IFtdO1xuICAgIGxldCByc3RhY2sgPSBbXTtcblxuICAgIGxzdGFjay5wdXNoKGxlZnQpO1xuICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcblxuICAgIHdoaWxlIChsc3RhY2subGVuZ3RoICE9IDApIHtcbiAgICAgIGxldCBwbCA9IChsZWZ0ID0gbHN0YWNrLnBvcCgpKTsgLy8g7Jm87Kq9IOy7pOyEnFxuICAgICAgbGV0IHByID0gKHJpZ2h0ID0gcnN0YWNrLnBvcCgpKTsgLy8g7Jik66W47Kq9IOy7pOyEnFxuICAgICAgbGV0IHBpdm90SWR4ID0gTWF0aC5jZWlsKChsZWZ0ICsgcmlnaHQpIC8gMik7XG4gICAgICBsZXQgcGl2b3QgPSBibG9ja3NbcGl2b3RJZHhdOyAvLyDtlLzrspdcblxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDiSDrs4Dqsr1cbiAgICAgIGJsb2Nrc1xuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckJvdW5kYXJ5KCkpO1xuICAgICAgLy8g7ZS867KX7J2YIOyDiSDrs4Dqsr1cbiAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcblxuICAgICAgZG8ge1xuICAgICAgICB3aGlsZSAoYmxvY2tzW3BsXS5nZXRWYWx1ZSgpIDwgcGl2b3QuZ2V0VmFsdWUoKSkgcGwrKztcbiAgICAgICAgd2hpbGUgKGJsb2Nrc1twcl0uZ2V0VmFsdWUoKSA+IHBpdm90LmdldFZhbHVlKCkpIHByLS07XG5cbiAgICAgICAgYmxvY2tzW3BsXS5zZXRDb2xvclNlbGVjdGVkKCk7XG4gICAgICAgIGJsb2Nrc1twcl0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuICAgICAgICAvLyBwbCDrmJDripQgcHLsnbQgcGl2b3Tqs7wg6rK57LOQ64+EIHBpdm907J2YIOyDieydhCDsnKDsp4BcbiAgICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xuXG4gICAgICAgIGNvbnN0IHsgdHlwZSwgbWVtZW50byB9ID0gYXdhaXQgdGhpcy53YWl0KCk7XG5cbiAgICAgICAgLy8g7IOB7YOcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIpIHtcbiAgICAgICAgICAoeyBsc3RhY2ssIHJzdGFjaywgcGwsIHByLCBsZWZ0LCByaWdodCwgcGl2b3RJZHggfSA9IG1lbWVudG8pO1xuICAgICAgICAgIHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTtcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbG9yLCB4UG9zaXRpb24sIHZhbHVlLCB3aWR0aCB9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIO2YhOyerCDsg4Htg5zrpbwg7Iqk7YOd7JeQIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtcbiAgICAgICAgICBwbCxcbiAgICAgICAgICBwcixcbiAgICAgICAgICBwaXZvdElkeCxcbiAgICAgICAgICBsZWZ0LFxuICAgICAgICAgIHJpZ2h0LFxuICAgICAgICAgIGxzdGFjazogWy4uLmxzdGFjaywgcGxdLFxuICAgICAgICAgIHJzdGFjazogWy4uLnJzdGFjaywgcHJdLFxuICAgICAgICAgIGJsb2NrczogWy4uLmJsb2Nrc10ubWFwKChibG9jaykgPT4gKHsgLi4uYmxvY2sgfSkpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGwgPD0gcHIpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3BsKytdLCBibG9ja3NbcHItLV0pO1xuICAgICAgICAgIC8vIHN3YXAoYmxvY2tzLCBwbCsrLCBwci0tKTtcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3NbcGwgLSAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XG4gICAgICAgIGJsb2Nrc1twciArIDFdLnNldENvbG9yQm91bmRhcnkoKTtcbiAgICAgIH0gd2hpbGUgKHBsIDw9IHByKTtcblxuICAgICAgaWYgKGxlZnQgPCBwcikge1xuICAgICAgICBsc3RhY2sucHVzaChsZWZ0KTtcbiAgICAgICAgcnN0YWNrLnB1c2gocHIpO1xuICAgICAgfVxuICAgICAgaWYgKHBsIDwgcmlnaHQpIHtcbiAgICAgICAgbHN0YWNrLnB1c2gocGwpO1xuICAgICAgICByc3RhY2sucHVzaChyaWdodCk7XG4gICAgICB9XG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJ7J2EIOybkOuemOuMgOuhnCDrs4Dqsr1cbiAgICAgIGJsb2Nrc1xuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcbiBgXG5mdW5jdGlvbiBTZWxlY3Rpb25Tb3J0KEEsIG4pIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IG4tMTsgaSsrKXtcbiAgICBtaW4gPSBpXG4gICAgZm9yKGxldCBqID0gaSArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgIGlmKEFbal0gPCBBW21pbl0pXG4gICAgICAgIG1pbiA9IGpcbiAgICB9XG4gICAgaWYobWluICE9IGkpXG4gICAgICBzd2FwKEFbaV0sQVttaW5dKVxuICB9XG59YClcbiAgICAgICAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXG4gICAgICByZXR1cm47XG4gICAgXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcbiAgICBcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbWluO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcbiAgICAgIG1pbiA9IGk7XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOykge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgIGlmKGo8bi0xKXtcbiAgICAgICAgICBsZXQgdmNtcCA9IGJsb2Nrc1tqKzFdLmdldFZhbHVlKCk7XG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmNtcH0g67mE6rWQYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIHtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAg7ZiE7J6sIOy1nOyGn+qwkiA6ICR7dmFsdWUyfWApO1xuICAgICAgICAgIG1pbiA9IGo7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYOy1nOyGn+qwkuqzvCDtmITsnqwg6rCS7J2EIOq1kO2ZmO2VnOuLpGApO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTsgLy8g67iU65+tIOyytOyduOyngFxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxMCk7XG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3Prpbwg7JeF642w7J207Yq4XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsm5Drnpgg7IOJ6rmU66GcIOuQmOuPjOumrOq4sFxuICAgICAgICBqICs9IDE7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTb3J0ZWQoKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG5cbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JTb3J0ZWQoKTtcblxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjb25zdCBDb2xvciA9IHJlcXVpcmUoJy4vQ29sb3InKTtcblxuY2xhc3MgQmxvY2sge1xuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxuICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lciwgYmxvY2tXaWR0aCA9IDI4LCBibG9ja01hcmdpbiA9IDIpIHtcbiAgICBjb25zdCBibG9ja0NvdW50ID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pLmZpbHRlcihkb20gPT4gZG9tLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKSkubGVuZ3RoO1xuICAgIGNvbnN0IHhQb3NpdGlvbiA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcblxuICAgIHJldHVybiBuZXcgQmxvY2sodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCBibG9ja1dpZHRoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgIHdpZHRoLHRyYW5zaXRpb25EdXJhdGlvbj0yMDApIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XG5cbiAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcbiAgXG4gICAgdGhpcy5kb20gPSBibG9jaztcblxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRUcmFuc2l0aW9uRHVyYXRpb24odHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcbiAgICB0aGlzLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuXG4gICAgLy8g7ZmU66m07JeQIOu4lOuhnSDtkZzsi5xcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICB9XG4gIHN3YXBCbG9jayhibG9jaykge1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IHRoaXMuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jay5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG5leHRPZlRhcmdldDEpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpbnNlcnRCZWZvcmUoYmxvY2spIHtcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgYmxvY2suZG9tKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VHJhbnNpdGlvbkR1cmF0aW9uKG1pbGxpcykge1xuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gbWlsbGlzO1xuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3RoaXMudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbigpIHtcbiAgICAvLyByZXR1cm4gTnVtYmVyKFxuICAgIC8vICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCAwKVxuICAgIC8vICk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uO1xuICB9XG5cbiAgc2V0WFBvc2l0aW9uKHgpIHtcbiAgICB0aGlzLnhQb3NpdGlvbiA9IHg7XG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLnhQb3NpdGlvbn1weClgO1xuICB9XG5cbiAgZ2V0WFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnhQb3NpdGlvbjtcbiAgICAvLyBjb25zdCByZWdFeHBUcmFuc1ggPSAvW1xcd10rXFwoWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdPyhbXFxkXSspWyBdPyxbIF0/W1xcZF0rWyBdP1xcKS87XG4gICAgLy8gY29uc3QgdHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zZm9ybTtcbiAgICAvLyByZXR1cm4gcmVnRXhwVHJhbnNYLmV4ZWModHJhbnNmb3JtKVsxXTtcbiAgfVxuXG4gIHNldFdpZHRoKHB4KSB7XG4gICAgdGhpcy53aWR0aCA9IHB4O1xuICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gYCR7dGhpcy53aWR0aH1weGA7XG4gIH1cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICBzZXRDb2xvcihjb2xvcikge1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIGdldENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLmNvbG9yO1xuICB9XG5cbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclNlbGVjdGVkKCkge1xuICAgIHRoaXMuY29sb3IgPSBDb2xvci5zZWxlY3RlZDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+yEoO2DneuQnCDruJTroZ0gOiDruajqsJUgLT4g7Jew67O06528XG4gIH1cblxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yRGVmYXVsdCgpIHtcbiAgICB0aGlzLmNvbG9yID0gQ29sb3IuZGVmYXVsdENvbG9yO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v6riw67O4IOu4lOuhnTog7YyM656RIC0+IOyXsO2Vke2BrFxuICB9XG5cbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JTb3J0ZWQoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnNvcnRlZDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+ygleugrCDrgZ3rgpwg67iU66GdOiDqt7jrprAo7LSI66GdKSAtPiDssJDtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIFBpdm90IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclBpdm90KCkge1xuICAgIHRoaXMuY29sb3IgPSBDb2xvci5waXZvdDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+2UvOuylyDruJTroZ0gOiDtmJXqtJEg7ZWR7YGsIC0+ICDssJDrs7TrnbxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOqyveqzhOulvCDrgpjtg4DrgrTripQg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yQm91bmRhcnkoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLmJvdW5kYXJ5O1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8vIOu4lOufrSDqsr3qs4QgOiDrs7TrnbwgLT4g64W4656RIFxuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpe1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAvLyDruJTroZ3snZgg7LWc64yAIOuGkuydtOuKlCDsu6jthYzsnbTrhIjsnZgg64aS7J20IC0gMjRweFxuICAgIGNvbnN0IG1heEhpZ2h0ID1cbiAgICAgIE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSAyNDtcbiAgICBsZXQgYmxvY2tIaWdodCA9IHZhbHVlICogMztcbiAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBgJHtibG9ja0hpZ2h0IDwgbWF4SGlnaHQgPyBibG9ja0hpZ2h0IDogbWF4SGlnaHR9cHhgO1xuXG4gICAgdGhpcy5kb20uZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcbiIsIlxuXG4vLyDquLDrs7gg67iU66GdIOyDieyDgVxuY29uc3QgZGVmYXVsdENvbG9yID0gXCIjRkY5RkIzXCI7XG5cbi8vIOu4lOuhneydtCDshKDtg53rkJjsl4jsnYQg65WMIOyDieyDgVxuY29uc3Qgc2VsZWN0ZWQgPSBcIiNCNjlBRTdcIjtcblxuLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7IOBXG5jb25zdCBzb3J0ZWQgPSBcIiNGRjZDNzdcIjtcblxuLy8gUGl2b3Qg67iU66Gd7J2YIOyDieyDgSAoUXVpY2sgU29ydOyXkOyEnOydmCBQaXZvdClcbmNvbnN0IHBpdm90ID0gXCIjOUY3MEYxXCI7XG5cbi8vIFF1aWNrIFNvcnTsl5DshJwgUGFydGl0aW9uIO2VqOyImOydmCDrjIDsg4Hsnbgg67iU66Gd65Ok7J2YIOyDieyDgVxuY29uc3QgYm91bmRhcnkgPSBcIiNGNUUzNDhcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGVmYXVsdENvbG9yLFxuICAgIHNlbGVjdGVkLFxuICAgIHNvcnRlZCxcbiAgICBwaXZvdCxcbiAgICBib3VuZGFyeVxufSIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XG5cbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxuY2xhc3MgU29ydCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbnRhaW5lcixcbiAgICBibG9ja3MgPSBbXSxcbiAgICBkZWxheSA9IDIwMCxcbiAgICBhbmltYXRpb25EZWxheSA9IDI1MCxcbiAgICBibG9ja1dpZHRoID0gMjgsXG4gICAgYmxvY2tNYXJnaW4gPSAyLFxuICAgIGRlc2NyaXB0aW9uXG4gICkge1xuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIC8vIOygleugrCDsiqTthZ0g7IKs7J20IOuUnOugiOydtFxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgLy8g67iU66GdIOyCrOydtCDqsITqsqlcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICAvLyDsoJXroKzsnbQg7ZiE7J6sIOyLpO2WieykkeyduCDsg4Htg5xcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xuXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICB9XG5cbiAgLy8g7IiY64+EIOy9lOuTnCDrrLjsnpDsl7TsnYQg67Cb7JWE7IScIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7Jqw7Lih7JeQIOuztOyXrOykjFxuICBkcmF3UHNldWRvQ29kZShwc2V1ZG9Db2RlKXtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDsiJjrj4TsvZTrk5wg7IKt7KCcXG4gICAgQXJyYXkuZnJvbShwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkPT5jaGlsZC5yZW1vdmUoKSk7XG4gICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIFxuICAgIC8vIOykhOuzhOuhnFxuICAgIHBzZXVkb0NvZGUuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgIHBzZXVkb0NvZGVDb250YWluZXIuaW5uZXJIVE1MICs9IGA8Y29kZT4ke2xpbmV9PC9jb2RlPiR7J1xcbid9YFxuICAgIH0pXG5cbiAgfVxuXG4gIC8vIOy2lOyDgSDrqZTshozrk5xcbiAgc29ydCgpIHt9XG5cbiAgd2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzU3RvcCkge1xuICAgICAgICAvLyDtmITsnqwg7KCV66CsIOykkeyngCDsg4Htg5zrnbzrqbQgdGhpcy5zdGVw7J2EIO2Gte2VtCDsoJXroKzsnYQg7Iuc7J6R7ZWY64+E66GdIOyEpOyglVxuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh7IHR5cGU6IFwiY29udGludWVcIiB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5pc1N0b3AgPSB0cnVlO1xuICB9XG5cbiAgY29udGludWUoKSB7XG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcbiAgICB0aGlzLnN0ZXAoKTtcbiAgfVxuXG4gIHN0ZXAoKSB7XG4gICAgaWYgKHRoaXMucmVzb2x2ZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVzb2x2ZSh7IHR5cGU6IFwic3RlcFwiIH0pO1xuICAgICAgdGhpcy5yZXNvbHZlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGVwQmFjaygpIHtcbiAgICBpZiAodGhpcy5yZXNvbHZlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMubWVtZXRvU3RhY2subGVuZ3RoICE9IDApIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHtcbiAgICAgICAgICB0eXBlOiBcImJhY2tcIixcbiAgICAgICAgICBtZW1lbnRvOiB0aGlzLm1lbWV0b1N0YWNrLnBvcCgpLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyDsi5zqsIHtmZTrkJwg7IiY64+EIOy9lOuTnOydmCDtlZjsnbTrnbzsnbTtirjrpbwg7JeG7JWwXG4gIGNvZGVEZWZhdWx0KCl7XG4gICAgY29uc3QgcHNldWRvQ29kZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHNldWRvLWNvZGUtY29udGFpbmVyXCIpO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZHJlbltpXS5zdHlsZS5jb2xvciA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIC8vIOyLnOqwge2ZlOuQnCDsiJjrj4Qg7L2U65Oc7J2YIO2KueyglSDspITsnYQg7ZWY7J2065287J207Yq4XG4gIGNvZGVIaWdobGlnaHQoLi4ubGluZSkge1xuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gcHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbjtcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRyZW5baV0uc3R5bGUuY29sb3IgPSAnJztcbiAgICB9XG5cbiAgICBmb3IgKGxldCBtYW5nbyA9IDA7IG1hbmdvIDwgbGluZS5sZW5ndGg7IG1hbmdvKyspIHtcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gY2hpbGRyZW5bbGluZVttYW5nb10tMV07XG4gICAgICBjb2RlRWxlbWVudC5zdHlsZS5jb2xvciA9IFwiI0I2OUFFN1wiO1xuICAgIH1cbiAgfVxuXG4gIHB1c2hNZW1lbnRvKG1lbWVudG8pIHtcbiAgICB0aGlzLm1lbWV0b1N0YWNrLnB1c2gobWVtZW50byk7XG4gIH1cblxuICBzaHVmZmxlKCkge1xuXG4gICAgdGhpcy5zZXREZXNjcmlwdGlvbihcIlwiKTtcbiAgICBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgZm9yIChsZXQgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXG4gICAgICBbYmxvY2tzW2ldLCBibG9ja3Nbal1dID0gW2Jsb2Nrc1tqXSwgYmxvY2tzW2ldXTsgLy8g7IWU7ZSMXG4gICAgfVxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgYmxvY2suc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu4lOuhnSDsg4kg7LSI6riw7ZmUXG5cbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xuXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKTtcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih0cmFuc1gpO1xuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXG5cbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gIH1cblxuICAvLyDtmITsnqwg7Iuc6rCB7ZmU65CY64qUIOuLqOqzhOydmCDshKTrqoUg7ISk7KCVXG4gIC8vIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7ZWY64uo7JeQIO2RnOyLnOuQqFxuICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJzb3J0LWRlc2NyaXB0aW9uXCIpO1xuICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IHRleHQ7XG4gIH1cblxuICBzZXRCbG9ja1dpZHRoKGJsb2NrV2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xuICAgIC8vIHdpZHRoOk51bWJlclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XG5cbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pICsgXCJweFwiO1xuXG4gICAgLy8g67iU66GdIO2BrOq4sCDrsJTqvrjquLBcbiAgICB0aGlzLmJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XG5cbiAgICAgIGNvbnN0IG5ld1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKG5ld1gpO1xuXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxuICAgICAgYmxvY2suc2V0V2lkdGgoYmxvY2tXaWR0aCk7XG5cbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBhZGRCbG9jayhibG9ja1ZhbHVlKSB7XG4gICAgLy8g67iU66GdIOqwnOyImCDsoJztlZxcbiAgICBpZiAodGhpcy5ibG9ja3MubGVuZ3RoID4gMzApIHJldHVybjtcblxuICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2soXG4gICAgICBibG9ja1ZhbHVlLFxuICAgICAgdGhpcy5jb250YWluZXIsXG4gICAgICB0aGlzLmJsb2NrV2lkdGgsXG4gICAgICB0aGlzLmJsb2NrTWFyZ2luXG4gICAgKTtcblxuICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcbiAgICAgIHdpbmRvd1xuICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcilcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXG4gICAgKTtcblxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID1cbiAgICAgIHByZXZXaWR0aCArICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKSArIFwicHhcIjtcbiAgfVxuXG4gIHNldERlbGF5KG1pbGxpcykge1xuICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XG4gIH1cblxuICBzZXRBbmltYXRpb25EZWxheShtaWxsaXMpIHtcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRoaXMuYW5pbWF0aW9uRGVsYXkpXG4gICAgKTtcbiAgfVxuXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcbiAgcmVmcmVzaEJsb2NrcygpIHtcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG4gIH1cblxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxuICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXG5cbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcbiAgICBjb25zdCB4MiA9IGJsb2NrMi5nZXRYUG9zaXRpb24oKTtcblxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xuICAgIGJsb2NrMi5zZXRYUG9zaXRpb24oeDEpO1xuXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgYXdhaXQgYmxvY2sxLnN3YXBCbG9jayhibG9jazIpO1xuICB9XG5cbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj64qUIO2VqOyImCBcbiAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxuICBhc3luYyBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICBibG9jay5zZXRYUG9zaXRpb24oZGVzdEluZGV4ICogICh0aGlzLmJsb2NrV2lkdGgrdGhpcy5ibG9ja01hcmdpbikpO1xuXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgYXdhaXQgYmxvY2suaW5zZXJ0QmVmb3JlKGJsb2Nrc1tkZXN0SW5kZXhdKTtcbiAgfVxuXG4gIC8vIHN0YXJ0IOyduOuNseyKpOu2gO2EsCBlbmQg7J24642x7Iqk6rmM7KeAIGJsb2NrIO2VnCDsubjslKkg66+464qUIO2VqOyImCBcbiAgYXN5bmMgc2hpZnQgKHN0YXJ0LCBlbmQpIHtcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGNvbnN0IGJldHdlZW5zID0gYmxvY2tzLmZpbHRlcigoXywgaSkgPT4gc3RhcnQgPD0gaSAmJiBpIDwgZW5kKTtcblxuICAgIGNvbnN0ICB4UmVzdCA9IGJldHdlZW5zLm1hcChiID0+IGIuZ2V0WFBvc2l0aW9uKCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBiZXR3ZWVuc1tpXS5zZXRYUG9zaXRpb24oeFJlc3RbaSArIDFdKTtcbiAgICB9XG4gICAgYmxvY2tzW2VuZC0xXS5zZXRYUG9zaXRpb24oYmxvY2tzW2VuZF0uZ2V0WFBvc2l0aW9uKCkpO1xuICAgIFxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBibG9ja3NbMF0uZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkpKTtcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XG5jb25zdCBRdWlja1NvcnQgPSByZXF1aXJlKFwiLi4vcXVpY2stc29ydC9RdWlja1NvcnRcIik7XG5cbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcblxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWJibGUtc29ydC1yYWRpb1wiKTtcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xuY29uc3QgcXVpY2tTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInF1aWNrLXNvcnQtcmFkaW9cIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcblxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dFxuY29uc3QgZGVsYXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0XCIpO1xuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cbmNvbnN0IGRlbGF5SW5wdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dC1idG5cIik7XG5cbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XG5cbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XG5cbi8vIOygleugrCDspJHsp4AgQnV0dG9uXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcblxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XG5cbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcblxuLy8g7KCV66CsIOuSpOuhnCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcblxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlVmFsdWVzKGNvdW50ID0gMjApIHtcbiAgY29uc3QgdmFsdWVzID0gW107XG4gIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2NSArIDEpO1xuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufVxuXG4vLyBTb3J0IOyVjOqzoOumrOymmCDtgbTrnpjsiqTrpbwg67Cb7JWE7IScIOygleugrOydhCDsi5xcbmNvbnN0IG1ha2VTb3J0UmFkaW9PbmNoYW5nZSA9IFNvcnRBbGdvcml0aG0gPT4gKCkgPT4ge1xuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXG4gICAgc29ydC5jb250YWluZXIsXG4gICAgc29ydC5ibG9ja3MsXG4gICAgc29ydC5kZWxheSxcbiAgICBzb3J0LmFuaW1hdGlvbkRlbGF5LFxuICAgIHNvcnQuYmxvY2tXaWR0aCxcbiAgICBzb3J0LmJsb2NrTWFyZ2luLFxuICAgIHNvcnQuZGVzY3JpcHRpb25cbiAgKTtcbn07XG5cblxuYnViYmxlU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEJ1YmJsZVNvcnQpO1xuaW5zZXJ0aW9uU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEluc2VydGlvblNvcnQpO1xuc2VsZWN0aW9uU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKFNlbGVjdGlvblNvcnQpO1xucXVpY2tTb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoUXVpY2tTb3J0KTtcblxuXG5sZXQgc29ydCA9IG5ldyBCdWJibGVTb3J0KGNvbnRhaW5lcik7XG5nZW5lcmF0ZVVuaXF1ZVZhbHVlcygpLmZvckVhY2godmFsdWUgPT4gc29ydC5hZGRCbG9jayh2YWx1ZSkpO1xuXG5kZWxheVJhbmdlLm9uaW5wdXQgPSBlID0+IHtcbiAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbiAgc29ydC5zZXREZWxheShkZWxheSk7XG5cbiAgZGVsYXlJbnB1dC52YWx1ZSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pLSBkZWxheTsgLy8gZGVsYXlJbnB1dOqzvCDqsJIg64+Z6riw7ZmUXG59O1xuXG4vLyBkZWxheUlucHV0Lm9uaW5wdXQgPSBlID0+IHtcbi8vICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpIC0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcblxuLy8gICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbi8vICAgc29ydC5zZXREZWxheShkZWxheSk7XG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxuLy8gICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XG4vLyB9XG5cbmRlbGF5SW5wdXQub25rZXlkb3duID0gZSA9PiB7XG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXG4gIGlmIChlLmtleUNvZGUgPT09IDEzKVxuICAgIC8vIGRlbGF5SW5wdXRCdG7sl5AgY2xpY2sg7J2067Kk7Yq4IO2KuOumrOqxsFxuICAgIGRlbGF5SW5wdXRCdG4uY2xpY2soKTtcbn1cbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IGUgPT4ge1xuICAvLyDsnoXroKXqsJLsnbQg67KU7JyE66W8IOuEmOyWtOyEnOuptCDqsr3qs4TqsJLsnLzroZwg7ISk7KCVXG4gIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPiBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpKSB7XG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWF4O1xuICB9IGVsc2UgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA8IE51bWJlcihkZWxheVJhbmdlLm1pbikpIHtcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5taW47XG4gIH1cblxuICBjb25zdCBkZWxheSA9XG4gICAgTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSk7XG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcbiAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXG4gIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcbn07XG5cbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XG59O1xuXG5uZXdEYXRhSW5wdXQub25rZXlkb3duID0gZSA9PiB7XG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXG4gIGlmIChlLmtleUNvZGUgPT09IDEzKVxuICAgIC8vIG5ld0RhdGFBZGRCdG7sl5AgY2xpY2sg7J2067Kk7Yq4IO2KuOumrOqxsFxuICAgIG5ld0RhdGFBZGRCdG4uY2xpY2soKTtcbn1cblxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xuXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XG5cbiAgc29ydC5hZGRCbG9jayh2YWx1ZSk7XG59O1xuXG5cbi8vIOygleugrCDrj4TspJHsl5QgSW5wdXTrk6TsnYQg67mE7Zmc7ISx7ZmUXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xufVxuLy8g7KCV66Cs7J20IOuBneuCnCDtm4QgSW5wdXTrk6TsnYQg7Zmc7ISx7ZmUXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XG5cbiAgZGlzYWJsZUlucHV0cygpOyAvLyDsoJXroKzsnbQg7Iuc7J6R65CgIOuVjCDruYTtmZzshLHtmZRcblxuICBzb3J0LnNvcnQoKS50aGVuKGVuYWJsZUlucHV0cylcbn07XG5cbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zdG9wKCk7XG59O1xuXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LmNvbnRpbnVlKCk7XG59O1xuXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuc3RlcCgpO1xufTtcblxuc29ydFN0ZXBCYWNrQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zdGVwQmFjaygpO1xufVxuXG5ibG9ja1NodWZmbGVCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LnNodWZmbGUoKTtcbn07XG4iXX0=
