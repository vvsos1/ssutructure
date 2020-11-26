const Sort = require("../sort/Sort");

class InsertionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);

  }

  async sort() {

    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    this.isSortRunning = true;

    document.getElementById("pseudo-code-container").innerHTML = 
    `
    <code>function insertionSort(A, n) {</code>
    <code> for (let i = 2; i <= n; i++) {</code>
    <code>  let key = A[i]</code>
    <code>  let j = i - 1</code>
    <code>  while (j > 0 && A[j] > key) {</code>
    <code>	  A[j + 1] = A[j]</code>
    <code>    j = j - 1</code>
    <code>  }</code>
    <code>  A[j + 1] = key</code>
    <code> }</code>
    <code>}</code>
    `;

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;

    blocks[0].setColorGreen();

    for (let i = 1; i < n;) {
      blocks[i].setColorRed();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorRed();

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          this.codeDefault();
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorGreen();
        if (value > target) {
          destIndex = j;
          break;
        }
        j+=1;
      }
      if (i != destIndex) {
        blocks[destIndex].setColorRed();

        this.codeHighlight(5, 6, 7, 8);
        await this.insertAt(blocks[i], destIndex);

        this.codeHighlight(9);
        await this.shift(destIndex, i);

        blocks[destIndex].setColorGreen();
      }
      blocks[i].setColorGreen();
      this.refreshBlocks();
      i += 1;
    }

    this.isSortRunning = false;
  }
}

module.exports = InsertionSort;
