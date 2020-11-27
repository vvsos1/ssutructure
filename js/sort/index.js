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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZSggIFxyXG5gXHJcbmZ1bmN0aW9uIGJ1YmJsZVNvcnQoQSwgbikge1xyXG4gIGZvciAobGV0IGxhc3QgPSBuOyBsYXN0IDw9IDI7IGxhc3QtLSlcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGxhc3QgLSAxOyBpKyspXHJcbiAgICAgIGlmIChBW2ldID4gQVtpICsgMV0pXHJcbiAgICAgICAgc3dhcChBW2ldLEFbaSsxXSlcclxufWBcclxuICAgIClcclxuICB9XHJcbiAgXHJcbiAgXHJcblxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuXHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTspIHtcclxuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgIFxyXG4gICAgICAgIC8vIOyCrOyaqeyekOqwgCDri6TsnYwg7Iqk7YWd7Jy866GcIOuEmOyWtOqwgOq4sCDsoIQg6rmM7KeAKHRoaXMuY29udGludWUoKSBvciB0aGlzLnN0ZXAoKSkg6riw64uk66a8XHJcbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcclxuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcclxuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xyXG4gICAgICAgICAgLy8gVE9ETzogXHJcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuY29kZURlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNSk7XHJcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmFsdWUyfSDruYTqtZBgKTtcclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XHJcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNik7XHJcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOuzgOqyvWApO1xyXG4gICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XHJcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgais9IDE7XHJcbiAgICAgIH1cclxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW24taS0xXS5nZXRWYWx1ZSgpfSDruJTroZ0g7KCV66CsIOyZhOujjGApO1xyXG4gICAgICBpICs9IDFcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgICB0aGlzLmRyYXdQc2V1ZG9Db2RlKFxyXG5gXHJcbmZ1bmN0aW9uIGluc2VydGlvblNvcnQoQSwgbikge1xyXG4gIGZvciAobGV0IGkgPSAyOyBpIDw9IG47IGkrKykge1xyXG4gICAgbGV0IGtleSA9IEFbaV1cclxuICAgIGxldCBqID0gMFxyXG4gICAgd2hpbGUgKGogPCBpICYmIEFbal0gPCBrZXkpXHJcbiAgICAgIGorK1xyXG4gICAgc2hpZnQoQSxqLGkpIFxyXG4gICAgQVtqXSA9IGtleSBcclxuICB9XHJcbn1gKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQoKSB7XHJcblxyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG5cclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcblxyXG4gICAgYmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47KSB7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XHJcblxyXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTspIHtcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J20IOuTpOyWtOqwiCDsnITsuZjrpbwg7YOQ7IOJYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNiw3KTtcclxuXHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgICBpZiAodmFsdWUgPiB0YXJnZXQpIHtcclxuICAgICAgICAgIGRlc3RJbmRleCA9IGo7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgais9MTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOCk7XHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5zaGlmdChkZXN0SW5kZXgsIGkpO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XHJcbiAgICAgICAgaWYgKGRlc3RJbmRleCAhPSAwKVxyXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleC0xXS5nZXRWYWx1ZSgpfSDruJTroZ3qs7wgJHtibG9ja3NbZGVzdEluZGV4XS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7IKs7J207JeQIOyCveyehWApO1xyXG4gICAgICAgIGVsc2UgaWYgKGRlc3RJbmRleCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleF0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOychOy5mOyXkCDsgr3snoVgKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7JyE7LmYIOuzgOqyvSDsl4bsnYxgKTtcclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFF1aWNrU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KGxlZnQgPSAwLCByaWdodCA9IHRoaXMuYmxvY2tzLmxlbmd0aCAtIDEpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgbGV0IGxzdGFjayA9IFtdO1xyXG4gICAgbGV0IHJzdGFjayA9IFtdO1xyXG5cclxuICAgIGxzdGFjay5wdXNoKGxlZnQpO1xyXG4gICAgcnN0YWNrLnB1c2gocmlnaHQpO1xyXG5cclxuICAgIHdoaWxlIChsc3RhY2subGVuZ3RoICE9IDApIHtcclxuICAgICAgbGV0IHBsID0gKGxlZnQgPSBsc3RhY2sucG9wKCkpOyAvLyDsmbzsqr0g7Luk7IScXHJcbiAgICAgIGxldCBwciA9IChyaWdodCA9IHJzdGFjay5wb3AoKSk7IC8vIOyYpOuluOyqvSDsu6TshJxcclxuICAgICAgbGV0IHBpdm90SWR4ID0gTWF0aC5jZWlsKChsZWZ0ICsgcmlnaHQpIC8gMik7XHJcbiAgICAgIGxldCBwaXZvdCA9IGJsb2Nrc1twaXZvdElkeF07IC8vIO2UvOuyl1xyXG5cclxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDiSDrs4Dqsr1cclxuICAgICAgYmxvY2tzXHJcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXHJcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckJvdW5kYXJ5KCkpO1xyXG4gICAgICAvLyDtlLzrspfsnZgg7IOJIOuzgOqyvVxyXG4gICAgICBwaXZvdC5zZXRDb2xvclBpdm90KCk7XHJcblxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgd2hpbGUgKGJsb2Nrc1twbF0uZ2V0VmFsdWUoKSA8IHBpdm90LmdldFZhbHVlKCkpIHBsKys7XHJcbiAgICAgICAgd2hpbGUgKGJsb2Nrc1twcl0uZ2V0VmFsdWUoKSA+IHBpdm90LmdldFZhbHVlKCkpIHByLS07XHJcblxyXG4gICAgICAgIGJsb2Nrc1twbF0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICBibG9ja3NbcHJdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgLy8gcGwg65iQ64qUIHBy7J20IHBpdm906rO8IOqyueyzkOuPhCBwaXZvdOydmCDsg4nsnYQg7Jyg7KeAXHJcbiAgICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHR5cGUsIG1lbWVudG8gfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG5cclxuICAgICAgICAvLyDsg4Htg5wg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiKSB7XHJcbiAgICAgICAgICAoeyBsc3RhY2ssIHJzdGFjaywgcGwsIHByLCBsZWZ0LCByaWdodCwgcGl2b3RJZHggfSA9IG1lbWVudG8pO1xyXG4gICAgICAgICAgcGl2b3QgPSBibG9ja3NbcGl2b3RJZHhdO1xyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IGNvbG9yLCB4UG9zaXRpb24sIHZhbHVlLCB3aWR0aCB9ID0gcHJldkJsb2NrO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g7ZiE7J6sIOyDge2DnOulvCDsiqTtg53sl5Ag7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7XHJcbiAgICAgICAgICBwbCxcclxuICAgICAgICAgIHByLFxyXG4gICAgICAgICAgcGl2b3RJZHgsXHJcbiAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgICAgcmlnaHQsXHJcbiAgICAgICAgICBsc3RhY2s6IFsuLi5sc3RhY2ssIHBsXSxcclxuICAgICAgICAgIHJzdGFjazogWy4uLnJzdGFjaywgcHJdLFxyXG4gICAgICAgICAgYmxvY2tzOiBbLi4uYmxvY2tzXS5tYXAoKGJsb2NrKSA9PiAoeyAuLi5ibG9jayB9KSksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChwbCA8PSBwcikge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1twbCsrXSwgYmxvY2tzW3ByLS1dKTtcclxuICAgICAgICAgIC8vIHN3YXAoYmxvY2tzLCBwbCsrLCBwci0tKTtcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBibG9ja3NbcGwgLSAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgICAgYmxvY2tzW3ByICsgMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xyXG4gICAgICB9IHdoaWxlIChwbCA8PSBwcik7XHJcblxyXG4gICAgICBpZiAobGVmdCA8IHByKSB7XHJcbiAgICAgICAgbHN0YWNrLnB1c2gobGVmdCk7XHJcbiAgICAgICAgcnN0YWNrLnB1c2gocHIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwbCA8IHJpZ2h0KSB7XHJcbiAgICAgICAgbHN0YWNrLnB1c2gocGwpO1xyXG4gICAgICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJ7J2EIOybkOuemOuMgOuhnCDrs4Dqsr1cclxuICAgICAgYmxvY2tzXHJcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXHJcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG5cclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICBsZXQgbWluO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7KSB7XHJcbiAgICAgIG1pbiA9IGk7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7IC8vIGkrMeuyiOu2gO2EsG4tMeuyiOq5jOyngOydmCDruJTrn63snYQg7LCo66GA64yA66GcIOu5qOqwhOyDieycvOuhnFxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpOyAvL+uzgOyImCDshKTsoJVcclxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIG1pbiA9IGo7XHJcbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTsgLy8g67iU65+tIOyytOyduOyngFxyXG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXHJcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCAg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruajqsITsg4kg67iU65+t7J2EIOuLpOyLnCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICBqICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XHJcbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0O1xyXG4iLCJjbGFzcyBCbG9jayB7XHJcbiAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcclxuICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lciwgYmxvY2tXaWR0aCA9IDI4LCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikuZmlsdGVyKGRvbSA9PiBkb20uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9jaycpKS5sZW5ndGg7XHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XHJcblxyXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgXHJcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xyXG5cclxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgIHRoaXMuc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcclxuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XHJcblxyXG4gICAgLy8g7ZmU66m07JeQIOu4lOuhnSDtkZzsi5xcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgfVxyXG4gIHN3YXBCbG9jayhibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSB0aGlzLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jay5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG5leHRPZlRhcmdldDEpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluc2VydEJlZm9yZShibG9jaykge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgYmxvY2suZG9tKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XHJcbiAgICB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiA9IG1pbGxpcztcclxuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3RoaXMudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcclxuICB9XHJcblxyXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgIC8vIHJldHVybiBOdW1iZXIoXHJcbiAgICAvLyAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS50cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgMClcclxuICAgIC8vICk7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgfVxyXG5cclxuICBzZXRYUG9zaXRpb24oeCkge1xyXG4gICAgdGhpcy54UG9zaXRpb24gPSB4O1xyXG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLnhQb3NpdGlvbn1weClgO1xyXG4gIH1cclxuXHJcbiAgZ2V0WFBvc2l0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xyXG4gICAgLy8gY29uc3QgcmVnRXhwVHJhbnNYID0gL1tcXHddK1xcKFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT9bXFxkXStbIF0/LFsgXT8oW1xcZF0rKVsgXT8sWyBdP1tcXGRdK1sgXT9cXCkvO1xyXG4gICAgLy8gY29uc3QgdHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zZm9ybTtcclxuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xyXG4gIH1cclxuXHJcbiAgc2V0V2lkdGgocHgpIHtcclxuICAgIHRoaXMud2lkdGggPSBweDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gYCR7dGhpcy53aWR0aH1weGA7XHJcbiAgfVxyXG4gIGdldFdpZHRoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcihjb2xvcikge1xyXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgfVxyXG5cclxuICBnZXRDb2xvcigpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JZZWxsb3coKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGRjAwXCI7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRkZGMDBcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclJlZCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNCNjlBRTdcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0I2OUFFN1wiOyAvL+yEoO2DneuQnCDruJTroZ0gOiDruajqsJUgLT4g7Jew67O06528XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGOUZCM1wiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY5RkIzXCI7IC8v6riw67O4IOu4lOuhnTog7YyM656RIC0+IOyXsO2Vke2BrFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckdyZWVuKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGNkM3N1wiO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY2Qzc3XCI7IC8v7KCV66CsIOuBneuCnCDruJTroZ06IOq3uOumsCjstIjroZ0pIC0+IOywkO2Vke2BrFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQgUGl2b3Qg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JQaXZvdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiM5RjcwRjFcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzlGNzBGMVwiOyAvL+2UvOuylyDruJTroZ0gOiDtmJXqtJEg7ZWR7YGsIC0+ICDssJDrs7TrnbxcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOqyveqzhOulvCDrgpjtg4DrgrTripQg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JCb3VuZGFyeSgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBcIiNGNUUzNDhcIjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0Y1RTM0OFwiOyAvLyDruJTrn60g6rK96rOEIDog67O06528IC0+IOuFuOuekSBcclxuICB9XHJcblxyXG4gIHNldFZhbHVlKHZhbHVlKXtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XHJcbiAgICBjb25zdCBtYXhIaWdodCA9XHJcbiAgICAgIE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSAyNDtcclxuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gYCR7YmxvY2tIaWdodCA8IG1heEhpZ2h0ID8gYmxvY2tIaWdodCA6IG1heEhpZ2h0fXB4YDtcclxuXHJcbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gIGdldFZhbHVlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuL0Jsb2NrXCIpO1xyXG5cclxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXHJcbmNsYXNzIFNvcnQge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29udGFpbmVyLFxyXG4gICAgYmxvY2tzID0gW10sXHJcbiAgICBkZWxheSA9IDIwMCxcclxuICAgIGFuaW1hdGlvbkRlbGF5ID0gMjUwLFxyXG4gICAgYmxvY2tXaWR0aCA9IDI4LFxyXG4gICAgYmxvY2tNYXJnaW4gPSAyLFxyXG4gICAgZGVzY3JpcHRpb25cclxuICApIHtcclxuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgIC8vIOu4lOuhneydhCDsi5zqsIHtmZQg7ZWgIOy7qO2FjOydtOuEiCBET01cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XHJcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIC8vIOu4lOuhneydmCDrhIjruYRcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxyXG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xyXG5cclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuXHJcbiAgICAvLyDsoJXroKzsnbQg7ZiE7J6sIOyLpO2WieykkeyduCDsg4Htg5xcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxyXG4gICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XHJcblxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8g7IiY64+EIOy9lOuTnCDrrLjsnpDsl7TsnYQg67Cb7JWE7IScIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7Jqw7Lih7JeQIOuztOyXrOykjFxyXG4gIGRyYXdQc2V1ZG9Db2RlKHBzZXVkb0NvZGUpe1xyXG4gICAgY29uc3QgcHNldWRvQ29kZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHNldWRvLWNvZGUtY29udGFpbmVyXCIpO1xyXG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDsiJjrj4TsvZTrk5wg7IKt7KCcXHJcbiAgICBBcnJheS5mcm9tKHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQ9PmNoaWxkLnJlbW92ZSgpKTtcclxuICAgIHBzZXVkb0NvZGVDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIFxyXG4gICAgLy8g7KSE67OE66GcXHJcbiAgICBwc2V1ZG9Db2RlLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XHJcbiAgICAgIHBzZXVkb0NvZGVDb250YWluZXIuaW5uZXJIVE1MICs9IGA8Y29kZT4ke2xpbmV9PC9jb2RlPiR7J1xcbid9YFxyXG4gICAgfSlcclxuXHJcbiAgfVxyXG5cclxuICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgc29ydCgpIHt9XHJcblxyXG4gIHdhaXQoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTdG9wKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnRpbnVlKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RlcCgpO1xyXG4gIH1cclxuXHJcbiAgc3RlcCgpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZSh7IHR5cGU6IFwic3RlcFwiIH0pO1xyXG4gICAgICB0aGlzLnJlc29sdmUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RlcEJhY2soKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvbHZlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZSh7XHJcbiAgICAgICAgICB0eXBlOiBcImJhY2tcIixcclxuICAgICAgICAgIG1lbWVudG86IHRoaXMubWVtZXRvU3RhY2sucG9wKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7ZWY7J2065287J207Yq466W8IOyXhuyVsFxyXG4gIGNvZGVEZWZhdWx0KCl7XHJcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjaGlsZHJlbltpXS5zdHlsZS5jb2xvciA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7Yq57KCVIOykhOydhCDtlZjsnbTrnbzsnbTtirhcclxuICBjb2RlSGlnaGxpZ2h0KC4uLmxpbmUpIHtcclxuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW47XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgbWFuZ28gPSAwOyBtYW5nbyA8IGxpbmUubGVuZ3RoOyBtYW5nbysrKSB7XHJcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gY2hpbGRyZW5bbGluZVttYW5nb10tMV07XHJcbiAgICAgIGNvZGVFbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjQjY5QUU3XCI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXNoTWVtZW50byhtZW1lbnRvKSB7XHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrLnB1c2gobWVtZW50byk7XHJcbiAgfVxyXG5cclxuICBzaHVmZmxlKCkge1xyXG5cclxuICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oXCJcIik7XHJcbiAgICBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXHJcbiAgICAgIFtibG9ja3NbaV0sIGJsb2Nrc1tqXV0gPSBbYmxvY2tzW2pdLCBibG9ja3NbaV1dOyAvLyDshZTtlIxcclxuICAgIH1cclxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICBibG9jay5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67iU66GdIOyDiSDstIjquLDtmZRcclxuXHJcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKTtcclxuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHRyYW5zWCk7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG51bGwpOyAvLyDruJTroZ3snZggRE9N7J2EIOy7qO2FjOydtOuEiOydmCDrp6gg64Gd7Jy866GcIOydtOuPmVxyXG5cclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICB9XHJcblxyXG4gIC8vIO2YhOyerCDsi5zqsIHtmZTrkJjripQg64uo6rOE7J2YIOyEpOuqhSDshKTsoJVcclxuICAvLyDsi5zqsIHtmZQg7Luo7YWM7J2064SIIO2VmOuLqOyXkCDtkZzsi5zrkKhcclxuICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XHJcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJzb3J0LWRlc2NyaXB0aW9uXCIpO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgc2V0QmxvY2tXaWR0aChibG9ja1dpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XHJcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XHJcbiAgICAvLyB3aWR0aDpOdW1iZXJcclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XHJcblxyXG4gICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG5cclxuICAgIC8vIOu4lOuhnSDtgazquLAg67CU6r646riwXHJcbiAgICB0aGlzLmJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XHJcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XHJcblxyXG4gICAgICBjb25zdCBuZXdYID0gaW5kZXggKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcclxuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKG5ld1gpO1xyXG5cclxuICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcclxuICAgICAgYmxvY2suc2V0V2lkdGgoYmxvY2tXaWR0aCk7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEJsb2NrKGJsb2NrVmFsdWUpIHtcclxuICAgIC8vIOu4lOuhnSDqsJzsiJgg7KCc7ZWcXHJcbiAgICBpZiAodGhpcy5ibG9ja3MubGVuZ3RoID4gMzApIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBibG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKFxyXG4gICAgICBibG9ja1ZhbHVlLFxyXG4gICAgICB0aGlzLmNvbnRhaW5lcixcclxuICAgICAgdGhpcy5ibG9ja1dpZHRoLFxyXG4gICAgICB0aGlzLmJsb2NrTWFyZ2luXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKFxyXG4gICAgICB3aW5kb3dcclxuICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcilcclxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoXCJweFwiLCBcIlwiKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9XHJcbiAgICAgIHByZXZXaWR0aCArICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKSArIFwicHhcIjtcclxuICB9XHJcblxyXG4gIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcclxuICB9XHJcblxyXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24odGhpcy5hbmltYXRpb25EZWxheSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyB0aGlzLmJsb2Nrc+ulvCDsi5zqsIHtmZTrkJjqs6DsnojripQg7Iic7ISc7JeQIOunnuqyjCDsoJXroKztlZjripQg7ZWo7IiYXHJcbiAgcmVmcmVzaEJsb2NrcygpIHtcclxuICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxyXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICBhc3luYyBzd2FwKGJsb2NrMSwgYmxvY2syKSB7XHJcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXHJcblxyXG4gICAgY29uc3QgeDEgPSBibG9jazEuZ2V0WFBvc2l0aW9uKCk7XHJcbiAgICBjb25zdCB4MiA9IGJsb2NrMi5nZXRYUG9zaXRpb24oKTtcclxuXHJcbiAgICBibG9jazEuc2V0WFBvc2l0aW9uKHgyKTtcclxuICAgIGJsb2NrMi5zZXRYUG9zaXRpb24oeDEpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2sxLnN3YXBCbG9jayhibG9jazIpO1xyXG4gIH1cclxuXHJcbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj64qUIO2VqOyImCBcclxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgYmxvY2suc2V0WFBvc2l0aW9uKGRlc3RJbmRleCAqICAodGhpcy5ibG9ja1dpZHRoK3RoaXMuYmxvY2tNYXJnaW4pKTtcclxuXHJcbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgIGF3YWl0IGJsb2NrLmluc2VydEJlZm9yZShibG9ja3NbZGVzdEluZGV4XSk7XHJcbiAgfVxyXG5cclxuICAvLyBzdGFydCDsnbjrjbHsiqTrtoDthLAgZW5kIOyduOuNseyKpOq5jOyngCBibG9jayDtlZwg7Lm47JSpIOuvuOuKlCDtlajsiJggXHJcbiAgYXN5bmMgc2hpZnQgKHN0YXJ0LCBlbmQpIHtcclxuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG5cclxuICAgIGNvbnN0IGJldHdlZW5zID0gYmxvY2tzLmZpbHRlcigoXywgaSkgPT4gc3RhcnQgPD0gaSAmJiBpIDwgZW5kKTtcclxuXHJcbiAgICBjb25zdCAgeFJlc3QgPSBiZXR3ZWVucy5tYXAoYiA9PiBiLmdldFhQb3NpdGlvbigpKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIGJldHdlZW5zW2ldLnNldFhQb3NpdGlvbih4UmVzdFtpICsgMV0pO1xyXG4gICAgfVxyXG4gICAgYmxvY2tzW2VuZC0xXS5zZXRYUG9zaXRpb24oYmxvY2tzW2VuZF0uZ2V0WFBvc2l0aW9uKCkpO1xyXG4gICAgXHJcblxyXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBibG9ja3NbMF0uZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkpKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4uL3NvcnQvQmxvY2tcIik7XHJcbmNvbnN0IEJ1YmJsZVNvcnQgPSByZXF1aXJlKFwiLi4vYnViYmxlLXNvcnQvQnViYmxlU29ydFwiKTtcclxuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0XCIpO1xyXG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZShcIi4uL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnRcIik7XHJcbmNvbnN0IFF1aWNrU29ydCA9IHJlcXVpcmUoXCIuLi9xdWljay1zb3J0L1F1aWNrU29ydFwiKTtcclxuXHJcbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxyXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGEtY29udGFpbmVyXCIpO1xyXG5cclxuLy8g7KCV66CsIOyiheulmCBSYWRpb1xyXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1YmJsZS1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBpbnNlcnRpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2VydGlvbi1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdGlvbi1zb3J0LXJhZGlvXCIpO1xyXG5jb25zdCBxdWlja1NvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVpY2stc29ydC1yYWRpb1wiKTtcclxuXHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcclxuY29uc3QgZGVsYXlSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5pbWF0aW9uLWRlbGF5LXJhbmdlXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dFxyXG5jb25zdCBkZWxheUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXRcIik7XHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXQgQnV0dG9uXHJcbmNvbnN0IGRlbGF5SW5wdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dC1idG5cIik7XHJcblxyXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxyXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XHJcblxyXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxyXG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xyXG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cclxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsi5zsnpEgQnV0dG9uXHJcbmNvbnN0IHNvcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOykkeyngCBCdXR0b25cclxuY29uc3Qgc29ydFN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RvcC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KeE7ZaJIEJ1dHRvblxyXG5jb25zdCBzb3J0Q29udGludWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtY29udGludWUtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyKpO2FnSBCdXR0b25cclxuY29uc3Qgc29ydFN0ZXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg65Kk66GcIOyKpO2FnSBCdXR0b25cclxuY29uc3Qgc29ydFN0ZXBCYWNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYmFjay1idG5cIik7XHJcblxyXG4vLyDruJTroZ0g7ISe6riwIEJ1dHRvblxyXG5jb25zdCBibG9ja1NodWZmbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2NrLXNodWZmbGUtYnRuXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoY291bnQgPSAyMCkge1xyXG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xyXG4gIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgY291bnQpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY1ICsgMSk7XHJcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdmFsdWVzO1xyXG59XHJcblxyXG4vLyBTb3J0IOyVjOqzoOumrOymmCDtgbTrnpjsiqTrpbwg67Cb7JWE7IScIOygleugrOydhCDsi5xcclxuY29uc3QgbWFrZVNvcnRSYWRpb09uY2hhbmdlID0gU29ydEFsZ29yaXRobSA9PiAoKSA9PiB7XHJcbiAgc29ydCA9IG5ldyBTb3J0QWxnb3JpdGhtKFxyXG4gICAgc29ydC5jb250YWluZXIsXHJcbiAgICBzb3J0LmJsb2NrcyxcclxuICAgIHNvcnQuZGVsYXksXHJcbiAgICBzb3J0LmFuaW1hdGlvbkRlbGF5LFxyXG4gICAgc29ydC5ibG9ja1dpZHRoLFxyXG4gICAgc29ydC5ibG9ja01hcmdpbixcclxuICAgIHNvcnQuZGVzY3JpcHRpb25cclxuICApO1xyXG59O1xyXG5cclxuXHJcbmJ1YmJsZVNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShCdWJibGVTb3J0KTtcclxuaW5zZXJ0aW9uU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEluc2VydGlvblNvcnQpO1xyXG5zZWxlY3Rpb25Tb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoU2VsZWN0aW9uU29ydCk7XHJcbnF1aWNrU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKFF1aWNrU29ydCk7XHJcblxyXG5cclxubGV0IHNvcnQgPSBuZXcgQnViYmxlU29ydChjb250YWluZXIpO1xyXG5nZW5lcmF0ZVVuaXF1ZVZhbHVlcygpLmZvckVhY2godmFsdWUgPT4gc29ydC5hZGRCbG9jayh2YWx1ZSkpO1xyXG5cclxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XHJcbiAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG5cclxuICBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbiktIGRlbGF5OyAvLyBkZWxheUlucHV06rO8IOqwkiDrj5nquLDtmZRcclxufTtcclxuXHJcbi8vIGRlbGF5SW5wdXQub25pbnB1dCA9IGUgPT4ge1xyXG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcblxyXG4vLyAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4vLyAgIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxuLy8gfVxyXG5cclxuZGVsYXlJbnB1dC5vbmtleWRvd24gPSBlID0+IHtcclxuICAvLyDsl5TthLDtgqTrpbwg64iE66W4IOqyveyasFxyXG4gIGlmIChlLmtleUNvZGUgPT09IDEzKVxyXG4gICAgLy8gZGVsYXlJbnB1dEJ0buyXkCBjbGljayDsnbTrsqTtirgg7Yq466as6rGwXHJcbiAgICBkZWxheUlucHV0QnRuLmNsaWNrKCk7XHJcbn1cclxuZGVsYXlJbnB1dEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7J6F66Cl6rCS7J20IOuylOychOulvCDrhJjslrTshJzrqbQg6rK96rOE6rCS7Jy866GcIOyEpOyglVxyXG4gIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPiBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XHJcbiAgfSBlbHNlIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPCBOdW1iZXIoZGVsYXlSYW5nZS5taW4pKSB7XHJcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5taW47XHJcbiAgfVxyXG5cclxuICBjb25zdCBkZWxheSA9XHJcbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxuICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcclxuICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XHJcbn07XHJcblxyXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcclxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XHJcbiAgY29uc3Qgc2l6ZSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xyXG59O1xyXG5cclxubmV3RGF0YUlucHV0Lm9ua2V5ZG93biA9IGUgPT4ge1xyXG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXHJcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXHJcbiAgICAvLyBuZXdEYXRhQWRkQnRu7JeQIGNsaWNrIOydtOuypO2KuCDtirjrpqzqsbBcclxuICAgIG5ld0RhdGFBZGRCdG4uY2xpY2soKTtcclxufVxyXG5cclxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgLy8g7JWE66y06rKD64+EIOyeheugpe2VmOyngCDslYrslZjri6TrqbRcclxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIobmV3RGF0YUlucHV0LnZhbHVlKTtcclxuXHJcbiAgc29ydC5hZGRCbG9jayh2YWx1ZSk7XHJcbn07XHJcblxyXG5cclxuLy8g7KCV66CsIOuPhOykkeyXlCBJbnB1dOuTpOydhCDruYTtmZzshLHtmZRcclxuZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcclxuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxufVxyXG4vLyDsoJXroKzsnbQg64Gd64KcIO2bhCBJbnB1dOuTpOydhCDtmZzshLHtmZRcclxuZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGluc2VydGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcbnNvcnRCdG4ub25jbGljayA9IGUgPT4ge1xyXG5cclxuICBkaXNhYmxlSW5wdXRzKCk7IC8vIOygleugrOydtCDsi5zsnpHrkKAg65WMIOu5hO2ZnOyEse2ZlFxyXG5cclxuICBzb3J0LnNvcnQoKS50aGVuKGVuYWJsZUlucHV0cylcclxufTtcclxuXHJcbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0b3AoKTtcclxufTtcclxuXHJcbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5jb250aW51ZSgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RlcCgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCYWNrQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0ZXBCYWNrKCk7XHJcbn1cclxuXHJcbmJsb2NrU2h1ZmZsZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zaHVmZmxlKCk7XHJcbn07XHJcbiJdfQ==
