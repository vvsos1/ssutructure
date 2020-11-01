(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require('../sort/Sort');

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
    }
}

module.exports = BubbleSort;



       

},{"../sort/Sort":5}],2:[function(require,module,exports){
const Sort = require('../sort/Sort');

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
				break ;
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
const Sort = require('../sort/Sort');

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
                if (value1 >= value2)
                    min = j;
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
        blocks[n-1].setColorGreen();
    }
}
module.exports = SelectionSort;

},{"../sort/Sort":5}],4:[function(require,module,exports){
class Block {
    // static factory method; value와 container를 이용해 Block 객체를 만든다
    static createNewBlock(value, container) {   // value:Number, container:DOM
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
        return new Block(block,container);
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
    constructor( container,blocks, delay=200, animationDelay=250) {
        this.blocks = blocks;
        this.container = container;
        this.delay = delay;
        
        // block 들의 애니메이션 딜레이를 설정
        this.setAnimationDelay(animationDelay);
    }   
    

    // 추상 메소드
    sort() {

    }

    setBlockWidth(width, blockMargin = 2) {  // width:Number
        const blockCount = this.blocks.length
        
        // 컨테이너 크기 넓히기
        this.container.style.width = blockCount*(width+margin) + "px";
        
        
        this.getBlocks()
        .map((block,index)=> {
            const dom = block.dom;

            // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
            const prevTransitionDuration = dom.style.transitionDuration;
            dom.style.transitionDuration = 0+'ms';

            const transX = index * (width + blockMargin);
            dom.style.transform = `translateX(${transX}px)`;

            // 블록의 너비 조정
            dom.style.width=width+"px";
            

            // 애니메이션 속도를 원래대로 조정
            dom.style.transitionDuration = prevTransitionDuration;
        });

    }

    addBlock(block) {
        this.blocks.push(block);
        const prevWidth = Number(window.getComputedStyle(this.container).getPropertyValue("width").replace('px',''));

        this.container.style.width = (prevWidth + 30)+'px';
        
    }

    setDelay(millis) {
        this.delay = millis;
    }

    setAnimationDelay(millis) {
        this.animationDelay = millis;
        this.blocks.map(block => block.dom.style.transitionDuration = this.animationDelay+"ms");
    }
    
    // 모든 block들을 리턴하는 함수
    getBlocks() {

        const doms = Array.from(document.querySelectorAll(".block"));
        
        this.blocks.sort((b1,b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));

        return this.blocks;
    }

    // target1과 tatget2의 위치를 바꿈
    // target1이 항상 target2보다 앞에 있어야 함
    swap(block1, block2) {  // block1: Block, block2: Block
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
            window.requestAnimationFrame(()=> {
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
            const transformRest = styleRest.map(style => style.getPropertyValue("transform"));

            block.dom.style.transform = transformRest[0];
            for (let i = 0; i < betweens.length - 1; i++) {
                betweens[i].style.transform = transformRest[i + 1];
            }
            betweens[betweens.length - 1].style.transform = transform1;

            // 애니메이션이 끝나기를 기다림.
            window.requestAnimationFrame(()=> {
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
const Block = require('../sort/Block')
const BubbleSort = require('../bubble-sort/BubbleSort');
const InsertionSort = require('../insertion-sort/InsertionSort');
const SelectionSort = require('../selection-sort/SelectionSort');

// 정렬이 시각화 될 container
const container = document.querySelector('.data-container');

// radio.checked 의 값을 읽어와서 사용
const bubbleSortRadio = document.getElementById('bubble-sort-radio');
const insertionSortRadio = document.getElementById('insertion-sort-radio');
const selectionSortRadio = document.getElementById('selection-sort-radio');

// 애니메이션 딜레이 Range
const delayRange = document.getElementById('animation-delay-range');

// 시각화 블록 크기 Range
const sizeRange = document.getElementById('size-range');

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById('new-data-input');
// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById('new-data-add-btn');

// 정렬 시작 Button
const sortStartBtn = document.getElementById('sort-start-btn');


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
        SortAlgorithm = InsertionSort
    } else if (selectionSortRadio.checked) {
        SortAlgorithm = SelectionSort;
    }
    else {
        SortAlgorithm = BubbleSort
    }
    return SortAlgorithm;
}




const blocks = generateUniqueBlocks(20, container);

let sort = new (getSortAlgorithm())(container, blocks, 250, 250);


delayRange.oninput = e => {
    const delay = e.target.value;
    sort.setAnimationDelay(delay);
    sort.setDelay(delay);
}

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
    const size = e.target.value;
    console.log('size: ' + size);
    sort.setBlockWidth(size);
}


newDataAddBtn.onclick = e => {
    // 아무것도 입력하지 않았다면
    if (newDataInput.value == '')
    return;

    const value = Number(newDataInput.value);

    const newBlock = Block.createNewBlock(value,container);
    sort.addBlock(newBlock);
}

// isSortRunning은 현재 정렬이 진행중인지 표시하는 변수. true이면 sortStartBtn이 동작하지 않는다.
let isSortRunning = false;
sortStartBtn.onclick = e => {
    if (isSortRunning) {
        return;
    }
    isSortRunning = true;
    const SortAlgorithm = getSortAlgorithm();

    sort = new SortAlgorithm(container, sort.getBlocks(), sort.delay, sort.animationDelay);

    sort.getBlocks().forEach(block => block.setColorDefault());
    sort.sort()
        .then(_ => isSortRunning = false);
};

},{"../bubble-sort/BubbleSort":1,"../insertion-sort/InsertionSort":2,"../selection-sort/SelectionSort":3,"../sort/Block":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xuXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XG5cbiAgICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc29ydCgpIHtcblxuICAgICAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICAgICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTsgaiArPSAxKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXG5cbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yUmVkKCk7XG5cblxuICAgICAgICAgICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XG5cblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirggXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxuICAgICAgICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1YmJsZVNvcnQ7XG5cblxuXG4gICAgICAgXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcblxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcbiAgICB9XG5cbiAgICBhc3luYyBzb3J0KCkge1xuXG4gICAgICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgICAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcblxuXHRibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XG5cdFx0XG5cdFx0YmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XG5cblx0XHRsZXQgZGVzdEluZGV4ID0gaTtcblx0XHRcblx0XHRjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG5cdFx0XHRcblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG5cblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cblx0XHRcdGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG5cblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuXHRcdFx0aWYgKHZhbHVlID4gdGFyZ2V0KSB7XG5cdFx0XHRcdGRlc3RJbmRleCA9IGo7XG5cdFx0XHRcdGJyZWFrIDtcblx0XHRcdH0gXHRcdFxuXHRcdH1cblx0XHRpZiAoaSAhPSBkZXN0SW5kZXgpIHtcblx0XHRcdGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XG5cdFx0XHRcblx0XHRcdGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xuXG5cdFx0XHRibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XG5cdFx0fVxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG5cdFx0YmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcblx0fVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XG5cblxuXG4gICAgICAgXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XG5cbmNsYXNzIFNlbGVjdGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcblxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcbiAgICB9XG5cbiAgICBhc3luYyBzb3J0KCkge1xuXG4gICAgICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgICAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICAgICAgbGV0IG1pbjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIG1pbiA9IGk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcbiAgICAgICAgICAgICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTEgPSBibG9ja3NbbWluXS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gajtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxuICAgICAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBibG9ja3NbaV0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XG4gICAgICAgIGJsb2Nrc1tuLTFdLnNldENvbG9yR3JlZW4oKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XG4iLCJjbGFzcyBCbG9jayB7XG4gICAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcbiAgICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikgeyAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xuXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuICAgICAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xuICAgICAgICBibG9jay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2Jsb2NrQ291bnQgKiAzMH1weClgO1xuXG4gICAgICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcbiAgICAgICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayxjb250YWluZXIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGRvbSwgY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JSZWQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JHcmVlbigpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XG4gICAgfVxuICAgIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgICBnZXRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XG4iLCJcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgICBjb25zdHJ1Y3RvciggY29udGFpbmVyLGJsb2NrcywgZGVsYXk9MjAwLCBhbmltYXRpb25EZWxheT0yNTApIHtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIFxuICAgICAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XG4gICAgfSAgIFxuICAgIFxuXG4gICAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICAgIHNvcnQoKSB7XG5cbiAgICB9XG5cbiAgICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHsgIC8vIHdpZHRoOk51bWJlclxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoXG4gICAgICAgIFxuICAgICAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQqKHdpZHRoK21hcmdpbikgKyBcInB4XCI7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5nZXRCbG9ja3MoKVxuICAgICAgICAubWFwKChibG9jayxpbmRleCk9PiB7XG4gICAgICAgICAgICBjb25zdCBkb20gPSBibG9jay5kb207XG5cbiAgICAgICAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcbiAgICAgICAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDArJ21zJztcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAod2lkdGggKyBibG9ja01hcmdpbik7XG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc1h9cHgpYDtcblxuICAgICAgICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcbiAgICAgICAgICAgIGRvbS5zdHlsZS53aWR0aD13aWR0aCtcInB4XCI7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gcHJldlRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBhZGRCbG9jayhibG9jaykge1xuICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikucmVwbGFjZSgncHgnLCcnKSk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSAocHJldldpZHRoICsgMzApKydweCc7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHNldERlbGF5KG1pbGxpcykge1xuICAgICAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xuICAgIH1cblxuICAgIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xuICAgICAgICB0aGlzLmJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkrXCJtc1wiKTtcbiAgICB9XG4gICAgXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcbiAgICBnZXRCbG9ja3MoKSB7XG5cbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSxiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzO1xuICAgIH1cblxuICAgIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gICAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICAgICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMS5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcbiAgICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICAgICAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcblxuICAgICAgICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcblxuICAgICAgICAgICAgYmxvY2suZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbMF07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc29ydC9CbG9jaycpXG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZSgnLi4vYnViYmxlLXNvcnQvQnViYmxlU29ydCcpO1xuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoJy4uL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQnKTtcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKCcuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0Jyk7XG5cbi8vIOygleugrOydtCDsi5zqsIHtmZQg65CgIGNvbnRhaW5lclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhdGEtY29udGFpbmVyJyk7XG5cbi8vIHJhZGlvLmNoZWNrZWQg7J2YIOqwkuydhCDsnb3slrTsmYDshJwg7IKs7JqpXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnViYmxlLXNvcnQtcmFkaW8nKTtcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnRpb24tc29ydC1yYWRpbycpO1xuY29uc3Qgc2VsZWN0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGlvbi1zb3J0LXJhZGlvJyk7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcbmNvbnN0IGRlbGF5UmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5pbWF0aW9uLWRlbGF5LXJhbmdlJyk7XG5cbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXG5jb25zdCBzaXplUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2l6ZS1yYW5nZScpO1xuXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1kYXRhLWlucHV0Jyk7XG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWRhdGEtYWRkLWJ0bicpO1xuXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxuY29uc3Qgc29ydFN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtc3RhcnQtYnRuJyk7XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVCbG9ja3MobnVtID0gMjAsIGNvbnRhaW5lcikge1xuICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgbnVtKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICAgICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikpO1xufVxuXG5cblxuLy8gc29ydCB0eXBlIHJhZGlv66GcIOu2gO2EsCDqsJLsnYQg7J297Ja07IScIFNvcnQgQWxnb3JpdGht7J2EIOqysOyglVxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcbiAgICBsZXQgU29ydEFsZ29yaXRobTtcbiAgICBpZiAoaW5zZXJ0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnRcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblNvcnRSYWRpby5jaGVja2VkKSB7XG4gICAgICAgIFNvcnRBbGdvcml0aG0gPSBTZWxlY3Rpb25Tb3J0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgU29ydEFsZ29yaXRobSA9IEJ1YmJsZVNvcnRcbiAgICB9XG4gICAgcmV0dXJuIFNvcnRBbGdvcml0aG07XG59XG5cblxuXG5cbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlVW5pcXVlQmxvY2tzKDIwLCBjb250YWluZXIpO1xuXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIsIGJsb2NrcywgMjUwLCAyNTApO1xuXG5cbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xuICAgIGNvbnN0IGRlbGF5ID0gZS50YXJnZXQudmFsdWU7XG4gICAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gICAgc29ydC5zZXREZWxheShkZWxheSk7XG59XG5cbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XG4gICAgY29uc3Qgc2l6ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKCdzaXplOiAnICsgc2l6ZSk7XG4gICAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xufVxuXG5cbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IGUgPT4ge1xuICAgIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XG4gICAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSAnJylcbiAgICByZXR1cm47XG5cbiAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xuXG4gICAgY29uc3QgbmV3QmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSxjb250YWluZXIpO1xuICAgIHNvcnQuYWRkQmxvY2sobmV3QmxvY2spO1xufVxuXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXG5sZXQgaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuc29ydFN0YXJ0QnRuLm9uY2xpY2sgPSBlID0+IHtcbiAgICBpZiAoaXNTb3J0UnVubmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuICAgIGNvbnN0IFNvcnRBbGdvcml0aG0gPSBnZXRTb3J0QWxnb3JpdGhtKCk7XG5cbiAgICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oY29udGFpbmVyLCBzb3J0LmdldEJsb2NrcygpLCBzb3J0LmRlbGF5LCBzb3J0LmFuaW1hdGlvbkRlbGF5KTtcblxuICAgIHNvcnQuZ2V0QmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgc29ydC5zb3J0KClcbiAgICAgICAgLnRoZW4oXyA9PiBpc1NvcnRSdW5uaW5nID0gZmFsc2UpO1xufTtcbiJdfQ==
