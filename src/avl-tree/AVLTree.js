class AVLTree {
  constructor() {
    this.root = AVLTreeNode.END;
  }
  add(data, vizCallback) {
    this.root = this.root.add(data, vizCallback);
    vizCallback();
  }
  remove(data, vizCallback) {
    this.root = this.root.remove(data, vizCallback);
    vizCallback();
  }
  height() {
    if (this.root != null) return this.root.height;
    else return 0;
  }
  contain(data) {
    if (this.root != null) return this.root.contain(data);
    else return false;
  }
}

class AVLTreeNode {
  static END = new (class extends AVLTreeNode {
    constructor() {
      super();
      this.data = null;
      this.left = this;
      this.right = this;
    }
    get height() {
      return 0;
    }
    get balanceFactor() {
      return 0;
    }
    remove(data) {
      return this;
    }
    add(data) {
      return new AVLTreeNode(data);
    }
    contain(data) {
      return false;
    }
    toString() {
      return "END";
    }
  })();

  constructor(data, left = AVLTreeNode.END, right = AVLTreeNode.END) {
    this.data = data;
    this.left = left;
    this.right = right;
  }

  get height() {
    return 1 + Math.max(this.left.height, this.right.height);
  }

  get balanceFactor() {
    return this.left.height - this.right.height;
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
    return this.rotateLeft();
  }

  rotateLR() {
    this.left = this.left.rotateLeft();
    return this.rotateRight();
  }

  getRightmost() {
    if (this.hasRight()) return this.right.getRightmost();
    else return this.data;
  }

  getLeftmost() {
    if (this.hasLeft()) return this.left.getLeftmost();
    else return this.data;
  }

  contain(data) {
    if (this.data == data) return true;
    else if (data < this.data) return this.left.contain(data);
    else if (this.data < data) return this.right.contain(data);
  }

  remove(data, vizCallback) {
    if (this.data == data) {
      if (this.isLeaf()) return AVLTreeNode.END;

      if (this.hasLeft()) {
        const rightmost = this.left.getRightmost();
        this.left = this.left.remove(rightmost, vizCallback);
        this.data = rightmost;
      } else if (this.hasRight()) {
        const leftmost = this.right.getLeftmost();
        this.right = this.right.remove(leftmost, vizCallback);
        this.data = leftmost;
      }
    } else if (data < this.data)
      this.left = this.left.remove(data, vizCallback);
    else if (this.data < data)
      this.right = this.right.remove(data, vizCallback);

    const fixed = this.fixBalance();
    vizCallback();
    return fixed;
  }

  add(data, vizCallback) {
    if (data < this.data) this.left = this.left.add(data, vizCallback);
    else if (this.data < data) this.right = this.right.add(data, vizCallback);
    const fixed = this.fixBalance();
    vizCallback();
    return fixed;
  }

  fixBalance() {
    if (!(this.balanceFactor == 2 || this.balanceFactor == -2)) return this;

    if (this.balanceFactor == 2) {
      if (this.left.balanceFactor > 0)
        // LL 상태
        return this.rotateRight();
      // LR 상태
      else return this.rotateLR();
    } else this.balanceFactor == -2;
    if (this.right.balanceFactor < 0)
      //RR 상태
      return this.rotateLeft();
    // RL 상태
    else return this.rotateRL();
  }

  isEnd() {
    return this === AVLTreeNode.END;
  }

  isLeaf() {
    return !this.hasLeft() && !this.hasRight();
  }

  hasLeft() {
    return !this.left.isEnd();
  }

  hasRight() {
    return !this.right.isEnd();
  }

  toString() {
    return `{data:${
      this.data
    }, left:${this.left.toString()}, right:${this.right.toString()}}`;
  }
}

module.exports = AVLTree;
