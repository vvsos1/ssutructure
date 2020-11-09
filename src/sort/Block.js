class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container,blockWidth=28,blockMargin=2) {
    // value:Number, container:DOM
    const blockCount = container.childElementCount;

    // 블록의 최대 높이는 컨테이너의 높이 - 24px
    const maxBlockHight = Number(window.getComputedStyle(container).height.replace('px','')) - 24;

    const block = document.createElement("div");
    block.classList.add("block");

    let blockHight = value * 3;
    if (blockHight > maxBlockHight)
      blockHight = maxBlockHight;
    block.style.height = `${blockHight}px`;
    block.style.width = `${blockWidth}px`;
    
    block.style.transform = `translateX(${blockCount * (blockWidth+blockMargin)}px)`;

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");
    blockLabel.innerHTML = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
    return new Block(block,value);
  }

  constructor(dom,value) {
    this.dom = dom;
    this.value = value;
  }

  setColorYellow(){
    this.dom.style.backgroundColor = "#FFFF00";
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

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot(){
    this.dom.style.backgroundColor = "#FF009D";  
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary(){
    this.dom.style.backgroundColor = "#800080"; // 보라
  }

  // block의 value를 반환하는 함수
  getValue() {
    return Number(this.dom.childNodes[0].innerHTML);
  }

  setTransitionDuration(millis){
    this.dom.style.transitionDuration=`${millis}ms`;
  }

  getTransitionDuration(){
    return Number(window.getComputedStyle(this.dom).transitionDuration.replace('s',0));
  }

  setXPosition(x){
    this.dom.style.transform = `translateX(${x}px)`;
  }

  getXPosition(){
    const regExpTransX = /[\w]+\([ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?([\d]+)[ ]?,[ ]?[\d]+[ ]?\)/;
    const transform =window.getComputedStyle(this.dom).transform; 
    return regExpTransX.exec(transform)[1];
  }

  setWidth(px){
    this.dom.style.width = `${px}px`;
  }
}

module.exports = Block;
