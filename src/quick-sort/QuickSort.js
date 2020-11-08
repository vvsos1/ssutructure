const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(container, blocks, delay, animationDelay) {
    super(container, blocks, delay, animationDelay);
  }
  async sort(p = 0, r = this.blocks.length-1) {
    if (p < r) {
      const blocks = this.getBlocks();
      const q = await this.partition(p, r);

      await this.waitDetail();
    //   await this.waitSimple();
      await this.sort(p, q - 1);

      await this.waitDetail();
    //   await this.waitSimple();
      await this.sort(q + 1, r);
    }
  }

  async partition(p, r) {
    let blocks = this.blocks;
    let pivot = blocks[p];
    let small = p;
    let big = r + 1;

    do {
      do {
        small++;
      } while (small <= r && blocks[small] < pivot);
      do {
        big--;
      } while (big >= p && blocks[big] > pivot);
      if (small < big) {
        blocks[small].setColorRed();
        blocks[big].setColorRed();

        await this.waitDetail();
        await this.swap(blocks[small], blocks[big]);
        blocks[small].setColorDefault();
        blocks[big].setColorDefault();
      }
    } while (small < big);

    blocks[p].setColorRed();
    blocks[big].setColorRed();
    await this.waitDetail();
    await this.waitSimple();
    await this.swap(blocks[p], blocks[big]);
    blocks[p].setColorDefault();
    blocks[big].setColorDefault();

    return big;
  }
}

module.exports = QuickSort;
