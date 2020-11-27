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
      blocks[n - i - 1].setColorGreen();
      this.setDescription(`${blocks[n-i-1].getValue()} 블록 정렬 완료`);
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

    blocks[0].setColorGreen();

    for (let i = 1; i < n;) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorRed();

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

        blocks[j].setColorGreen();
        if (value > target) {
          destIndex = j;
          break;
        }
        j+=1;
      }
      if (i != destIndex) {
        this.codeHighlight(8);
        blocks[destIndex].setColorRed();

        await this.shift(destIndex, i);

        this.codeHighlight(9);
        if (destIndex != 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex-1].getValue()} 블록과 ${blocks[destIndex].getValue()} 블록의 사이에 삽입`);
        else if (destIndex == 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex].getValue()} 블록의 위치에 삽입`);

        await this.insertAt(blocks[i], destIndex);
        
        blocks[destIndex].setColorGreen();
      }
      else
        this.setDescription(`${blocks[i].getValue()} 블록의 위치 변경 없음`);
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

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../quick-sort/QuickSort":3,"../selection-sort/SelectionSort":4,"../sort/Block":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcbmBcbmZ1bmN0aW9uIGJ1YmJsZVNvcnQoQSwgbikge1xuICBmb3IgKGxldCBsYXN0ID0gbjsgbGFzdCA8PSAyOyBsYXN0LS0pXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbGFzdCAtIDE7IGkrKylcbiAgICAgIGlmIChBW2ldID4gQVtpICsgMV0pXG4gICAgICAgIHN3YXAoQVtpXSxBW2krMV0pXG59YFxuICAgIClcbiAgfVxuICBcbiAgXG5cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG5cbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG5cbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgIFxuICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuY29kZURlZmF1bHQoKTtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHZhbHVlMSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XG5cbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDUpO1xuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOu5hOq1kGApO1xuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDYpO1xuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7dmFsdWUxfeqzvCAke3ZhbHVlMn0g67OA6rK9YCk7XG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1tqXSwgYmxvY2tzW2ogKyAxXSk7XG4gICAgICAgICAgLy8g65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ydhCDsl4XrjbDsnbTtirhcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBqKz0gMTtcbiAgICAgIH1cbiAgICAgIC8vIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieydhCBHcmVlbuycvOuhnCDrsJTqv4hcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yR3JlZW4oKTtcbiAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW24taS0xXS5nZXRWYWx1ZSgpfSDruJTroZ0g7KCV66CsIOyZhOujjGApO1xuICAgICAgaSArPSAxXG4gICAgfVxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZShcbmBcbmZ1bmN0aW9uIGluc2VydGlvblNvcnQoQSwgbikge1xuICBmb3IgKGxldCBpID0gMjsgaSA8PSBuOyBpKyspIHtcbiAgICBsZXQga2V5ID0gQVtpXVxuICAgIGxldCBqID0gMFxuICAgIHdoaWxlIChqIDwgaSAmJiBBW2pdIDwga2V5KVxuICAgICAgaisrXG4gICAgc2hpZnQoQSxqLGkpIFxuICAgIEFbal0gPSBrZXkgXG4gIH1cbn1gKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG5cbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOykge1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XG5cbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xuXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOykge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snbQg65Ok7Ja06rCIIOychOy5mOulvCDtg5Dsg4lgKTtcblxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb2RlRGVmYXVsdCgpO1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcblxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNiw3KTtcblxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG5cbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yR3JlZW4oKTtcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBqKz0xO1xuICAgICAgfVxuICAgICAgaWYgKGkgIT0gZGVzdEluZGV4KSB7XG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg4KTtcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnNoaWZ0KGRlc3RJbmRleCwgaSk7XG5cbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xuICAgICAgICBpZiAoZGVzdEluZGV4ICE9IDApXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleC0xXS5nZXRWYWx1ZSgpfSDruJTroZ3qs7wgJHtibG9ja3NbZGVzdEluZGV4XS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7IKs7J207JeQIOyCveyehWApO1xuICAgICAgICBlbHNlIGlmIChkZXN0SW5kZXggPT0gMClcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snYQgJHtibG9ja3NbZGVzdEluZGV4XS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7JyE7LmY7JeQIOyCveyehWApO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7JyE7LmYIOuzgOqyvSDsl4bsnYxgKTtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFF1aWNrU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gIH1cblxuICBhc3luYyBzb3J0KGxlZnQgPSAwLCByaWdodCA9IHRoaXMuYmxvY2tzLmxlbmd0aCAtIDEpIHtcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZykgcmV0dXJuO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG5cbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICBsZXQgbHN0YWNrID0gW107XG4gICAgbGV0IHJzdGFjayA9IFtdO1xuXG4gICAgbHN0YWNrLnB1c2gobGVmdCk7XG4gICAgcnN0YWNrLnB1c2gocmlnaHQpO1xuXG4gICAgd2hpbGUgKGxzdGFjay5sZW5ndGggIT0gMCkge1xuICAgICAgbGV0IHBsID0gKGxlZnQgPSBsc3RhY2sucG9wKCkpOyAvLyDsmbzsqr0g7Luk7IScXG4gICAgICBsZXQgcHIgPSAocmlnaHQgPSByc3RhY2sucG9wKCkpOyAvLyDsmKTrpbjsqr0g7Luk7IScXG4gICAgICBsZXQgcGl2b3RJZHggPSBNYXRoLmNlaWwoKGxlZnQgKyByaWdodCkgLyAyKTtcbiAgICAgIGxldCBwaXZvdCA9IGJsb2Nrc1twaXZvdElkeF07IC8vIO2UvOuyl1xuXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJIOuzgOqyvVxuICAgICAgYmxvY2tzXG4gICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gbGVmdCA8PSBpZHggJiYgaWR4IDw9IHJpZ2h0KVxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XG4gICAgICAvLyDtlLzrspfsnZgg7IOJIOuzgOqyvVxuICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xuICAgICAgICB3aGlsZSAoYmxvY2tzW3ByXS5nZXRWYWx1ZSgpID4gcGl2b3QuZ2V0VmFsdWUoKSkgcHItLTtcblxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGJsb2Nrc1twcl0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgLy8gcGwg65iQ64qUIHBy7J20IHBpdm906rO8IOqyueyzkOuPhCBwaXZvdOydmCDsg4nsnYQg7Jyg7KeAXG4gICAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcblxuICAgICAgICBjb25zdCB7IHR5cGUsIG1lbWVudG8gfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuXG4gICAgICAgIC8vIOyDge2DnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiKSB7XG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcbiAgICAgICAgICBwaXZvdCA9IGJsb2Nrc1twaXZvdElkeF07XG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDtmITsnqwg7IOB7YOc66W8IOyKpO2DneyXkCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7XG4gICAgICAgICAgcGwsXG4gICAgICAgICAgcHIsXG4gICAgICAgICAgcGl2b3RJZHgsXG4gICAgICAgICAgbGVmdCxcbiAgICAgICAgICByaWdodCxcbiAgICAgICAgICBsc3RhY2s6IFsuLi5sc3RhY2ssIHBsXSxcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcbiAgICAgICAgICBibG9ja3M6IFsuLi5ibG9ja3NdLm1hcCgoYmxvY2spID0+ICh7IC4uLmJsb2NrIH0pKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsIDw9IHByKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1twbCsrXSwgYmxvY2tzW3ByLS1dKTtcbiAgICAgICAgICAvLyBzd2FwKGJsb2NrcywgcGwrKywgcHItLSk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzW3BsIC0gMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xuICAgICAgICBibG9ja3NbcHIgKyAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XG4gICAgICB9IHdoaWxlIChwbCA8PSBwcik7XG5cbiAgICAgIGlmIChsZWZ0IDwgcHIpIHtcbiAgICAgICAgbHN0YWNrLnB1c2gobGVmdCk7XG4gICAgICAgIHJzdGFjay5wdXNoKHByKTtcbiAgICAgIH1cbiAgICAgIGlmIChwbCA8IHJpZ2h0KSB7XG4gICAgICAgIGxzdGFjay5wdXNoKHBsKTtcbiAgICAgICAgcnN0YWNrLnB1c2gocmlnaHQpO1xuICAgICAgfVxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDieydhCDsm5DrnpjrjIDroZwg67OA6rK9XG4gICAgICBibG9ja3NcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgICB0aGlzLmRyYXdQc2V1ZG9Db2RlKCAgXG4gYFxuZnVuY3Rpb24gU2VsZWN0aW9uU29ydChBLCBuKSB7XG4gIGZvcihsZXQgaSA9IDA7IGkgPCBuLTE7IGkrKyl7XG4gICAgbWluID0gaVxuICAgIGZvcihsZXQgaiA9IGkgKyAxOyBqIDwgbjsgaisrKSB7XG4gICAgICBpZihBW2pdIDwgQVttaW5dKVxuICAgICAgICBtaW4gPSBqXG4gICAgfVxuICAgIGlmKG1pbiAhPSBpKVxuICAgICAgc3dhcChBW2ldLEFbbWluXSlcbiAgfVxufWApXG4gICAgICAgIH1cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIFxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG4gICAgXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG1pbjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7KSB7XG4gICAgICBtaW4gPSBpO1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcblxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuY29kZURlZmF1bHQoKTtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDYpO1xuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTsgLy/rs4DsiJgg7ISk7KCVXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYoajxuLTEpe1xuICAgICAgICAgIGxldCB2Y21wID0gYmxvY2tzW2orMV0uZ2V0VmFsdWUoKTtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2Y21wfSDruYTqtZBgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikge1xuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCDtmITsnqwg7LWc7Iaf6rCSIDogJHt2YWx1ZTJ9YCk7XG4gICAgICAgICAgbWluID0gajtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihg7LWc7Iaf6rCS6rO8IO2YhOyerCDqsJLsnYQg6rWQ7ZmY7ZWc64ukYCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDEwKTtcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCDrjIDsg4HruJTroZ3sg4nquZQg7YyM656A7IOJ7Jy866GcXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcbiAgICAgICAgfVxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOybkOuemCDsg4nquZTroZwg65CY64+M66as6riwXG4gICAgICAgIGogKz0gMTtcbiAgICAgIH1cbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICBpICs9IDE7XG4gICAgfVxuXG4gICAgLy8g7KCV66Cs7J20IOuBneuCrOycvOuvgOuhnCDrp4jsp4Drp4kg67iU66Gd64+EIEdyZWVu7Jy866GcIOyDiSDrs4Dqsr1cbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcblxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjbGFzcyBCbG9jayB7XG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLCBibG9ja1dpZHRoID0gMjgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikuZmlsdGVyKGRvbSA9PiBkb20uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9jaycpKS5sZW5ndGg7XG4gICAgY29uc3QgeFBvc2l0aW9uID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG5cbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcblxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xuICBcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xuXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICB0aGlzLnNldFRyYW5zaXRpb25EdXJhdGlvbih0cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG5cbiAgICAvLyDtmZTrqbTsl5Ag67iU66GdIO2RnOyLnFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XG4gIH1cbiAgc3dhcEJsb2NrKGJsb2NrKSB7XG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gdGhpcy5kb20ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrLmRvbS5uZXh0U2libGluZztcblxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluc2VydEJlZm9yZShibG9jaykge1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBibG9jay5kb20pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPSBtaWxsaXM7XG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkge1xuICAgIC8vIHJldHVybiBOdW1iZXIoXG4gICAgLy8gICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIDApXG4gICAgLy8gKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XG4gIH1cblxuICBzZXRYUG9zaXRpb24oeCkge1xuICAgIHRoaXMueFBvc2l0aW9uID0geDtcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RoaXMueFBvc2l0aW9ufXB4KWA7XG4gIH1cblxuICBnZXRYUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xuICAgIC8vIGNvbnN0IHJlZ0V4cFRyYW5zWCA9IC9bXFx3XStcXChbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/KFtcXGRdKylbIF0/LFsgXT9bXFxkXStbIF0/XFwpLztcbiAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNmb3JtO1xuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xuICB9XG5cbiAgc2V0V2lkdGgocHgpIHtcbiAgICB0aGlzLndpZHRoID0gcHg7XG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcbiAgfVxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gIH1cblxuICBzZXRDb2xvclllbGxvdygpIHtcbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGRjAwXCI7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRjAwXCI7XG4gIH1cblxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yUmVkKCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiNCNjlBRTdcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNCNjlBRTdcIjsgLy/shKDtg53rkJwg67iU66GdIDog67mo6rCVIC0+IOyXsOuztOudvFxuICB9XG5cbiAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGOUZCM1wiO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGOUZCM1wiOyAvL+q4sOuzuCDruJTroZ06IO2MjOuekSAtPiDsl7DtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yR3JlZW4oKSB7XG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGNkM3N1wiO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNkM3N1wiOyAvL+ygleugrCDrgZ3rgpwg67iU66GdOiDqt7jrprAo7LSI66GdKSAtPiDssJDtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIFBpdm90IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclBpdm90KCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiM5RjcwRjFcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM5RjcwRjFcIjsgLy/tlLzrspcg67iU66GdIDog7ZiV6rSRIO2Vke2BrCAtPiAg7LCQ67O06528XG4gIH1cblxuICAvLyBibG9ja+ydhCDqsr3qs4Trpbwg64KY7YOA64K064qUIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvckJvdW5kYXJ5KCkge1xuICAgIHRoaXMuY29sb3IgPSBcIiNGNUUzNDhcIjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGNUUzNDhcIjsgLy8g67iU65+tIOqyveqzhCA6IOuztOudvCAtPiDrhbjrnpEgXG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZSl7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XG4gICAgY29uc3QgbWF4SGlnaHQgPVxuICAgICAgTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpKSAtIDI0O1xuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xuICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHQgPCBtYXhIaWdodCA/IGJsb2NrSGlnaHQgOiBtYXhIaWdodH1weGA7XG5cbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xuICB9XG5cbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgY29udGFpbmVyLFxuICAgIGJsb2NrcyA9IFtdLFxuICAgIGRlbGF5ID0gMjAwLFxuICAgIGFuaW1hdGlvbkRlbGF5ID0gMjUwLFxuICAgIGJsb2NrV2lkdGggPSAyOCxcbiAgICBibG9ja01hcmdpbiA9IDIsXG4gICAgZGVzY3JpcHRpb25cbiAgKSB7XG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcbiAgICAvLyDruJTroZ3snZgg64SI67mEXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcblxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXG4gICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XG5cbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gIH1cblxuICAvLyDsiJjrj4Qg7L2U65OcIOusuOyekOyXtOydhCDrsJvslYTshJwg7Iuc6rCB7ZmUIOy7qO2FjOydtOuEiCDsmrDsuKHsl5Ag67O07Jes7KSMXG4gIGRyYXdQc2V1ZG9Db2RlKHBzZXVkb0NvZGUpe1xuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyImOuPhOy9lOuTnCDsgq3soJxcbiAgICBBcnJheS5mcm9tKHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQ9PmNoaWxkLnJlbW92ZSgpKTtcbiAgICBwc2V1ZG9Db2RlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgXG4gICAgLy8g7KSE67OE66GcXG4gICAgcHNldWRvQ29kZS5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxjb2RlPiR7bGluZX08L2NvZGU+JHsnXFxuJ31gXG4gICAgfSlcblxuICB9XG5cbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICBzb3J0KCkge31cblxuICB3YWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNTdG9wKSB7XG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHsgdHlwZTogXCJjb250aW51ZVwiIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XG4gIH1cblxuICBjb250aW51ZSgpIHtcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xuICAgIHRoaXMuc3RlcCgpO1xuICB9XG5cbiAgc3RlcCgpIHtcbiAgICBpZiAodGhpcy5yZXNvbHZlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXNvbHZlKHsgdHlwZTogXCJzdGVwXCIgfSk7XG4gICAgICB0aGlzLnJlc29sdmUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0ZXBCYWNrKCkge1xuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xuICAgICAgICB0aGlzLnJlc29sdmUoe1xuICAgICAgICAgIHR5cGU6IFwiYmFja1wiLFxuICAgICAgICAgIG1lbWVudG86IHRoaXMubWVtZXRvU3RhY2sucG9wKCksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc29sdmUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIOyLnOqwge2ZlOuQnCDsiJjrj4Qg7L2U65Oc7J2YIO2VmOydtOudvOydtO2KuOulvCDsl4bslbBcbiAgY29kZURlZmF1bHQoKXtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW47XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gJyc7XG4gICAgfVxuICB9XG5cbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7Yq57KCVIOykhOydhCDtlZjsnbTrnbzsnbTtirhcbiAgY29kZUhpZ2hsaWdodCguLi5saW5lKSB7XG4gICAgY29uc3QgcHNldWRvQ29kZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHNldWRvLWNvZGUtY29udGFpbmVyXCIpO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZHJlbltpXS5zdHlsZS5jb2xvciA9ICcnO1xuICAgIH1cblxuICAgIGZvciAobGV0IG1hbmdvID0gMDsgbWFuZ28gPCBsaW5lLmxlbmd0aDsgbWFuZ28rKykge1xuICAgICAgY29uc3QgY29kZUVsZW1lbnQgPSBjaGlsZHJlbltsaW5lW21hbmdvXS0xXTtcbiAgICAgIGNvZGVFbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjQjY5QUU3XCI7XG4gICAgfVxuICB9XG5cbiAgcHVzaE1lbWVudG8obWVtZW50bykge1xuICAgIHRoaXMubWVtZXRvU3RhY2sucHVzaChtZW1lbnRvKTtcbiAgfVxuXG4gIHNodWZmbGUoKSB7XG5cbiAgICB0aGlzLnNldERlc2NyaXB0aW9uKFwiXCIpO1xuICAgIFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICBmb3IgKGxldCBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcbiAgICB9XG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67iU66GdIOyDiSDstIjquLDtmZRcblxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XG5cbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pO1xuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHRyYW5zWCk7XG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBudWxsKTsgLy8g67iU66Gd7J2YIERPTeydhCDsu6jthYzsnbTrhIjsnZgg66eoIOuBneycvOuhnCDsnbTrj5lcblxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgfVxuXG4gIC8vIO2YhOyerCDsi5zqsIHtmZTrkJjripQg64uo6rOE7J2YIOyEpOuqhSDshKTsoJVcbiAgLy8g7Iuc6rCB7ZmUIOy7qO2FjOydtOuEiCDtlZjri6jsl5Ag7ZGc7Iuc65CoXG4gIHNldERlc2NyaXB0aW9uKHRleHQpIHtcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZChcInNvcnQtZGVzY3JpcHRpb25cIik7XG4gICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gdGV4dDtcbiAgfVxuXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7XG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XG4gICAgLy8gd2lkdGg6TnVtYmVyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcblxuICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XG5cbiAgICAvLyDruJTroZ0g7YGs6riwIOuwlOq+uOq4sFxuICAgIHRoaXMuYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcblxuICAgICAgY29uc3QgbmV3WCA9IGluZGV4ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XG4gICAgICBibG9jay5zZXRYUG9zaXRpb24obmV3WCk7XG5cbiAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXG4gICAgICBibG9jay5zZXRXaWR0aChibG9ja1dpZHRoKTtcblxuICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEJsb2NrKGJsb2NrVmFsdWUpIHtcbiAgICAvLyDruJTroZ0g6rCc7IiYIOygnO2VnFxuICAgIGlmICh0aGlzLmJsb2Nrcy5sZW5ndGggPiAzMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayhcbiAgICAgIGJsb2NrVmFsdWUsXG4gICAgICB0aGlzLmNvbnRhaW5lcixcbiAgICAgIHRoaXMuYmxvY2tXaWR0aCxcbiAgICAgIHRoaXMuYmxvY2tNYXJnaW5cbiAgICApO1xuXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XG4gICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKFxuICAgICAgd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcbiAgICApO1xuXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPVxuICAgICAgcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xuICB9XG5cbiAgc2V0RGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcbiAgfVxuXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xuICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24odGhpcy5hbmltYXRpb25EZWxheSlcbiAgICApO1xuICB9XG5cbiAgLy8gdGhpcy5ibG9ja3Prpbwg7Iuc6rCB7ZmU65CY6rOg7J6I64qUIOyInOyEnOyXkCDrp57qsowg7KCV66Cs7ZWY64qUIO2VqOyImFxuICByZWZyZXNoQmxvY2tzKCkge1xuICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xuXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcbiAgfVxuXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcbiAgYXN5bmMgc3dhcChibG9jazEsIGJsb2NrMikge1xuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcblxuICAgIGNvbnN0IHgxID0gYmxvY2sxLmdldFhQb3NpdGlvbigpO1xuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xuXG4gICAgYmxvY2sxLnNldFhQb3NpdGlvbih4Mik7XG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XG5cbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XG4gIH1cblxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPripQg7ZWo7IiYIFxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXG4gIGFzeW5jIGluc2VydEF0KGJsb2NrLCBkZXN0SW5kZXgpIHtcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGJsb2NrLnNldFhQb3NpdGlvbihkZXN0SW5kZXggKiAgKHRoaXMuYmxvY2tXaWR0aCt0aGlzLmJsb2NrTWFyZ2luKSk7XG5cbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICBhd2FpdCBibG9jay5pbnNlcnRCZWZvcmUoYmxvY2tzW2Rlc3RJbmRleF0pO1xuICB9XG5cbiAgLy8gc3RhcnQg7J24642x7Iqk67aA7YSwIGVuZCDsnbjrjbHsiqTquYzsp4AgYmxvY2sg7ZWcIOy5uOyUqSDrr7jripQg7ZWo7IiYIFxuICBhc3luYyBzaGlmdCAoc3RhcnQsIGVuZCkge1xuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgY29uc3QgYmV0d2VlbnMgPSBibG9ja3MuZmlsdGVyKChfLCBpKSA9PiBzdGFydCA8PSBpICYmIGkgPCBlbmQpO1xuXG4gICAgY29uc3QgIHhSZXN0ID0gYmV0d2VlbnMubWFwKGIgPT4gYi5nZXRYUG9zaXRpb24oKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGJldHdlZW5zW2ldLnNldFhQb3NpdGlvbih4UmVzdFtpICsgMV0pO1xuICAgIH1cbiAgICBibG9ja3NbZW5kLTFdLnNldFhQb3NpdGlvbihibG9ja3NbZW5kXS5nZXRYUG9zaXRpb24oKSk7XG4gICAgXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGJsb2Nrc1swXS5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKSkpO1xuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcbmNvbnN0IEJ1YmJsZVNvcnQgPSByZXF1aXJlKFwiLi4vYnViYmxlLXNvcnQvQnViYmxlU29ydFwiKTtcbmNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKFwiLi4vaW5zZXJ0aW9uLXNvcnQvSW5zZXJ0aW9uU29ydFwiKTtcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcbmNvbnN0IFF1aWNrU29ydCA9IHJlcXVpcmUoXCIuLi9xdWljay1zb3J0L1F1aWNrU29ydFwiKTtcblxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGEtY29udGFpbmVyXCIpO1xuXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1YmJsZS1zb3J0LXJhZGlvXCIpO1xuY29uc3QgaW5zZXJ0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNlcnRpb24tc29ydC1yYWRpb1wiKTtcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XG5jb25zdCBxdWlja1NvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVpY2stc29ydC1yYWRpb1wiKTtcblxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxuY29uc3QgZGVsYXlSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0aW9uLWRlbGF5LXJhbmdlXCIpO1xuXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XG5jb25zdCBkZWxheUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXRcIik7XG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0IEJ1dHRvblxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcblxuLy8g7Iuc6rCB7ZmUIOu4lOuhnSDtgazquLAgUmFuZ2VcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcblxuLy8g7IKs7Jqp7J6Q66Gc67aA7YSwIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7J6F66Cl67Cb64qUIElucHV0IFRleHRcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWFkZC1idG5cIik7XG5cbi8vIOygleugrCDsi5zsnpEgQnV0dG9uXG5jb25zdCBzb3J0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWJ0blwiKTtcblxuLy8g7KCV66CsIOykkeyngCBCdXR0b25cbmNvbnN0IHNvcnRTdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0b3AtYnRuXCIpO1xuXG4vLyDsoJXroKwg7KeE7ZaJIEJ1dHRvblxuY29uc3Qgc29ydENvbnRpbnVlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LWNvbnRpbnVlLWJ0blwiKTtcblxuLy8g7KCV66CsIOyKpO2FnSBCdXR0b25cbmNvbnN0IHNvcnRTdGVwQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYnRuXCIpO1xuXG4vLyDsoJXroKwg65Kk66GcIOyKpO2FnSBCdXR0b25cbmNvbnN0IHNvcnRTdGVwQmFja0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJhY2stYnRuXCIpO1xuXG4vLyDruJTroZ0g7ISe6riwIEJ1dHRvblxuY29uc3QgYmxvY2tTaHVmZmxlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9jay1zaHVmZmxlLWJ0blwiKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoY291bnQgPSAyMCkge1xuICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBjb3VudCkge1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY1ICsgMSk7XG4gICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbi8vIFNvcnQg7JWM6rOg66as7KaYIO2BtOuemOyKpOulvCDrsJvslYTshJwg7KCV66Cs7J2EIOyLnFxuY29uc3QgbWFrZVNvcnRSYWRpb09uY2hhbmdlID0gU29ydEFsZ29yaXRobSA9PiAoKSA9PiB7XG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcbiAgICBzb3J0LmNvbnRhaW5lcixcbiAgICBzb3J0LmJsb2NrcyxcbiAgICBzb3J0LmRlbGF5LFxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXG4gICAgc29ydC5ibG9ja1dpZHRoLFxuICAgIHNvcnQuYmxvY2tNYXJnaW4sXG4gICAgc29ydC5kZXNjcmlwdGlvblxuICApO1xufTtcblxuXG5idWJibGVTb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoQnViYmxlU29ydCk7XG5pbnNlcnRpb25Tb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoSW5zZXJ0aW9uU29ydCk7XG5zZWxlY3Rpb25Tb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoU2VsZWN0aW9uU29ydCk7XG5xdWlja1NvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShRdWlja1NvcnQpO1xuXG5cbmxldCBzb3J0ID0gbmV3IEJ1YmJsZVNvcnQoY29udGFpbmVyKTtcbmdlbmVyYXRlVW5pcXVlVmFsdWVzKCkuZm9yRWFjaCh2YWx1ZSA9PiBzb3J0LmFkZEJsb2NrKHZhbHVlKSk7XG5cbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcblxuICBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcbn07XG5cbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xuLy8gICBjb25zdCBkZWxheSA9IE51bWJlcihkZWxheVJhbmdlLm1heCkgLSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xuXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuLy8gICBzb3J0LnNldERlbGF5KGRlbGF5KTtcbi8vICAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcbi8vIH1cblxuZGVsYXlJbnB1dC5vbmtleWRvd24gPSBlID0+IHtcbiAgLy8g7JeU7YSw7YKk66W8IOuIhOuluCDqsr3smrBcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXG4gICAgLy8gZGVsYXlJbnB1dEJ0buyXkCBjbGljayDsnbTrsqTtirgg7Yq466as6rGwXG4gICAgZGVsYXlJbnB1dEJ0bi5jbGljaygpO1xufVxuZGVsYXlJbnB1dEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XG4gIH0gZWxzZSBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSkge1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcbiAgfVxuXG4gIGNvbnN0IGRlbGF5ID1cbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcbiAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xufTtcblxuLy8gVE9ETzogU29ydC5zZXRCbG9ja1dpZHRoIOyZhOyEse2VnCDrkqQgc2l6ZSByYW5nZeydmCBpbnZpc2libGUg7ZKA6riwXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcbiAgY29uc3Qgc2l6ZSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG4gIHNvcnQuc2V0QmxvY2tXaWR0aChzaXplKTtcbn07XG5cbm5ld0RhdGFJbnB1dC5vbmtleWRvd24gPSBlID0+IHtcbiAgLy8g7JeU7YSw7YKk66W8IOuIhOuluCDqsr3smrBcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXG4gICAgLy8gbmV3RGF0YUFkZEJ0buyXkCBjbGljayDsnbTrsqTtirgg7Yq466as6rGwXG4gICAgbmV3RGF0YUFkZEJ0bi5jbGljaygpO1xufVxuXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcbiAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSBcIlwiKSByZXR1cm47XG5cbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcblxuICBzb3J0LmFkZEJsb2NrKHZhbHVlKTtcbn07XG5cblxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcbmZ1bmN0aW9uIGRpc2FibGVJbnB1dHMoKSB7XG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcblxuICBzaXplUmFuZ2UuZGlzYWJsZWQgPSB0cnVlO1xuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGJsb2NrU2h1ZmZsZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG59XG4vLyDsoJXroKzsnbQg64Gd64KcIO2bhCBJbnB1dOuTpOydhCDtmZzshLHtmZRcbmZ1bmN0aW9uIGVuYWJsZUlucHV0cygpIHtcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcblxuICBzaXplUmFuZ2UuZGlzYWJsZWQgPSBmYWxzZTtcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGJsb2NrU2h1ZmZsZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xufVxuXG5zb3J0QnRuLm9uY2xpY2sgPSBlID0+IHtcblxuICBkaXNhYmxlSW5wdXRzKCk7IC8vIOygleugrOydtCDsi5zsnpHrkKAg65WMIOu5hO2ZnOyEse2ZlFxuXG4gIHNvcnQuc29ydCgpLnRoZW4oZW5hYmxlSW5wdXRzKVxufTtcblxuc29ydFN0b3BCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LnN0b3AoKTtcbn07XG5cbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuY29udGludWUoKTtcbn07XG5cbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zdGVwKCk7XG59O1xuXG5zb3J0U3RlcEJhY2tCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LnN0ZXBCYWNrKCk7XG59XG5cbmJsb2NrU2h1ZmZsZUJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuc2h1ZmZsZSgpO1xufTtcbiJdfQ==
