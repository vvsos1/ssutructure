(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;

    for (let i = 0; i < n - 1; i += 1) {
      for (let j = 0; j < n - i - 1; j += 1) {       
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorRed();
        blocks[j + 1].setColorRed();

         // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
         await this.wait();

        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();

        if (value1 > value2) {
          // swap 함수로 두 블록의 위치를 바꿈; await은 swap 이 끝날 때 까지 기다리겠다는 의미
          await this.swap(blocks[j], blocks[j + 1]);

          // 두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
          blocks = this.getBlocks();
        }

        // 선택이 끝났으므로 블록의 색을 원래 색으로 바꿈
        blocks[j].setColorDefault();
        blocks[j + 1].setColorDefault();
      }

      // 정렬이 끝난 블록의 색을 Green으로 바꿈
      blocks[n - i - 1].setColorGreen();
    }
    blocks[0].setColorGreen();
  }
}

module.exports = BubbleSort;

},{"../sort/Sort":7}],2:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort2 extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;

    for (let i = 0; i < n - 1; i += 1) {
       // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
       await this.wait();
      for (let j = 0; j < n - i - 1; j += 1) {       
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorRed();
        blocks[j + 1].setColorRed();

        

        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();

        if (value1 > value2) {
          // swap 함수로 두 블록의 위치를 바꿈; await은 swap 이 끝날 때 까지 기다리겠다는 의미
          await this.swap(blocks[j], blocks[j + 1]);

          // 두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
          blocks = this.getBlocks();
        }

        // 선택이 끝났으므로 블록의 색을 원래 색으로 바꿈
        blocks[j].setColorDefault();
        blocks[j + 1].setColorDefault();
      }

      // 정렬이 끝난 블록의 색을 Green으로 바꿈
      blocks[n - i - 1].setColorGreen();
    }
    blocks[0].setColorGreen();
  }
}

module.exports = BubbleSort2;

},{"../sort/Sort":7}],3:[function(require,module,exports){
const Sort = require("../sort/Sort");

class InsertionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;

    blocks[0].setColorGreen();

    for (let i = 1; i < n; i += 1) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i; j++) {
        blocks[j].setColorRed();

        await this.wait();

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorGreen();
        if (value > target) {
          destIndex = j;
          break;
        }
      }
      if (i != destIndex) {
        blocks[destIndex].setColorRed();
        await this.wait();

        await this.insertAt(blocks[i], destIndex);

        blocks[destIndex].setColorGreen();
      }
      blocks[i].setColorGreen();
      blocks = this.getBlocks();
    }
  }
}

