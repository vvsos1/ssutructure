const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
  }
  async sort(p = 0, r = this.blocks.length - 1) {
    if (p < r) {
      const blocks = this.getBlocks();
      const q = await this.partition(p, r);

    //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(p, q - 1);

    //   await this.waitDetail();
      //   await this.waitSimple();
      await this.sort(q + 1, r);
    }
  }

  async partition(p, r) {
    let blocks = this.blocks;
    let pivot = blocks[p].getValue();
    let small = p;
    let big = r + 1;

    blocks
      .filter((_, i) => p <= i && i <= r)
      .forEach(block => block.setColorBoundary());

    blocks[p].setColorPivot();

    do {
      do {
        small++;
      } while (small <= r && blocks[small].getValue() <= pivot);
      do {
        big--;
      } while (big >= p && blocks[big].getValue() > pivot);
      if (small < big) {
        blocks[small].setColorRed();
        blocks[big].setColorRed();

        await this.waitDetail();
        await this.swap(blocks[small], blocks[big]);
        blocks[small].setColorBoundary();
        blocks[big].setColorBoundary();
        this.blocks = this.getBlocks();
      }
    } while (small < big);

    blocks[big].setColorRed();
    await this.waitDetail();
    await this.waitSimple();
    await this.swap(blocks[p], blocks[big]);

    this.blocks = this.getBlocks();

    blocks
    .filter((_, i) => p <= i && i <= r)
    .forEach(block => block.setColorDefault());

    return big;
  }

}

module.exports = QuickSort;
