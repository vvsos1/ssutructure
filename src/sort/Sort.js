// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
 
  
  constructor(container, blocks, delay = 200, animationDelay = 250,blockWidth = 28,blockMargin = 2) {
    // 정렬할 대상인 블록들
    this.blocks = blocks;
    // 블록을 시각화 할 컨테이너 DOM
    this.container = container;
    // 정렬 스텝 사이 딜레이
    this.delay = delay;
    // 정렬이 멈춘 상태
    this.isStop = false;
    // 블록의 너비
    this.blockWidth = blockWidth;
    // 블록 사이 간격
    this.blockMargin = blockMargin;

    // Step을 상세히 보여줌
    this.stepType = Sort.STEP_DETAIL;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);
  }

  // 추상 메소드
  sort() {}

  
  waitDetail() {
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_DETAIL) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveDetail = resolve;
      } else {
        resolve();
      }
    });
  }

  waitSimple(){
    return new Promise(resolve => {
      if (this.isStop && this.stepType == Sort.STEP_SIMPLE) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolveSimple = resolve;
      } else {
        resolve();
      }
    });
  }

  stop() {
    this.isStop = true;
  }

  continue() {
    this.isStop = false;
    this.step();
  }

  step() {
      if (this.resolveDetail != null && this.resolveDetail != undefined){
        this.resolveDetail();
        this.resolveDetail = null;
      } else if (this.resolveSimple != null && this.resolveSimple != undefined) {
        this.resolveSimple();
        this.resolveSimple = null;
      }
    
  }

  setStepTypeDetail(){
    this.stepType = Sort.STEP_DETAIL;
  }
  setStepTypeSimple(){
    this.stepType = Sort.STEP_SIMPLE;
  }

  shuffle() {
    let blocks = this.blocks;
    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 미만의 무작위 인덱스
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // 셔플
    }
    blocks.map((block, index) => {
      block.setColorDefault();  // 블록 색 초기화

      const prevTransitionDuration = window.getComputedStyle(block.dom)
        .transitionDuration;
      block.dom.transitionDuration = 0 + "ms";

      console.log(`i : ${index}, value:${block.getValue()}, this.blockWidth:${this.blockWidth}, this.blockMargin :${this.blockMargin}`);
      const transX = index * (this.blockWidth+this.blockMargin);

      block.dom.style.transform = `translateX(${transX}px)`;  // 블록의 화면상 위치 조정
      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.dom.transitionDuration = prevTransitionDuration;
    });

    this.blocks = blocks;
  }

  setBlockWidth(blockWidth, blockMargin = 2) {
    this.blockWidth = blockWidth;
    this.blockMargin =blockMargin;
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (blockWidth + blockMargin) + "px";

    this.getBlocks().map((block, index) => {
      const dom = block.dom;

      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevTransitionDuration = window.getComputedStyle(dom).transitionDuration;
      dom.style.transitionDuration = 0 + "ms";

      const transX = index * (blockWidth + blockMargin);
      dom.style.transform = `translateX(${transX}px)`;

      // 블록의 너비 조정
      dom.style.width = blockWidth + "px";

      // 애니메이션 속도를 원래대로 조정
      dom.style.transitionDuration = prevTransitionDuration;
    });
  }

  addBlock(block) {
    this.blocks.push(block);
    const prevWidth = Number(
      window
        .getComputedStyle(this.container)
        .getPropertyValue("width")
        .replace("px", "")
    );

    this.container.style.width = prevWidth + (this.blockWidth+this.blockMargin) + "px";
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.map(
      block => (block.dom.style.transitionDuration = this.animationDelay + "ms")
    );
  }

  // 모든 block들을 시각화되고있는 순서에 맞게 리턴하는 함수
  getBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));

    return this.blocks;
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  swap(block1, block2) {
    // block1: Block, block2: Block
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
      window.requestAnimationFrame(() => {
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
      const transformRest = styleRest.map(style =>
        style.getPropertyValue("transform")
      );

      block.dom.style.transform = transformRest[0];
      for (let i = 0; i < betweens.length - 1; i++) {
        betweens[i].style.transform = transformRest[i + 1];
      }
      betweens[betweens.length - 1].style.transform = transform1;

      // 애니메이션이 끝나기를 기다림.
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(block.dom, betweens[0]);
          resolve();
        }, this.animationDelay);
      });
    });
  }
}


 // 세부적으로 모든 단계 표시
 Sort.STEP_DETAIL = Symbol.for('STEP_DETAIL');
 // 블록 위치가 바뀌는 단계만 표시
 Sort.STEP_SIMPLE = Symbol.for('STEP_SIMPLE');

module.exports = Sort;