module.exports = InsertionSort;

},{"../sort/Sort":7}],4:[function(require,module,exports){
const Sort = require("../sort/Sort");

class SelectionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;
    let min;

    for (let i = 0; i < n - 1; i += 1) {
	    min = i;
	    blocks[i].setColorRed(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n; j += 1) {
	      blocks[j].setColorRed(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        // delay만큼 기다림// 
	      await new Promise(resolve => setTimeout(resolve, this.delay));
	      let value1 = blocks[min].getValue(); //변수 설정
	      let value2 = blocks[j].getValue();
        if (value1 >= value2) min = j;
        if (i != min && j == n - 1) {
          await this.wait();
          await this.swap(blocks[min], blocks[i]); // 블럭 체인지
		min = i; // min값초기화
		blocks[min].setColorDefault(); // 위치가 바뀌는  대상블록색깔 파란색으로
          blocks = this.getBlocks(); //두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
        }
	      await this.wait();
        blocks[j].setColorDefault(); // 빨간색 블럭을 다시 파란색으로
      }
      blocks[i].setColorGreen();
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorGreen();
  }
}
module.exports = SelectionSort;

},{"../sort/Sort":7}],5:[function(require,module,exports){
const Sort = require("../sort/Sort");

class SelectionSort2 extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }

  async sort() {
    // block들 가져오기
    let blocks = this.getBlocks();
    // block들의 총 개수
    const n = blocks.length;
    let min;

    for (let i = 0; i < n - 1; i += 1) {
      min = i;
      for (let j = i + 1; j < n; j += 1) {
        blocks[i].setColorRed();

        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));
        
        let value1 = blocks[min].getValue();
        let value2 = blocks[j].getValue();
        if (value1 >= value2) min = j;
        if (i != min && j == n - 1) {

          await this.wait();

          await this.swap(blocks[min], blocks[i]);
          min = i;
          // 두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
          blocks = this.getBlocks();
        }
        blocks[i].setColorDefault();
        blocks[j].setColorDefault();
      }
      blocks[i].setColorGreen();
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorGreen();
  }
}
module.exports = SelectionSort2;

},{"../sort/Sort":7}],6:[function(require,module,exports){
class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container) {
    // value:Number, container:DOM
    const blockCount = container.childElementCount;

    const block = document.createElement("div");
    block.classList.add("block");
    block.style.height = `${value * 3}px`;
    block.style.transform = `translateX(${blockCount * 30}px)`;

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");
    blockLabel.innerHTML = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
    return new Block(block, container);
  }

  constructor(dom, container) {
    this.dom = dom;
    this.container = container;
  }

  setColorYellow(){
    this.dom.style.backgroundColor = "#FFFF00";
  }

  // block을 선택된 블록의 색으로 바꾸는 함수
  setColorRed() {
    this.dom.style.backgroundColor = "#FF4949";
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.dom.style.backgroundColor = "#58B7FF";
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorGreen() {
    this.dom.style.backgroundColor = "#13CE66";
  }
  // block의 value를 반환하는 함수
  getValue() {
    return Number(this.dom.childNodes[0].innerHTML);
  }
}

module.exports = Block;

},{}],7:[function(require,module,exports){
// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(container, blocks, delay = 200, animationDelay = 250) {
    this.blocks = blocks;
    this.container = container;
    this.delay = delay;
    this.isStop = false;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);
  }

  // 추상 메소드
  sort() {}

  wait() {
    return new Promise(resolve => {
      if (this.isStop){
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
      this.resolve = resolve;
      } else {
        resolve();
      }
    })
  }

  stop() {
    this.isStop = true;
  }

  continue() {
    this.isStop = false;
    this.step();
  }

  step() {
    if (this.resolve != null && this.resolve != undefined){
      this.resolve();
      this.resolve = null;
    }
  }

  setBlockWidth(width, blockMargin = 2) {
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (width + margin) + "px";

    this.getBlocks().map((block, index) => {
      const dom = block.dom;

      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevTransitionDuration = dom.style.transitionDuration;
      dom.style.transitionDuration = 0 + "ms";

      const transX = index * (width + blockMargin);
      dom.style.transform = `translateX(${transX}px)`;

      // 블록의 너비 조정
      dom.style.width = width + "px";

      // 애니메이션 속도를 원래대로 조정
      dom.style.transitionDuration = prevTransitionDuration;
    });
  }

  addBlock(block) {
    this.blocks.push(block);
    const prevWidth = Number(
      window
        .getComputedStyle(this.container)
        .getPropertyValue("width")
        .replace("px", "")
    );

    this.container.style.width = prevWidth + 30 + "px";
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.map(
      block => (block.dom.style.transitionDuration = this.animationDelay + "ms")
    );
  }

  // 모든 block들을 리턴하는 함수
  getBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));

    return this.blocks;
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  swap(block1, block2) {
    // block1: Block, block2: Block
    return new Promise(resolve => {
      const style1 = window.getComputedStyle(block1.dom);
      const style2 = window.getComputedStyle(block2.dom);

      const transform1 = style1.getPropertyValue("transform");
      const transform2 = style2.getPropertyValue("transform");

      block1.dom.style.transform = transform2;
      block2.dom.style.transform = transform1;

      const nextOfTarget1 = block1.dom.nextSibling;
      const nextOfTarget2 = block2.dom.nextSibling;

      // 애니메이션이 끝나기를 기다림.
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(block1.dom, nextOfTarget2);
          this.container.insertBefore(block2.dom, nextOfTarget1);
          resolve();
        }, this.animationDelay);
      });
    });
  }

  // target을 destIndex 자리에 넣고 원래 destIndex의 element부터 한 칸씩 뒤로 미는 함수
  // target은 항상 destIndex보다 뒤에 있어야함
  insertAt(block, destIndex) {
    return new Promise(resolve => {
      const arr = Array.from(document.querySelectorAll(".block"));

      // target의 인덱스
      const targetIndex = arr.indexOf(block.dom);

      // destInde와 target 사이에 있는 블록들
      const betweens = arr.filter((_, i) => destIndex <= i && i < targetIndex);

      const style1 = window.getComputedStyle(block.dom);
      const styleRest = betweens.map(dom => window.getComputedStyle(dom));

      const transform1 = style1.getPropertyValue("transform");
      const transformRest = styleRest.map(style =>
        style.getPropertyValue("transform")
      );

      block.dom.style.transform = transformRest[0];
      for (let i = 0; i < betweens.length - 1; i++) {
        betweens[i].style.transform = transformRest[i + 1];
      }
      betweens[betweens.length - 1].style.transform = transform1;

      // 애니메이션이 끝나기를 기다림.
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(block.dom, betweens[0]);
          resolve();
        }, this.animationDelay);
      });
    });
  }
}

