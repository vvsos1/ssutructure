(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



       

},{"../sort/Sort":4}],2:[function(require,module,exports){
const InsertionSort = require('./InsertionSort');
const Block = require('../sort/Block');

const container = document.querySelector('.data-container');

// 0~100 사이 랜덤 값을 가지는 블록 num개 생성 
function generateBlocks(num = 20,container) {
    const blocks = [];
    for (let i = 0; i < num; i += 1) {
        const value = Math.floor(Math.random() * 100);
        const block = Block.createNewBlock(value,container);
        blocks.push(block);
    }
    return blocks;
}

const blocks = generateBlocks(20,container);
const insertionSort = new InsertionSort(container,blocks,200,250);

insertionSort.sort();

},{"../sort/Block":3,"./InsertionSort":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){


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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2Jub3BhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L2luZGV4LmpzIiwic3JjL3NvcnQvQmxvY2suanMiLCJzcmMvc29ydC9Tb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xyXG5cclxuY2xhc3MgSW5zZXJ0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG5cclxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc29ydCgpIHtcclxuXHJcbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuXHRibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMTsgaSA8IG47IGkgKz0gMSkge1xyXG5cdFx0XHJcblx0XHRibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcclxuXHJcblx0XHRsZXQgZGVzdEluZGV4ID0gaTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcblxyXG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xyXG5cclxuXHRcdFx0Y29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuXHJcblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG5cdFx0XHRpZiAodmFsdWUgPiB0YXJnZXQpIHtcclxuXHRcdFx0XHRkZXN0SW5kZXggPSBqO1xyXG5cdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0fSBcdFx0XHJcblx0XHR9XHJcblx0XHRpZiAoaSAhPSBkZXN0SW5kZXgpIHtcclxuXHRcdFx0YmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xyXG5cclxuXHRcdFx0YmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xyXG5cdFx0fVxyXG5cdFx0YmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuXHRcdGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcblx0fVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xyXG5cclxuXHJcblxyXG4gICAgICAgXHJcbiIsImNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKCcuL0luc2VydGlvblNvcnQnKTtcclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zb3J0L0Jsb2NrJyk7XHJcblxyXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0YS1jb250YWluZXInKTtcclxuXHJcbi8vIDB+MTAwIOyCrOydtCDrnpzrjaQg6rCS7J2EIOqwgOyngOuKlCDruJTroZ0gbnVt6rCcIOyDneyEsSBcclxuZnVuY3Rpb24gZ2VuZXJhdGVCbG9ja3MobnVtID0gMjAsY29udGFpbmVyKSB7XHJcbiAgICBjb25zdCBibG9ja3MgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpICs9IDEpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSxjb250YWluZXIpO1xyXG4gICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgIH1cclxuICAgIHJldHVybiBibG9ja3M7XHJcbn1cclxuXHJcbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlQmxvY2tzKDIwLGNvbnRhaW5lcik7XHJcbmNvbnN0IGluc2VydGlvblNvcnQgPSBuZXcgSW5zZXJ0aW9uU29ydChjb250YWluZXIsYmxvY2tzLDIwMCwyNTApO1xyXG5cclxuaW5zZXJ0aW9uU29ydC5zb3J0KCk7XHJcbiIsImNsYXNzIEJsb2NrIHtcclxuICAgIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXHJcbiAgICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikgeyAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxyXG4gICAgICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgYmxvY2suc3R5bGUuaGVpZ2h0ID0gYCR7dmFsdWUgKiAzfXB4YDtcclxuICAgICAgICBibG9jay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2Jsb2NrQ291bnQgKiAzMH1weClgO1xyXG5cclxuICAgICAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcclxuICAgICAgICBibG9ja0xhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xyXG4gICAgICAgIHJldHVybiBuZXcgQmxvY2soYmxvY2ssY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihkb20sIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICAgIHNldENvbG9yUmVkKCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICAgIHNldENvbG9yRGVmYXVsdCgpIHtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JHcmVlbigpIHtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjtcclxuICAgIH1cclxuICAgIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcclxuICAgIGdldFZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIodGhpcy5kb20uY2hpbGROb2Rlc1swXS5pbm5lckhUTUwpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiXHJcblxyXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcclxuY2xhc3MgU29ydCB7XHJcbiAgICBjb25zdHJ1Y3RvciggY29udGFpbmVyLGJsb2NrcywgZGVsYXk9MjAwLCBhbmltYXRpb25EZWxheT0yNTApIHtcclxuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXHJcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XHJcbiAgICB9ICAgXHJcbiAgICBcclxuXHJcbiAgICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgICBzb3J0KCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHsgIC8vIHdpZHRoOk51bWJlclxyXG4gICAgICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGhcclxuICAgICAgICBcclxuICAgICAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCood2lkdGgrbWFyZ2luKSArIFwicHhcIjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdldEJsb2NrcygpXHJcbiAgICAgICAgLm1hcCgoYmxvY2ssaW5kZXgpPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkb20gPSBibG9jay5kb207XHJcblxyXG4gICAgICAgICAgICAvLyDruJTroZ0g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCAwbXProZwg7KGw7KCVOyDtgazquLAg67OA6rK97J2EIOymieqwgeyggeycvOuhnCDtlZjquLAg7JyE7ZW0XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gMCsnbXMnO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAod2lkdGggKyBibG9ja01hcmdpbik7XHJcbiAgICAgICAgICAgIGRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zWH1weClgO1xyXG5cclxuICAgICAgICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcclxuICAgICAgICAgICAgZG9tLnN0eWxlLndpZHRoPXdpZHRoK1wicHhcIjtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IOybkOuemOuMgOuhnCDsobDsoJVcclxuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHByZXZUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZEJsb2NrKGJsb2NrKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICAgICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikucmVwbGFjZSgncHgnLCcnKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gKHByZXZXaWR0aCArIDMwKSsncHgnO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNldERlbGF5KG1pbGxpcykge1xyXG4gICAgICAgIHRoaXMuZGVsYXkgPSBtaWxsaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5pbWF0aW9uRGVsYXkobWlsbGlzKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25EZWxheSA9IG1pbGxpcztcclxuICAgICAgICB0aGlzLmJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkrXCJtc1wiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcclxuICAgIGdldEJsb2NrcygpIHtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcclxuICAgIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgICAgICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xyXG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxyXG4gICAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxyXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRlc3RJbmRl7JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYmV0d2VlbnNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcclxuXHJcbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iXX0=
