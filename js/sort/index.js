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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2Jub3BhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xyXG5cclxuY2xhc3MgQnViYmxlU29ydCBleHRlbmRzIFNvcnQge1xyXG5cclxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc29ydCgpIHtcclxuXHJcbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7IGogKz0gMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcclxuXHJcbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICAgICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlMSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUxID4gdmFsdWUyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3dhcCDtlajsiJjroZwg65GQIOu4lOuhneydmCDsnITsuZjrpbwg67CU6r+IOyBhd2FpdOydgCBzd2FwIOydtCDrgZ3rgqAg65WMIOq5jOyngCDquLDri6TrpqzqsqDri6TripQg7J2Y66+4XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1tqXSwgYmxvY2tzW2ogKyAxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuCBcclxuICAgICAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyDshKDtg53snbQg64Gd64Ks7Jy866+A66GcIOu4lOuhneydmCDsg4nsnYQg7JuQ656YIOyDieycvOuhnCDrsJTqv4hcclxuICAgICAgICAgICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGJsb2Nrc1tqICsgMV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieydhCBHcmVlbuycvOuhnCDrsJTqv4hcclxuICAgICAgICAgICAgYmxvY2tzW24gLSBpIC0gMV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xyXG5cclxuXHJcblxyXG4gICAgICAgXHJcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKCcuLi9zb3J0L1NvcnQnKTtcclxuXHJcbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuXHJcbiAgICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNvcnQoKSB7XHJcblxyXG4gICAgICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgICAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcblx0YmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpICs9IDEpIHtcclxuXHRcdFxyXG5cdFx0YmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcblxyXG5cdFx0bGV0IGRlc3RJbmRleCA9IGk7XHJcblx0XHRcclxuXHRcdGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xyXG5cclxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvL2Jsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuXHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcblx0XHRcdGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcblxyXG5cdFx0XHQvL2Jsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuXHRcdFx0aWYgKHZhbHVlID4gdGFyZ2V0KSB7XHJcblx0XHRcdFx0ZGVzdEluZGV4ID0gajtcclxuXHRcdFx0XHRicmVhayA7XHJcblx0XHRcdH0gXHRcdFxyXG5cdFx0fVxyXG5cdFx0aWYgKGkgIT0gZGVzdEluZGV4KSB7XHJcblx0XHRcdGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcclxuXHJcblx0XHRcdGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yR3JlZW4oKTtcclxuXHRcdH1cclxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcblx0XHRibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG5cdH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcclxuXHJcblxyXG5cclxuICAgICAgIFxyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XHJcblxyXG5jbGFzcyBTZWxlY3Rpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcblxyXG4gICAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzb3J0KCkge1xyXG5cclxuICAgICAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICAgICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG1pbjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIG1pbiA9IGk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XHJcbiAgICAgICAgICAgICAgICBibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPj0gdmFsdWUyKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGo7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBtaW4gJiYgaiA9PSBuIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCDquLDsobQgYmxvY2tz66W8IOyXheuNsOydtO2KuFxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBibG9ja3NbaV0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XHJcbiAgICAgICAgYmxvY2tzW24tMV0uc2V0Q29sb3JHcmVlbigpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcclxuIiwiY2xhc3MgQmxvY2sge1xyXG4gICAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcclxuICAgIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyKSB7ICAgLy8gdmFsdWU6TnVtYmVyLCBjb250YWluZXI6RE9NXHJcbiAgICAgICAgY29uc3QgYmxvY2tDb3VudCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgICAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xyXG4gICAgICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIDMwfXB4KWA7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xyXG4gICAgICAgIGJsb2NrTGFiZWwuaW5uZXJIVE1MID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayxjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRvbSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5kb20gPSBkb207XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JSZWQoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgICBzZXRDb2xvckdyZWVuKCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xyXG4gICAgfVxyXG4gICAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gICAgZ2V0VmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJcclxuXHJcbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxyXG5jbGFzcyBTb3J0IHtcclxuICAgIGNvbnN0cnVjdG9yKCBjb250YWluZXIsYmxvY2tzLCBkZWxheT0yMDAsIGFuaW1hdGlvbkRlbGF5PTI1MCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcclxuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbkRlbGF5KGFuaW1hdGlvbkRlbGF5KTtcclxuICAgIH0gICBcclxuICAgIFxyXG5cclxuICAgIC8vIOy2lOyDgSDrqZTshozrk5xcclxuICAgIHNvcnQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEJsb2NrV2lkdGgod2lkdGgsIGJsb2NrTWFyZ2luID0gMikgeyAgLy8gd2lkdGg6TnVtYmVyXHJcbiAgICAgICAgY29uc3QgYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tzLmxlbmd0aFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOy7qO2FjOydtOuEiCDtgazquLAg64ST7Z6I6riwXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSBibG9ja0NvdW50Kih3aWR0aCttYXJnaW4pICsgXCJweFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZ2V0QmxvY2tzKClcclxuICAgICAgICAubWFwKChibG9jayxpbmRleCk9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSA9IGJsb2NrLmRvbTtcclxuXHJcbiAgICAgICAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcclxuICAgICAgICAgICAgY29uc3QgcHJldlRyYW5zaXRpb25EdXJhdGlvbiA9IGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAwKydtcyc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh3aWR0aCArIGJsb2NrTWFyZ2luKTtcclxuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dHJhbnNYfXB4KWA7XHJcblxyXG4gICAgICAgICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxyXG4gICAgICAgICAgICBkb20uc3R5bGUud2lkdGg9d2lkdGgrXCJweFwiO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxyXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gcHJldlRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkQmxvY2soYmxvY2spIHtcclxuICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICBjb25zdCBwcmV2V2lkdGggPSBOdW1iZXIod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpLmdldFByb3BlcnR5VmFsdWUoXCJ3aWR0aFwiKS5yZXBsYWNlKCdweCcsJycpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSAocHJldldpZHRoICsgMzApKydweCc7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGVsYXkobWlsbGlzKSB7XHJcbiAgICAgICAgdGhpcy5kZWxheSA9IG1pbGxpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXRBbmltYXRpb25EZWxheShtaWxsaXMpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xyXG4gICAgICAgIHRoaXMuYmxvY2tzLm1hcChibG9jayA9PiBibG9jay5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5hbmltYXRpb25EZWxheStcIm1zXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyDrqqjrk6AgYmxvY2vrk6TsnYQg66as7YS07ZWY64qUIO2VqOyImFxyXG4gICAgZ2V0QmxvY2tzKCkge1xyXG5cclxuICAgICAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSxiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrcztcclxuICAgIH1cclxuXHJcbiAgICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxyXG4gICAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxyXG4gICAgc3dhcChibG9jazEsIGJsb2NrMikgeyAgLy8gYmxvY2sxOiBCbG9jaywgYmxvY2syOiBCbG9ja1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMi5kb20pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0yID0gc3R5bGUyLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XHJcblxyXG4gICAgICAgICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XHJcbiAgICAgICAgICAgIGJsb2NrMi5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2syLmRvbS5uZXh0U2libGluZztcclxuXHJcbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMS5kb20sIG5leHRPZlRhcmdldDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazIuZG9tLCBuZXh0T2ZUYXJnZXQxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXHJcbiAgICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXHJcbiAgICBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYXJyID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBhcnIuaW5kZXhPZihibG9jay5kb20pO1xyXG5cclxuICAgICAgICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXHJcbiAgICAgICAgICAgIGNvbnN0IGJldHdlZW5zID0gYXJyLmZpbHRlcigoXywgaSkgPT4gZGVzdEluZGV4IDw9IGkgJiYgaSA8IHRhcmdldEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlUmVzdCA9IGJldHdlZW5zLm1hcChkb20gPT4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVJlc3QgPSBzdHlsZVJlc3QubWFwKHN0eWxlID0+IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIikpO1xyXG5cclxuICAgICAgICAgICAgYmxvY2suZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbMF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBiZXR3ZWVuc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0W2kgKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xyXG5cclxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc29ydC9CbG9jaycpXHJcbmNvbnN0IEJ1YmJsZVNvcnQgPSByZXF1aXJlKCcuLi9idWJibGUtc29ydC9CdWJibGVTb3J0Jyk7XHJcbmNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKCcuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0Jyk7XHJcbmNvbnN0IFNlbGVjdGlvblNvcnQgPSByZXF1aXJlKCcuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0Jyk7XHJcblxyXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhdGEtY29udGFpbmVyJyk7XHJcblxyXG4vLyByYWRpby5jaGVja2VkIOydmCDqsJLsnYQg7J297Ja07JmA7IScIOyCrOyaqVxyXG5jb25zdCBidWJibGVTb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnViYmxlLXNvcnQtcmFkaW8nKTtcclxuY29uc3QgaW5zZXJ0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydGlvbi1zb3J0LXJhZGlvJyk7XHJcbmNvbnN0IHNlbGVjdGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3Rpb24tc29ydC1yYWRpbycpO1xyXG5cclxuLy8g7JWg64uI66mU7J207IWYIOuUnOugiOydtCBSYW5nZVxyXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuaW1hdGlvbi1kZWxheS1yYW5nZScpO1xyXG5cclxuLy8g7Iuc6rCB7ZmUIOu4lOuhnSDtgazquLAgUmFuZ2VcclxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpemUtcmFuZ2UnKTtcclxuXHJcbi8vIOyCrOyaqeyekOuhnOu2gO2EsCDsg4jroZzsmrQg642w7J207YSw66W8IOyeheugpeuwm+uKlCBJbnB1dCBUZXh0XHJcbmNvbnN0IG5ld0RhdGFJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctZGF0YS1pbnB1dCcpO1xyXG4vLyDsg4jroZzsmrQg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCBCdXR0b25cclxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctZGF0YS1hZGQtYnRuJyk7XHJcblxyXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxyXG5jb25zdCBzb3J0U3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29ydC1zdGFydC1idG4nKTtcclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUJsb2NrcyhudW0gPSAyMCwgY29udGFpbmVyKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcclxuICAgIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgbnVtKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApO1xyXG4gICAgICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikpO1xyXG59XHJcblxyXG5cclxuXHJcbi8vIHNvcnQgdHlwZSByYWRpb+uhnCDrtoDthLAg6rCS7J2EIOydveyWtOyEnCBTb3J0IEFsZ29yaXRobeydhCDqsrDsoJVcclxuZnVuY3Rpb24gZ2V0U29ydEFsZ29yaXRobSgpIHtcclxuICAgIGxldCBTb3J0QWxnb3JpdGhtO1xyXG4gICAgaWYgKGluc2VydGlvblNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICAgICAgU29ydEFsZ29yaXRobSA9IEluc2VydGlvblNvcnRcclxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uU29ydFJhZGlvLmNoZWNrZWQpIHtcclxuICAgICAgICBTb3J0QWxnb3JpdGhtID0gU2VsZWN0aW9uU29ydDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIFNvcnRBbGdvcml0aG0gPSBCdWJibGVTb3J0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU29ydEFsZ29yaXRobTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVVbmlxdWVCbG9ja3MoMjAsIGNvbnRhaW5lcik7XHJcblxyXG5sZXQgc29ydCA9IG5ldyAoZ2V0U29ydEFsZ29yaXRobSgpKShjb250YWluZXIsIGJsb2NrcywgMjUwLCAyNTApO1xyXG5cclxuXHJcbmRlbGF5UmFuZ2Uub25pbnB1dCA9IGUgPT4ge1xyXG4gICAgY29uc3QgZGVsYXkgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xyXG4gICAgc29ydC5zZXREZWxheShkZWxheSk7XHJcbn1cclxuXHJcbi8vIFRPRE86IFNvcnQuc2V0QmxvY2tXaWR0aCDsmYTshLHtlZwg65KkIHNpemUgcmFuZ2XsnZggaW52aXNpYmxlIO2SgOq4sFxyXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSBlID0+IHtcclxuICAgIGNvbnN0IHNpemUgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnNvbGUubG9nKCdzaXplOiAnICsgc2l6ZSk7XHJcbiAgICBzb3J0LnNldEJsb2NrV2lkdGgoc2l6ZSk7XHJcbn1cclxuXHJcblxyXG5uZXdEYXRhQWRkQnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAgIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XHJcbiAgICBpZiAobmV3RGF0YUlucHV0LnZhbHVlID09ICcnKVxyXG4gICAgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XHJcblxyXG4gICAgY29uc3QgbmV3QmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSxjb250YWluZXIpO1xyXG4gICAgc29ydC5hZGRCbG9jayhuZXdCbG9jayk7XHJcbn1cclxuXHJcbi8vIGlzU29ydFJ1bm5pbmfsnYAg7ZiE7J6sIOygleugrOydtCDsp4TtlonspJHsnbjsp4Ag7ZGc7Iuc7ZWY64qUIOuzgOyImC4gdHJ1ZeydtOuptCBzb3J0U3RhcnRCdG7snbQg64+Z7J6R7ZWY7KeAIOyViuuKlOuLpC5cclxubGV0IGlzU29ydFJ1bm5pbmcgPSBmYWxzZTtcclxuc29ydFN0YXJ0QnRuLm9uY2xpY2sgPSBlID0+IHtcclxuICAgIGlmIChpc1NvcnRSdW5uaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaXNTb3J0UnVubmluZyA9IHRydWU7XHJcbiAgICBjb25zdCBTb3J0QWxnb3JpdGhtID0gZ2V0U29ydEFsZ29yaXRobSgpO1xyXG5cclxuICAgIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShjb250YWluZXIsIHNvcnQuZ2V0QmxvY2tzKCksIHNvcnQuZGVsYXksIHNvcnQuYW5pbWF0aW9uRGVsYXkpO1xyXG5cclxuICAgIHNvcnQuZ2V0QmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XHJcbiAgICBzb3J0LnNvcnQoKVxyXG4gICAgICAgIC50aGVuKF8gPT4gaXNTb3J0UnVubmluZyA9IGZhbHNlKTtcclxufTtcclxuIl19
