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
        blocks[0].setColorGreen();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2Jub3BhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L0luc2VydGlvblNvcnQuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XHJcblxyXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XHJcblxyXG4gICAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzb3J0KCkge1xyXG5cclxuICAgICAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICAgICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4gLSBpIC0gMTsgaiArPSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCjsoJXroKzspJHsnbgpIOu4lOuhneydmCDsg4nsnYQgUmVk66GcIOuwlOq/iFxyXG5cclxuICAgICAgICAgICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprxcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSBibG9ja3NbaiArIDFdLmdldFZhbHVlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPiB2YWx1ZTIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzd2FwIO2VqOyImOuhnCDrkZAg67iU66Gd7J2YIOychOy5mOulvCDrsJTqv4g7IGF3YWl07J2AIHN3YXAg7J20IOuBneuCoCDrlYwg6rmM7KeAIOq4sOuLpOumrOqyoOuLpOuKlCDsnZjrr7hcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW2pdLCBibG9ja3NbaiArIDFdKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIOq4sOyhtCBibG9ja3Prpbwg7JeF642w7J207Yq4IFxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOyEoO2DneydtCDrgZ3rgqzsnLzrr4DroZwg67iU66Gd7J2YIOyDieydhCDsm5Drnpgg7IOJ7Jy866GcIOuwlOq/iFxyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7J2EIEdyZWVu7Jy866GcIOuwlOq/iFxyXG4gICAgICAgICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcclxuXHJcblxyXG5cclxuICAgICAgIFxyXG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XHJcblxyXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XHJcblxyXG4gICAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcclxuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzb3J0KCkge1xyXG5cclxuICAgICAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcclxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXHJcbiAgICAgICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XHJcblxyXG5cdGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XHJcblx0XHRcclxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xyXG5cclxuXHRcdGxldCBkZXN0SW5kZXggPSBpO1xyXG5cdFx0XHJcblx0XHRjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcclxuXHJcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9ibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcclxuXHJcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XHJcblxyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xyXG5cclxuXHRcdFx0Ly9ibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcblx0XHRcdGlmICh2YWx1ZSA+IHRhcmdldCkge1xyXG5cdFx0XHRcdGRlc3RJbmRleCA9IGo7XHJcblx0XHRcdFx0YnJlYWsgO1xyXG5cdFx0XHR9IFx0XHRcclxuXHRcdH1cclxuXHRcdGlmIChpICE9IGRlc3RJbmRleCkge1xyXG5cdFx0XHRibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0YXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XHJcblxyXG5cdFx0XHRibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XHJcblx0XHR9XHJcblx0XHRibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xyXG5cdFx0YmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuXHR9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydGlvblNvcnQ7XHJcblxyXG5cclxuXHJcbiAgICAgICBcclxuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xyXG5cclxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG5cclxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc29ydCgpIHtcclxuXHJcbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtaW47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBtaW4gPSBpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlMSA9IGJsb2Nrc1ttaW5dLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMilcclxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBqO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnN3YXAoYmxvY2tzW21pbl0sIGJsb2Nrc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDsoJXroKzsnbQg64Gd64Ks7Jy866+A66GcIOuniOyngOuniSDruJTroZ3rj4QgR3JlZW7snLzroZwg7IOJIOuzgOqyvVxyXG4gICAgICAgIGJsb2Nrc1tuLTFdLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblNvcnQ7XHJcbiIsImNsYXNzIEJsb2NrIHtcclxuICAgIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXHJcbiAgICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikgeyAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxyXG4gICAgICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgYmxvY2suc3R5bGUuaGVpZ2h0ID0gYCR7dmFsdWUgKiAzfXB4YDtcclxuICAgICAgICBibG9jay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2Jsb2NrQ291bnQgKiAzMH1weClgO1xyXG5cclxuICAgICAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuICAgICAgICBibG9ja0xhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gICAgICAgIHJldHVybiBuZXcgQmxvY2soYmxvY2ssY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihkb20sIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICAgIHNldENvbG9yUmVkKCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICAgIHNldENvbG9yRGVmYXVsdCgpIHtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JHcmVlbigpIHtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjtcclxuICAgIH1cclxuICAgIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcclxuICAgIGdldFZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIodGhpcy5kb20uY2hpbGROb2Rlc1swXS5pbm5lckhUTUwpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiXHJcblxyXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgICBjb25zdHJ1Y3RvciggY29udGFpbmVyLGJsb2NrcywgZGVsYXk9MjAwLCBhbmltYXRpb25EZWxheT0yNTApIHtcclxuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XHJcbiAgICB9ICAgXHJcbiAgICBcclxuXHJcbiAgICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgICBzb3J0KCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHsgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGhcclxuICAgICAgICBcclxuICAgICAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCood2lkdGgrbWFyZ2luKSArIFwicHhcIjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdldEJsb2NrcygpXHJcbiAgICAgICAgLm1hcCgoYmxvY2ssaW5kZXgpPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkb20gPSBibG9jay5kb207XHJcblxyXG4gICAgICAgICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCsnbXMnO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAod2lkdGggKyBibG9ja01hcmdpbik7XHJcbiAgICAgICAgICAgIGRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zWH1weClgO1xyXG5cclxuICAgICAgICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcclxuICAgICAgICAgICAgZG9tLnN0eWxlLndpZHRoPXdpZHRoK1wicHhcIjtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZEJsb2NrKGJsb2NrKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICAgICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikucmVwbGFjZSgncHgnLCcnKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gKHByZXZXaWR0aCArIDMwKSsncHgnO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgICAgICB0aGlzLmJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkrXCJtc1wiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcclxuICAgIGdldEJsb2NrcygpIHtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcclxuICAgIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgICAgICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xyXG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxyXG4gICAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxyXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRlc3RJbmRl7JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYmV0d2VlbnNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcclxuXHJcbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoJy4uL3NvcnQvQmxvY2snKVxyXG5jb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZSgnLi4vYnViYmxlLXNvcnQvQnViYmxlU29ydCcpO1xyXG5jb25zdCBJbnNlcnRpb25Tb3J0ID0gcmVxdWlyZSgnLi4vaW5zZXJ0aW9uLXNvcnQvSW5zZXJ0aW9uU29ydCcpO1xyXG5jb25zdCBTZWxlY3Rpb25Tb3J0ID0gcmVxdWlyZSgnLi4vc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydCcpO1xyXG5cclxuLy8g7KCV66Cs7J20IOyLnOqwge2ZlCDrkKAgY29udGFpbmVyXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhLWNvbnRhaW5lcicpO1xyXG5cclxuLy8gcmFkaW8uY2hlY2tlZCDsnZgg6rCS7J2EIOydveyWtOyZgOyEnCDsgqzsmqlcclxuY29uc3QgYnViYmxlU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1YmJsZS1zb3J0LXJhZGlvJyk7XHJcbmNvbnN0IGluc2VydGlvblNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnRpb24tc29ydC1yYWRpbycpO1xyXG5jb25zdCBzZWxlY3Rpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0aW9uLXNvcnQtcmFkaW8nKTtcclxuXHJcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgUmFuZ2VcclxuY29uc3QgZGVsYXlSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmltYXRpb24tZGVsYXktcmFuZ2UnKTtcclxuXHJcbi8vIOyLnOqwge2ZlCDruJTroZ0g7YGs6riwIFJhbmdlXHJcbmNvbnN0IHNpemVSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaXplLXJhbmdlJyk7XHJcblxyXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxyXG5jb25zdCBuZXdEYXRhSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWRhdGEtaW5wdXQnKTtcclxuLy8g7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDstpTqsIDtlZjripQgQnV0dG9uXHJcbmNvbnN0IG5ld0RhdGFBZGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWRhdGEtYWRkLWJ0bicpO1xyXG5cclxuLy8g7KCV66CsIOyLnOyekSBCdXR0b25cclxuY29uc3Qgc29ydFN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtc3RhcnQtYnRuJyk7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVCbG9ja3MobnVtID0gMjAsIGNvbnRhaW5lcikge1xyXG4gICAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgICB3aGlsZSAodmFsdWVzLmxlbmd0aCA8IG51bSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcclxuICAgICAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBzb3J0IHR5cGUgcmFkaW/roZwg67aA7YSwIOqwkuydhCDsnb3slrTshJwgU29ydCBBbGdvcml0aG3snYQg6rKw7KCVXHJcbmZ1bmN0aW9uIGdldFNvcnRBbGdvcml0aG0oKSB7XHJcbiAgICBsZXQgU29ydEFsZ29yaXRobTtcclxuICAgIGlmIChpbnNlcnRpb25Tb3J0UmFkaW8uY2hlY2tlZCkge1xyXG4gICAgICAgIFNvcnRBbGdvcml0aG0gPSBJbnNlcnRpb25Tb3J0XHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblNvcnRSYWRpby5jaGVja2VkKSB7XHJcbiAgICAgICAgU29ydEFsZ29yaXRobSA9IFNlbGVjdGlvblNvcnQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBTb3J0QWxnb3JpdGhtID0gQnViYmxlU29ydFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFNvcnRBbGdvcml0aG07XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlVW5pcXVlQmxvY2tzKDIwLCBjb250YWluZXIpO1xyXG5cclxubGV0IHNvcnQgPSBuZXcgKGdldFNvcnRBbGdvcml0aG0oKSkoY29udGFpbmVyLCBibG9ja3MsIDI1MCwgMjUwKTtcclxuXHJcblxyXG5kZWxheVJhbmdlLm9uaW5wdXQgPSBlID0+IHtcclxuICAgIGNvbnN0IGRlbGF5ID0gZS50YXJnZXQudmFsdWU7XHJcbiAgICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcclxuICAgIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xyXG59XHJcblxyXG4vLyBUT0RPOiBTb3J0LnNldEJsb2NrV2lkdGgg7JmE7ISx7ZWcIOuSpCBzaXplIHJhbmdl7J2YIGludmlzaWJsZSDtkoDquLBcclxuc2l6ZVJhbmdlLm9uY2hhbmdlID0gZSA9PiB7XHJcbiAgICBjb25zdCBzaXplID0gZS50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zb2xlLmxvZygnc2l6ZTogJyArIHNpemUpO1xyXG4gICAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xyXG59XHJcblxyXG5cclxubmV3RGF0YUFkZEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAvLyDslYTrrLTqsoPrj4Qg7J6F66Cl7ZWY7KeAIOyViuyVmOuLpOuptFxyXG4gICAgaWYgKG5ld0RhdGFJbnB1dC52YWx1ZSA9PSAnJylcclxuICAgIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihuZXdEYXRhSW5wdXQudmFsdWUpO1xyXG5cclxuICAgIGNvbnN0IG5ld0Jsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsY29udGFpbmVyKTtcclxuICAgIHNvcnQuYWRkQmxvY2sobmV3QmxvY2spO1xyXG59XHJcblxyXG4vLyBpc1NvcnRSdW5uaW5n7J2AIO2YhOyerCDsoJXroKzsnbQg7KeE7ZaJ7KSR7J247KeAIO2RnOyLnO2VmOuKlCDrs4DsiJguIHRydWXsnbTrqbQgc29ydFN0YXJ0QnRu7J20IOuPmeyeke2VmOyngCDslYrripTri6QuXHJcbmxldCBpc1NvcnRSdW5uaW5nID0gZmFsc2U7XHJcbnNvcnRTdGFydEJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICBpZiAoaXNTb3J0UnVubmluZykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlzU29ydFJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgY29uc3QgU29ydEFsZ29yaXRobSA9IGdldFNvcnRBbGdvcml0aG0oKTtcclxuXHJcbiAgICBzb3J0ID0gbmV3IFNvcnRBbGdvcml0aG0oY29udGFpbmVyLCBzb3J0LmdldEJsb2NrcygpLCBzb3J0LmRlbGF5LCBzb3J0LmFuaW1hdGlvbkRlbGF5KTtcclxuXHJcbiAgICBzb3J0LmdldEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4gYmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xyXG4gICAgc29ydC5zb3J0KClcclxuICAgICAgICAudGhlbihfID0+IGlzU29ydFJ1bm5pbmcgPSBmYWxzZSk7XHJcbn07XHJcbiJdfQ==
