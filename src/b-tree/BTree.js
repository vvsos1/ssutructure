class BTree {
  constructor(minimum = 2) {
    TreeNode.MINIMUN = minimum;
    TreeNode.MAXIMUM = minimum * 2;
    TreeNode.NODE_COUNT = 0;
    this.root = TreeNode.END;
  }

  clear(){
    this.root = TreeNode.END;
  }

  add(data, vizCallback) {
    this.root = this.root.add(data, vizCallback);
    vizCallback();
  }

  contain(data){
      return this.root.contain(data);
  }
}

class TreeNode {
  constructor(datas = [], subsets = [], index) {
    this.index = index ?? TreeNode.NODE_COUNT++;
    this.datas = datas;
    // subset은 항상 MAX + 1의 길이를 가짐.
    this.subsets =
      subsets == null
        ? []
        : subsets.concat(
            Array(TreeNode.MAXIMUM + 1 - subsets.length)
              .fill(0)
              .map((_) => TreeNode.END)
          );
  }

  getColor() {
    return "rosybrown";
  }

  firstGE(data) {
    for (let i = 0; i < this.datas.length; i++)
      if (this.datas[i] >= data) return i;
    return this.datas.length;
  }
  add(data, vizCallback) {
    const i = this.firstGE(data);
    if (data[i] === data) return this;
    else if (this.isLeaf()) {
      this.datas = shiftAndAdd(this.datas, i, data);
    } else {
      const prev = this.subsets[i];
      const subset = this.subsets[i].add(data, vizCallback);
      if ((!prev.isEnd()) && (prev !== subset)) {
        this.datas.push(subset.datas[0]);
        this.datas.sort();
        const subsets = subset.subsets.slice(0,2);

       this.subsets.splice(i,1,...subsets);

       this.subsets = this.subsets.slice(0,TreeNode.MAXIMUM+1);

      }
    }

    vizCallback();
    const fixed = this.fixExcess();
    return fixed;
  }

  // 자신이 넘치면 트리를 분할하고, 분할한 트리의 루트를 반환
  fixExcess() {
    if (this.datas.length <= TreeNode.MAXIMUM) return this;

    // 분할될 왼쪽 트리
    const leftDatas = this.datas.slice(0, TreeNode.MINIMUN);
    const leftSubsets = this.subsets.slice(0, TreeNode.MINIMUN + 1);
    const leftNode = new TreeNode(leftDatas, leftSubsets,this.index);

    // 분할될 오른쪽 트리
    const rightDatas = this.datas.slice(TreeNode.MINIMUN + 1);
    const rightSubsets = this.subsets.slice(TreeNode.MINIMUN + 1);
    const rightNode = new TreeNode(rightDatas, rightSubsets);

    // 분할될 트리의 루트; this
    const rootDatas = [this.datas[TreeNode.MINIMUN]];
    const rootSubsets = [leftNode, rightNode];

    const rootNode = new TreeNode(rootDatas, rootSubsets);

    return rootNode;
  }
  
  contain(data) {
    const i = this.firstGE(data);
    if (data[i] === data) 
        return true;
     else
        return this.subsets[i].contain(data);

  }


  isEnd() {
    return this === TreeNode.END;
  }

  isLeaf() {
    return (!this.isEnd()) && // End 노드가 아니고
      (this.subsets.every((child) => child.isEnd())); // subset이 모두 END라면
  }
  toString() {
    return `{datas:${this.datas.join(
      ", "
    )}, subsets:${this.subsets.map((subset) => subset.toString()).join(", ")}}`;
  }
}

// i번 인덱스를 data로 채우고 나머지를 한 칸 뒤로
function shiftAndAdd(arr, index, data) {
  const frontPart = arr.slice(0, index);

  const backPart = arr.slice(index + 1);
  return frontPart.concat([data]).concat(backPart);
}

TreeNode.MINIMUN = 2;
TreeNode.MAXIMUM = 2 * TreeNode.MINIMUN;
TreeNode.NODE_COUNT = 0;
TreeNode.END = new (class extends TreeNode {
  constructor() {
    super(null, null);
  }
  add(data) {
    return new TreeNode([data]);
  }

  contain(data){
      return false;
  }

  toString() {
    return "{END}";
  }
})();

module.exports = BTree;
