(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require('../sort/Sort');

class InsertSort extends Sort {

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

module.exports = InsertSort;



       

},{"../sort/Sort":4}],2:[function(require,module,exports){
const InsertSort = require('./InsertSort');
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
const insertSort = new InsertSort(container,blocks,200,250);

insertSort.sort();

},{"../sort/Block":3,"./InsertSort":1}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkluc2VydFNvcnQuanMiLCJpbmRleC5qcyIsIi4uL3NvcnQvQmxvY2suanMiLCIuLi9zb3J0L1NvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBTb3J0ID0gcmVxdWlyZSgnLi4vc29ydC9Tb3J0Jyk7XG5cbmNsYXNzIEluc2VydFNvcnQgZXh0ZW5kcyBTb3J0IHtcblxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xuICAgICAgICBzdXBlcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KTtcbiAgICB9XG5cbiAgICBhc3luYyBzb3J0KCkge1xuXG4gICAgICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxuICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgICAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcblxuXHRibG9ja3NbMF0uc2V0Q29sb3JHcmVlbigpO1xuXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSArPSAxKSB7XG5cdFx0XG5cdFx0YmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XG5cblx0XHRsZXQgZGVzdEluZGV4ID0gaTtcblx0XHRcblx0XHRjb25zdCB0YXJnZXQgPSBibG9ja3NbaV0uZ2V0VmFsdWUoKTtcblxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG5cdFx0XHRcblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XG5cblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cblx0XHRcdGNvbnN0IHZhbHVlID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG5cblx0XHRcdC8vYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xuXHRcdFx0aWYgKHZhbHVlID4gdGFyZ2V0KSB7XG5cdFx0XHRcdGRlc3RJbmRleCA9IGo7XG5cdFx0XHRcdGJyZWFrIDtcblx0XHRcdH0gXHRcdFxuXHRcdH1cblx0XHRpZiAoaSAhPSBkZXN0SW5kZXgpIHtcblx0XHRcdGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yUmVkKCk7XG5cdFx0XHRcblx0XHRcdGF3YWl0IHRoaXMuaW5zZXJ0QXQoYmxvY2tzW2ldLCBkZXN0SW5kZXgpO1xuXG5cdFx0XHRibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvckdyZWVuKCk7XG5cdFx0fVxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG5cdFx0YmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcblx0fVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluc2VydFNvcnQ7XG5cblxuXG4gICAgICAgXG4iLCJjb25zdCBJbnNlcnRTb3J0ID0gcmVxdWlyZSgnLi9JbnNlcnRTb3J0Jyk7XG5jb25zdCBCbG9jayA9IHJlcXVpcmUoJy4uL3NvcnQvQmxvY2snKTtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhdGEtY29udGFpbmVyJyk7XG5cbi8vIDB+MTAwIOyCrOydtCDrnpzrjaQg6rCS7J2EIOqwgOyngOuKlCDruJTroZ0gbnVt6rCcIOyDneyEsSBcbmZ1bmN0aW9uIGdlbmVyYXRlQmxvY2tzKG51bSA9IDIwLGNvbnRhaW5lcikge1xuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApO1xuICAgICAgICBjb25zdCBibG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLGNvbnRhaW5lcik7XG4gICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICB9XG4gICAgcmV0dXJuIGJsb2Nrcztcbn1cblxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVCbG9ja3MoMjAsY29udGFpbmVyKTtcbmNvbnN0IGluc2VydFNvcnQgPSBuZXcgSW5zZXJ0U29ydChjb250YWluZXIsYmxvY2tzLDIwMCwyNTApO1xuXG5pbnNlcnRTb3J0LnNvcnQoKTtcbiIsImNsYXNzIEJsb2NrIHtcbiAgICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxuICAgIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyKSB7ICAgLy8gdmFsdWU6TnVtYmVyLCBjb250YWluZXI6RE9NXG4gICAgICAgIGNvbnN0IGJsb2NrQ291bnQgPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7XG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG4gICAgICAgIGJsb2NrLnN0eWxlLmhlaWdodCA9IGAke3ZhbHVlICogM31weGA7XG4gICAgICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIDMwfXB4KWA7XG5cbiAgICAgICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xuICAgICAgICBibG9ja0xhYmVsLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICAgICAgICByZXR1cm4gbmV3IEJsb2NrKGJsb2NrLGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoZG9tLCBjb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5kb20gPSBkb207XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOyEoO2DneuQnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgICBzZXRDb2xvclJlZCgpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XG4gICAgfVxuXG4gICAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICAgIHNldENvbG9yRGVmYXVsdCgpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNThCN0ZGXCI7XG4gICAgfVxuXG4gICAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgICBzZXRDb2xvckdyZWVuKCkge1xuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxM0NFNjZcIjtcbiAgICB9XG4gICAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcbiIsIlxuXG4vLyDsnbQg7YG0656Y7Iqk66W8IOyDgeyGje2VtOyEnCBzb3J0IOuplOyGjOuTnCDqtaztmITtlZjquLBcbmNsYXNzIFNvcnQge1xuICAgIGNvbnN0cnVjdG9yKCBjb250YWluZXIsYmxvY2tzLCBkZWxheT0yMDAsIGFuaW1hdGlvbkRlbGF5PTI1MCkge1xuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25EZWxheSA9IGFuaW1hdGlvbkRlbGF5O1xuICAgIH1cblxuICAgIC8vIOy2lOyDgSDrqZTshozrk5xcbiAgICBzb3J0KCkge1xuXG4gICAgfVxuICAgIFxuICAgIC8vIOuqqOuToCBibG9ja+uTpOydhCDrpqzthLTtlZjripQg7ZWo7IiYXG4gICAgZ2V0QmxvY2tzKCkge1xuXG4gICAgICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrcztcbiAgICB9XG5cbiAgICAvLyB0YXJnZXQx6rO8IHRhdGdldDLsnZgg7JyE7LmY66W8IOuwlOq/iFxuICAgIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcbiAgICBzd2FwKGJsb2NrMSwgYmxvY2syKSB7ICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUyID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2syLmRvbSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTIgPSBzdHlsZTIuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcblxuICAgICAgICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xuICAgICAgICAgICAgYmxvY2syLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xuXG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jazIuZG9tLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMi5kb20sIG5leHRPZlRhcmdldDEpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdGFyZ2V07J2EIGRlc3RJbmRleCDsnpDrpqzsl5Ag64Sj6rOgIOybkOuemCBkZXN0SW5kZXjsnZggZWxlbWVudOu2gO2EsCDtlZwg7Lm47JSpIOuSpOuhnCDrr7jripQg7ZWo7IiYXG4gICAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxuICAgIGluc2VydEF0KGJsb2NrLCBkZXN0SW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xuXG4gICAgICAgICAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJbmRleCA9IGFyci5pbmRleE9mKGJsb2NrLmRvbSk7XG5cbiAgICAgICAgICAgIC8vIGRlc3RJbmRl7JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxuICAgICAgICAgICAgY29uc3QgYmV0d2VlbnMgPSBhcnIuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xuXG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pO1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVSZXN0ID0gYmV0d2VlbnMubWFwKGRvbSA9PiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pKTtcblxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtUmVzdCA9IHN0eWxlUmVzdC5tYXAoc3R5bGUgPT4gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKSk7XG5cbiAgICAgICAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBiZXR3ZWVuc1tpXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0W2kgKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJldHdlZW5zW2JldHdlZW5zLmxlbmd0aCAtIDFdLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XG5cbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XG4iXX0=