module.exports = Sort;

},{}],8:[function(require,module,exports){
const Block = require("../sort/Block");
const BubbleSort = require("../bubble-sort/BubbleSort");
const BubbleSort2 = require("../bubble-sort/BubbleSort2");
const InsertionSort = require("../insertion-sort/InsertionSort");
const SelectionSort = require("../selection-sort/SelectionSort");
const SelectionSort2 = require("../selection-sort/SelectionSort2");

// 정렬이 시각화 될 container
const container = document.querySelector(".data-container");

// radio.checked 의 값을 읽어와서 사용
const bubbleSortRadio = document.getElementById("bubble-sort-radio");
const bubbleSort2Radio = document.getElementById("bubble-sort2-radio");
const insertionSortRadio = document.getElementById("insertion-sort-radio");
const selectionSortRadio = document.getElementById("selection-sort-radio");
const selectionSort2Radio = document.getElementById("selection-sort2-radio");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

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

function generateUniqueBlocks(num = 20, container) {
  const values = [];
  while (values.length < num) {
    const value = Math.floor(Math.random() * 100);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values.map(value => Block.createNewBlock(value, container));
}

// sort type radio로 부터 값을 읽어서 Sort Algorithm을 결정
function getSortAlgorithm() {
  let SortAlgorithm;
  if (insertionSortRadio.checked) {
    SortAlgorithm = InsertionSort;
  } else if (selectionSortRadio.checked) {
    SortAlgorithm = SelectionSort;
  } else if (selectionSort2Radio.checked) {
    SortAlgorithm = SelectionSort2;
  } else if (bubbleSortRadio.checked) {
    SortAlgorithm = BubbleSort;
  } else if (bubbleSort2Radio.checked) {
    SortAlgorithm = BubbleSort2;
  }
  return SortAlgorithm;
}

const blocks = generateUniqueBlocks(20, container);

let sort = new (getSortAlgorithm())(container, blocks, 250, 250);

delayRange.oninput = e => {
  const delay = e.target.value;
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);
};

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
  const size = e.target.value;
  console.log("size: " + size);
  sort.setBlockWidth(size);
};

newDataAddBtn.onclick = e => {
  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  const newBlock = Block.createNewBlock(value, container);
  sort.addBlock(newBlock);
};

// isSortRunning은 현재 정렬이 진행중인지 표시하는 변수. true이면 sortStartBtn이 동작하지 않는다.
let isSortRunning = false;
sortBtn.onclick = e => {
  if (isSortRunning) {
    return;
  }
  isSortRunning = true;
  const SortAlgorithm = getSortAlgorithm();

  sort = new SortAlgorithm(
    container,
    sort.getBlocks(),
    sort.delay,
    sort.animationDelay
  );

  sort.getBlocks().forEach(block => block.setColorDefault());
  sort.sort().then(_ => (isSortRunning = false));
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

},{"../bubble-sort/BubbleSort":1,"../bubble-sort/BubbleSort2":2,"../insertion-sort/InsertionSort":3,"../selection-sort/SelectionSort":4,"../selection-sort/SelectionSort2":5,"../sort/Block":6}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnQyLmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0Mi5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTsgaiArPSAxKSB7ICAgICAgIFxyXG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgICAvLyDsgqzsmqnsnpDqsIAg64uk7J2MIOyKpO2FneycvOuhnCDrhJjslrTqsIDquLAg7KCEIOq5jOyngCh0aGlzLmNvbnRpbnVlKCkgb3IgdGhpcy5zdGVwKCkpIOq4sOuLpOumvFxyXG4gICAgICAgICBhd2FpdCB0aGlzLndhaXQoKTtcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XHJcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG5cclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydDIgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuICAgICAgIC8vIOyCrOyaqeyekOqwgCDri6TsnYwg7Iqk7YWd7Jy866GcIOuEmOyWtOqwgOq4sCDsoIQg6rmM7KeAKHRoaXMuY29udGludWUoKSBvciB0aGlzLnN0ZXAoKSkg6riw64uk66a8XHJcbiAgICAgICBhd2FpdCB0aGlzLndhaXQoKTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7IGogKz0gMSkgeyAgICAgICBcclxuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XHJcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG5cclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQyO1xyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc29ydCgpIHtcclxuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XHJcblxyXG4gICAgICBjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XHJcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdCgpO1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG4gICAgICAgICAgZGVzdEluZGV4ID0gajtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcclxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdCgpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcclxuXHJcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xyXG5cclxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgbGV0IG1pbjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuXHQgICAgbWluID0gaTtcclxuXHQgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbjsgaiArPSAxKSB7XHJcblx0ICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7IC8vIGkrMeuyiOu2gO2EsG4tMeuyiOq5jOyngOydmCDruJTrn63snYQg7LCo66GA64yA66GcIOu5qOqwhOyDieycvOuhnFxyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvC8vIFxyXG5cdCAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblx0ICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7IC8v67OA7IiYIOyEpOyglVxyXG5cdCAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikgbWluID0gajtcclxuICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy53YWl0KCk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7IC8vIOu4lOufrSDssrTsnbjsp4BcclxuXHRcdG1pbiA9IGk7IC8vIG1pbuqwkuy0iOq4sO2ZlFxyXG5cdFx0YmxvY2tzW21pbl0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOychOy5mOqwgCDrsJTrgIzripQgIOuMgOyDgeu4lOuhneyDieq5lCDtjIzrnoDsg4nsnLzroZxcclxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIOq4sOyhtCBibG9ja3Prpbwg7JeF642w7J207Yq4XHJcbiAgICAgICAgfVxyXG5cdCAgICAgIGF3YWl0IHRoaXMud2FpdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g67mo6rCE7IOJIOu4lOufreydhCDri6Tsi5wg7YyM656A7IOJ7Jy866GcXHJcbiAgICAgIH1cclxuICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxyXG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XHJcblxyXG5jbGFzcyBTZWxlY3Rpb25Tb3J0MiBleHRlbmRzIFNvcnQge1xyXG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzb3J0KCkge1xyXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgbGV0IG1pbjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuICAgICAgbWluID0gaTtcclxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbjsgaiArPSAxKSB7XHJcbiAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcblxyXG4gICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7XHJcbiAgICAgICAgbGV0IHZhbHVlMiA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZTEgPj0gdmFsdWUyKSBtaW4gPSBqO1xyXG4gICAgICAgIGlmIChpICE9IG1pbiAmJiBqID09IG4gLSAxKSB7XHJcblxyXG4gICAgICAgICAgYXdhaXQgdGhpcy53YWl0KCk7XHJcblxyXG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pO1xyXG4gICAgICAgICAgbWluID0gaTtcclxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XHJcbiAgICBibG9ja3NbbiAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0MjtcclxuIiwiY2xhc3MgQmxvY2sge1xyXG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXHJcbiAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpIHtcclxuICAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xyXG4gICAgYmxvY2suc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtibG9ja0NvdW50ICogMzB9cHgpYDtcclxuXHJcbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xyXG4gICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcclxuXHJcbiAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgICByZXR1cm4gbmV3IEJsb2NrKGJsb2NrLCBjb250YWluZXIpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoZG9tLCBjb250YWluZXIpIHtcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvclllbGxvdygpe1xyXG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRjAwXCI7XHJcbiAgfVxyXG5cclxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JSZWQoKSB7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjQ5NDlcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICBzZXRDb2xvckRlZmF1bHQoKSB7XHJcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcclxuICB9XHJcblxyXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgc2V0Q29sb3JHcmVlbigpIHtcclxuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xyXG4gIH1cclxuICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXHJcbiAgZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsIi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxyXG5jbGFzcyBTb3J0IHtcclxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXkgPSAyMDAsIGFuaW1hdGlvbkRlbGF5ID0gMjUwKSB7XHJcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcclxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xyXG4gIH1cclxuXHJcbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxyXG4gIHNvcnQoKSB7fVxyXG5cclxuICB3YWl0KCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1N0b3Ape1xyXG4gICAgICAgIC8vIO2YhOyerCDsoJXroKwg7KSR7KeAIOyDge2DnOudvOuptCB0aGlzLnN0ZXDsnYQg7Ya17ZW0IOygleugrOydhCDsi5zsnpHtlZjrj4TroZ0g7ISk7KCVXHJcbiAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnRpbnVlKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RlcCgpO1xyXG4gIH1cclxuXHJcbiAgc3RlcCgpIHtcclxuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy5yZXNvbHZlKCk7XHJcbiAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcclxuICAgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50ICogKHdpZHRoICsgbWFyZ2luKSArIFwicHhcIjtcclxuXHJcbiAgICB0aGlzLmdldEJsb2NrcygpLm1hcCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGRvbSA9IGJsb2NrLmRvbTtcclxuXHJcbiAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcclxuICAgICAgY29uc3QgcHJldlRyYW5zaXRpb25EdXJhdGlvbiA9IGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgXCJtc1wiO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAod2lkdGggKyBibG9ja01hcmdpbik7XHJcbiAgICAgIGRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zWH1weClgO1xyXG5cclxuICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcclxuICAgICAgZG9tLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEJsb2NrKGJsb2NrKSB7XHJcbiAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcclxuICAgICAgd2luZG93XHJcbiAgICAgICAgLmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpXHJcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKFwicHhcIiwgXCJcIilcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBwcmV2V2lkdGggKyAzMCArIFwicHhcIjtcclxuICB9XHJcblxyXG4gIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcclxuICB9XHJcblxyXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xyXG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgIHRoaXMuYmxvY2tzLm1hcChcclxuICAgICAgYmxvY2sgPT4gKGJsb2NrLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0aGlzLmFuaW1hdGlvbkRlbGF5ICsgXCJtc1wiKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIOuqqOuToCBibG9ja+uTpOydhCDrpqzthLTtlZjripQg7ZWo7IiYXHJcbiAgZ2V0QmxvY2tzKCkge1xyXG4gICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxyXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICBzd2FwKGJsb2NrMSwgYmxvY2syKSB7XHJcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xyXG4gICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xyXG4gICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcblxyXG4gICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcclxuICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2sxLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcclxuICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBjb25zdCBhcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG5cclxuICAgICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxyXG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IGFyci5pbmRleE9mKGJsb2NrLmRvbSk7XHJcblxyXG4gICAgICAvLyBkZXN0SW5kZeyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcclxuICAgICAgY29uc3QgYmV0d2VlbnMgPSBhcnIuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xyXG5cclxuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKTtcclxuICAgICAgY29uc3Qgc3R5bGVSZXN0ID0gYmV0d2VlbnMubWFwKGRvbSA9PiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtUmVzdCA9IHN0eWxlUmVzdC5tYXAoc3R5bGUgPT5cclxuICAgICAgICBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBiZXR3ZWVuc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0W2kgKyAxXTtcclxuICAgICAgfVxyXG4gICAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xyXG5cclxuICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xyXG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnRcIik7XHJcbmNvbnN0IEJ1YmJsZVNvcnQyID0gcmVxdWlyZShcIi4uL2J1YmJsZS1zb3J0L0J1YmJsZVNvcnQyXCIpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZShcIi4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnRcIik7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydFwiKTtcclxuY29uc3QgU2VsZWN0aW9uU29ydDIgPSByZXF1aXJlKFwiLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydDJcIik7XHJcblxyXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRhLWNvbnRhaW5lclwiKTtcclxuXHJcbi8vIHJhZGlvLmNoZWNrZWQg7J2YIOqwkuydhCDsnb3slrTsmYDshJwg7IKs7JqpXHJcbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XHJcbmNvbnN0IGJ1YmJsZVNvcnQyUmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1YmJsZS1zb3J0Mi1yYWRpb1wiKTtcclxuY29uc3QgaW5zZXJ0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNlcnRpb24tc29ydC1yYWRpb1wiKTtcclxuY29uc3Qgc2VsZWN0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rpb24tc29ydC1yYWRpb1wiKTtcclxuY29uc3Qgc2VsZWN0aW9uU29ydDJSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQyLXJhZGlvXCIpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XHJcblxyXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxyXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpemUtcmFuZ2VcIik7XHJcblxyXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxyXG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWlucHV0XCIpO1xyXG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cclxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcclxuXHJcbi8vIOygleugrCDsi5zsnpEgQnV0dG9uXHJcbmNvbnN0IHNvcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOykkeyngCBCdXR0b25cclxuY29uc3Qgc29ydFN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RvcC1idG5cIik7XHJcblxyXG4vLyDsoJXroKwg7KeE7ZaJIEJ1dHRvblxyXG5jb25zdCBzb3J0Q29udGludWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtY29udGludWUtYnRuXCIpO1xyXG5cclxuLy8g7KCV66CsIOyKpO2FnSBCdXR0b25cclxuY29uc3Qgc29ydFN0ZXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1idG5cIik7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XHJcbiAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPCBudW0pIHtcclxuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcclxuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpKTtcclxufVxyXG5cclxuLy8gc29ydCB0eXBlIHJhZGlv66GcIOu2gO2EsCDqsJLsnYQg7J297Ja07IScIFNvcnQgQWxnb3JpdGht7J2EIOqysOyglVxyXG5mdW5jdGlvbiBnZXRTb3J0QWxnb3JpdGhtKCkge1xyXG4gIGxldCBTb3J0QWxnb3JpdGhtO1xyXG4gIGlmIChpbnNlcnRpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XHJcbiAgfSBlbHNlIGlmIChzZWxlY3Rpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IFNlbGVjdGlvblNvcnQ7XHJcbiAgfSBlbHNlIGlmIChzZWxlY3Rpb25Tb3J0MlJhZGlvLmNoZWNrZWQpIHtcclxuICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0MjtcclxuICB9IGVsc2UgaWYgKGJ1YmJsZVNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICBTb3J0QWxnb3JpdGhtID0gQnViYmxlU29ydDtcclxuICB9IGVsc2UgaWYgKGJ1YmJsZVNvcnQyUmFkaW8uY2hlY2tlZCkge1xyXG4gICAgU29ydEFsZ29yaXRobSA9IEJ1YmJsZVNvcnQyO1xyXG4gIH1cclxuICByZXR1cm4gU29ydEFsZ29yaXRobTtcclxufVxyXG5cclxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVVbmlxdWVCbG9ja3MoMjAsIGNvbnRhaW5lcik7XHJcblxyXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIsIGJsb2NrcywgMjUwLCAyNTApO1xyXG5cclxuZGVsYXlSYW5nZS5vbmlucHV0ID0gZSA9PiB7XHJcbiAgY29uc3QgZGVsYXkgPSBlLnRhcmdldC52YWx1ZTtcclxuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcclxufTtcclxuXHJcbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxyXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcclxuICBjb25zdCBzaXplID0gZS50YXJnZXQudmFsdWU7XHJcbiAgY29uc29sZS5sb2coXCJzaXplOiBcIiArIHNpemUpO1xyXG4gIHNvcnQuc2V0QmxvY2tXaWR0aChzaXplKTtcclxufTtcclxuXHJcbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XHJcbiAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSBcIlwiKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XHJcblxyXG4gIGNvbnN0IG5ld0Jsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcik7XHJcbiAgc29ydC5hZGRCbG9jayhuZXdCbG9jayk7XHJcbn07XHJcblxyXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXHJcbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbnNvcnRCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIGlmIChpc1NvcnRSdW5uaW5nKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG4gIGNvbnN0IFNvcnRBbGdvcml0aG0gPSBnZXRTb3J0QWxnb3JpdGhtKCk7XHJcblxyXG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcclxuICAgIGNvbnRhaW5lcixcclxuICAgIHNvcnQuZ2V0QmxvY2tzKCksXHJcbiAgICBzb3J0LmRlbGF5LFxyXG4gICAgc29ydC5hbmltYXRpb25EZWxheVxyXG4gICk7XHJcblxyXG4gIHNvcnQuZ2V0QmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgc29ydC5zb3J0KCkudGhlbihfID0+IChpc1NvcnRSdW5uaW5nID0gZmFsc2UpKTtcclxufTtcclxuXHJcbnNvcnRTdG9wQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICBzb3J0LnN0b3AoKTtcclxufTtcclxuXHJcbnNvcnRDb250aW51ZUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgc29ydC5jb250aW51ZSgpO1xyXG59O1xyXG5cclxuc29ydFN0ZXBCdG4ub25jbGljayA9IGUgPT4ge1xyXG4gIHNvcnQuc3RlcCgpO1xyXG59O1xyXG4iXX0=
