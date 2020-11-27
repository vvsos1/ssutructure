const Tree = require("../tree/Tree");
const Color = require('../tree/Color');

class BTree extends Tree {
  constructor(minimum = 2) {
    super(TreeNode.END);
    TreeNode.MINIMUN = minimum;
    TreeNode.MAXIMUM = minimum * 2;
    TreeNode.NODE_COUNT = 0;
  }

  clear() {
    this.root = TreeNode.END;
    TreeNode.NODE_COUNT = 0;
  }

  remove(data,vizCallback) {
    if (!this.contain(data))
      return;

    this.root = this.root.remove(data,vizCallback);

    if((!this.root.isLeaf()) && (this.root.datas.length == 0) ) {
    // 자식이 있는데 datas가 없다면 빈 노드가 자식 1개만 가르키고 있는 경우이므로 자식을 자기 위치에 둠 
      this.root = this.root.subsets[0];
    } else if (this.root.isLeaf() && (this.root.datas.length == 0) ) {
      // 자식도 없고 datas 도 없으므로 root를 END 노드로 변경
      this.root = TreeNode.END;
    }
    vizCallback();
  }

  traversal(root = this.root, parentId = null) {
    if (root.isEnd()) return [];

    const id = Number.parseInt(root.index);

    const data = {
      id,
      data:root.datas[0],
      text: root.datas.join(", "),
      parentId,
      color: root.getColor(),
      textColor: Color.textDefault,
    };

    const childs = root.subsets
      .map((child) => this.traversal(child, id))
      .reduce((sum, current) => sum.concat(current), []);

    return [data].concat(childs);
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
    return Color.bTreeNode;
  }

  firstGE(data) {
    for (let i = 0; i < this.datas.length; i++)
      if (this.datas[i] >= data) return i;
    return this.datas.length;
  }

  // TODO: 1~15까지 넣은 뒤 16부터 안들어가는 버그 수정
  add(data, vizCallback) {
    const i = this.firstGE(data);
    if (this.datas[i] === data) return this;
    else if (this.isLeaf()) {
      this.datas.splice(i,0,data)
    } else {
      const prev = this.subsets[i];
      const subset = this.subsets[i].add(data, vizCallback);
      if (!prev.isEnd() && prev !== subset) {
        // 만약 subset이 분할되었다면
        // 분할된 subset은 datas가 1개, subsets가 2개(TreeNode.END까지 합치면 MAX+1개)
        this.datas.splice(i,0,subset.datas[0]);
        const subsets = subset.subsets.slice(0, 2);

        this.subsets.splice(i, 1, ...subsets);

        this.subsets = this.subsets.slice(0, TreeNode.MAXIMUM + 2);
      }
    }

    const fixed = this.fixExcess();
    vizCallback();
    return fixed;
  }

