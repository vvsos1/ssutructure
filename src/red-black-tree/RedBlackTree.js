class RedBlackTree {
  constructor() {
    this.root = new EndNode();
  }
  add(data, vizCallback) {
    this.root = this.root.add(data, vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
    vizCallback();
  }

  remove(data, vizCallback) {
    this.root = this.root.remove(data, vizCallback);
    this.root.color = TreeNode.BLACK; // Root는 항상 Black
  }
  contain(data) {
    return this.root.contain(data);
  }
  toString() {
    return "END";
  }
}

class TreeNode {
  constructor(
    data,
    color = TreeNode.RED,
    left = new EndNode(this),
    right = new EndNode(this)
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.color = color;
    this.parent = null;
  }

  getColor() {
    if (this.isBlack()) return "black";
    if (this.isRed()) return "red";
    else
      throw new Error(
        `레드 블랙 트리 노드의 색상은 항상 레드 | 블랙 중 하나여야 합니다. node :${this}, color : ${this.color}`
      );
  }

  replaceNode(child) {
    // 앞에서 this의 부모가 null 이 되는 경우를 delete case에 오지 않게 미리 처리해주면 된다
    child.parent = this.parent;
    if (this.parent.left === this) {
      this.parent.left = child;
    } else if (this.parent.right === this) {
      this.parent.right = child;
    }
  }

  deleteOneChild() {
    // 선제조건 : n이 최대 하나의 non null 자식을 갖고 있음
    if (!this.left.isEnd() && !this.right.isEnd())
      throw new Error(`deleOneChild : ${this}`);

    const child = this.right.isEnd() ? n.left : n.right;

    this.replaceNode(child);
    if (this.isBlack()) {
      if (child.isRed()) {
        child.color = TreeNode.BLACK;
      } else {
        const newChild =  child.deleteCase1();
        if (!this.left.isEnd())
          this.left = newChild;
        else
          this.right = newChild;

      }
    }
  }

  deleteCase1() {
    if (this.parent != null) return this.deleteCase2();
  }

  deleteCase2() {
    const sibling = this.getSibling();
    // const parentOfParent = this.parent.parent;
    if (sibling.isRed()) {
      this.parent.color = TreeNode.RED;
      sibling.color = TreeNode.BLACK;
      if (this == this.parent.left) {
        this.parent = this.parent.rotateLeft();
      } else {
        this.parent = this.parent.rotateRight();
      }
    }
    return this.deleteCase3();
  }

  deleteCase3() {
    const sibling = this.getSibling();

    if (
      this.parent.isBlack() &&
      sibling.isBlack() &&
      sibling.left.isBlack() &&
      sibling.right.isBlack()
    ) {
      sibling.color = TreeNode.RED;
      this.parent = this.parent.deleteCase1();
      return this;
    } else {
      return this.deleteCase4();
    }
  }

  deleteCase4() {
    const sibling = this.getSibling();

    if (
      this.parent.isRed() &&
      sibling.isBlack() &&
      sibling.left.isBlack() &&
      sibling.right.isBlack()
    ) {
      sibling.color = TreeNode.RED;
      this.parent.color = TreeNode.BLACK;
    } else {
      return this.deleteCase5();
    }
  }

  deleteCase5() {
    const sibling = this.getSibling();
    const isSiblingRight = this.parent.left === this;
    
    let newSibling;

    if (sibling.isBlack()) {
      if ((this === this.parent.left) && 
      sibling.right.isBlack() &&
      sibling.left.isRed()) {
        sibling.color = TreeNode.RED;
        sibling.left.color = TreeNode.BLACK;
        newSibling = sibling.rotateRight();
      } else if ((this === this.parent.right) && 
      sibling.left.isBlack() &&
      sibling.right.isRed()) {
        sibling.color = TreeNode.RED;
        sibling.right.color = TreeNode.BLACK;
        newSibling = sibling.rotateLeft();
      }
    }
    if(isSiblingRight)
      this.parent.right = newSibling;
    else
      this.parent.left = newSibling;

    return this.deleteCase6();
  }

  deleteCase6() {
    const sibling = this.getSibling();

    sibling.color = this.parent.color;
    this.parent.color = TreeNode.BLACK;

    if (this === this.parent.left ) {
      sibling.right.color = TreeNode.BLACK;
      this.parent = this.parent.rotateLeft();
    } else {
      sibling.left.color = TreeNode.BLACK;
      this.parent = this.parent.rotateRight();
    }
    return this;
  }



  // data를 지운 서브트리를 반환
  remove(data, vizCallback) {
    // 미완성
    if (data < this.data) {
      this.left = this.left.remove(data, vizCallback);
      this.left.parent = this;
    } else if (this.data < data) {
      this.right = this.right.remove(data, vizCallback);
      this.right.parent = this;
    } else {
      if (this.hasLeft()) {
        const rightMost = this.left.getRightmost();
        // 서로 값 변경
        const rightMostData = rightMost.data;
        rightMost.data = this.data;
        this.data = rightMostData;
        vizCallback();
       rightMost.parent =  rightMost.parent.deleteOneChild();

      } else if (this.hasRight()) {
        const leftMost = this.right.getLeftmost();
        // 서로 값 변경
        const leftMostData = leftMost.data;
        leftMost.data = this.data;
        this.data = leftMostData;
        vizCallback();
       leftMost.parent =  leftMost.parent.deleteOneChild();
      }
    }
    vizCallback();
    return this;
  }

  

  getSibling() {
    if (this.parent == null) {
      console.log(`getSibling: ${this} 는 부모 노드가 없습니다`);
      return;
    }
    const { left, right } = this.parent;

    if (left === this) return right;
    else if (right === this) return left;
    else
      throw new Error(
        `객체 무결성 손상; this : ${this}, parent.left : ${left}, parent.right " ${right}`
      );
  }

  // x를 기준으로 p, s, l ,r 을 적절히 변형한 뒤 x 자리의 노드를 리턴
  fix() {
    if (this.parent == null)
      // 부모노드가 없는 경우는 필요없음
      return this;
    if (this.isRed())
      // x가 red인 경우는 필요없음
      return;
    let parent = this.parent;
    let sibling = this.getSibling();

    if (
      parent.isRed() &&
      sibling.isBlack() &&
      sibling.left.isBlack() &&
      sibling.right.isBlack()
    ) {
      sibling.color = TreeNode.RED;
      return this;
    } else if (sibling.isBlack() && sibling.right.isRed()) {
      // case *-2
      parent.rotateLeft();
      let parentColor = parent.color;
      let siblingColor = sibling.color;
      parent.color = siblingColor;
      sibling.color = parentColor;
      return parent;
    } else if (
      sibling.isBlack() &&
      sibling.left.isRed() &&
      sibling.right.isBlack()
    ) {
      // case *-3
      sibling.left.color = TreeNode.BLACK;
      sibling.color = TreeNode.RED;
      parent.right = sibling.rotateRight();
      return this;
    } else if (parent.isBlack()) {
      // case 2-*
      if (
        sibling.isBlack() &&
        sibling.left.isBlack() &&
        sibling.right.isBlack()
      ) {
        //case 2-1
        sibling.color = TreeNode.RED;
        return this;
      } else if (
        sibling.isRed() &&
        sibling.left.isBlack() &&
        sibling.right.isBlack()
      ) {
        //case 2-4
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
    return false;
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

class EndNode extends TreeNode {
  constructor(parent) {
    super(null, TreeNode.BLACK, null, null);
    this.parent = parent;
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
}

module.exports = RedBlackTree;
