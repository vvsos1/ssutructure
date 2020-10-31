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
        this.animationDelay = animationDelay;
        
        // block 들의 애니메이션 딜레이를 설정
        this.blocks.map(block => block.dom.style.transitionDuration = this.animationDelay+"ms");
    }

    // 추상 메소드
    sort() {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5zZXJ0aW9uLXNvcnQvSW5zZXJ0aW9uU29ydC5qcyIsInNyYy9pbnNlcnRpb24tc29ydC9pbmRleC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKCcuLi9zb3J0L1NvcnQnKTtcblxuY2xhc3MgSW5zZXJ0aW9uU29ydCBleHRlbmRzIFNvcnQge1xuXG4gICAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgIH1cblxuICAgIGFzeW5jIHNvcnQoKSB7XG5cbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgICAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuXG5cdGJsb2Nrc1swXS5zZXRDb2xvckdyZWVuKCk7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpICs9IDEpIHtcblx0XHRcblx0XHRibG9ja3NbaV0uc2V0Q29sb3JSZWQoKTtcblxuXHRcdGxldCBkZXN0SW5kZXggPSBpO1xuXHRcdFxuXHRcdGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xuXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcblx0XHRcdFxuXHRcdFx0Ly9ibG9ja3Nbal0uc2V0Q29sb3JSZWQoKTtcblxuXHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuXHRcdFx0Y29uc3QgdmFsdWUgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcblxuXHRcdFx0Ly9ibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG5cdFx0XHRpZiAodmFsdWUgPiB0YXJnZXQpIHtcblx0XHRcdFx0ZGVzdEluZGV4ID0gajtcblx0XHRcdFx0YnJlYWsgO1xuXHRcdFx0fSBcdFx0XG5cdFx0fVxuXHRcdGlmIChpICE9IGRlc3RJbmRleCkge1xuXHRcdFx0YmxvY2tzW2Rlc3RJbmRleF0uc2V0Q29sb3JSZWQoKTtcblx0XHRcdFxuXHRcdFx0YXdhaXQgdGhpcy5pbnNlcnRBdChibG9ja3NbaV0sIGRlc3RJbmRleCk7XG5cblx0XHRcdGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yR3JlZW4oKTtcblx0XHR9XG5cdFx0YmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcblx0XHRibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuXHR9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5zZXJ0aW9uU29ydDtcblxuXG5cbiAgICAgICBcbiIsImNvbnN0IEluc2VydGlvblNvcnQgPSByZXF1aXJlKCcuL0luc2VydGlvblNvcnQnKTtcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc29ydC9CbG9jaycpO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0YS1jb250YWluZXInKTtcblxuLy8gMH4xMDAg7IKs7J20IOuenOuNpCDqsJLsnYQg6rCA7KeA64qUIOu4lOuhnSBudW3qsJwg7IOd7ISxIFxuZnVuY3Rpb24gZ2VuZXJhdGVCbG9ja3MobnVtID0gMjAsY29udGFpbmVyKSB7XG4gICAgY29uc3QgYmxvY2tzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkgKz0gMSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XG4gICAgICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsY29udGFpbmVyKTtcbiAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xuICAgIH1cbiAgICByZXR1cm4gYmxvY2tzO1xufVxuXG5jb25zdCBibG9ja3MgPSBnZW5lcmF0ZUJsb2NrcygyMCxjb250YWluZXIpO1xuY29uc3QgaW5zZXJ0aW9uU29ydCA9IG5ldyBJbnNlcnRpb25Tb3J0KGNvbnRhaW5lcixibG9ja3MsMjAwLDI1MCk7XG5cbmluc2VydGlvblNvcnQuc29ydCgpO1xuIiwiY2xhc3MgQmxvY2sge1xuICAgIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXG4gICAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpIHsgICAvLyB2YWx1ZTpOdW1iZXIsIGNvbnRhaW5lcjpET01cbiAgICAgICAgY29uc3QgYmxvY2tDb3VudCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcblxuICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbiAgICAgICAgYmxvY2suc3R5bGUuaGVpZ2h0ID0gYCR7dmFsdWUgKiAzfXB4YDtcbiAgICAgICAgYmxvY2suc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtibG9ja0NvdW50ICogMzB9cHgpYDtcblxuICAgICAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XG4gICAgICAgIGJsb2NrTGFiZWwuaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgIHJldHVybiBuZXcgQmxvY2soYmxvY2ssY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihkb20sIGNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLmRvbSA9IGRvbTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgfVxuXG4gICAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICAgIHNldENvbG9yUmVkKCkge1xuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjQ5NDlcIjtcbiAgICB9XG5cbiAgICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JEZWZhdWx0KCkge1xuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OEI3RkZcIjtcbiAgICB9XG5cbiAgICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICAgIHNldENvbG9yR3JlZW4oKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xuICAgIH1cbiAgICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXG4gICAgZ2V0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIodGhpcy5kb20uY2hpbGROb2Rlc1swXS5pbm5lckhUTUwpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiXG5cbi8vIOydtCDtgbTrnpjsiqTrpbwg7IOB7IaN7ZW07IScIHNvcnQg66mU7IaM65OcIOq1rO2YhO2VmOq4sFxuY2xhc3MgU29ydCB7XG4gICAgY29uc3RydWN0b3IoIGNvbnRhaW5lcixibG9ja3MsIGRlbGF5PTIwMCwgYW5pbWF0aW9uRGVsYXk9MjUwKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbGF5ID0gYW5pbWF0aW9uRGVsYXk7XG4gICAgICAgIFxuICAgICAgICAvLyBibG9jayDrk6TsnZgg7JWg64uI66mU7J207IWYIOuUnOugiOydtOulvCDshKTsoJVcbiAgICAgICAgdGhpcy5ibG9ja3MubWFwKGJsb2NrID0+IGJsb2NrLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0aGlzLmFuaW1hdGlvbkRlbGF5K1wibXNcIik7XG4gICAgfVxuXG4gICAgLy8g7LaU7IOBIOuplOyGjOuTnFxuICAgIHNvcnQoKSB7XG5cbiAgICB9XG4gICAgXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcbiAgICBnZXRCbG9ja3MoKSB7XG5cbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJsb2Nrcy5zb3J0KChiMSxiMikgPT4gZG9tcy5pbmRleE9mKGIxLmRvbSkgLSBkb21zLmluZGV4T2YoYjIuZG9tKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzO1xuICAgIH1cblxuICAgIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gICAgLy8gdGFyZ2V0MeydtCDtla3sg4EgdGFyZ2V0MuuztOuLpCDslZ7sl5Ag7J6I7Ja07JW8IO2VqFxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2sxLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICAgICAgICBibG9jazEuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTI7XG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDEgPSBibG9jazEuZG9tLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMS5kb20sIG5leHRPZlRhcmdldDIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcbiAgICAvLyB0YXJnZXTsnYAg7ZWt7IOBIGRlc3RJbmRleOuztOuLpCDrkqTsl5Ag7J6I7Ja07JW87ZWoXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XG5cbiAgICAgICAgICAgIC8vIHRhcmdldOydmCDsnbjrjbHsiqRcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcblxuICAgICAgICAgICAgLy8gZGVzdEluZGXsmYAgdGFyZ2V0IOyCrOydtOyXkCDsnojripQg67iU66Gd65OkXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrLmRvbSk7XG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcblxuICAgICAgICAgICAgYmxvY2suZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbMF07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2suZG9tLCBiZXR3ZWVuc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydDtcbiJdfQ==
