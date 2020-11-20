class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() { 
    if (this.items.length == 0) 
      return "Empty"; 
    return this.items.pop(); 
  }

  peek() {
    return this.items[this.items.length - 1]; 
  }

  isEmpty() {
    return this.items.length == 0;
  }

  getSize() {
    return this.items.length;
  }

  swap() {
    if(this.items.length > 1) {
      let temp = this.items[this.items.length - 1];
      this.items[this.items.length - 1] = this.items[this.items.length - 2];
      this.items[this.items.length - 2] = temp;
    }
  }

  clear() {
    this.items = [];
  }
}
module.exports = Stack;



