const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
  }
  async sort(p = 0, r = this.blocks.length - 1) {
    // 초기 호출이고 이미 정렬 중인 경우 바로 리턴
    if (p === 0 && r === this.blocks.length - 1 && this.isSortRunning) return;
    // 초기 호출일 경우
    if (p === 0 && r === this.blocks.length - 1) {
      this.isSortRunning = true;
      // 블록 색상을 기본으로 변경
      this.blocks.forEach(block => block.setColorDefault());
    }

    if (p < r) {
      const q = await this.partition(p, r);

      //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(p, q - 1);

      //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(q + 1, r);
    }

    // 초기 호출일 경우
    if (p === 0 && r === this.blocks.length - 1) this.isSortRunning = false;
  }

  async partition(p, r) {
    let pivot = this.blocks[p].getValue();
    let small = p;
    let big = r + 1;

    this.blocks
      .filter((_, i) => p <= i && i <= r)
      .forEach(block => block.setColorBoundary());

      this.blocks[p].setColorPivot();

    do {
      do {
        small++;
      } while (small <= r && this.blocks[small].getValue() <= pivot);
      do {
        big--;
      } while (big >= p && this.blocks[big].getValue() > pivot);
      if (small < big) {
        this.blocks[small].setColorRed();
        this.blocks[big].setColorRed();

        await this.waitDetail();
        await this.swap(this.blocks[small], this.blocks[big]);
        this.blocks[small].setColorBoundary();
        this.blocks[big].setColorBoundary();
        this.refreshBlocks();
      }
    } while (small < big);

    this.blocks[big].setColorRed();
    await this.waitDetail();
    await this.waitSimple();
    await this.swap(this.blocks[p], this.blocks[big]);

    this.refreshBlocks();

    this.blocks
      .filter((_, i) => p <= i && i <= r)
      .forEach(block => block.setColorDefault());

    return big;
  }
}

module.exports = QuickSort;
