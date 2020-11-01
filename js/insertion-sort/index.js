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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0LmpzIiwic3JjL2luc2VydGlvbi1zb3J0L2luZGV4LmpzIiwic3JjL3NvcnQvQmxvY2suanMiLCJzcmMvc29ydC9Tb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xuXG5jbGFzcyBJbnNlcnRpb25Tb3J0IGV4dGVuZHMgU29ydCB7XG5cbiAgICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpIHtcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc29ydCgpIHtcblxuICAgICAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICAgICAgY29uc3QgbiA9IGJsb2Nrcy5sZW5ndGg7XG5cblx0YmxvY2tzWzBdLnNldENvbG9yR3JlZW4oKTtcblxuXHRmb3IgKGxldCBpID0gMTsgaSA8IG47IGkgKz0gMSkge1xuXHRcdFxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xuXG5cdFx0bGV0IGRlc3RJbmRleCA9IGk7XG5cdFx0XG5cdFx0Y29uc3QgdGFyZ2V0ID0gYmxvY2tzW2ldLmdldFZhbHVlKCk7XG5cblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuXHRcdFx0XG5cdFx0XHQvL2Jsb2Nrc1tqXS5zZXRDb2xvclJlZCgpO1xuXG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuXG5cdFx0XHRjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuXG5cdFx0XHQvL2Jsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcblx0XHRcdGlmICh2YWx1ZSA+IHRhcmdldCkge1xuXHRcdFx0XHRkZXN0SW5kZXggPSBqO1xuXHRcdFx0XHRicmVhayA7XG5cdFx0XHR9IFx0XHRcblx0XHR9XG5cdFx0aWYgKGkgIT0gZGVzdEluZGV4KSB7XG5cdFx0XHRibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclJlZCgpO1xuXHRcdFx0XG5cdFx0XHRhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcblxuXHRcdFx0YmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JHcmVlbigpO1xuXHRcdH1cblx0XHRibG9ja3NbaV0uc2V0Q29sb3JHcmVlbigpO1xuXHRcdGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG5cdH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xuXG5cblxuICAgICAgIFxuIiwiY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoJy4vSW5zZXJ0aW9uU29ydCcpO1xuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zb3J0L0Jsb2NrJyk7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhLWNvbnRhaW5lcicpO1xuXG4vLyAwfjEwMCDsgqzsnbQg656c642kIOqwkuydhCDqsIDsp4DripQg67iU66GdIG51beqwnCDsg53shLEgXG5mdW5jdGlvbiBnZW5lcmF0ZUJsb2NrcyhudW0gPSAyMCxjb250YWluZXIpIHtcbiAgICBjb25zdCBibG9ja3MgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICAgICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSxjb250YWluZXIpO1xuICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgfVxuICAgIHJldHVybiBibG9ja3M7XG59XG5cbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlQmxvY2tzKDIwLGNvbnRhaW5lcik7XG5jb25zdCBpbnNlcnRpb25Tb3J0ID0gbmV3IEluc2VydGlvblNvcnQoY29udGFpbmVyLGJsb2NrcywyMDAsMjUwKTtcblxuaW5zZXJ0aW9uU29ydC5zb3J0KCk7XG4iLCJjbGFzcyBCbG9jayB7XG4gICAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcbiAgICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikgeyAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xuXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuICAgICAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xuICAgICAgICBibG9jay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2Jsb2NrQ291bnQgKiAzMH1weClgO1xuXG4gICAgICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcbiAgICAgICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayxjb250YWluZXIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGRvbSwgY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JSZWQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JHcmVlbigpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XG4gICAgfVxuICAgIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgICBnZXRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XG4iLCJcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgICBjb25zdHJ1Y3RvciggY29udGFpbmVyLGJsb2NrcywgZGVsYXk9MjAwLCBhbmltYXRpb25EZWxheT0yNTApIHtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIFxuICAgICAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XG4gICAgfSAgIFxuICAgIFxuXG4gICAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICAgIHNvcnQoKSB7XG5cbiAgICB9XG5cbiAgICBzZXRCbG9ja1dpZHRoKHdpZHRoLCBibG9ja01hcmdpbiA9IDIpIHsgIC8vIHdpZHRoOk51bWJlclxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoXG4gICAgICAgIFxuICAgICAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQqKHdpZHRoK21hcmdpbikgKyBcInB4XCI7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5nZXRCbG9ja3MoKVxuICAgICAgICAubWFwKChibG9jayxpbmRleCk9PiB7XG4gICAgICAgICAgICBjb25zdCBkb20gPSBibG9jay5kb207XG5cbiAgICAgICAgICAgIC8vIOu4lOuhnSDslaDri4jrqZTsnbTshZgg7IaN64+E66W8IDBtc+uhnCDsobDsoJU7IO2BrOq4sCDrs4Dqsr3snYQg7KaJ6rCB7KCB7Jy866GcIO2VmOq4sCDsnITtlbRcbiAgICAgICAgICAgIGNvbnN0IHByZXZUcmFuc2l0aW9uRHVyYXRpb24gPSBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDArJ21zJztcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNYID0gaW5kZXggKiAod2lkdGggKyBibG9ja01hcmdpbik7XG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc1h9cHgpYDtcblxuICAgICAgICAgICAgLy8g67iU66Gd7J2YIOuEiOu5hCDsobDsoJVcbiAgICAgICAgICAgIGRvbS5zdHlsZS53aWR0aD13aWR0aCtcInB4XCI7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gcHJldlRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBhZGRCbG9jayhibG9jaykge1xuICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgY29uc3QgcHJldldpZHRoID0gTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikucmVwbGFjZSgncHgnLCcnKSk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2lkdGggPSAocHJldldpZHRoICsgMzApKydweCc7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHNldERlbGF5KG1pbGxpcykge1xuICAgICAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xuICAgIH1cblxuICAgIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gbWlsbGlzO1xuICAgICAgICB0aGlzLmJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkrXCJtc1wiKTtcbiAgICB9XG4gICAgXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcbiAgICBnZXRCbG9ja3MoKSB7XG5cbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSxiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzO1xuICAgIH1cblxuICAgIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gICAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICAgICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMS5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcbiAgICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICAgICAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcblxuICAgICAgICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcblxuICAgICAgICAgICAgYmxvY2suZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbMF07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiJdfQ==
