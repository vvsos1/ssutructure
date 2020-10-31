(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
                await new Promise(resolve => setTimeout(resolve,this.delay));
                let value1 = blocks[min].getValue();
                let value2 = blocks[j].getValue();
                if (value1 >= value2)
                    min = j;
                if (i != min&&j==n-1) {
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
}
}
module.exports = SelectionSort;

},{"../sort/Sort":4}],2:[function(require,module,exports){
const SelectionSort = require('./SelectionSort');
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
const selectionSort = new SelectionSort(container,blocks,200,250);

selectionSort.sort();

},{"../sort/Block":3,"./SelectionSort":1}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2VsZWN0aW9uLXNvcnQvU2VsZWN0aW9uU29ydC5qcyIsInNyYy9zZWxlY3Rpb24tc29ydC9pbmRleC5qcyIsInNyYy9zb3J0L0Jsb2NrLmpzIiwic3JjL3NvcnQvU29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IFNvcnQgPSByZXF1aXJlKCcuLi9zb3J0L1NvcnQnKTtcblxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xuXG4gICAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XG4gICAgICAgIHN1cGVyKGNvbnRhaW5lciwgYmxvY2tzLCBkZWxheSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgIH1cblxuICAgIGFzeW5jIHNvcnQoKSB7XG5cbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgICAgIGxldCBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xuICAgICAgICAvLyBibG9ja+uTpOydmCDstJ0g6rCc7IiYXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuICAgICAgICBsZXQgbWluO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgbWluID0gaTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxuICAgICAgICAgICAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclJlZCgpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLHRoaXMuZGVsYXkpKTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUyID0gYmxvY2tzW2pdLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMSA+PSB2YWx1ZTIpXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGo7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gbWluJiZqPT1uLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pO1xuXHRcdFx0bWluID0gaTtcbiAgICAgICAgICAgICAgICAgICAgLy8g65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIOq4sOyhtCBibG9ja3Prpbwg7JeF642w7J207Yq4XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgfVxuXHRcdGJsb2Nrc1tpXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvckdyZWVuKCk7XG4gICAgfVxufVxufVxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25Tb3J0O1xuIiwiY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoJy4vU2VsZWN0aW9uU29ydCcpO1xuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zb3J0L0Jsb2NrJyk7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhLWNvbnRhaW5lcicpO1xuXG4vLyAwfjEwMCDsgqzsnbQg656c642kIOqwkuydhCDqsIDsp4DripQg67iU66GdIG51beqwnCDsg53shLEgXG5mdW5jdGlvbiBnZW5lcmF0ZUJsb2NrcyhudW0gPSAyMCxjb250YWluZXIpIHtcbiAgICBjb25zdCBibG9ja3MgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICAgICAgY29uc3QgYmxvY2sgPSBCbG9jay5jcmVhdGVOZXdCbG9jayh2YWx1ZSxjb250YWluZXIpO1xuICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgfVxuICAgIHJldHVybiBibG9ja3M7XG59XG5cbmNvbnN0IGJsb2NrcyA9IGdlbmVyYXRlQmxvY2tzKDIwLGNvbnRhaW5lcik7XG5jb25zdCBzZWxlY3Rpb25Tb3J0ID0gbmV3IFNlbGVjdGlvblNvcnQoY29udGFpbmVyLGJsb2NrcywyMDAsMjUwKTtcblxuc2VsZWN0aW9uU29ydC5zb3J0KCk7XG4iLCJjbGFzcyBCbG9jayB7XG4gICAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcbiAgICBzdGF0aWMgY3JlYXRlTmV3QmxvY2sodmFsdWUsIGNvbnRhaW5lcikgeyAgIC8vIHZhbHVlOk51bWJlciwgY29udGFpbmVyOkRPTVxuICAgICAgICBjb25zdCBibG9ja0NvdW50ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50O1xuXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuICAgICAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xuICAgICAgICBibG9jay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2Jsb2NrQ291bnQgKiAzMH1weClgO1xuXG4gICAgICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcbiAgICAgICAgYmxvY2tMYWJlbC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChibG9ja0xhYmVsKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayxjb250YWluZXIpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGRvbSwgY29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JSZWQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGNDk0OVwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgICBzZXRDb2xvckRlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xuICAgIH1cblxuICAgIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gICAgc2V0Q29sb3JHcmVlbigpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTNDRTY2XCI7XG4gICAgfVxuICAgIC8vIGJsb2Nr7J2YIHZhbHVl66W8IOuwmO2ZmO2VmOuKlCDtlajsiJhcbiAgICBnZXRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XG4iLCJcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgICBjb25zdHJ1Y3RvciggY29udGFpbmVyLGJsb2NrcywgZGVsYXk9MjAwLCBhbmltYXRpb25EZWxheT0yNTApIHtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBhbmltYXRpb25EZWxheTtcbiAgICAgICAgXG4gICAgICAgIC8vIGJsb2NrIOuTpOydmCDslaDri4jrqZTsnbTshZgg65Sc66CI7J2066W8IOyEpOyglVxuICAgICAgICB0aGlzLmJsb2Nrcy5tYXAoYmxvY2sgPT4gYmxvY2suZG9tLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uRGVsYXkrXCJtc1wiKTtcbiAgICB9XG5cbiAgICAvLyDstpTsg4Eg66mU7IaM65OcXG4gICAgc29ydCgpIHtcblxuICAgIH1cbiAgICBcbiAgICAvLyDrqqjrk6AgYmxvY2vrk6TsnYQg66as7YS07ZWY64qUIO2VqOyImFxuICAgIGdldEJsb2NrcygpIHtcblxuICAgICAgICBjb25zdCBkb21zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYmxvY2tzLnNvcnQoKGIxLGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XG4gICAgfVxuXG4gICAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcbiAgICAvLyB0YXJnZXQx7J20IO2VreyDgSB0YXJnZXQy67O064ukIOyVnuyXkCDsnojslrTslbwg7ZWoXG4gICAgc3dhcChibG9jazEsIGJsb2NrMikgeyAgLy8gYmxvY2sxOiBCbG9jaywgYmxvY2syOiBCbG9ja1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazEuZG9tKTtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMi5kb20pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0xID0gc3R5bGUxLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0yID0gc3R5bGUyLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIik7XG5cbiAgICAgICAgICAgIGJsb2NrMS5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMjtcbiAgICAgICAgICAgIGJsb2NrMi5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MSA9IGJsb2NrMS5kb20ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQyID0gYmxvY2syLmRvbS5uZXh0U2libGluZztcblxuICAgICAgICAgICAgLy8g7JWg64uI66mU7J207IWY7J20IOuBneuCmOq4sOulvCDquLDri6TrprwuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2sxLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazIuZG9tLCBuZXh0T2ZUYXJnZXQxKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxuICAgIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgICBpbnNlcnRBdChibG9jaywgZGVzdEluZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblxuICAgICAgICAgICAgY29uc3QgYXJyID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJsb2NrXCIpKTtcblxuICAgICAgICAgICAgLy8gdGFyZ2V07J2YIOyduOuNseyKpFxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBhcnIuaW5kZXhPZihibG9jay5kb20pO1xuXG4gICAgICAgICAgICAvLyBkZXN0SW5kZeyZgCB0YXJnZXQg7IKs7J207JeQIOyeiOuKlCDruJTroZ3rk6RcbiAgICAgICAgICAgIGNvbnN0IGJldHdlZW5zID0gYXJyLmZpbHRlcigoXywgaSkgPT4gZGVzdEluZGV4IDw9IGkgJiYgaSA8IHRhcmdldEluZGV4KTtcblxuICAgICAgICAgICAgY29uc3Qgc3R5bGUxID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYmxvY2suZG9tKTtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlUmVzdCA9IGJldHdlZW5zLm1hcChkb20gPT4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVJlc3QgPSBzdHlsZVJlc3QubWFwKHN0eWxlID0+IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJ0cmFuc2Zvcm1cIikpO1xuXG4gICAgICAgICAgICBibG9jay5kb20uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFswXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmV0d2VlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmV0d2VlbnNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFtpICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiZXR3ZWVuc1tiZXR3ZWVucy5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0xO1xuXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jay5kb20sIGJldHdlZW5zWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xuIl19
