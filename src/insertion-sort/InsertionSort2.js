const Sort = require("../sort/Sort");

class InsertionSort2 extends Sort {
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

    await this.wait();

    for (let i = 1; i < n; i++) {

      // src 블록을 빨간색으로 설정
      blocks[i].setColorRed();

      // src 블록이 들어갈 목적지 인덱스 destIndex
      // 마땅한 위치가 없을 경우 그대로 있기 위해 임시로 src의 인덱스로 초기화
      let destIndex = i;

      // src 블록의 값 target
      const target = blocks[i].getValue();

      // 인덱스 0~destIndex까지는 정렬되었으므로 그 사이에서 src블록이 들어갈 위치를 찾는다
      for (let j = 0; j < i; j++) {

        await new Promise(resolve => setTimeout(resolve, this.delay));

	// 차례대로 살펴볼 블록들의 값
        const value = blocks[j].getValue();

	// 앞의 블록의 값이 src블록보다 크면 목적지 인덱스 변경 & 현재 반복문(j) 종료
        if (value > target) {
          destIndex = j;
          break;
        }
      }
      // 만약 목적지 인덱스가 변경되었으면 해당 목적지 인덱스의 블록을 빨강으로 설정 
      // src 블록을 목적지에 넣는다. 다시 목적지 블록은 초록색으로 설정
      if (i != destIndex) {
        blocks[destIndex].setColorRed();
        //await this.wait();

        await this.insertAt(blocks[i], destIndex);

        blocks[destIndex].setColorGreen();
      }
      blocks[i].setColorGreen();
      blocks = this.getBlocks();
      await this.wait();
    }
  }
}

module.exports = InsertionSort2;
