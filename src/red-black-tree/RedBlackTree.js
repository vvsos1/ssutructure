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

  remove(data) {
    return;
    this.root = this.root.remove(data);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
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
    right = TreeNode.END
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.color = color;
  }

  // data를 지운 서브트리를 반환
  remove(data) {
    // 미완성
    if (this.data == data) {
      if (this.isLeaf()) return TreeNode.END;
      else if (this.hasLeft()) {
        const rightmost = this.left.getRightmost();
        this.left = this.left.remove(rightmost);
        this.data = rightmost;
        return this;
      } else if (this.hasRight()) {
        const leftmost = this.right.getLeftmost();
        this.right = this.right.remove(rightmost);
        this.data = leftmost;
        return this;
      }
    } else if (data < this.data) {
      this.left = this.left.remove(data);
      return this;
    } else if (this.data < data) {
      this.right = this.right.remove(data);
      return this;
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
    if (this.left.isEnd()) return this.data;
    else return this.left.getLeftmost();
  }

  getRightmost() {
    if (this.right.isEnd()) return this.data;
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
