class Queue {
  constructor() {
    this.item = [];
  }
  enqueue(item) {
    this.item.push(item);
  }
  dequeue() {
    return this.item.shift();
  }
	empty(){
		if(this.item.length==0){
			return true;
		}
		else{
			return false
		}
	}

	clear(){
		this.item = [];
	}
	size(){
		return this.item.length;
	}

}
module.exports = Queue;
