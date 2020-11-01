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

},{"../sort/Sort":5}],2:[function(require,module,exports){
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
        //blocks[j].setColorRed();

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        //blocks[j].setColorDefault();
        if (value > target) {
          destIndex = j;
          break;
        }
      }
      if (i != destIndex) {
        blocks[destIndex].setColorRed();

        await this.insertAt(blocks[i], destIndex);

        blocks[destIndex].setColorGreen();
      }
      blocks[i].setColorGreen();
      blocks = this.getBlocks();
    }
  }
}

module.exports = InsertionSort;

},{"../sort/Sort":5}],3:[function(require,module,exports){
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
      for (let j = i + 1; j < n; j += 1) {
        // delay만큼 기다림
        blocks[i].setColorRed();
        await new Promise(resolve => setTimeout(resolve, this.delay));
        let value1 = blocks[min].getValue();
        let value2 = blocks[j].getValue();
        if (value1 >= value2) min = j;
        if (i != min && j == n - 1) {
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
module.exports = SelectionSort;

},{"../sort/Sort":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(container, blocks, delay = 200, animationDelay = 250) {
    this.blocks = blocks;
    this.container = container;
    this.delay = delay;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);
  }

  // 추상 메소드
  sort() {}

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

},{}],6:[function(require,module,exports){
const Block = require("../sort/Block");
const BubbleSort = require("../bubble-sort/BubbleSort");
const InsertionSort = require("../insertion-sort/InsertionSort");
const SelectionSort = require("../selection-sort/SelectionSort");

// 정렬이 시각화 될 container
const container = document.querySelector(".data-container");

// radio.checked 의 값을 읽어와서 사용
const bubbleSortRadio = document.getElementById("bubble-sort-radio");
const insertionSortRadio = document.getElementById("insertion-sort-radio");
const selectionSortRadio = document.getElementById("selection-sort-radio");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

// 시각화 블록 크기 Range
const sizeRange = document.getElementById("size-range");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById("new-data-input");
// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");

// 정렬 시작 Button
const sortStartBtn = document.getElementById("sort-start-btn");

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
  } else {
    SortAlgorithm = BubbleSort;
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
sortStartBtn.onclick = e => {
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

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../selection-sort/SelectionSort":3,"../sort/Block":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XG4gICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XG4gIH1cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7IGogKz0gMSkge1xuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXG5cbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcbiAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcbiAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcblxuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgfVxuICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICBibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpICs9IDEpIHtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xuXG4gICAgICBsZXQgZGVzdEluZGV4ID0gaTtcblxuICAgICAgY29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgIC8vYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIC8vYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBpZiAodmFsdWUgPiB0YXJnZXQpIHtcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcbiAgICAgICAgYmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcblxuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG1pbjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xuICAgICAgbWluID0gaTtcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcbiAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG4gICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpO1xuICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgIGlmICh2YWx1ZTEgPj0gdmFsdWUyKSBtaW4gPSBqO1xuICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTtcbiAgICAgICAgICBtaW4gPSBpO1xuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuICAgIH1cblxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvckdyZWVuKCk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcbiIsImNsYXNzIEJsb2NrIHtcbiAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcbiAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpIHtcbiAgICAvLyB2YWx1ZTpOdW1iZXIsIGNvbnRhaW5lcjpET01cbiAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xuXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbiAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xuICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIDMwfXB4KWA7XG5cbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcbiAgICBibG9ja0xhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICByZXR1cm4gbmV3IEJsb2NrKGJsb2NrLCBjb250YWluZXIpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZG9tLCBjb250YWluZXIpIHtcbiAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JSZWQoKSB7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XG4gIH1cblxuICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yRGVmYXVsdCgpIHtcbiAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yR3JlZW4oKSB7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XG4gIH1cbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5ID0gMjAwLCBhbmltYXRpb25EZWxheSA9IDI1MCkge1xuICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcblxuICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxuICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xuICB9XG5cbiAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICBzb3J0KCkge31cblxuICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHtcbiAgICAvLyB3aWR0aDpOdW1iZXJcbiAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoO1xuXG4gICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQgKiAod2lkdGggKyBtYXJnaW4pICsgXCJweFwiO1xuXG4gICAgdGhpcy5nZXRCbG9ja3MoKS5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZG9tID0gYmxvY2suZG9tO1xuXG4gICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XG4gICAgICBjb25zdCBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uID0gZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwICsgXCJtc1wiO1xuXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh3aWR0aCArIGJsb2NrTWFyZ2luKTtcbiAgICAgIGRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zWH1weClgO1xuXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxuICAgICAgZG9tLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG5cbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XG4gICAgfSk7XG4gIH1cblxuICBhZGRCbG9jayhibG9jaykge1xuICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xuICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcihcbiAgICAgIHdpbmRvd1xuICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcilcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKVxuICAgICAgICAucmVwbGFjZShcInB4XCIsIFwiXCIpXG4gICAgKTtcblxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gcHJldldpZHRoICsgMzAgKyBcInB4XCI7XG4gIH1cblxuICBzZXREZWxheShtaWxsaXMpIHtcbiAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xuICB9XG5cbiAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcbiAgICB0aGlzLmJsb2Nrcy5tYXAoXG4gICAgICBibG9jayA9PiAoYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkgKyBcIm1zXCIpXG4gICAgKTtcbiAgfVxuXG4gIC8vIOuqqOuToCBibG9ja+uTpOydhCDrpqzthLTtlZjripQg7ZWo7IiYXG4gIGdldEJsb2NrcygpIHtcbiAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLCBiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ja3M7XG4gIH1cblxuICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxuICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXG4gIHN3YXAoYmxvY2sxLCBibG9jazIpIHtcbiAgICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XG4gICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcblxuICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XG4gICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG5cbiAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcbiAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcblxuICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXG4gICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XG5cbiAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XG4gICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xuXG4gICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PlxuICAgICAgICBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpXG4gICAgICApO1xuXG4gICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xuICAgICAgfVxuICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0XCIpO1xuY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0XCIpO1xuXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XG5cbi8vIHJhZGlvLmNoZWNrZWQg7J2YIOqwkuydhCDsnb3slrTsmYDshJwg7IKs7JqpXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1YmJsZS1zb3J0LXJhZGlvXCIpO1xuY29uc3QgaW5zZXJ0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnNlcnRpb24tc29ydC1yYWRpb1wiKTtcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0aW9uLXNvcnQtcmFkaW9cIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuaW1hdGlvbi1kZWxheS1yYW5nZVwiKTtcblxuLy8g7Iuc6rCB7ZmUIOu4lOuhnSDtgazquLAgUmFuZ2VcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZS1yYW5nZVwiKTtcblxuLy8g7IKs7Jqp7J6Q66Gc67aA7YSwIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7J6F66Cl67Cb64qUIElucHV0IFRleHRcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtaW5wdXRcIik7XG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kYXRhLWFkZC1idG5cIik7XG5cbi8vIOygleugrCDsi5zsnpEgQnV0dG9uXG5jb25zdCBzb3J0U3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RhcnQtYnRuXCIpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XG4gIGNvbnN0IHZhbHVlcyA9IFtdO1xuICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IG51bSkge1xuICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikpO1xufVxuXG4vLyBzb3J0IHR5cGUgcmFkaW/roZwg67aA7YSwIOqwkuydhCDsnb3slrTshJwgU29ydCBBbGdvcml0aG3snYQg6rKw7KCVXG5mdW5jdGlvbiBnZXRTb3J0QWxnb3JpdGhtKCkge1xuICBsZXQgU29ydEFsZ29yaXRobTtcbiAgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnQ7XG4gIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcbiAgICBTb3J0QWxnb3JpdGhtID0gU2VsZWN0aW9uU29ydDtcbiAgfSBlbHNlIHtcbiAgICBTb3J0QWxnb3JpdGhtID0gQnViYmxlU29ydDtcbiAgfVxuICByZXR1cm4gU29ydEFsZ29yaXRobTtcbn1cblxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVVbmlxdWVCbG9ja3MoMjAsIGNvbnRhaW5lcik7XG5cbmxldCBzb3J0ID0gbmV3IChnZXRTb3J0QWxnb3JpdGhtKCkpKGNvbnRhaW5lciwgYmxvY2tzLCAyNTAsIDI1MCk7XG5cbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xuICBjb25zdCBkZWxheSA9IGUudGFyZ2V0LnZhbHVlO1xuICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbiAgc29ydC5zZXREZWxheShkZWxheSk7XG59O1xuXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcbnNpemVSYW5nZS5vbmNoYW5nZSA9IGUgPT4ge1xuICBjb25zdCBzaXplID0gZS50YXJnZXQudmFsdWU7XG4gIGNvbnNvbGUubG9nKFwic2l6ZTogXCIgKyBzaXplKTtcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xufTtcblxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xuXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XG5cbiAgY29uc3QgbmV3QmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyKTtcbiAgc29ydC5hZGRCbG9jayhuZXdCbG9jayk7XG59O1xuXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXG5sZXQgaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuc29ydFN0YXJ0QnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgaWYgKGlzU29ydFJ1bm5pbmcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNTb3J0UnVubmluZyA9IHRydWU7XG4gIGNvbnN0IFNvcnRBbGdvcml0aG0gPSBnZXRTb3J0QWxnb3JpdGhtKCk7XG5cbiAgc29ydCA9IG5ldyBTb3J0QWxnb3JpdGhtKFxuICAgIGNvbnRhaW5lcixcbiAgICBzb3J0LmdldEJsb2NrcygpLFxuICAgIHNvcnQuZGVsYXksXG4gICAgc29ydC5hbmltYXRpb25EZWxheVxuICApO1xuXG4gIHNvcnQuZ2V0QmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gIHNvcnQuc29ydCgpLnRoZW4oXyA9PiAoaXNTb3J0UnVubmluZyA9IGZhbHNlKSk7XG59O1xuIl19
