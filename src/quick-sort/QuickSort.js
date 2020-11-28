const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
quick sort(퀵 정렬)는 기준점(pivot)을 기준으로 두 개의 분할된 부분 리스트를 정렬한 다음 합하여 전체가 정렬된 리스트가 되게 하는 알고리즘입니다.
분할 정복 알고리즘의 하나로, 평균적으로 매우 빠른 수행 속도를 자랑합니다.

평균 시간 복잡도 : T(n) = O(n * log(n))
`
    )
    this.drawPseudoCode(
`function quickSort(A, p, r) {
  if (p < r) {
    let q = partition(A, p, r)
    quickSort(A, p, q-1)
    quickSort(A, q+1, r)
  }
}
function partition(A, p, r) {
  let pivot = A[(p+r)/2)]
  let left = p;
  let right = r;
  do {
    while (A[left] < pivot) 
      left++
    while (A[right] > pivot) 
      right--
    if (left <= right) 
       swap(A[left--],A[right++])
  } while (left <= right)
  return right >= p ? right : p
}
`
    )
  }

  async sort(left = 0, right = this.blocks.length - 1) {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning) return;
    this.isSortRunning = true;

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach((block) => block.setColorDefault());

    let blocks = this.blocks;
    let lstack = [];
    let rstack = [];

    lstack.push(left);
    rstack.push(right);

    while (lstack.length != 0) {
      let pl = (left = lstack.pop()); // 왼쪽 커서
      let pr = (right = rstack.pop()); // 오른쪽 커서
      let pivotIdx = Math.ceil((left + right) / 2);
      let pivot = blocks[pivotIdx]; // 피벗

      // 현재 알고리즘이 바라보는 블록들의 색 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorBoundary());
      // 피벗의 색 변경
      pivot.setColorPivot();
      
      this.codeHighlight(9);
      await this.sleep("50");

      do {
        while (blocks[pl].getValue() < pivot.getValue()) pl++;
        while (blocks[pr].getValue() > pivot.getValue()) pr--;

        blocks[pl].setColorSelected();
        blocks[pr].setColorSelected();
        // pl 또는 pr이 pivot과 겹쳐도 pivot의 색을 유지
        pivot.setColorPivot();

        this.codeHighlight(13,14,15,16)

        const { type, memento } = await this.wait();

        // 상태 복구
        if (type === "back") {
          ({ lstack, rstack, pl, pr, left, right, pivotIdx } = memento);
          pivot = blocks[pivotIdx];
          memento.blocks.forEach((prevBlock, index) => {
            const { color, xPosition, value, width } = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });
          continue;
        }

        // 현재 상태를 스택에 저장
        this.pushMemento({
          pl,
          pr,
          pivotIdx,
          left,
          right,
          lstack: [...lstack, pl],
          rstack: [...rstack, pr],
          blocks: [...blocks].map((block) => ({ ...block })),
        });

        if (pl <= pr) {
          this.codeHighlight(18);
          await this.swap(blocks[pl++], blocks[pr--]);
          // swap(blocks, pl++, pr--);
          this.refreshBlocks();
        }
        blocks[pl - 1].setColorBoundary();
        blocks[pr + 1].setColorBoundary();
      } while (pl <= pr);

      if (left < pr) {
        lstack.push(left);
        rstack.push(pr);
      }
      if (pl < right) {
        lstack.push(pl);
        rstack.push(right);
      }
      // 현재 알고리즘이 바라보는 블록들의 색을 원래대로 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorDefault());
    }
  }
}

module.exports = QuickSort;
