class RedBlackTree {
  constructor() {
    this.root = TreeNode.END;
  }
  add(data, vizCallback) {
    this.root = this.root.add(data, vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
    vizCallback();
  }

  remove(data,vizCallback) {
    this.root = this.root.remove(data,vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
  }
  contain(data) {
    return this.root.contain(data);
  }
}

class TreeNode {
  getColor() {
    if (this.isBlack()) return "black";
    if (this.isRed()) return "red";
    else
      throw new Error(
        `레드 블랙 트리 노드의 색상은 항상 레드 | 블랙 중 하나여야 합니다. node :${this}, color : ${this.color}`
      );
  }

  constructor(
    data,
    color = TreeNode.RED,
    left = TreeNode.END,
    right = TreeNode.END,
    parent = null
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.color = color;
    this.parent = parent;
  }

  // data를 지운 서브트리를 반환
  remove(data,vizCallback) {
    // 미완성
    if (this.data == data) {
      if (this.isLeaf()) return TreeNode.END;
      else if (this.hasLeft()) {
        const rightmost = this.left.getRightmost();
        this.left = this.left.remove(rightmost.data,vizCallback);
        this.data = rightmost.data;
        this.left.parent = this;
      } else if (this.hasRight()) {
        const leftmost = this.right.getLeftmost();
        this.right = this.right.remove(rightmost.data,vizCallback);
        this.data = leftmost.data;
        this.right.parent = this;
      }
    } else if (data < this.data) {
      this.left = this.left.remove(data,vizCallback);
      this.left.parent = this;
    } else if (this.data < data) {
      this.right = this.right.remove(data,vizCallback);
      this.right.parent = this;
    }

    const fixed = this.fix();
    vizCallback();
    return fixed;
  }
  findNode(data) {
    if (data < this.data) return this.left.findNode(data);
    else if (this.data < data) {
      return this.right.findNode(data);
    } else {
      return this;
    }
  }

  getSibling(){
    if (this.parent?.left == this)
      return this.parent?.right;
    else if (this.parent?.right == this) {
      return this.parent?.left;
    } else 
      throw new Error(`${this}는 부모 노드가 없습니다`)
  
  }

  // x를 기준으로 p, s, l ,r 을 적절히 변형한 뒤 x 자리의 노드를 리턴
  fix() {
    if (this.parent == null)  // 부모노드가 없는 경우는 필요없음
      return this;
    if (this.isRed()) // x가 red인 경우는 필요없음
      return;
    let parent = this.parent;
    let sibling = this.getSibling();
    
    if (parent.isRed() && sibling.isBlack() &&  sibling.left.isBlack() && sibling.right.isBlack()) {
        sibling.color = TreeNode.RED;
        return this;
    } else if (sibling.isBlack() && sibling.right.isRed()) { // case *-2
        parent.rotateLeft();
        let parentColor = parent.color;
        let siblingColor = sibling.color;
        parent.color = siblingColor;
        sibling.color = parentColor;
        return parent;

    } else if (sibling.isBlack() && sibling.left.isRed() && sibling.right.isBlack()) {  // case *-3
      sibling.left.color = TreeNode.BLACK;
      sibling.color = TreeNode.RED
      parent.right = sibling.rotateRight();
      return this;
    } else if (parent.isBlack()) { // case 2-*
      if (sibling.isBlack() && sibling.left.isBlack() && sibling.right.isBlack()) { //case 2-1
        sibling.color = TreeNode.RED;
        return this;
      } else if (sibling.isRed() && sibling.left.isBlack() && sibling.right.isBlack()) {  //case 2-4
        parent.rotateLeft();
        return sibling;
      }
    }


  }

  // data를 추가한 서브트리를 반환
  add(data, vizCallback) {
    if (data < this.data) {
      this.left = this.left.add(data, vizCallback);
      this.left.parent = this;
    } else if (this.data < data) {
      this.right = this.right.add(data, vizCallback);
      this.right.parent = this;
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
          this.color = TreeNode.RED;
          this.left.color = TreeNode.BLACK;
          this.right.color = TreeNode.BLACK;
          return this;
        }
      } else if (this.left.right.isRed()) {
        if (this.right.isBlack()) {
          // LR 상태 & 형제가 BLACK
          const root = this.rotateLR();

          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.right.isRed()) {
          // LR 상태 & 형제가 RED
          this.color = TreeNode.RED;
          this.left.color = TreeNode.BLACK;
          this.right.color = TreeNode.BLACK;
          return this;
        }
      }
    } else if (this.right.isRed() && !this.right.isLeaf()) {
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
          this.color = TreeNode.RED;
          this.left.color = TreeNode.BLACK;
          this.right.color = TreeNode.BLACK;
          return this;
        }
      } else if (this.right.right.isRed()) {
        if (this.left.isBlack()) {
          // RR 상태 & 형제가 BLACK

          const root = this.rotateLeft();
          root.color = TreeNode.BLACK;
          root.left.color = TreeNode.RED;
          root.right.color = TreeNode.RED;
          return root;
        } else if (this.left.isRed()) {
          // RR 상태 & 형제가 RED
          this.color = TreeNode.RED;
          this.left.color = TreeNode.BLACK;
          this.right.color = TreeNode.BLACK;
          return this;
        }
      }
    }
    return this;
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

    left.parent = this.parent;
    this.parent = left;
    rightOfLeft.parent = this;

    return left;
  }

  rotateLeft() {
    let right = this.right;
    let leftOfRight = right.left;

    right.left = this;
    this.right = leftOfRight;

    right.parent = this.parent;
    this.parent = right;
    leftOfRight.parent = this;

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
    return this === TreeNode.END;
  }

  hasLeft() {
    return !this.left.isEnd();
  }

  hasRight() {
    return !this.right.isEnd();
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

TreeNode.END = new (class extends TreeNode {
  constructor() {
    super(null, TreeNode.BLACK);
    this.left = this;
    this.right = this;
  }
  toString() {
    return "END";
  }
  add(data) {
    return new TreeNode(data);
  }
  remove(data) {
    return this;
  }
  contain(data) {
    return false;
  }
})();

module.exports = RedBlackTree;
