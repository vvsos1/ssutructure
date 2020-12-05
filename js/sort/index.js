(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
bubble sort(거품 정렬)는 서로 인접한 두 원소를 검사하여 정렬하는 알고리즘입니다.
첫 번째 원소와 두 번째 원소, 두번째 원소와 세 번째 원소, ..., n-1번째 원소와 n번째 원소를 비교, 교환하며 정렬합니다.
1회전이 끝나면 가장 큰 원소는 맨 뒤로 이동하므로 다음 회전에서는 정렬에서 제외됩니다.
이를 반복할 때마다 정렬에서 제외되는 원소가 하나씩 늘어납니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
    this.drawPseudoCode(  
`
function bubbleSort(A, n) {
  for (let last = n; last <= 2; last--)
    for (let i = 1; i <= last - 1; i++)
      if (A[i] > A[i + 1])
        swap(A[i],A[i+1])
}`
    );
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
    this.drawDescription(
`
insert sort(삽입 정렬)는 원소를 이미 정렬된 배열 부분과 비교 하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘입니다.
기존의 정렬된 배열에서 삽입 될 부분을 찾았다면 그 위치에 원소를 삽입하기 위해 원소들을 한 칸씩 뒤로 이동시킵니다.
삽입정렬의 처음 key 값은 두 번째 원소로부터 시작합니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
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
}
`
    );
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
    this.drawDescription(
`
quick sort(퀵 정렬)는 기준점(pivot)을 기준으로 두 개의 분할된 부분 리스트를 정렬한 다음 합하여 전체가 정렬된 리스트가 되게 하는 알고리즘입니다.
분할 정복 알고리즘의 하나로, 평균적으로 매우 빠른 수행 속도를 자랑합니다.

평균 시간 복잡도 : T(n) = O(n * log(n))
`
    );
    this.drawPseudoCode(
`function quickSort(A, p, r) {
  if (p < r) {
    let q = partition(A, p, r)
    quickSort(A, p, q-1)
    quickSort(A, q+1, r)
  }
}
function partition(A, p, r) {
  let pivot = A[(p+r)/2)]
  let left = p;
  let right = r;
  do {
    while (A[left] < pivot) 
      left++
    while (A[right] > pivot) 
      right--
    if (left <= right) 
       swap(A[left--],A[right++])
  } while (left <= right)
  return right >= p ? right : p
}
`
    );
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
      
      this.codeHighlight(9);
      await this.sleep("50");

      do {
        while (blocks[pl].getValue() < pivot.getValue()) pl++;
        while (blocks[pr].getValue() > pivot.getValue()) pr--;

        blocks[pl].setColorSelected();
        blocks[pr].setColorSelected();
        // pl 또는 pr이 pivot과 겹쳐도 pivot의 색을 유지
        pivot.setColorPivot();

        this.codeHighlight(13,14,15,16)

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
          this.codeHighlight(18);
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
    this.drawDescription(
`
selection sort(선택 정렬)는 해당 순서에 원소를 넣을 위치는 이미 정해져 있고, 어떤 원소를 넣을지 선택하는 알고리즘입니다.
최소값을 탐색 후 그 값을 앞에서부터 배열하는 방식입니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
    this.drawPseudoCode(  
 `
function selectionSort(A, n) {
  for(let i = 0; i < n-1; i++){
    min = i
    for(let j = i + 1; j < n; j++) {
      if(A[j] < A[min])
        min = j
    }
    if(min != i)
      swap(A[i],A[min])
  }
}
`   );
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

  // 설명을 받아서 시각화 컨테이너 우측에 보여줌
  drawDescription(description){
    const descriptionContainer = document.querySelector(".description-container");
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach(child=>child.remove());
    descriptionContainer.innerHTML = "";
    
    // 줄별로
    description.split('\n').map(line => {
      descriptionContainer.innerHTML += `<div>${line}</div>${'\n'}`
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

  sleep(millis) {
    return new Promise(res =>setTimeout(res,millis));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvQ29sb3IuanMiLCJzcmMvc29ydC9Tb3J0LmpzIiwic3JjL3NvcnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXHJcbmBcclxuYnViYmxlIHNvcnQo6rGw7ZKIIOygleugrCnripQg7ISc66GcIOyduOygke2VnCDrkZAg7JuQ7IaM66W8IOqygOyCrO2VmOyXrCDsoJXroKztlZjripQg7JWM6rOg66as7KaY7J6F64uI64ukLlxyXG7ssqsg67KI7Ke4IOybkOyGjOyZgCDrkZAg67KI7Ke4IOybkOyGjCwg65GQ67KI7Ke4IOybkOyGjOyZgCDshLgg67KI7Ke4IOybkOyGjCwgLi4uLCBuLTHrsojsp7gg7JuQ7IaM7JmAIG7rsojsp7gg7JuQ7IaM66W8IOu5hOq1kCwg6rWQ7ZmY7ZWY66mwIOygleugrO2VqeuLiOuLpC5cclxuMe2ajOyghOydtCDrgZ3rgpjrqbQg6rCA7J6lIO2BsCDsm5DshozripQg66eoIOuSpOuhnCDsnbTrj5ntlZjrr4DroZwg64uk7J2MIO2ajOyghOyXkOyEnOuKlCDsoJXroKzsl5DshJwg7KCc7Jm465Cp64uI64ukLlxyXG7snbTrpbwg67CY67O17ZWgIOuVjOuniOuLpCDsoJXroKzsl5DshJwg7KCc7Jm465CY64qUIOybkOyGjOqwgCDtlZjrgpjslKkg64qY7Ja064Kp64uI64ukLlxyXG5cclxu7Y+J6regIOyLnOqwhCDrs7XsnqHrj4QgOiBUKG4pID0gTyhuPHN1cD4yPC9zdXA+KVxyXG5gXHJcbiAgICApO1xyXG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZSggIFxyXG5gXHJcbmZ1bmN0aW9uIGJ1YmJsZVNvcnQoQSwgbikge1xyXG4gIGZvciAobGV0IGxhc3QgPSBuOyBsYXN0IDw9IDI7IGxhc3QtLSlcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGxhc3QgLSAxOyBpKyspXHJcbiAgICAgIGlmIChBW2ldID4gQVtpICsgMV0pXHJcbiAgICAgICAgc3dhcChBW2ldLEFbaSsxXSlcclxufWBcclxuICAgICk7XHJcbiAgfVxyXG4gIFxyXG4gIFxyXG5cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcblxyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgLy8g7IKs7Jqp7J6Q6rCAIOuLpOydjCDsiqTthZ3snLzroZwg64SY7Ja06rCA6riwIOyghCDquYzsp4AodGhpcy5jb250aW51ZSgpIG9yIHRoaXMuc3RlcCgpKSDquLDri6TrprxcclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5jb2RlRGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg1KTtcclxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOu5hOq1kGApO1xyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcclxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcclxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7dmFsdWUxfeqzvCAke3ZhbHVlMn0g67OA6rK9YCk7XHJcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG4gICAgICAgICAgLy8g65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ydhCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBqKz0gMTtcclxuICAgICAgfVxyXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yU29ydGVkKCk7XHJcbiAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW24taS0xXS5nZXRWYWx1ZSgpfSDruJTroZ0g7KCV66CsIOyZhOujjGApO1xyXG4gICAgICBpICs9IDFcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvclNvcnRlZCgpO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgSW5zZXJ0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcclxuYFxyXG5pbnNlcnQgc29ydCjsgr3snoUg7KCV66CsKeuKlCDsm5Dshozrpbwg7J2066+4IOygleugrOuQnCDrsLDsl7Qg67aA67aE6rO8IOu5hOq1kCDtlZjsl6wsIOyekOyLoOydmCDsnITsuZjrpbwg7LC+7JWEIOyCveyehe2VqOycvOuhnOyNqCDsoJXroKzsnYQg7JmE7ISx7ZWY64qUIOyVjOqzoOumrOymmOyeheuLiOuLpC5cclxu6riw7KG07J2YIOygleugrOuQnCDrsLDsl7Tsl5DshJwg7IK97J6FIOuQoCDrtoDrtoTsnYQg7LC+7JWY64uk66m0IOq3uCDsnITsuZjsl5Ag7JuQ7IaM66W8IOyCveyehe2VmOq4sCDsnITtlbQg7JuQ7IaM65Ok7J2EIO2VnCDsubjslKkg65Kk66GcIOydtOuPmeyLnO2CteuLiOuLpC5cclxu7IK97J6F7KCV66Cs7J2YIOyymOydjCBrZXkg6rCS7J2AIOuRkCDrsojsp7gg7JuQ7IaM66Gc67aA7YSwIOyLnOyeke2VqeuLiOuLpC5cclxuXHJcbu2Pieq3oCDsi5zqsIQg67O17J6h64+EIDogVChuKSA9IE8objxzdXA+Mjwvc3VwPilcclxuYFxyXG4gICAgKTtcclxuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoXHJcbmBcclxuZnVuY3Rpb24gaW5zZXJ0aW9uU29ydChBLCBuKSB7XHJcbiAgZm9yIChsZXQgaSA9IDI7IGkgPD0gbjsgaSsrKSB7XHJcbiAgICBsZXQga2V5ID0gQVtpXVxyXG4gICAgbGV0IGogPSAwXHJcbiAgICB3aGlsZSAoaiA8IGkgJiYgQVtqXSA8IGtleSlcclxuICAgICAgaisrXHJcbiAgICBzaGlmdChBLGosaSkgXHJcbiAgICBBW2pdID0ga2V5IFxyXG4gIH1cclxufVxyXG5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuXHJcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XHJcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxyXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xyXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcblxyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JTb3J0ZWQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47KSB7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcblxyXG4gICAgICBsZXQgZGVzdEluZGV4ID0gaTtcclxuXHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOykge1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydtCDrk6TslrTqsIgg7JyE7LmY66W8IO2DkOyDiWApO1xyXG5cclxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xyXG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhpcy5jb2RlRGVmYXVsdCgpO1xyXG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XHJcbiAgICAgICAgICAvLyBUT0RPOiBcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXHJcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDYsNyk7XHJcblxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNvcnRlZCgpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqKz0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpICE9IGRlc3RJbmRleCkge1xyXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg4KTtcclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclNlbGVjdGVkKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2hpZnQoZGVzdEluZGV4LCBpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xyXG4gICAgICAgIGlmIChkZXN0SW5kZXggIT0gMClcclxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydhCAke2Jsb2Nrc1tkZXN0SW5kZXgtMV0uZ2V0VmFsdWUoKX0g67iU66Gd6rO8ICR7YmxvY2tzW2Rlc3RJbmRleF0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOyCrOydtOyXkCDsgr3snoVgKTtcclxuICAgICAgICBlbHNlIGlmIChkZXN0SW5kZXggPT0gMClcclxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydhCAke2Jsb2Nrc1tkZXN0SW5kZXhdLmdldFZhbHVlKCl9IOu4lOuhneydmCDsnITsuZjsl5Ag7IK97J6FYCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yU29ydGVkKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydmCDsnITsuZgg67OA6rK9IOyXhuydjGApO1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTb3J0ZWQoKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFF1aWNrU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xyXG4gICAgc3VwZXIoLi4uYXJncyk7XHJcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcclxuYFxyXG5xdWljayBzb3J0KO2AtSDsoJXroKwp64qUIOq4sOykgOygkChwaXZvdCnsnYQg6riw7KSA7Jy866GcIOuRkCDqsJzsnZgg67aE7ZWg65CcIOu2gOu2hCDrpqzsiqTtirjrpbwg7KCV66Cs7ZWcIOuLpOydjCDtlantlZjsl6wg7KCE7LK06rCAIOygleugrOuQnCDrpqzsiqTtirjqsIAg65CY6rKMIO2VmOuKlCDslYzqs6DrpqzsppjsnoXri4jri6QuXHJcbuu2hO2VoCDsoJXrs7Ug7JWM6rOg66as7KaY7J2YIO2VmOuCmOuhnCwg7Y+J6reg7KCB7Jy866GcIOunpOyasCDruaDrpbgg7IiY7ZaJIOyGjeuPhOulvCDsnpDrnpHtlanri4jri6QuXHJcblxyXG7tj4nqt6Ag7Iuc6rCEIOuzteyeoeuPhCA6IFQobikgPSBPKG4gKiBsb2cobikpXHJcbmBcclxuICAgICk7XHJcbiAgICB0aGlzLmRyYXdQc2V1ZG9Db2RlKFxyXG5gZnVuY3Rpb24gcXVpY2tTb3J0KEEsIHAsIHIpIHtcclxuICBpZiAocCA8IHIpIHtcclxuICAgIGxldCBxID0gcGFydGl0aW9uKEEsIHAsIHIpXHJcbiAgICBxdWlja1NvcnQoQSwgcCwgcS0xKVxyXG4gICAgcXVpY2tTb3J0KEEsIHErMSwgcilcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gcGFydGl0aW9uKEEsIHAsIHIpIHtcclxuICBsZXQgcGl2b3QgPSBBWyhwK3IpLzIpXVxyXG4gIGxldCBsZWZ0ID0gcDtcclxuICBsZXQgcmlnaHQgPSByO1xyXG4gIGRvIHtcclxuICAgIHdoaWxlIChBW2xlZnRdIDwgcGl2b3QpIFxyXG4gICAgICBsZWZ0KytcclxuICAgIHdoaWxlIChBW3JpZ2h0XSA+IHBpdm90KSBcclxuICAgICAgcmlnaHQtLVxyXG4gICAgaWYgKGxlZnQgPD0gcmlnaHQpIFxyXG4gICAgICAgc3dhcChBW2xlZnQtLV0sQVtyaWdodCsrXSlcclxuICB9IHdoaWxlIChsZWZ0IDw9IHJpZ2h0KVxyXG4gIHJldHVybiByaWdodCA+PSBwID8gcmlnaHQgOiBwXHJcbn1cclxuYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNvcnQobGVmdCA9IDAsIHJpZ2h0ID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xyXG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxyXG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZykgcmV0dXJuO1xyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICBsZXQgbHN0YWNrID0gW107XHJcbiAgICBsZXQgcnN0YWNrID0gW107XHJcblxyXG4gICAgbHN0YWNrLnB1c2gobGVmdCk7XHJcbiAgICByc3RhY2sucHVzaChyaWdodCk7XHJcblxyXG4gICAgd2hpbGUgKGxzdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICBsZXQgcGwgPSAobGVmdCA9IGxzdGFjay5wb3AoKSk7IC8vIOyZvOyqvSDsu6TshJxcclxuICAgICAgbGV0IHByID0gKHJpZ2h0ID0gcnN0YWNrLnBvcCgpKTsgLy8g7Jik66W47Kq9IOy7pOyEnFxyXG4gICAgICBsZXQgcGl2b3RJZHggPSBNYXRoLmNlaWwoKGxlZnQgKyByaWdodCkgLyAyKTtcclxuICAgICAgbGV0IHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTsgLy8g7ZS867KXXHJcblxyXG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJIOuzgOqyvVxyXG4gICAgICBibG9ja3NcclxuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcclxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yQm91bmRhcnkoKSk7XHJcbiAgICAgIC8vIO2UvOuyl+ydmCDsg4kg67OA6rK9XHJcbiAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg5KTtcclxuICAgICAgYXdhaXQgdGhpcy5zbGVlcChcIjUwXCIpO1xyXG5cclxuICAgICAgZG8ge1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xyXG4gICAgICAgIHdoaWxlIChibG9ja3NbcHJdLmdldFZhbHVlKCkgPiBwaXZvdC5nZXRWYWx1ZSgpKSBwci0tO1xyXG5cclxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yU2VsZWN0ZWQoKTtcclxuICAgICAgICBibG9ja3NbcHJdLnNldENvbG9yU2VsZWN0ZWQoKTtcclxuICAgICAgICAvLyBwbCDrmJDripQgcHLsnbQgcGl2b3Tqs7wg6rK57LOQ64+EIHBpdm907J2YIOyDieydhCDsnKDsp4BcclxuICAgICAgICBwaXZvdC5zZXRDb2xvclBpdm90KCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxMywxNCwxNSwxNilcclxuXHJcbiAgICAgICAgY29uc3QgeyB0eXBlLCBtZW1lbnRvIH0gPSBhd2FpdCB0aGlzLndhaXQoKTtcclxuXHJcbiAgICAgICAgLy8g7IOB7YOcIOuzteq1rFxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIikge1xyXG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTtcclxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIO2YhOyerCDsg4Htg5zrpbwg7Iqk7YOd7JeQIOyggOyepVxyXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe1xyXG4gICAgICAgICAgcGwsXHJcbiAgICAgICAgICBwcixcclxuICAgICAgICAgIHBpdm90SWR4LFxyXG4gICAgICAgICAgbGVmdCxcclxuICAgICAgICAgIHJpZ2h0LFxyXG4gICAgICAgICAgbHN0YWNrOiBbLi4ubHN0YWNrLCBwbF0sXHJcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcclxuICAgICAgICAgIGJsb2NrczogWy4uLmJsb2Nrc10ubWFwKChibG9jaykgPT4gKHsgLi4uYmxvY2sgfSkpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocGwgPD0gcHIpIHtcclxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxOCk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3BsKytdLCBibG9ja3NbcHItLV0pO1xyXG4gICAgICAgICAgLy8gc3dhcChibG9ja3MsIHBsKyssIHByLS0pO1xyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJsb2Nrc1twbCAtIDFdLnNldENvbG9yQm91bmRhcnkoKTtcclxuICAgICAgICBibG9ja3NbcHIgKyAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XHJcbiAgICAgIH0gd2hpbGUgKHBsIDw9IHByKTtcclxuXHJcbiAgICAgIGlmIChsZWZ0IDwgcHIpIHtcclxuICAgICAgICBsc3RhY2sucHVzaChsZWZ0KTtcclxuICAgICAgICByc3RhY2sucHVzaChwcik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBsIDwgcmlnaHQpIHtcclxuICAgICAgICBsc3RhY2sucHVzaChwbCk7XHJcbiAgICAgICAgcnN0YWNrLnB1c2gocmlnaHQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIO2YhOyerCDslYzqs6DrpqzsppjsnbQg67CU652867O064qUIOu4lOuhneuTpOydmCDsg4nsnYQg7JuQ656Y64yA66GcIOuzgOqyvVxyXG4gICAgICBibG9ja3NcclxuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcclxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTb3J0O1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXHJcbmBcclxuc2VsZWN0aW9uIHNvcnQo7ISg7YOdIOygleugrCnripQg7ZW064u5IOyInOyEnOyXkCDsm5Dshozrpbwg64Sj7J2EIOychOy5mOuKlCDsnbTrr7gg7KCV7ZW07KC4IOyeiOqzoCwg7Ja065akIOybkOyGjOulvCDrhKPsnYTsp4Ag7ISg7YOd7ZWY64qUIOyVjOqzoOumrOymmOyeheuLiOuLpC5cclxu7LWc7IaM6rCS7J2EIO2DkOyDiSDtm4Qg6re4IOqwkuydhCDslZ7sl5DshJzrtoDthLAg67Cw7Je07ZWY64qUIOuwqeyLneyeheuLiOuLpC5cclxuXHJcbu2Pieq3oCDsi5zqsIQg67O17J6h64+EIDogVChuKSA9IE8objxzdXA+Mjwvc3VwPilcclxuYFxyXG4gICAgKTtcclxuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcclxuIGBcclxuZnVuY3Rpb24gc2VsZWN0aW9uU29ydChBLCBuKSB7XHJcbiAgZm9yKGxldCBpID0gMDsgaSA8IG4tMTsgaSsrKXtcclxuICAgIG1pbiA9IGlcclxuICAgIGZvcihsZXQgaiA9IGkgKyAxOyBqIDwgbjsgaisrKSB7XHJcbiAgICAgIGlmKEFbal0gPCBBW21pbl0pXHJcbiAgICAgICAgbWluID0galxyXG4gICAgfVxyXG4gICAgaWYobWluICE9IGkpXHJcbiAgICAgIHN3YXAoQVtpXSxBW21pbl0pXHJcbiAgfVxyXG59XHJcbmAgICApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcclxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXHJcbiAgICAgIHJldHVybjtcclxuICAgIFxyXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcclxuICAgIFxyXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XHJcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cclxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcclxuXHJcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgbGV0IG1pbjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xyXG4gICAgICBtaW4gPSBpO1xyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yU2VsZWN0ZWQoKTsgLy8gaSsx67KI67aA7YSwbi0x67KI6rmM7KeA7J2YIOu4lOufreydhCDssKjroYDrjIDroZwg67mo6rCE7IOJ7Jy866GcXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XHJcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcclxuICAgICAgICAgIC8vIFRPRE86IFxyXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcclxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xyXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcclxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxyXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBpZihqPG4tMSl7XHJcbiAgICAgICAgICBsZXQgdmNtcCA9IGJsb2Nrc1tqKzFdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2Y21wfSDruYTqtZBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIHtcclxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCDtmITsnqwg7LWc7Iaf6rCSIDogJHt2YWx1ZTJ9YCk7XHJcbiAgICAgICAgICBtaW4gPSBqO1xyXG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xyXG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xyXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihg7LWc7Iaf6rCS6rO8IO2YhOyerCDqsJLsnYQg6rWQ7ZmY7ZWc64ukYCk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7IC8vIOu4lOufrSDssrTsnbjsp4BcclxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxMCk7XHJcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcclxuICAgICAgICAgIGJsb2Nrc1ttaW5dLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsnITsuZjqsIAg67CU64CM64qUIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3Prpbwg7JeF642w7J207Yq4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JuQ656YIOyDieq5lOuhnCDrkJjrj4zrpqzquLBcclxuICAgICAgICBqICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yU29ydGVkKCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxyXG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvclNvcnRlZCgpO1xyXG5cclxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XHJcbiIsImNvbnN0IENvbG9yID0gcmVxdWlyZSgnLi9Db2xvcicpO1xyXG5cclxuY2xhc3MgQmxvY2sge1xyXG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXHJcbiAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIsIGJsb2NrV2lkdGggPSAyOCwgYmxvY2tNYXJnaW4gPSAyKSB7XHJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pLmZpbHRlcihkb20gPT4gZG9tLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKSkubGVuZ3RoO1xyXG4gICAgY29uc3QgeFBvc2l0aW9uID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG5cclxuICAgIHJldHVybiBuZXcgQmxvY2sodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCBibG9ja1dpZHRoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgIHdpZHRoLHRyYW5zaXRpb25EdXJhdGlvbj0yMDApIHtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuXHJcbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xyXG5cclxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xyXG4gIFxyXG4gICAgdGhpcy5kb20gPSBibG9jaztcclxuXHJcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcclxuICAgIHRoaXMuc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICB0aGlzLnNldFRyYW5zaXRpb25EdXJhdGlvbih0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgdGhpcy5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICB0aGlzLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xyXG5cclxuICAgIC8vIO2ZlOuptOyXkCDruJTroZ0g7ZGc7IucXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gIH1cclxuICBzd2FwQmxvY2soYmxvY2spIHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gdGhpcy5kb20ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2suZG9tLm5leHRTaWJsaW5nO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBuZXh0T2ZUYXJnZXQxKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbnNlcnRCZWZvcmUoYmxvY2spIHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIGJsb2NrLmRvbSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0VHJhbnNpdGlvbkR1cmF0aW9uKG1pbGxpcykge1xyXG4gICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPSBtaWxsaXM7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHt0aGlzLnRyYW5zaXRpb25EdXJhdGlvbn1tc2A7XHJcbiAgfVxyXG5cclxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb24oKSB7XHJcbiAgICAvLyByZXR1cm4gTnVtYmVyKFxyXG4gICAgLy8gICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIDApXHJcbiAgICAvLyApO1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gIH1cclxuXHJcbiAgc2V0WFBvc2l0aW9uKHgpIHtcclxuICAgIHRoaXMueFBvc2l0aW9uID0geDtcclxuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dGhpcy54UG9zaXRpb259cHgpYDtcclxuICB9XHJcblxyXG4gIGdldFhQb3NpdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnhQb3NpdGlvbjtcclxuICAgIC8vIGNvbnN0IHJlZ0V4cFRyYW5zWCA9IC9bXFx3XStcXChbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/KFtcXGRdKylbIF0/LFsgXT9bXFxkXStbIF0/XFwpLztcclxuICAgIC8vIGNvbnN0IHRyYW5zZm9ybSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS50cmFuc2Zvcm07XHJcbiAgICAvLyByZXR1cm4gcmVnRXhwVHJhbnNYLmV4ZWModHJhbnNmb3JtKVsxXTtcclxuICB9XHJcblxyXG4gIHNldFdpZHRoKHB4KSB7XHJcbiAgICB0aGlzLndpZHRoID0gcHg7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IGAke3RoaXMud2lkdGh9cHhgO1xyXG4gIH1cclxuICBnZXRXaWR0aCgpIHtcclxuICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3IoY29sb3IpIHtcclxuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sb3IoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2xvcjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclNlbGVjdGVkKCkge1xyXG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnNlbGVjdGVkO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy/shKDtg53rkJwg67iU66GdIDog67mo6rCVIC0+IOyXsOuztOudvFxyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yRGVmYXVsdCgpIHtcclxuICAgIHRoaXMuY29sb3IgPSBDb2xvci5kZWZhdWx0Q29sb3I7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+q4sOuzuCDruJTroZ06IO2MjOuekSAtPiDsl7DtlZHtgaxcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JTb3J0ZWQoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gQ29sb3Iuc29ydGVkO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy/soJXroKwg64Gd64KcIOu4lOuhnTog6re466awKOy0iOuhnSkgLT4g7LCQ7ZWR7YGsXHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCBQaXZvdCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvclBpdm90KCkge1xyXG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnBpdm90O1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy/tlLzrspcg67iU66GdIDog7ZiV6rSRIO2Vke2BrCAtPiAg7LCQ67O06528XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDqsr3qs4Trpbwg64KY7YOA64K064qUIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gIHNldENvbG9yQm91bmRhcnkoKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gQ29sb3IuYm91bmRhcnk7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvLyDruJTrn60g6rK96rOEIDog67O06528IC0+IOuFuOuekSBcclxuICB9XHJcblxyXG4gIHNldFZhbHVlKHZhbHVlKXtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XHJcbiAgICBjb25zdCBtYXhIaWdodCA9XHJcbiAgICAgIE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSAyNDtcclxuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xyXG4gICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gYCR7YmxvY2tIaWdodCA8IG1heEhpZ2h0ID8gYmxvY2tIaWdodCA6IG1heEhpZ2h0fXB4YDtcclxuXHJcbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gIGdldFZhbHVlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJcclxuXHJcbi8vIOq4sOuzuCDruJTroZ0g7IOJ7IOBXHJcbmNvbnN0IGRlZmF1bHRDb2xvciA9IFwiI0ZGOUZCM1wiO1xyXG5cclxuLy8g67iU66Gd7J20IOyEoO2DneuQmOyXiOydhCDrlYwg7IOJ7IOBXHJcbmNvbnN0IHNlbGVjdGVkID0gXCIjQjY5QUU3XCI7XHJcblxyXG4vLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsg4FcclxuY29uc3Qgc29ydGVkID0gXCIjRkY2Qzc3XCI7XHJcblxyXG4vLyBQaXZvdCDruJTroZ3snZgg7IOJ7IOBIChRdWljayBTb3J07JeQ7ISc7J2YIFBpdm90KVxyXG5jb25zdCBwaXZvdCA9IFwiIzlGNzBGMVwiO1xyXG5cclxuLy8gUXVpY2sgU29ydOyXkOyEnCBQYXJ0aXRpb24g7ZWo7IiY7J2YIOuMgOyDgeyduCDruJTroZ3rk6TsnZgg7IOJ7IOBXHJcbmNvbnN0IGJvdW5kYXJ5ID0gXCIjRjVFMzQ4XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGRlZmF1bHRDb2xvcixcclxuICAgIHNlbGVjdGVkLFxyXG4gICAgc29ydGVkLFxyXG4gICAgcGl2b3QsXHJcbiAgICBib3VuZGFyeVxyXG59IiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcclxuXHJcbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxyXG5jbGFzcyBTb3J0IHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGNvbnRhaW5lcixcclxuICAgIGJsb2NrcyA9IFtdLFxyXG4gICAgZGVsYXkgPSAyMDAsXHJcbiAgICBhbmltYXRpb25EZWxheSA9IDI1MCxcclxuICAgIGJsb2NrV2lkdGggPSAyOCxcclxuICAgIGJsb2NrTWFyZ2luID0gMixcclxuICAgIGRlc2NyaXB0aW9uXHJcbiAgKSB7XHJcbiAgICAvLyDsoJXroKztlaAg64yA7IOB7J24IOu4lOuhneuTpFxyXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIC8vIOygleugrCDsiqTthZ0g7IKs7J20IOuUnOugiOydtFxyXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG4gICAgLy8g7KCV66Cs7J20IOupiOy2mCDsg4Htg5xcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICAvLyDruJTroZ3snZgg64SI67mEXHJcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xyXG4gICAgLy8g67iU66GdIOyCrOydtCDqsITqsqlcclxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcclxuXHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcblxyXG4gICAgLy8g7KCV66Cs7J20IO2YhOyerCDsi6TtlonspJHsnbgg7IOB7YOcXHJcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcclxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xyXG5cclxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcclxuICB9XHJcblxyXG4gIC8vIOyImOuPhCDsvZTrk5wg66y47J6Q7Je07J2EIOuwm+yVhOyEnCDsi5zqsIHtmZQg7Luo7YWM7J2064SIIOyasOy4oeyXkCDrs7Tsl6zspIxcclxuICBkcmF3UHNldWRvQ29kZShwc2V1ZG9Db2RlKXtcclxuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcclxuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7IiY64+E7L2U65OcIOyCreygnFxyXG4gICAgQXJyYXkuZnJvbShwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkPT5jaGlsZC5yZW1vdmUoKSk7XHJcbiAgICBwc2V1ZG9Db2RlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBcclxuICAgIC8vIOykhOuzhOuhnFxyXG4gICAgcHNldWRvQ29kZS5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xyXG4gICAgICBwc2V1ZG9Db2RlQ29udGFpbmVyLmlubmVySFRNTCArPSBgPGNvZGU+JHtsaW5lfTwvY29kZT4keydcXG4nfWBcclxuICAgIH0pXHJcblxyXG4gIH1cclxuXHJcbiAgLy8g7ISk66qF7J2EIOuwm+yVhOyEnCDsi5zqsIHtmZQg7Luo7YWM7J2064SIIOyasOy4oeyXkCDrs7Tsl6zspIxcclxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pe1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLWNvbnRhaW5lclwiKTtcclxuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7ISk66qFIOyCreygnFxyXG4gICAgQXJyYXkuZnJvbShkZXNjcmlwdGlvbkNvbnRhaW5lci5jaGlsZHJlbikuZm9yRWFjaChjaGlsZD0+Y2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIFxyXG4gICAgLy8g7KSE67OE66GcXHJcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xyXG4gICAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxkaXY+JHtsaW5lfTwvZGl2PiR7J1xcbid9YFxyXG4gICAgfSlcclxuXHJcbiAgfVxyXG5cclxuICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgc29ydCgpIHt9XHJcblxyXG4gIHdhaXQoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTdG9wKSB7XHJcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnRpbnVlKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RlcCgpO1xyXG4gIH1cclxuXHJcbiAgc3RlcCgpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZSh7IHR5cGU6IFwic3RlcFwiIH0pO1xyXG4gICAgICB0aGlzLnJlc29sdmUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RlcEJhY2soKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvbHZlICE9IG51bGwgJiYgdGhpcy5yZXNvbHZlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAodGhpcy5tZW1ldG9TdGFjay5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZSh7XHJcbiAgICAgICAgICB0eXBlOiBcImJhY2tcIixcclxuICAgICAgICAgIG1lbWVudG86IHRoaXMubWVtZXRvU3RhY2sucG9wKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7ZWY7J2065287J207Yq466W8IOyXhuyVsFxyXG4gIGNvZGVEZWZhdWx0KCl7XHJcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjaGlsZHJlbltpXS5zdHlsZS5jb2xvciA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7Yq57KCVIOykhOydhCDtlZjsnbTrnbzsnbTtirhcclxuICBjb2RlSGlnaGxpZ2h0KC4uLmxpbmUpIHtcclxuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW47XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgbWFuZ28gPSAwOyBtYW5nbyA8IGxpbmUubGVuZ3RoOyBtYW5nbysrKSB7XHJcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gY2hpbGRyZW5bbGluZVttYW5nb10tMV07XHJcbiAgICAgIGNvZGVFbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjQjY5QUU3XCI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXNoTWVtZW50byhtZW1lbnRvKSB7XHJcbiAgICB0aGlzLm1lbWV0b1N0YWNrLnB1c2gobWVtZW50byk7XHJcbiAgfVxyXG5cclxuICBzbGVlcChtaWxsaXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXMgPT5zZXRUaW1lb3V0KHJlcyxtaWxsaXMpKTtcclxuICB9XHJcblxyXG4gIHNodWZmbGUoKSB7XHJcblxyXG4gICAgdGhpcy5zZXREZXNjcmlwdGlvbihcIlwiKTtcclxuICAgIFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgZm9yIChsZXQgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7IC8vIDAg7J207IOBIGkg66+466eM7J2YIOustOyekeychCDsnbjrjbHsiqRcclxuICAgICAgW2Jsb2Nrc1tpXSwgYmxvY2tzW2pdXSA9IFtibG9ja3Nbal0sIGJsb2Nrc1tpXV07IC8vIOyFlO2UjFxyXG4gICAgfVxyXG4gICAgYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIGJsb2NrLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxyXG5cclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24odHJhbnNYKTtcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXHJcblxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gIH1cclxuXHJcbiAgLy8g7ZiE7J6sIOyLnOqwge2ZlOuQmOuKlCDri6jqs4TsnZgg7ISk66qFIOyEpOyglVxyXG4gIC8vIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7ZWY64uo7JeQIO2RnOyLnOuQqFxyXG4gIHNldERlc2NyaXB0aW9uKHRleHQpIHtcclxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZChcInNvcnQtZGVzY3JpcHRpb25cIik7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb24pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgfVxyXG5cclxuICBzZXRCbG9ja1dpZHRoKGJsb2NrV2lkdGgsIGJsb2NrTWFyZ2luID0gMikge1xyXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcclxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcclxuICAgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKGJsb2NrV2lkdGggKyBibG9ja01hcmdpbikgKyBcInB4XCI7XHJcblxyXG4gICAgLy8g67iU66GdIO2BrOq4sCDrsJTqvrjquLBcclxuICAgIHRoaXMuYmxvY2tzLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcclxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG4gICAgICBibG9jay5zZXRYUG9zaXRpb24obmV3WCk7XHJcblxyXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRXaWR0aChibG9ja1dpZHRoKTtcclxuXHJcbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxyXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQmxvY2soYmxvY2tWYWx1ZSkge1xyXG4gICAgLy8g67iU66GdIOqwnOyImCDsoJztlZxcclxuICAgIGlmICh0aGlzLmJsb2Nrcy5sZW5ndGggPiAzMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2soXHJcbiAgICAgIGJsb2NrVmFsdWUsXHJcbiAgICAgIHRoaXMuY29udGFpbmVyLFxyXG4gICAgICB0aGlzLmJsb2NrV2lkdGgsXHJcbiAgICAgIHRoaXMuYmxvY2tNYXJnaW5cclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXHJcbiAgICAgIHdpbmRvd1xyXG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKVxyXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcclxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID1cclxuICAgICAgcHJldldpZHRoICsgKHRoaXMuYmxvY2tXaWR0aCArIHRoaXMuYmxvY2tNYXJnaW4pICsgXCJweFwiO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbih0aGlzLmFuaW1hdGlvbkRlbGF5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIHRoaXMuYmxvY2tz66W8IOyLnOqwge2ZlOuQmOqzoOyeiOuKlCDsiJzshJzsl5Ag66ee6rKMIOygleugrO2VmOuKlCDtlajsiJhcclxuICByZWZyZXNoQmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuICB9XHJcblxyXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gIGFzeW5jIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcclxuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuXHJcbiAgICBjb25zdCB4MSA9IGJsb2NrMS5nZXRYUG9zaXRpb24oKTtcclxuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xyXG5cclxuICAgIGJsb2NrMS5zZXRYUG9zaXRpb24oeDIpO1xyXG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XHJcblxyXG4gICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPripQg7ZWo7IiYIFxyXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcclxuICBhc3luYyBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XHJcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcclxuXHJcbiAgICBibG9jay5zZXRYUG9zaXRpb24oZGVzdEluZGV4ICogICh0aGlzLmJsb2NrV2lkdGgrdGhpcy5ibG9ja01hcmdpbikpO1xyXG5cclxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgYXdhaXQgYmxvY2suaW5zZXJ0QmVmb3JlKGJsb2Nrc1tkZXN0SW5kZXhdKTtcclxuICB9XHJcblxyXG4gIC8vIHN0YXJ0IOyduOuNseyKpOu2gO2EsCBlbmQg7J24642x7Iqk6rmM7KeAIGJsb2NrIO2VnCDsubjslKkg66+464qUIO2VqOyImCBcclxuICBhc3luYyBzaGlmdCAoc3RhcnQsIGVuZCkge1xyXG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgY29uc3QgYmV0d2VlbnMgPSBibG9ja3MuZmlsdGVyKChfLCBpKSA9PiBzdGFydCA8PSBpICYmIGkgPCBlbmQpO1xyXG5cclxuICAgIGNvbnN0ICB4UmVzdCA9IGJldHdlZW5zLm1hcChiID0+IGIuZ2V0WFBvc2l0aW9uKCkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XHJcbiAgICB9XHJcbiAgICBibG9ja3NbZW5kLTFdLnNldFhQb3NpdGlvbihibG9ja3NbZW5kXS5nZXRYUG9zaXRpb24oKSk7XHJcbiAgICBcclxuXHJcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIGJsb2Nrc1swXS5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKSkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi4vc29ydC9CbG9ja1wiKTtcclxuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XHJcblxyXG4vLyDsoJXroKwg7KKF66WYIFJhZGlvXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zZXJ0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IElucHV0XHJcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBJbnB1dCBCdXR0b25cclxuY29uc3QgZGVsYXlJbnB1dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRlbGF5LWlucHV0LWJ0blwiKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XHJcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxyXG5jb25zdCBuZXdEYXRhQWRkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1hZGQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsp4TtlokgQnV0dG9uXHJcbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDrkqTroZwg7Iqk7YWdIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcclxuXHJcbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXHJcbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcclxuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbi8vIFNvcnQg7JWM6rOg66as7KaYIO2BtOuemOyKpOulvCDrsJvslYTshJwg7KCV66Cs7J2EIOyLnFxyXG5jb25zdCBtYWtlU29ydFJhZGlvT25jaGFuZ2UgPSBTb3J0QWxnb3JpdGhtID0+ICgpID0+IHtcclxuICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oXHJcbiAgICBzb3J0LmNvbnRhaW5lcixcclxuICAgIHNvcnQuYmxvY2tzLFxyXG4gICAgc29ydC5kZWxheSxcclxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXHJcbiAgICBzb3J0LmJsb2NrV2lkdGgsXHJcbiAgICBzb3J0LmJsb2NrTWFyZ2luLFxyXG4gICAgc29ydC5kZXNjcmlwdGlvblxyXG4gICk7XHJcbn07XHJcblxyXG5cclxuYnViYmxlU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEJ1YmJsZVNvcnQpO1xyXG5pbnNlcnRpb25Tb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoSW5zZXJ0aW9uU29ydCk7XHJcbnNlbGVjdGlvblNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShTZWxlY3Rpb25Tb3J0KTtcclxucXVpY2tTb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoUXVpY2tTb3J0KTtcclxuXHJcblxyXG5sZXQgc29ydCA9IG5ldyBCdWJibGVTb3J0KGNvbnRhaW5lcik7XHJcbmdlbmVyYXRlVW5pcXVlVmFsdWVzKCkuZm9yRWFjaCh2YWx1ZSA9PiBzb3J0LmFkZEJsb2NrKHZhbHVlKSk7XHJcblxyXG5kZWxheVJhbmdlLm9uaW5wdXQgPSBlID0+IHtcclxuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbiAgc29ydC5zZXREZWxheShkZWxheSk7XHJcblxyXG4gIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxyXG59O1xyXG5cclxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XHJcbi8vICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpIC0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuXHJcbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XHJcbi8vICAgc29ydC5zZXREZWxheShkZWxheSk7XHJcbi8vICAgLy8gZGVsYXlSYW5nZeyZgCDqsJIg64+Z6riw7ZmUXHJcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xyXG4vLyB9XHJcblxyXG5kZWxheUlucHV0Lm9ua2V5ZG93biA9IGUgPT4ge1xyXG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXHJcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXHJcbiAgICAvLyBkZWxheUlucHV0QnRu7JeQIGNsaWNrIOydtOuypO2KuCDtirjrpqzqsbBcclxuICAgIGRlbGF5SW5wdXRCdG4uY2xpY2soKTtcclxufVxyXG5kZWxheUlucHV0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDsnoXroKXqsJLsnbQg67KU7JyE66W8IOuEmOyWtOyEnOuptCDqsr3qs4TqsJLsnLzroZwg7ISk7KCVXHJcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcclxuICB9IGVsc2UgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA8IE51bWJlcihkZWxheVJhbmdlLm1pbikpIHtcclxuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRlbGF5ID1cclxuICAgIE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pIC0gTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpO1xyXG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG4gIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxyXG4gIGRlbGF5UmFuZ2UudmFsdWUgPSBkZWxheTtcclxufTtcclxuXHJcbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxyXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcclxuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn07XHJcblxyXG5uZXdEYXRhSW5wdXQub25rZXlkb3duID0gZSA9PiB7XHJcbiAgLy8g7JeU7YSw7YKk66W8IOuIhOuluCDqsr3smrBcclxuICBpZiAoZS5rZXlDb2RlID09PSAxMylcclxuICAgIC8vIG5ld0RhdGFBZGRCdG7sl5AgY2xpY2sg7J2067Kk7Yq4IO2KuOumrOqxsFxyXG4gICAgbmV3RGF0YUFkZEJ0bi5jbGljaygpO1xyXG59XHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxyXG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICBzb3J0LmFkZEJsb2NrKHZhbHVlKTtcclxufTtcclxuXHJcblxyXG4vLyDsoJXroKwg64+E7KSR7JeUIElucHV065Ok7J2EIOu5hO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xyXG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcclxuICBzb3J0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxyXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XHJcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuc29ydEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcblxyXG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXHJcblxyXG4gIHNvcnQuc29ydCgpLnRoZW4oZW5hYmxlSW5wdXRzKVxyXG59O1xyXG5cclxuc29ydFN0b3BCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RvcCgpO1xyXG59O1xyXG5cclxuc29ydENvbnRpbnVlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LmNvbnRpbnVlKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5zdGVwKCk7XHJcbn07XHJcblxyXG5zb3J0U3RlcEJhY2tCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RlcEJhY2soKTtcclxufVxyXG5cclxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnNodWZmbGUoKTtcclxufTtcclxuIl19