  // 자신이 넘치면 트리를 분할하고, 분할한 트리의 루트를 반환
  fixExcess() {
    if (this.datas.length <= TreeNode.MAXIMUM) return this;

    // 분할될 왼쪽 트리
    const leftDatas = this.datas.slice(0, TreeNode.MINIMUN);
    const leftSubsets = this.subsets.slice(0, TreeNode.MINIMUN + 1);
    const leftNode = new TreeNode(leftDatas, leftSubsets, this.index);

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

  remove(data, vizCallback) {
    // TODO : left의 rightmost 가져와서 값 바꾼 뒤 삭제하기
    const i = this.firstGE(data);
    if (this.datas[i] === data) {
      if (this.isLeaf()) {
        // case 2.b 데이터를 찾았고, 리프 노드인 경우
        this.datas = this.datas.filter((_, idx) => idx !== i); // datas에서 datas[i] 삭제
        return this;
      } else {
        // case 2.d 데이터를 찾았고, 리프 노드가 아닌경우
        // rightMost 노드(항상 Leaf)의 가장 큰 data와 this.datas[i]를 맞바꿈
        const rightMost = this.subsets[i].getRightmostNode();
        const rightMostValue = rightMost.datas.pop();
        rightMost.datas.push(this.datas[i]);
        this.datas[i] = rightMostValue;
        vizCallback();

        this.subsets[i] = this.subsets[i].remove(data, vizCallback);
      }
    } else {
      if (!this.isLeaf()) {
        // case 2.c 데이터를 못찾았고, 리프노드가 아닌 경우(리프 노드인 경우는 불가능-> 트리 전체에 해당 데이터가 없다는 뜻이므로)
        this.subsets[i] = this.subsets[i].remove(data, vizCallback);
        // this.fixShortage(i);
      }
    }
  
    const fixed = this.fixShortage(i,vizCallback);
    vizCallback();
    return fixed;
  }

  // subset[i]의 길이가 MIN보다 작은 것을 고치고 this를 반환
  fixShortage(i,vizCallback) {
    if (this.subsets[i].datas.length >= TreeNode.MINIMUN) return this;

    const leftSibling = this.subsets[i - 1];
    const rightSibling = this.subsets[i + 1];

    const target = this.subsets[i];
    
    if ((!leftSibling?.isEnd()) &&leftSibling?.datas?.length > TreeNode.MINIMUN) {
      // case 1 왼쪽 형제에서 노드 하나 가져옴

      // 왼쪽 형제의 가장 오른쪽 서브트리
      const rightSubset = leftSibling.subsets.splice(
        leftSibling.datas.length,
        1,
        TreeNode.END
      )[0];
      // 왼쪽 형제의 가장 오른쪽 데이터
      const rightData = leftSibling.datas.pop();

      // subset[i] 의 가장 왼쪽에 추가
      target.datas.unshift(this.datas[i-1]);
      this.datas.splice(i-1, 1, rightData);
      vizCallback();
      target.subsets.unshift(rightSubset);

    } else if ((!rightSibling.isEnd()) && rightSibling?.datas?.length > TreeNode.MINIMUN) {
      // case 2 오른쪽 형제에서 노드 하나 가져옴

      // 오른쪽 형제의 가장 왼쪽 서브트리
      const leftSubset = rightSibling.subsets.shift();
      rightSibling.subsets.push(TreeNode.END);
      // 오른쪽 형제의 가장 왼쪽 데이터
      const leftData = rightSibling.datas.shift();

      // subset[i] 의 가장 오른쪽에 추가
      target.datas.push(this.datas[i]);
      this.datas.splice(i, 1, leftData);
      vizCallback();
      target.subsets.splice(this.datas.length, 0, leftSubset);

    } else if(leftSibling !== null && leftSibling !== undefined && (!leftSibling?.isEnd())){
      // case 3-1 왼쪽 형제와 합침

      const newDatas = leftSibling.datas
        .concat(this.datas.splice(i-1, 1))
        .concat(target.datas);
      const newSubsets = leftSibling.subsets
        .filter((child) => !child.isEnd())
        .concat(target.subsets.filter((child) => !child.isEnd()));

      const newChild = new TreeNode(newDatas, newSubsets, leftSibling.index);
      this.subsets.splice(i - 1, 2, newChild);
      this.subsets.push(TreeNode.END);
    } else if(rightSibling !== null && rightSibling !== undefined && (!rightSibling?.isEnd())){
      // case 3-2 오른쪽 형제와 합침
    
      const newDatas = target.datas
      .concat(this.datas.splice(i, 1))
      .concat(rightSibling.datas);
      const newSubsets = target.subsets
        .filter((child) => !child.isEnd())
        .concat(rightSibling.subsets.filter((child) => !child.isEnd()));

      const newChild = new TreeNode(newDatas, newSubsets, rightSibling.index);
      this.subsets.splice(i, 2, newChild);  //subset[i]와 subset[i+1]을 제거하고 새로운 newChild를 삽입
      this.subsets.push(TreeNode.END);  // 위에서 2개 제거하고 1개 넣었으니 남은 1개를 END노드로 삽입
    }
    return this;
  }

  getRightmostNode() {
    if (!this.isLeaf()) return this.subsets[this.datas.length].getRightmost();
    else return this;
  }

  contain(data) {
    const i = this.firstGE(data);
    if (this.datas[i] === data) return true;
    else return this.subsets[i].contain(data);
  }

  isEnd() {
    return this === TreeNode.END;
  }

  isLeaf() {
    return (
      !this.isEnd() && // End 노드가 아니고
      this.subsets.every((child) => child.isEnd())
    ); // subset이 모두 END라면
  }
  toString() {
    return `{datas:${this.datas.join(
      ", "
    )}, subsets:${this.subsets.map((subset) => subset.toString()).join(", ")}}`;
  }
}

TreeNode.MINIMUN = 2;
TreeNode.MAXIMUM = 2 * TreeNode.MINIMUN;
TreeNode.NODE_COUNT = 0;
TreeNode.END = new (class extends TreeNode {
  constructor() {
    super(null, null, -1);
  }
  add(data) {
    return new TreeNode([data]);
  }

  contain(data) {
    return false;
  }

  remove(data) {
    return this;
  }

  toString() {
    return "{END}";
  }
})();

module.exports = BTree;
