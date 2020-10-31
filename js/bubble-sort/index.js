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



       

},{"../sort/Sort":4}],2:[function(require,module,exports){
const BubbleSort = require('./BubbleSort');
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
const bubbleSort = new BubbleSort(container,blocks,200,250);

bubbleSort.sort();

},{"../sort/Block":3,"./BubbleSort":1}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2Jub3BhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idWJibGUtc29ydC9CdWJibGVTb3J0LmpzIiwic3JjL2J1YmJsZS1zb3J0L2luZGV4LmpzIiwic3JjL3NvcnQvQmxvY2suanMiLCJzcmMvc29ydC9Tb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKCcuLi9zb3J0L1NvcnQnKTtcclxuXHJcbmNsYXNzIEJ1YmJsZVNvcnQgZXh0ZW5kcyBTb3J0IHtcclxuXHJcbiAgICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSkge1xyXG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNvcnQoKSB7XHJcblxyXG4gICAgICAgIC8vIGJsb2Nr65OkIOqwgOyguOyYpOq4sFxyXG4gICAgICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcclxuICAgICAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbiAtIGkgLSAxOyBqICs9IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcKOygleugrOykkeyduCkg67iU66Gd7J2YIOyDieydhCBSZWTroZwg67CU6r+IXHJcblxyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yUmVkKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlMiA9IGJsb2Nrc1tqICsgMV0uZ2V0VmFsdWUoKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN3YXAg7ZWo7IiY66GcIOuRkCDruJTroZ3snZgg7JyE7LmY66W8IOuwlOq/iDsgYXdhaXTsnYAgc3dhcCDsnbQg64Gd64KgIOuVjCDquYzsp4Ag6riw64uk66as6rKg64uk64qUIOydmOuvuFxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirggXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5nZXRCbG9ja3MoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXHJcbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBibG9ja3NbaiArIDFdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXHJcbiAgICAgICAgICAgIGJsb2Nrc1tuIC0gaSAtIDFdLnNldENvbG9yR3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnViYmxlU29ydDtcclxuXHJcblxyXG5cclxuICAgICAgIFxyXG4iLCJjb25zdCBCdWJibGVTb3J0ID0gcmVxdWlyZSgnLi9CdWJibGVTb3J0Jyk7XHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc29ydC9CbG9jaycpO1xyXG5cclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhdGEtY29udGFpbmVyJyk7XHJcblxyXG4vLyAwfjEwMCDsgqzsnbQg656c642kIOqwkuydhCDqsIDsp4DripQg67iU66GdIG51beqwnCDsg53shLEgXHJcbmZ1bmN0aW9uIGdlbmVyYXRlQmxvY2tzKG51bSA9IDIwLGNvbnRhaW5lcikge1xyXG4gICAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSArPSAxKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApO1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2sodmFsdWUsY29udGFpbmVyKTtcclxuICAgICAgICBibG9ja3MucHVzaChibG9jayk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmxvY2tzO1xyXG59XHJcblxyXG5jb25zdCBibG9ja3MgPSBnZW5lcmF0ZUJsb2NrcygyMCxjb250YWluZXIpO1xyXG5jb25zdCBidWJibGVTb3J0ID0gbmV3IEJ1YmJsZVNvcnQoY29udGFpbmVyLGJsb2NrcywyMDAsMjUwKTtcclxuXHJcbmJ1YmJsZVNvcnQuc29ydCgpO1xyXG4iLCJjbGFzcyBCbG9jayB7XHJcbiAgICAvLyBzdGF0aWMgZmFjdG9yeSBtZXRob2Q7IHZhbHVl7JmAIGNvbnRhaW5lcuulvCDsnbTsmqntlbQgQmxvY2sg6rCd7LK066W8IOunjOuToOuLpFxyXG4gICAgc3RhdGljIGNyZWF0ZU5ld0Jsb2NrKHZhbHVlLCBjb250YWluZXIpIHsgICAvLyB2YWx1ZTpOdW1iZXIsIGNvbnRhaW5lcjpET01cclxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xyXG5cclxuICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgICAgIGJsb2NrLnN0eWxlLmhlaWdodCA9IGAke3ZhbHVlICogM31weGA7XHJcbiAgICAgICAgYmxvY2suc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtibG9ja0NvdW50ICogMzB9cHgpYDtcclxuXHJcbiAgICAgICAgY29uc3QgYmxvY2tMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBibG9ja0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJibG9ja19faWRcIik7XHJcbiAgICAgICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgYmxvY2suYXBwZW5kQ2hpbGQoYmxvY2tMYWJlbCk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcclxuICAgICAgICByZXR1cm4gbmV3IEJsb2NrKGJsb2NrLGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZG9tLCBjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmRvbSA9IGRvbTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgICBzZXRDb2xvclJlZCgpIHtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjQ5NDlcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBibG9ja+ydhCDquLDrs7gg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgICBzZXRDb2xvckRlZmF1bHQoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNThCN0ZGXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYmxvY2vsnYQg7KCV66Cs7J20IOuBneuCnCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcclxuICAgIHNldENvbG9yR3JlZW4oKSB7XHJcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XHJcbiAgICB9XHJcbiAgICAvLyBibG9ja+ydmCB2YWx1ZeulvCDrsJjtmZjtlZjripQg7ZWo7IiYXHJcbiAgICBnZXRWYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsIlxyXG5cclxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXHJcbmNsYXNzIFNvcnQge1xyXG4gICAgY29uc3RydWN0b3IoIGNvbnRhaW5lcixibG9ja3MsIGRlbGF5PTIwMCwgYW5pbWF0aW9uRGVsYXk9MjUwKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxyXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uRGVsYXkoYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcblxyXG4gICAgLy8g7LaU7IOBIOuplOyGjOuTnFxyXG4gICAgc29ydCgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0QmxvY2tXaWR0aCh3aWR0aCwgYmxvY2tNYXJnaW4gPSAyKSB7ICAvLyB3aWR0aDpOdW1iZXJcclxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gdGhpcy5ibG9ja3MubGVuZ3RoXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g7Luo7YWM7J2064SIIO2BrOq4sCDrhJPtnojquLBcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGJsb2NrQ291bnQqKHdpZHRoK21hcmdpbikgKyBcInB4XCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5nZXRCbG9ja3MoKVxyXG4gICAgICAgIC5tYXAoKGJsb2NrLGluZGV4KT0+IHtcclxuICAgICAgICAgICAgY29uc3QgZG9tID0gYmxvY2suZG9tO1xyXG5cclxuICAgICAgICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxyXG4gICAgICAgICAgICBjb25zdCBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uID0gZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDArJ21zJztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zWCA9IGluZGV4ICogKHdpZHRoICsgYmxvY2tNYXJnaW4pO1xyXG4gICAgICAgICAgICBkb20uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc1h9cHgpYDtcclxuXHJcbiAgICAgICAgICAgIC8vIOu4lOuhneydmCDrhIjruYQg7KGw7KCVXHJcbiAgICAgICAgICAgIGRvbS5zdHlsZS53aWR0aD13aWR0aCtcInB4XCI7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWYIOyGjeuPhOulvCDsm5DrnpjrjIDroZwg7KGw7KCVXHJcbiAgICAgICAgICAgIGRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBwcmV2VHJhbnNpdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRCbG9jayhibG9jaykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgIGNvbnN0IHByZXZXaWR0aCA9IE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRhaW5lcikuZ2V0UHJvcGVydHlWYWx1ZShcIndpZHRoXCIpLnJlcGxhY2UoJ3B4JywnJykpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IChwcmV2V2lkdGggKyAzMCkrJ3B4JztcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzZXREZWxheShtaWxsaXMpIHtcclxuICAgICAgICB0aGlzLmRlbGF5ID0gbWlsbGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MubWFwKGJsb2NrID0+IGJsb2NrLmRvbS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSB0aGlzLmFuaW1hdGlvbkRlbGF5K1wibXNcIik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOuqqOuToCBibG9ja+uTpOydhCDrpqzthLTtlZjripQg7ZWo7IiYXHJcbiAgICBnZXRCbG9ja3MoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXHJcbiAgICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXHJcbiAgICBzd2FwKGJsb2NrMSwgYmxvY2syKSB7ICAvLyBibG9jazE6IEJsb2NrLCBibG9jazI6IEJsb2NrXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazEuZG9tKTtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGUyID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2syLmRvbSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTIgPSBzdHlsZTIuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuXHJcbiAgICAgICAgICAgIGJsb2NrMS5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMjtcclxuICAgICAgICAgICAgYmxvY2syLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IGJsb2NrMS5kb20ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZlRhcmdldDIgPSBibG9jazIuZG9tLm5leHRTaWJsaW5nO1xyXG5cclxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2sxLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrMi5kb20sIG5leHRPZlRhcmdldDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPqs6Ag7JuQ656YIGRlc3RJbmRleOydmCBlbGVtZW5067aA7YSwIO2VnCDsubjslKkg65Kk66GcIOuvuOuKlCDtlajsiJhcclxuICAgIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcclxuICAgIGluc2VydEF0KGJsb2NrLCBkZXN0SW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJbmRleCA9IGFyci5pbmRleE9mKGJsb2NrLmRvbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBkZXN0SW5kZeyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcclxuICAgICAgICAgICAgY29uc3QgYmV0d2VlbnMgPSBhcnIuZmlsdGVyKChfLCBpKSA9PiBkZXN0SW5kZXggPD0gaSAmJiBpIDwgdGFyZ2V0SW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKTtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGVSZXN0ID0gYmV0d2VlbnMubWFwKGRvbSA9PiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb20pKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtUmVzdCA9IHN0eWxlUmVzdC5tYXAoc3R5bGUgPT4gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKSk7XHJcblxyXG4gICAgICAgICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXR3ZWVucy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGJldHdlZW5zW2ldLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVJlc3RbaSArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJldHdlZW5zW2JldHdlZW5zLmxlbmd0aCAtIDFdLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIGJldHdlZW5zWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmFuaW1hdGlvbkRlbGF5KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ydDtcclxuIl19
