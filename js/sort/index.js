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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvcXVpY2stc29ydC9RdWlja1NvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvQ29sb3IuanMiLCJzcmMvc29ydC9Tb3J0LmpzIiwic3JjL3NvcnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXG5gXG5idWJibGUgc29ydCjqsbDtkogg7KCV66CsKeuKlCDshJzroZwg7J247KCR7ZWcIOuRkCDsm5Dshozrpbwg6rKA7IKs7ZWY7JesIOygleugrO2VmOuKlCDslYzqs6DrpqzsppjsnoXri4jri6QuXG7ssqsg67KI7Ke4IOybkOyGjOyZgCDrkZAg67KI7Ke4IOybkOyGjCwg65GQ67KI7Ke4IOybkOyGjOyZgCDshLgg67KI7Ke4IOybkOyGjCwgLi4uLCBuLTHrsojsp7gg7JuQ7IaM7JmAIG7rsojsp7gg7JuQ7IaM66W8IOu5hOq1kCwg6rWQ7ZmY7ZWY66mwIOygleugrO2VqeuLiOuLpC5cbjHtmozsoITsnbQg64Gd64KY66m0IOqwgOyepSDtgbAg7JuQ7IaM64qUIOunqCDrkqTroZwg7J2064+Z7ZWY66+A66GcIOuLpOydjCDtmozsoITsl5DshJzripQg7KCV66Cs7JeQ7IScIOygnOyZuOuQqeuLiOuLpC5cbuydtOulvCDrsJjrs7XtlaAg65WM66eI64ukIOygleugrOyXkOyEnCDsoJzsmbjrkJjripQg7JuQ7IaM6rCAIO2VmOuCmOyUqSDripjslrTrgqnri4jri6QuXG5cbu2Pieq3oCDsi5zqsIQg67O17J6h64+EIDogVChuKSA9IE8objxzdXA+Mjwvc3VwPilcbmBcbiAgICApO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcbmBcbmZ1bmN0aW9uIGJ1YmJsZVNvcnQoQSwgbikge1xuICBmb3IgKGxldCBsYXN0ID0gbjsgbGFzdCA8PSAyOyBsYXN0LS0pXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbGFzdCAtIDE7IGkrKylcbiAgICAgIGlmIChBW2ldID4gQVtpICsgMV0pXG4gICAgICAgIHN3YXAoQVtpXSxBW2krMV0pXG59YFxuICAgICk7XG4gIH1cbiAgXG4gIFxuXG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuXG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbiAtIGkgLSAxOykge1xuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuXG4gICAgICAgXG4gICAgICAgIC8vIOyCrOyaqeyekOqwgCDri6TsnYwg7Iqk7YWd7Jy866GcIOuEmOyWtOqwgOq4sCDsoIQg6rmM7KeAKHRoaXMuY29udGludWUoKSBvciB0aGlzLnN0ZXAoKSkg6riw64uk66a8XG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcbiAgICAgICAgICAvLyBUT0RPOiBcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5jb2RlRGVmYXVsdCgpO1xuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgIGNvbnN0IHZhbHVlMiA9IGJsb2Nrc1tqICsgMV0uZ2V0VmFsdWUoKTtcblxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNSk7XG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7dmFsdWUxfeqzvCAke3ZhbHVlMn0g67mE6rWQYCk7XG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNik7XG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmFsdWUyfSDrs4Dqsr1gKTtcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcbiAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwgYmxvY2tz7J2EIOyXheuNsOydtO2KuFxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgIGorPSAxO1xuICAgICAgfVxuICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxuICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JTb3J0ZWQoKTtcbiAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW24taS0xXS5nZXRWYWx1ZSgpfSDruJTroZ0g7KCV66CsIOyZhOujjGApO1xuICAgICAgaSArPSAxXG4gICAgfVxuICAgIGJsb2Nrc1swXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcbmBcbmluc2VydCBzb3J0KOyCveyehSDsoJXroKwp64qUIOybkOyGjOulvCDsnbTrr7gg7KCV66Cs65CcIOuwsOyXtCDrtoDrtoTqs7wg67mE6rWQIO2VmOyXrCwg7J6Q7Iug7J2YIOychOy5mOulvCDssL7slYQg7IK97J6F7ZWo7Jy866Gc7I2oIOygleugrOydhCDsmYTshLHtlZjripQg7JWM6rOg66as7KaY7J6F64uI64ukLlxu6riw7KG07J2YIOygleugrOuQnCDrsLDsl7Tsl5DshJwg7IK97J6FIOuQoCDrtoDrtoTsnYQg7LC+7JWY64uk66m0IOq3uCDsnITsuZjsl5Ag7JuQ7IaM66W8IOyCveyehe2VmOq4sCDsnITtlbQg7JuQ7IaM65Ok7J2EIO2VnCDsubjslKkg65Kk66GcIOydtOuPmeyLnO2CteuLiOuLpC5cbuyCveyeheygleugrOydmCDsspjsnYwga2V5IOqwkuydgCDrkZAg67KI7Ke4IOybkOyGjOuhnOu2gO2EsCDsi5zsnpHtlanri4jri6QuXG5cbu2Pieq3oCDsi5zqsIQg67O17J6h64+EIDogVChuKSA9IE8objxzdXA+Mjwvc3VwPilcbmBcbiAgICApO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoXG5gXG5mdW5jdGlvbiBpbnNlcnRpb25Tb3J0KEEsIG4pIHtcbiAgZm9yIChsZXQgaSA9IDI7IGkgPD0gbjsgaSsrKSB7XG4gICAgbGV0IGtleSA9IEFbaV1cbiAgICBsZXQgaiA9IDBcbiAgICB3aGlsZSAoaiA8IGkgJiYgQVtqXSA8IGtleSlcbiAgICAgIGorK1xuICAgIHNoaWZ0KEEsaixpKSBcbiAgICBBW2pdID0ga2V5IFxuICB9XG59XG5gXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG5cbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2s9PmJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcblxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmJsb2NrcztcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JTb3J0ZWQoKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjspIHtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgIGxldCBkZXN0SW5kZXggPSBpO1xuXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOykge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuXG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydtCDrk6TslrTqsIgg7JyE7LmY66W8IO2DkOyDiWApO1xuXG4gICAgICAgIGNvbnN0IHt0eXBlLG1lbWVudG99ID0gYXdhaXQgdGhpcy53YWl0KCk7XG4gICAgICAgIC8vIOydtOyghCDsg4Htg5zroZwg67O16rWsXG4gICAgICAgIGlmICh0eXBlID09PSBcImJhY2tcIiAmJiBtZW1lbnRvICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7IOB7YOcIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtpLGosYmxvY2tzOlsuLi5ibG9ja3NdLm1hcChibG9jaz0+KHsuLi5ibG9ja30pKX0pO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2LDcpO1xuXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcblxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTb3J0ZWQoKTtcbiAgICAgICAgaWYgKHZhbHVlID4gdGFyZ2V0KSB7XG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBqKz0xO1xuICAgICAgfVxuICAgICAgaWYgKGkgIT0gZGVzdEluZGV4KSB7XG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg4KTtcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuc2hpZnQoZGVzdEluZGV4LCBpKTtcblxuICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XG4gICAgICAgIGlmIChkZXN0SW5kZXggIT0gMClcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snYQgJHtibG9ja3NbZGVzdEluZGV4LTFdLmdldFZhbHVlKCl9IOu4lOuhneqzvCAke2Jsb2Nrc1tkZXN0SW5kZXhdLmdldFZhbHVlKCl9IOu4lOuhneydmCDsgqzsnbTsl5Ag7IK97J6FYCk7XG4gICAgICAgIGVsc2UgaWYgKGRlc3RJbmRleCA9PSAwKVxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydhCAke2Jsb2Nrc1tkZXN0SW5kZXhdLmdldFZhbHVlKCl9IOu4lOuhneydmCDsnITsuZjsl5Ag7IK97J6FYCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XG4gICAgICAgIFxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke2Jsb2Nrc1tpXS5nZXRWYWx1ZSgpfSDruJTroZ3snZgg7JyE7LmYIOuzgOqyvSDsl4bsnYxgKTtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBRdWlja1NvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxuYFxucXVpY2sgc29ydCjtgLUg7KCV66CsKeuKlCDquLDspIDsoJAocGl2b3Qp7J2EIOq4sOykgOycvOuhnCDrkZAg6rCc7J2YIOu2hO2VoOuQnCDrtoDrtoQg66as7Iqk7Yq466W8IOygleugrO2VnCDri6TsnYwg7ZWp7ZWY7JesIOyghOyytOqwgCDsoJXroKzrkJwg66as7Iqk7Yq46rCAIOuQmOqyjCDtlZjripQg7JWM6rOg66as7KaY7J6F64uI64ukLlxu67aE7ZWgIOygleuztSDslYzqs6DrpqzsppjsnZgg7ZWY64KY66GcLCDtj4nqt6DsoIHsnLzroZwg66ek7JqwIOu5oOuluCDsiJjtlokg7IaN64+E66W8IOyekOueke2VqeuLiOuLpC5cblxu7Y+J6regIOyLnOqwhCDrs7XsnqHrj4QgOiBUKG4pID0gTyhuICogbG9nKG4pKVxuYFxuICAgICk7XG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZShcbmBmdW5jdGlvbiBxdWlja1NvcnQoQSwgcCwgcikge1xuICBpZiAocCA8IHIpIHtcbiAgICBsZXQgcSA9IHBhcnRpdGlvbihBLCBwLCByKVxuICAgIHF1aWNrU29ydChBLCBwLCBxLTEpXG4gICAgcXVpY2tTb3J0KEEsIHErMSwgcilcbiAgfVxufVxuZnVuY3Rpb24gcGFydGl0aW9uKEEsIHAsIHIpIHtcbiAgbGV0IHBpdm90ID0gQVsocCtyKS8yKV1cbiAgbGV0IGxlZnQgPSBwO1xuICBsZXQgcmlnaHQgPSByO1xuICBkbyB7XG4gICAgd2hpbGUgKEFbbGVmdF0gPCBwaXZvdCkgXG4gICAgICBsZWZ0KytcbiAgICB3aGlsZSAoQVtyaWdodF0gPiBwaXZvdCkgXG4gICAgICByaWdodC0tXG4gICAgaWYgKGxlZnQgPD0gcmlnaHQpIFxuICAgICAgIHN3YXAoQVtsZWZ0LS1dLEFbcmlnaHQrK10pXG4gIH0gd2hpbGUgKGxlZnQgPD0gcmlnaHQpXG4gIHJldHVybiByaWdodCA+PSBwID8gcmlnaHQgOiBwXG59XG5gXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQobGVmdCA9IDAsIHJpZ2h0ID0gdGhpcy5ibG9ja3MubGVuZ3RoIC0gMSkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKSByZXR1cm47XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcblxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIGxldCBsc3RhY2sgPSBbXTtcbiAgICBsZXQgcnN0YWNrID0gW107XG5cbiAgICBsc3RhY2sucHVzaChsZWZ0KTtcbiAgICByc3RhY2sucHVzaChyaWdodCk7XG5cbiAgICB3aGlsZSAobHN0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICBsZXQgcGwgPSAobGVmdCA9IGxzdGFjay5wb3AoKSk7IC8vIOyZvOyqvSDsu6TshJxcbiAgICAgIGxldCBwciA9IChyaWdodCA9IHJzdGFjay5wb3AoKSk7IC8vIOyYpOuluOyqvSDsu6TshJxcbiAgICAgIGxldCBwaXZvdElkeCA9IE1hdGguY2VpbCgobGVmdCArIHJpZ2h0KSAvIDIpO1xuICAgICAgbGV0IHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTsgLy8g7ZS867KXXG5cbiAgICAgIC8vIO2YhOyerCDslYzqs6DrpqzsppjsnbQg67CU652867O064qUIOu4lOuhneuTpOydmCDsg4kg67OA6rK9XG4gICAgICBibG9ja3NcbiAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBsZWZ0IDw9IGlkeCAmJiBpZHggPD0gcmlnaHQpXG4gICAgICAgIC5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suc2V0Q29sb3JCb3VuZGFyeSgpKTtcbiAgICAgIC8vIO2UvOuyl+ydmCDsg4kg67OA6rK9XG4gICAgICBwaXZvdC5zZXRDb2xvclBpdm90KCk7XG4gICAgICBcbiAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg5KTtcbiAgICAgIGF3YWl0IHRoaXMuc2xlZXAoXCI1MFwiKTtcblxuICAgICAgZG8ge1xuICAgICAgICB3aGlsZSAoYmxvY2tzW3BsXS5nZXRWYWx1ZSgpIDwgcGl2b3QuZ2V0VmFsdWUoKSkgcGwrKztcbiAgICAgICAgd2hpbGUgKGJsb2Nrc1twcl0uZ2V0VmFsdWUoKSA+IHBpdm90LmdldFZhbHVlKCkpIHByLS07XG5cbiAgICAgICAgYmxvY2tzW3BsXS5zZXRDb2xvclNlbGVjdGVkKCk7XG4gICAgICAgIGJsb2Nrc1twcl0uc2V0Q29sb3JTZWxlY3RlZCgpO1xuICAgICAgICAvLyBwbCDrmJDripQgcHLsnbQgcGl2b3Tqs7wg6rK57LOQ64+EIHBpdm907J2YIOyDieydhCDsnKDsp4BcbiAgICAgICAgcGl2b3Quc2V0Q29sb3JQaXZvdCgpO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxMywxNCwxNSwxNilcblxuICAgICAgICBjb25zdCB7IHR5cGUsIG1lbWVudG8gfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuXG4gICAgICAgIC8vIOyDge2DnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiKSB7XG4gICAgICAgICAgKHsgbHN0YWNrLCByc3RhY2ssIHBsLCBwciwgbGVmdCwgcmlnaHQsIHBpdm90SWR4IH0gPSBtZW1lbnRvKTtcbiAgICAgICAgICBwaXZvdCA9IGJsb2Nrc1twaXZvdElkeF07XG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgeFBvc2l0aW9uLCB2YWx1ZSwgd2lkdGggfSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDtmITsnqwg7IOB7YOc66W8IOyKpO2DneyXkCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7XG4gICAgICAgICAgcGwsXG4gICAgICAgICAgcHIsXG4gICAgICAgICAgcGl2b3RJZHgsXG4gICAgICAgICAgbGVmdCxcbiAgICAgICAgICByaWdodCxcbiAgICAgICAgICBsc3RhY2s6IFsuLi5sc3RhY2ssIHBsXSxcbiAgICAgICAgICByc3RhY2s6IFsuLi5yc3RhY2ssIHByXSxcbiAgICAgICAgICBibG9ja3M6IFsuLi5ibG9ja3NdLm1hcCgoYmxvY2spID0+ICh7IC4uLmJsb2NrIH0pKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsIDw9IHByKSB7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDE4KTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW3BsKytdLCBibG9ja3NbcHItLV0pO1xuICAgICAgICAgIC8vIHN3YXAoYmxvY2tzLCBwbCsrLCBwci0tKTtcbiAgICAgICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3NbcGwgLSAxXS5zZXRDb2xvckJvdW5kYXJ5KCk7XG4gICAgICAgIGJsb2Nrc1twciArIDFdLnNldENvbG9yQm91bmRhcnkoKTtcbiAgICAgIH0gd2hpbGUgKHBsIDw9IHByKTtcblxuICAgICAgaWYgKGxlZnQgPCBwcikge1xuICAgICAgICBsc3RhY2sucHVzaChsZWZ0KTtcbiAgICAgICAgcnN0YWNrLnB1c2gocHIpO1xuICAgICAgfVxuICAgICAgaWYgKHBsIDwgcmlnaHQpIHtcbiAgICAgICAgbHN0YWNrLnB1c2gocGwpO1xuICAgICAgICByc3RhY2sucHVzaChyaWdodCk7XG4gICAgICB9XG4gICAgICAvLyDtmITsnqwg7JWM6rOg66as7KaY7J20IOuwlOudvOuztOuKlCDruJTroZ3rk6TsnZgg7IOJ7J2EIOybkOuemOuMgOuhnCDrs4Dqsr1cbiAgICAgIGJsb2Nrc1xuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxuYFxuc2VsZWN0aW9uIHNvcnQo7ISg7YOdIOygleugrCnripQg7ZW064u5IOyInOyEnOyXkCDsm5Dshozrpbwg64Sj7J2EIOychOy5mOuKlCDsnbTrr7gg7KCV7ZW07KC4IOyeiOqzoCwg7Ja065akIOybkOyGjOulvCDrhKPsnYTsp4Ag7ISg7YOd7ZWY64qUIOyVjOqzoOumrOymmOyeheuLiOuLpC5cbuy1nOyGjOqwkuydhCDtg5Dsg4kg7ZuEIOq3uCDqsJLsnYQg7JWe7JeQ7ISc67aA7YSwIOuwsOyXtO2VmOuKlCDrsKnsi53snoXri4jri6QuXG5cbu2Pieq3oCDsi5zqsIQg67O17J6h64+EIDogVChuKSA9IE8objxzdXA+Mjwvc3VwPilcbmBcbiAgICApO1xuICAgIHRoaXMuZHJhd1BzZXVkb0NvZGUoICBcbiBgXG5mdW5jdGlvbiBzZWxlY3Rpb25Tb3J0KEEsIG4pIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IG4tMTsgaSsrKXtcbiAgICBtaW4gPSBpXG4gICAgZm9yKGxldCBqID0gaSArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgIGlmKEFbal0gPCBBW21pbl0pXG4gICAgICAgIG1pbiA9IGpcbiAgICB9XG4gICAgaWYobWluICE9IGkpXG4gICAgICBzd2FwKEFbaV0sQVttaW5dKVxuICB9XG59XG5gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNvcnQoKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpXG4gICAgICByZXR1cm47XG4gICAgXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gdHJ1ZTtcbiAgICBcbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbWluO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTspIHtcbiAgICAgIG1pbiA9IGk7XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvL2nrsojsp7jruJTrn60g67mo6rCE7IOJ7Jy866GcXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOykge1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JTZWxlY3RlZCgpOyAvLyBpKzHrsojrtoDthLBuLTHrsojquYzsp4DsnZgg67iU65+t7J2EIOywqOuhgOuMgOuhnCDruajqsITsg4nsnLzroZxcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8Ly9cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgIGlmKGo8bi0xKXtcbiAgICAgICAgICBsZXQgdmNtcCA9IGJsb2Nrc1tqKzFdLmdldFZhbHVlKCk7XG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmNtcH0g67mE6rWQYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpIHtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAg7ZiE7J6sIOy1nOyGn+qwkiA6ICR7dmFsdWUyfWApO1xuICAgICAgICAgIG1pbiA9IGo7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYOy1nOyGn+qwkuqzvCDtmITsnqwg6rCS7J2EIOq1kO2ZmO2VnOuLpGApO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTsgLy8g67iU65+tIOyytOyduOyngFxuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCgxMCk7XG4gICAgICAgICAgbWluID0gaTsgLy8gbWlu6rCS7LSI6riw7ZmUXG4gICAgICAgICAgYmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQg64yA7IOB67iU66Gd7IOJ6rmUIO2MjOuegOyDieycvOuhnFxuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpOyAvL+uRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3Prpbwg7JeF642w7J207Yq4XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpOyAvLyDsm5Drnpgg7IOJ6rmU66GcIOuQmOuPjOumrOq4sFxuICAgICAgICBqICs9IDE7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JTb3J0ZWQoKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG5cbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxuICAgIGJsb2Nrc1tuIC0gMV0uc2V0Q29sb3JTb3J0ZWQoKTtcblxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjb25zdCBDb2xvciA9IHJlcXVpcmUoJy4vQ29sb3InKTtcblxuY2xhc3MgQmxvY2sge1xuICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxuICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lciwgYmxvY2tXaWR0aCA9IDI4LCBibG9ja01hcmdpbiA9IDIpIHtcbiAgICBjb25zdCBibG9ja0NvdW50ID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pLmZpbHRlcihkb20gPT4gZG9tLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKSkubGVuZ3RoO1xuICAgIGNvbnN0IHhQb3NpdGlvbiA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcblxuICAgIHJldHVybiBuZXcgQmxvY2sodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCBibG9ja1dpZHRoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBjb250YWluZXIsIHhQb3NpdGlvbiwgIHdpZHRoLHRyYW5zaXRpb25EdXJhdGlvbj0yMDApIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuXG4gICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XG5cbiAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcbiAgXG4gICAgdGhpcy5kb20gPSBibG9jaztcblxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRUcmFuc2l0aW9uRHVyYXRpb24odHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcbiAgICB0aGlzLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuXG4gICAgLy8g7ZmU66m07JeQIOu4lOuhnSDtkZzsi5xcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICB9XG4gIHN3YXBCbG9jayhibG9jaykge1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IHRoaXMuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jay5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG5leHRPZlRhcmdldDEpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpbnNlcnRCZWZvcmUoYmxvY2spIHtcbiAgICBjb25zdCBhbmltYXRpb25EZWxheSA9IHRoaXMuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgYmxvY2suZG9tKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VHJhbnNpdGlvbkR1cmF0aW9uKG1pbGxpcykge1xuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gbWlsbGlzO1xuICAgIHRoaXMuZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAke3RoaXMudHJhbnNpdGlvbkR1cmF0aW9ufW1zYDtcbiAgfVxuXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbigpIHtcbiAgICAvLyByZXR1cm4gTnVtYmVyKFxuICAgIC8vICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCAwKVxuICAgIC8vICk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uO1xuICB9XG5cbiAgc2V0WFBvc2l0aW9uKHgpIHtcbiAgICB0aGlzLnhQb3NpdGlvbiA9IHg7XG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLnhQb3NpdGlvbn1weClgO1xuICB9XG5cbiAgZ2V0WFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnhQb3NpdGlvbjtcbiAgICAvLyBjb25zdCByZWdFeHBUcmFuc1ggPSAvW1xcd10rXFwoWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdP1tcXGRdK1sgXT8sWyBdPyhbXFxkXSspWyBdPyxbIF0/W1xcZF0rWyBdP1xcKS87XG4gICAgLy8gY29uc3QgdHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kb20pLnRyYW5zZm9ybTtcbiAgICAvLyByZXR1cm4gcmVnRXhwVHJhbnNYLmV4ZWModHJhbnNmb3JtKVsxXTtcbiAgfVxuXG4gIHNldFdpZHRoKHB4KSB7XG4gICAgdGhpcy53aWR0aCA9IHB4O1xuICAgIHRoaXMuZG9tLnN0eWxlLndpZHRoID0gYCR7dGhpcy53aWR0aH1weGA7XG4gIH1cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICBzZXRDb2xvcihjb2xvcikge1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIGdldENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLmNvbG9yO1xuICB9XG5cbiAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclNlbGVjdGVkKCkge1xuICAgIHRoaXMuY29sb3IgPSBDb2xvci5zZWxlY3RlZDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+yEoO2DneuQnCDruJTroZ0gOiDruajqsJUgLT4g7Jew67O06528XG4gIH1cblxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yRGVmYXVsdCgpIHtcbiAgICB0aGlzLmNvbG9yID0gQ29sb3IuZGVmYXVsdENvbG9yO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v6riw67O4IOu4lOuhnTog7YyM656RIC0+IOyXsO2Vke2BrFxuICB9XG5cbiAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JTb3J0ZWQoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnNvcnRlZDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+ygleugrCDrgZ3rgpwg67iU66GdOiDqt7jrprAo7LSI66GdKSAtPiDssJDtlZHtgaxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIFBpdm90IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclBpdm90KCkge1xuICAgIHRoaXMuY29sb3IgPSBDb2xvci5waXZvdDtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yOyAvL+2UvOuylyDruJTroZ0gOiDtmJXqtJEg7ZWR7YGsIC0+ICDssJDrs7TrnbxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOqyveqzhOulvCDrgpjtg4DrgrTripQg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yQm91bmRhcnkoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLmJvdW5kYXJ5O1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8vIOu4lOufrSDqsr3qs4QgOiDrs7TrnbwgLT4g64W4656RIFxuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpe1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAvLyDruJTroZ3snZgg7LWc64yAIOuGkuydtOuKlCDsu6jthYzsnbTrhIjsnZgg64aS7J20IC0gMjRweFxuICAgIGNvbnN0IG1heEhpZ2h0ID1cbiAgICAgIE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSAyNDtcbiAgICBsZXQgYmxvY2tIaWdodCA9IHZhbHVlICogMztcbiAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSBgJHtibG9ja0hpZ2h0IDwgbWF4SGlnaHQgPyBibG9ja0hpZ2h0IDogbWF4SGlnaHR9cHhgO1xuXG4gICAgdGhpcy5kb20uZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcbiIsIlxuXG4vLyDquLDrs7gg67iU66GdIOyDieyDgVxuY29uc3QgZGVmYXVsdENvbG9yID0gXCIjRkY5RkIzXCI7XG5cbi8vIOu4lOuhneydtCDshKDtg53rkJjsl4jsnYQg65WMIOyDieyDgVxuY29uc3Qgc2VsZWN0ZWQgPSBcIiNCNjlBRTdcIjtcblxuLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7IOBXG5jb25zdCBzb3J0ZWQgPSBcIiNGRjZDNzdcIjtcblxuLy8gUGl2b3Qg67iU66Gd7J2YIOyDieyDgSAoUXVpY2sgU29ydOyXkOyEnOydmCBQaXZvdClcbmNvbnN0IHBpdm90ID0gXCIjOUY3MEYxXCI7XG5cbi8vIFF1aWNrIFNvcnTsl5DshJwgUGFydGl0aW9uIO2VqOyImOydmCDrjIDsg4Hsnbgg67iU66Gd65Ok7J2YIOyDieyDgVxuY29uc3QgYm91bmRhcnkgPSBcIiNGNUUzNDhcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGVmYXVsdENvbG9yLFxuICAgIHNlbGVjdGVkLFxuICAgIHNvcnRlZCxcbiAgICBwaXZvdCxcbiAgICBib3VuZGFyeVxufSIsImNvbnN0IEJsb2NrID0gcmVxdWlyZShcIi4vQmxvY2tcIik7XG5cbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxuY2xhc3MgU29ydCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbnRhaW5lcixcbiAgICBibG9ja3MgPSBbXSxcbiAgICBkZWxheSA9IDIwMCxcbiAgICBhbmltYXRpb25EZWxheSA9IDI1MCxcbiAgICBibG9ja1dpZHRoID0gMjgsXG4gICAgYmxvY2tNYXJnaW4gPSAyLFxuICAgIGRlc2NyaXB0aW9uXG4gICkge1xuICAgIC8vIOygleugrO2VoCDrjIDsg4Hsnbgg67iU66Gd65OkXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgLy8g67iU66Gd7J2EIOyLnOqwge2ZlCDtlaAg7Luo7YWM7J2064SIIERPTVxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIC8vIOygleugrCDsiqTthZ0g7IKs7J20IOuUnOugiOydtFxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAvLyDsoJXroKzsnbQg66mI7LaYIOyDge2DnFxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgLy8g67iU66Gd7J2YIOuEiOu5hFxuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgLy8g67iU66GdIOyCrOydtCDqsITqsqlcbiAgICB0aGlzLmJsb2NrTWFyZ2luID0gYmxvY2tNYXJnaW47XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICAvLyDsoJXroKzsnbQg7ZiE7J6sIOyLpO2WieykkeyduCDsg4Htg5xcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xuXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICB9XG5cbiAgLy8g7IiY64+EIOy9lOuTnCDrrLjsnpDsl7TsnYQg67Cb7JWE7IScIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7Jqw7Lih7JeQIOuztOyXrOykjFxuICBkcmF3UHNldWRvQ29kZShwc2V1ZG9Db2RlKXtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDsiJjrj4TsvZTrk5wg7IKt7KCcXG4gICAgQXJyYXkuZnJvbShwc2V1ZG9Db2RlQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkPT5jaGlsZC5yZW1vdmUoKSk7XG4gICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIFxuICAgIC8vIOykhOuzhOuhnFxuICAgIHBzZXVkb0NvZGUuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgIHBzZXVkb0NvZGVDb250YWluZXIuaW5uZXJIVE1MICs9IGA8Y29kZT4ke2xpbmV9PC9jb2RlPiR7J1xcbid9YFxuICAgIH0pXG5cbiAgfVxuXG4gIC8vIOyEpOuqheydhCDrsJvslYTshJwg7Iuc6rCB7ZmUIOy7qO2FjOydtOuEiCDsmrDsuKHsl5Ag67O07Jes7KSMXG4gIGRyYXdEZXNjcmlwdGlvbihkZXNjcmlwdGlvbil7XG4gICAgY29uc3QgZGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLWNvbnRhaW5lclwiKTtcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyEpOuqhSDsgq3soJxcbiAgICBBcnJheS5mcm9tKGRlc2NyaXB0aW9uQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkPT5jaGlsZC5yZW1vdmUoKSk7XG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICBcbiAgICAvLyDspITrs4TroZxcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MICs9IGA8ZGl2PiR7bGluZX08L2Rpdj4keydcXG4nfWBcbiAgICB9KVxuXG4gIH1cblxuICAvLyDstpTsg4Eg66mU7IaM65OcXG4gIHNvcnQoKSB7fVxuXG4gIHdhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3ApIHtcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnRpbnVlKCkge1xuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgdGhpcy5zdGVwKCk7XG4gIH1cblxuICBzdGVwKCkge1xuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlc29sdmUoeyB0eXBlOiBcInN0ZXBcIiB9KTtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RlcEJhY2soKSB7XG4gICAgaWYgKHRoaXMucmVzb2x2ZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSh7XG4gICAgICAgICAgdHlwZTogXCJiYWNrXCIsXG4gICAgICAgICAgbWVtZW50bzogdGhpcy5tZW1ldG9TdGFjay5wb3AoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7ZWY7J2065287J207Yq466W8IOyXhuyVsFxuICBjb2RlRGVmYXVsdCgpe1xuICAgIGNvbnN0IHBzZXVkb0NvZGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gcHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbjtcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRyZW5baV0uc3R5bGUuY29sb3IgPSAnJztcbiAgICB9XG4gIH1cblxuICAvLyDsi5zqsIHtmZTrkJwg7IiY64+EIOy9lOuTnOydmCDtirnsoJUg7KSE7J2EIO2VmOydtOudvOydtO2KuFxuICBjb2RlSGlnaGxpZ2h0KC4uLmxpbmUpIHtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wc2V1ZG8tY29kZS1jb250YWluZXJcIik7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW47XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gJyc7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgbWFuZ28gPSAwOyBtYW5nbyA8IGxpbmUubGVuZ3RoOyBtYW5nbysrKSB7XG4gICAgICBjb25zdCBjb2RlRWxlbWVudCA9IGNoaWxkcmVuW2xpbmVbbWFuZ29dLTFdO1xuICAgICAgY29kZUVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNCNjlBRTdcIjtcbiAgICB9XG4gIH1cblxuICBwdXNoTWVtZW50byhtZW1lbnRvKSB7XG4gICAgdGhpcy5tZW1ldG9TdGFjay5wdXNoKG1lbWVudG8pO1xuICB9XG5cbiAgc2xlZXAobWlsbGlzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlcyA9PnNldFRpbWVvdXQocmVzLG1pbGxpcykpO1xuICB9XG5cbiAgc2h1ZmZsZSgpIHtcblxuICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oXCJcIik7XG4gICAgXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIGZvciAobGV0IGkgPSBibG9ja3MubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTsgLy8gMCDsnbTsg4EgaSDrr7jrp4zsnZgg66y07J6R7JyEIOyduOuNseyKpFxuICAgICAgW2Jsb2Nrc1tpXSwgYmxvY2tzW2pdXSA9IFtibG9ja3Nbal0sIGJsb2Nrc1tpXV07IC8vIOyFlO2UjFxuICAgIH1cbiAgICBibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcbiAgICAgIGJsb2NrLnNldENvbG9yRGVmYXVsdCgpOyAvLyDruJTroZ0g7IOJIOy0iOq4sO2ZlFxuXG4gICAgICBjb25zdCBwcmV2RHVyYXRpb24gPSBibG9jay5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbigwKTtcblxuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAodGhpcy5ibG9ja1dpZHRoICsgdGhpcy5ibG9ja01hcmdpbik7XG4gICAgICBibG9jay5zZXRYUG9zaXRpb24odHJhbnNYKTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIG51bGwpOyAvLyDruJTroZ3snZggRE9N7J2EIOy7qO2FjOydtOuEiOydmCDrp6gg64Gd7Jy866GcIOydtOuPmVxuXG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24ocHJldkR1cmF0aW9uKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICB9XG5cbiAgLy8g7ZiE7J6sIOyLnOqwge2ZlOuQmOuKlCDri6jqs4TsnZgg7ISk66qFIOyEpOyglVxuICAvLyDsi5zqsIHtmZQg7Luo7YWM7J2064SIIO2VmOuLqOyXkCDtkZzsi5zrkKhcbiAgc2V0RGVzY3JpcHRpb24odGV4dCkge1xuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKFwic29ydC1kZXNjcmlwdGlvblwiKTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb24pO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSB0ZXh0O1xuICB9XG5cbiAgc2V0QmxvY2tXaWR0aChibG9ja1dpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcbiAgICB0aGlzLmJsb2NrV2lkdGggPSBibG9ja1dpZHRoO1xuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcbiAgICAvLyB3aWR0aDpOdW1iZXJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoO1xuXG4gICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQgKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKSArIFwicHhcIjtcblxuICAgIC8vIOu4lOuhnSDtgazquLAg67CU6r646riwXG4gICAgdGhpcy5ibG9ja3MubWFwKChibG9jaywgaW5kZXgpID0+IHtcbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xuXG4gICAgICBjb25zdCBuZXdYID0gaW5kZXggKiAoYmxvY2tXaWR0aCArIGJsb2NrTWFyZ2luKTtcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbihuZXdYKTtcblxuICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcbiAgICAgIGJsb2NrLnNldFdpZHRoKGJsb2NrV2lkdGgpO1xuXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkQmxvY2soYmxvY2tWYWx1ZSkge1xuICAgIC8vIOu4lOuhnSDqsJzsiJgg7KCc7ZWcXG4gICAgaWYgKHRoaXMuYmxvY2tzLmxlbmd0aCA+IDMwKSByZXR1cm47XG5cbiAgICBjb25zdCBibG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKFxuICAgICAgYmxvY2tWYWx1ZSxcbiAgICAgIHRoaXMuY29udGFpbmVyLFxuICAgICAgdGhpcy5ibG9ja1dpZHRoLFxuICAgICAgdGhpcy5ibG9ja01hcmdpblxuICAgICk7XG5cbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIoXG4gICAgICB3aW5kb3dcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIilcbiAgICAgICAgLnJlcGxhY2UoXCJweFwiLCBcIlwiKVxuICAgICk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9XG4gICAgICBwcmV2V2lkdGggKyAodGhpcy5ibG9ja1dpZHRoICsgdGhpcy5ibG9ja01hcmdpbikgKyBcInB4XCI7XG4gIH1cblxuICBzZXREZWxheShtaWxsaXMpIHtcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xuICB9XG5cbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT5cbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbih0aGlzLmFuaW1hdGlvbkRlbGF5KVxuICAgICk7XG4gIH1cblxuICAvLyB0aGlzLmJsb2Nrc+ulvCDsi5zqsIHtmZTrkJjqs6DsnojripQg7Iic7ISc7JeQIOunnuqyjCDsoJXroKztlZjripQg7ZWo7IiYXG4gIHJlZnJlc2hCbG9ja3MoKSB7XG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSwgYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xuICB9XG5cbiAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcbiAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxuICBhc3luYyBzd2FwKGJsb2NrMSwgYmxvY2syKSB7XG4gICAgLy8gYmxvY2sxOiBCbG9jaywgYmxvY2syOiBCbG9ja1xuXG4gICAgY29uc3QgeDEgPSBibG9jazEuZ2V0WFBvc2l0aW9uKCk7XG4gICAgY29uc3QgeDIgPSBibG9jazIuZ2V0WFBvc2l0aW9uKCk7XG5cbiAgICBibG9jazEuc2V0WFBvc2l0aW9uKHgyKTtcbiAgICBibG9jazIuc2V0WFBvc2l0aW9uKHgxKTtcblxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgIGF3YWl0IGJsb2NrMS5zd2FwQmxvY2soYmxvY2syKTtcbiAgfVxuXG4gIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+uKlCDtlajsiJggXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgYmxvY2suc2V0WFBvc2l0aW9uKGRlc3RJbmRleCAqICAodGhpcy5ibG9ja1dpZHRoK3RoaXMuYmxvY2tNYXJnaW4pKTtcblxuICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgIGF3YWl0IGJsb2NrLmluc2VydEJlZm9yZShibG9ja3NbZGVzdEluZGV4XSk7XG4gIH1cblxuICAvLyBzdGFydCDsnbjrjbHsiqTrtoDthLAgZW5kIOyduOuNseyKpOq5jOyngCBibG9jayDtlZwg7Lm47JSpIOuvuOuKlCDtlajsiJggXG4gIGFzeW5jIHNoaWZ0IChzdGFydCwgZW5kKSB7XG4gICAgY29uc3QgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICBjb25zdCBiZXR3ZWVucyA9IGJsb2Nrcy5maWx0ZXIoKF8sIGkpID0+IHN0YXJ0IDw9IGkgJiYgaSA8IGVuZCk7XG5cbiAgICBjb25zdCAgeFJlc3QgPSBiZXR3ZWVucy5tYXAoYiA9PiBiLmdldFhQb3NpdGlvbigpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XG4gICAgfVxuICAgIGJsb2Nrc1tlbmQtMV0uc2V0WFBvc2l0aW9uKGJsb2Nrc1tlbmRdLmdldFhQb3NpdGlvbigpKTtcbiAgICBcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgYmxvY2tzWzBdLmdldFRyYW5zaXRpb25EdXJhdGlvbigpKSk7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0XCIpO1xuY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0XCIpO1xuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xuXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XG5cbi8vIOygleugrCDsooXrpZggUmFkaW9cbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XG5jb25zdCBpbnNlcnRpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2VydGlvbi1zb3J0LXJhZGlvXCIpO1xuY29uc3Qgc2VsZWN0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rpb24tc29ydC1yYWRpb1wiKTtcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xuXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IFJhbmdlXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXRcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXQgQnV0dG9uXG5jb25zdCBkZWxheUlucHV0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXQtYnRuXCIpO1xuXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaXplLXJhbmdlXCIpO1xuXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1pbnB1dFwiKTtcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcblxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cbmNvbnN0IHNvcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtYnRuXCIpO1xuXG4vLyDsoJXroKwg7KSR7KeAIEJ1dHRvblxuY29uc3Qgc29ydFN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RvcC1idG5cIik7XG5cbi8vIOygleugrCDsp4TtlokgQnV0dG9uXG5jb25zdCBzb3J0Q29udGludWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtY29udGludWUtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iqk7YWdIEJ1dHRvblxuY29uc3Qgc29ydFN0ZXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1idG5cIik7XG5cbi8vIOygleugrCDrkqTroZwg7Iqk7YWdIEJ1dHRvblxuY29uc3Qgc29ydFN0ZXBCYWNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb3J0LXN0ZXAtYmFjay1idG5cIik7XG5cbi8vIOu4lOuhnSDshJ7quLAgQnV0dG9uXG5jb25zdCBibG9ja1NodWZmbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2NrLXNodWZmbGUtYnRuXCIpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZVZhbHVlcyhjb3VudCA9IDIwKSB7XG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjUgKyAxKTtcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuLy8gU29ydCDslYzqs6Drpqzsppgg7YG0656Y7Iqk66W8IOuwm+yVhOyEnCDsoJXroKzsnYQg7IucXG5jb25zdCBtYWtlU29ydFJhZGlvT25jaGFuZ2UgPSBTb3J0QWxnb3JpdGhtID0+ICgpID0+IHtcbiAgc29ydCA9IG5ldyBTb3J0QWxnb3JpdGhtKFxuICAgIHNvcnQuY29udGFpbmVyLFxuICAgIHNvcnQuYmxvY2tzLFxuICAgIHNvcnQuZGVsYXksXG4gICAgc29ydC5hbmltYXRpb25EZWxheSxcbiAgICBzb3J0LmJsb2NrV2lkdGgsXG4gICAgc29ydC5ibG9ja01hcmdpbixcbiAgICBzb3J0LmRlc2NyaXB0aW9uXG4gICk7XG59O1xuXG5cbmJ1YmJsZVNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShCdWJibGVTb3J0KTtcbmluc2VydGlvblNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShJbnNlcnRpb25Tb3J0KTtcbnNlbGVjdGlvblNvcnRSYWRpby5vbmNoYW5nZSA9IG1ha2VTb3J0UmFkaW9PbmNoYW5nZShTZWxlY3Rpb25Tb3J0KTtcbnF1aWNrU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKFF1aWNrU29ydCk7XG5cblxubGV0IHNvcnQgPSBuZXcgQnViYmxlU29ydChjb250YWluZXIpO1xuZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoKS5mb3JFYWNoKHZhbHVlID0+IHNvcnQuYWRkQmxvY2sodmFsdWUpKTtcblxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XG4gIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuXG4gIGRlbGF5SW5wdXQudmFsdWUgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKS0gZGVsYXk7IC8vIGRlbGF5SW5wdXTqs7wg6rCSIOuPmeq4sO2ZlFxufTtcblxuLy8gZGVsYXlJbnB1dC5vbmlucHV0ID0gZSA9PiB7XG4vLyAgIGNvbnN0IGRlbGF5ID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSAtIE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG5cbi8vICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4vLyAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuLy8gICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcbi8vICAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xuLy8gfVxuXG5kZWxheUlucHV0Lm9ua2V5ZG93biA9IGUgPT4ge1xuICAvLyDsl5TthLDtgqTrpbwg64iE66W4IOqyveyasFxuICBpZiAoZS5rZXlDb2RlID09PSAxMylcbiAgICAvLyBkZWxheUlucHV0QnRu7JeQIGNsaWNrIOydtOuypO2KuCDtirjrpqzqsbBcbiAgICBkZWxheUlucHV0QnRuLmNsaWNrKCk7XG59XG5kZWxheUlucHV0QnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgLy8g7J6F66Cl6rCS7J20IOuylOychOulvCDrhJjslrTshJzrqbQg6rK96rOE6rCS7Jy866GcIOyEpOyglVxuICBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpID4gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSkge1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1heDtcbiAgfSBlbHNlIGlmIChOdW1iZXIoZGVsYXlJbnB1dC52YWx1ZSkgPCBOdW1iZXIoZGVsYXlSYW5nZS5taW4pKSB7XG4gICAgZGVsYXlJbnB1dC52YWx1ZSA9IGRlbGF5UmFuZ2UubWluO1xuICB9XG5cbiAgY29uc3QgZGVsYXkgPVxuICAgIE51bWJlcihkZWxheVJhbmdlLm1heCkgKyBOdW1iZXIoZGVsYXlSYW5nZS5taW4pIC0gTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpO1xuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbiAgc29ydC5zZXREZWxheShkZWxheSk7XG4gIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxuICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XG59O1xuXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xufTtcblxubmV3RGF0YUlucHV0Lm9ua2V5ZG93biA9IGUgPT4ge1xuICAvLyDsl5TthLDtgqTrpbwg64iE66W4IOqyveyasFxuICBpZiAoZS5rZXlDb2RlID09PSAxMylcbiAgICAvLyBuZXdEYXRhQWRkQnRu7JeQIGNsaWNrIOydtOuypO2KuCDtirjrpqzqsbBcbiAgICBuZXdEYXRhQWRkQnRuLmNsaWNrKCk7XG59XG5cbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IGUgPT4ge1xuICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxuICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09IFwiXCIpIHJldHVybjtcblxuICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xuXG4gIHNvcnQuYWRkQmxvY2sodmFsdWUpO1xufTtcblxuXG4vLyDsoJXroKwg64+E7KSR7JeUIElucHV065Ok7J2EIOu5hO2ZnOyEse2ZlFxuZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcbiAgYnViYmxlU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgcXVpY2tTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IHRydWU7XG4gIHNvcnRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBuZXdEYXRhQWRkQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbn1cbi8vIOygleugrOydtCDrgZ3rgpwg7ZuEIElucHV065Ok7J2EIO2ZnOyEse2ZlFxuZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgaW5zZXJ0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIHNlbGVjdGlvblNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHNpemVSYW5nZS5kaXNhYmxlZCA9IGZhbHNlO1xuICBzb3J0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgYmxvY2tTaHVmZmxlQnRuLmRpc2FibGVkID0gZmFsc2U7XG59XG5cbnNvcnRCdG4ub25jbGljayA9IGUgPT4ge1xuXG4gIGRpc2FibGVJbnB1dHMoKTsgLy8g7KCV66Cs7J20IOyLnOyekeuQoCDrlYwg67mE7Zmc7ISx7ZmUXG5cbiAgc29ydC5zb3J0KCkudGhlbihlbmFibGVJbnB1dHMpXG59O1xuXG5zb3J0U3RvcEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuc3RvcCgpO1xufTtcblxuc29ydENvbnRpbnVlQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5jb250aW51ZSgpO1xufTtcblxuc29ydFN0ZXBCdG4ub25jbGljayA9IGUgPT4ge1xuICBzb3J0LnN0ZXAoKTtcbn07XG5cbnNvcnRTdGVwQmFja0J0bi5vbmNsaWNrID0gZSA9PiB7XG4gIHNvcnQuc3RlcEJhY2soKTtcbn1cblxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgc29ydC5zaHVmZmxlKCk7XG59O1xuIl19
