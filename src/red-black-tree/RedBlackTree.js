const Tree = require('../tree/Tree');

class RedBlackTree extends Tree{
  constructor() {
    super(TreeNode.END);
  }
  clear(){
    this.root = TreeNode.END;
  }

  add(data, vizCallback) {
    this.root = this.root.add(data, vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
    vizCallback();
  }

  remove(data, vizCallback) {
    this.root = this.root.remove(data, vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
    vizCallback();
  }
}

let isLeafRed;

class TreeNode {
  constructor(
    data,
    color = TreeNode.RED,
    left = TreeNode.END,
    right = TreeNode.END
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.color = color;
  }

  getColor() {
    if (this.isBlack()) return "black";
    else if (this.isRed()) return "red";
    else throw `unknown color ${this.color}`
  }

  // data를 지운 서브트리를 반환
  remove(data, vizCallback) {
    let isXLeft;

    // 미완성
    if (this.data == data) {
      if (this.hasLeft()){
        // data를 찾았고, left가 있는 경우
        const rightMost = this.left.getRightmost();
        // left의 rightmost와 data swap
        TreeNode.swapData(this,rightMost);
        this.left = this.left.remove(data,vizCallback);
        // fix로 고칠 노드를 this.left로 설정
        isXLeft = true;
      } else if (this.hasRight()){
        // data를 찾았고, left가 있는 경우
        const leftMost = this.right.getLeftmost();
        // left의 rightmost와 data swap
        TreeNode.swapData(this,leftMost);
        this.right = this.right.remove(data,vizCallback);
        // fix로 고칠 노드를 this.right로 설정
        isXLeft = false;
      } else {
        // data를 찾았고, leaf 노드인 경우
        if (this.isRed()) isLeafRed = 1;
        return TreeNode.END;
      }
    } else if (data < this.data) {
      // data가 left에 있는 경우
      this.left = this.left.remove(data,vizCallback);
      // fix로 고칠 노드를 this.left로 설정
      isXLeft = true;
    } else if (this.data < data) {
      // data가 right에 있는 경우
      this.right = this.right.remove(data,vizCallback);
      // fix로 고칠 노드를 this.right로 설정
      isXLeft = false;
    }

    const fixed = this.fix(isXLeft);
    // vizCallback();
    return fixed;
  }

    // TODO : 1~10까지 차례로 넣은 상태에서 10을 삭제 시 8도 색상이 검정으로 바뀜.
  // parent 노드 기준으로 x, s, l, r 노드의 균형을 맞춘 뒤 parent 자리 노드를 반환
  fix(isXLeft) {
    //isXLeft:Boolean
    let x,
      p = this,
      s,
      l,
      r;

    // 빨간색 리프노드일 때
    if (isLeafRed) {
      return this;
    }

    // x가 p의 left냐 right냐에 따라 값을 할당
    if (isXLeft) {
      x = p.left;
      s = p.right;
      l = s.left;
      r = s.right;

      // 애초에 x가 black이 아니라면 문제가 발생하지 않음
      if (!x.isBlack()) return this;
      
      if (s.isEnd())
        return this;

      // x는 항상 black 이므로 조건문에서 x.isBlack() 생략
      // x가 p의 left일 때의 코드
      if (s.isBlack() && l.isBlack() && r.isBlack()) {
        // case *-1
        p.setColorBlack();
        s.setColorRed();
        return p;
      } else if (s.isBlack() && r.isRed()) {
        // case *-2
        TreeNode.swapColor(p, s);
        r.setColorBlack();
        p = p.rotateLeft();
        return p;
      } else if (s.isBlack() && l.isRed() && r.isBlack()) {
        // case *-3
        TreeNode.swapColor(s, l);
        s = s.rotateRight();
        p.right = s;
        l = s.left;
        r = s.right;
        // case *-2의 방법 적용
        TreeNode.swapColor(p, s);
        r.setColorBlack();
        p = p.rotateLeft();
        return p;
      }else if (s.isRed() && l.isBlack() && r.isBlack()) {
        // case 2-4
        TreeNode.swapColor(p,s);
        p = p.rotateLeft();

        p.left = p.left.fix(true);
      
        return p;
      } else {
        return this;
      }
    } else { 
      x = p.right;
      s = p.left;
      l = s.right;
      r = s.left;

      // 애초에 x가 black이 아니라면 문제가 발생하지 않음
      if (!x.isBlack()) return this;
      
      if (s.isEnd())
        return this;

      // x는 항상 black 이므로 조건문에서 x.isBlack() 생략
      // x가 p의 left일 때의 코드
      if (s.isBlack() && l.isBlack() && r.isBlack()) {
        // case *-1
        p.setColorBlack();
        s.setColorBlack();
        return p;
      } else if (s.isBlack() && r.isRed()) {
        // case *-2
        TreeNode.swapColor(p, s);
        r.setColorBlack();
        p = p.rotateRight();
        return p;
      } else if (s.isBlack() && l.isRed() && r.isBlack()) {
        // case *-3
        TreeNode.swapColor(s, l);
        s = s.rotateLeft();
        p.left = s;
        l = s.right;
        r = s.left;
        // case *-2의 방법 적용
        TreeNode.swapColor(p, s);
        r.setColorBlack();
        p = p.rotateRight();
        return p;
      }else if (s.isRed() && l.isBlack() && r.isBlack()) {
        // case 2-4
        TreeNode.swapColor(p,s);
        p = p.rotateRight();

        p.right = p.right.fix(false);
      
        return p;
      } else {
        return this;
      }
    }
  }


  // data를 추가한 서브트리를 반환
  add(data, vizCallback) {
    if (data < this.data) {
      this.left = this.left.add(data, vizCallback);
    } else if (this.data < data) {
      this.right = this.right.add(data, vizCallback);
    }
    const fixed = this.fixColor();
    vizCallback();
    return fixed;
  }

  fixColor() {
    if (this.left.isRed() && !this.left.isLeaf()) {
      if (this.left.left.isRed()) {
        if (this.right.isBlack()) {
          // LL 상태 & 형제가  BLACK
          const root = this.rotateRight();
          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.right.isRed()) {
          // LL 상태 & 형제가 RED
          this.recoloring();
          return this;
        }
      }
      if (this.left.right.isRed()) {
        if (this.right.isBlack()) {
          // LR 상태 & 형제가 BLACK
          const root = this.rotateLR();

          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.right.isRed()) {
          // LR 상태 & 형제가 RED
          this.recoloring();
          return this;
        }
      }
    }
    if (this.right.isRed() && (!this.right.isLeaf())) {
      if (this.right.left.isRed()) {
        if (this.left.isBlack()) {
          // RL 상태 & 형제가  BLACK
          const root = this.rotateRL();

          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.left.isRed()) {
          // RL 상태 & 형제가 RED
          this.recoloring();
          return this;
        }
      }
      if (this.right.right.isRed()) {
        if (this.left.isBlack()) {
          // RR 상태 & 형제가 BLACK

          const root = this.rotateLeft();
          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.left.isRed()) {
          // RR 상태 & 형제가 RED
          this.recoloring();
          return this;
        }
      }
    }
    return this;
  }

  recoloring(){
    this.setColorRed();
    this.left.setColorBlack();
    this.right.setColorBlack();
  }

  contain(data) {
    if (this.data == data) return true;
    else if (data < this.data) return this.left.contain(data);
    else if (this.data < data) return this.right.contain(data);
  }
  rotateRight() {
    let left = this.left;
    let rightOfLeft = left.right;

    left.right = this;
    this.left = rightOfLeft;

    return left;
  }

  rotateLeft() {
    let right = this.right;
    let leftOfRight = right.left;

    right.left = this;
    this.right = leftOfRight;

    return right;
  }

  rotateRL() {
    this.right = this.right.rotateRight();

    const root = this.rotateLeft();

    return root;
  }

  rotateLR() {
    this.left = this.left.rotateLeft();

    const root = this.rotateRight();

    return root;
  }

  getLeftmost() {
    if (this.left.isEnd()) return this;
    else return this.left.getLeftmost();
  }

  getRightmost() {
    if (this.right.isEnd()) return this;
    else return this.right.getLeftmost();
  }

  isEnd() {
    return false;
  }

  hasLeft() {
    return !this.left.isEnd();
  }

  hasRight() {
    return !this.right.isEnd();
  }

  setColorRed() {
    this.color = TreeNode.RED;
  }

  setColorBlack() {
    this.color = TreeNode.BLACK;
  }

  isRed() {
    return this.color === TreeNode.RED;
  }
  isBlack() {
    return this.color === TreeNode.BLACK;
  }

  isLeaf() {
    return this.left.isEnd() && this.right.isEnd();
  }
  toString() {
    return this.data;
  }
}

TreeNode.RED = Symbol.for("RED");
TreeNode.BLACK = Symbol.for("BLACK");

TreeNode.swapColor = (node1, node2) => {
  const { color: color1 } = node1;
  const { color: color2 } = node2;
  node1.color = color2;
  node2.color = color1;
};

TreeNode.swapData = (node1, node2) => {
  const { data: data1 } = node1;
  const { data: data2 } = node2;
  node1.data = data2;
  node2.data = data1;
};

TreeNode.END = new (class extends TreeNode {
  constructor() {
    super(null, TreeNode.BLACK, null, null);
  }

  add(data) {
    return new TreeNode(data);
  }

  remove(_) {
    return this;
  }

  contain(_) {
    return false;
  }
  isEnd() {
    return true;
  }
})();

module.exports = RedBlackTree;
