(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// 스택 아이템의 노드 색상
const stackItem = '#ff7f00';

// 스택 아이템의 텍스트 색상
const stackItemText = '#f5f6fa';

// 큐 아이템의 노드 색상
const queueItem = '#ff7f00';

// 큐 아이템의 텍스트 색상
const queueItemText = '#f5f6fa'

module.exports = {
    stackItem,
    stackItemText,

    queueItem,
    queueItemText
}
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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


  clear() {
    this.items = [];
  }
}
module.exports = Stack;




},{}],4:[function(require,module,exports){
const Stack = require("./Stack");
const Queue = require("./Queue");

const Color = require('./Color');

const items = document.querySelector('.stack-items');
const push = document.getElementById('push');
const pushbtn = document.getElementById('push-btn');
const popbtn = document.getElementById('pop-btn');
const clearbtn = document.getElementById('clear-btn');
const enqueue = document.getElementById('enqueue');
const enqueuebtn = document.getElementById('enqueue-btn');
const dequeuebtn = document.getElementById('dequeue-btn');
const stack_visible=document.getElementById('stack-container');
const queue_visible=document.getElementById('queue-container');

let stack = new Stack();

const stackradio=document.getElementById("Stack-radio");
const queueradio=document.getElementById("Queue-radio");




queueradio.onchange = (e) => {
	stack.clear();
	disableButtons(true);
        items.classList.add('stack-items--remove');
        setTimeout(() => {
        items.classList.remove('stack-items--remove');
        items.innerHTML = "";
        disableButtons(false);
        }, 500);

	stack = new Queue();
	stack_visible.classList.remove("block");
	stack_visible.classList.add("d-none");
	queue_visible.classList.remove("d-none");
	queue_visible.classList.add("block");
};


stackradio.onchange = (e) => {
	stack.clear();
        disableButtons(true);
        items.classList.add('stack-items--remove');
        setTimeout(() => {
        items.classList.remove('stack-items--remove');
        items.innerHTML = "";
        disableButtons(false);
        }, 500);

	stack = new Stack();
	stack_visible.classList.remove("d-none");
        stack_visible.classList.add("block");
        queue_visible.classList.remove("block");
        queue_visible.classList.add("d-none");

};



pushbtn.onclick = function() {
  stack_many = $('.stack-item').length;
  if(stack_many!=16){
  const itemName = Number(push.value);
	stack.push(itemName);

  disableButtons(true);
  // Create HTML element and push it to items
  const item = document.createElement('div');
  item.style.color = Color.stackItemText;
  item.style.backgroundColor = Color.stackItem;
  item.classList.add('stack-item');
  item.innerHTML = itemName;
  items.insertBefore(item, items.childNodes[0]);

  setTimeout(() => {
    disableButtons(false);
  },500)
  }
}


popbtn.onclick = function(){
  if(!stack.isEmpty()) {
    stack.pop();
    disableButtons(true);
    items.childNodes[0].classList.add('popAnimation');
    setTimeout(() => {
      items.removeChild(items.childNodes[0]);
      disableButtons(false);
    }, 500);
  }
}

enqueuebtn.onclick = function() {
  queue_many = $('.queue-item').length;
  if(queue_many!=16){
        const arrName = Number(enqueue.value);
        stack.enqueue(arrName);
	var l = stack.size();

  disableButtons(true);
  // Create HTML element and push it to items
  const arr = document.createElement('div');
  arr.style.color = Color.queueItemText;
  arr.style.backgroundColor = Color.queueItem;
  arr.classList.add('queue-item');
  arr.innerHTML = arrName;
  items.insertBefore(arr, items.childNodes[l]);

  setTimeout(() => {
    disableButtons(false);
  },500)
}

dequeuebtn.onclick = function(){
	if(!stack.empty()){
		stack.dequeue();
		disableButtons(true);
		items.childNodes[0].classList.add('popAnimation');
		setTimeout(() => {
			items.removeChild(items.childNodes[0]);
			disableButtons(false);
		}, 500);
	}
}
}


		

clearbtn.onclick = function(){
    stack.clear();  
    disableButtons(true);
    items.classList.add('stack-items--remove');
    items.classList.add('queue-items--remove');
    setTimeout(() => {
      items.classList.remove('stack-items--remove');
      items.classList.remove('queue-items--remove');
      items.innerHTML = "";
      disableButtons(false);
    }, 500);
}



// Functions
function disableButtons(value = true) {
	stackradio.disabled = value;
	queueradio.disabled = value;
	clearbtn.disabled = value;
	push.disabled = value;
	enqueue.disabled = value;
}

},{"./Color":1,"./Queue":2,"./Stack":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9Db2xvci5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcclxuY29uc3Qgc3RhY2tJdGVtID0gJyNmZjdmMDAnO1xyXG5cclxuLy8g7Iqk7YOdIOyVhOydtO2FnOydmCDthY3siqTtirgg7IOJ7IOBXHJcbmNvbnN0IHN0YWNrSXRlbVRleHQgPSAnI2Y1ZjZmYSc7XHJcblxyXG4vLyDtgZAg7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcclxuY29uc3QgcXVldWVJdGVtID0gJyNmZjdmMDAnO1xyXG5cclxuLy8g7YGQIOyVhOydtO2FnOydmCDthY3siqTtirgg7IOJ7IOBXHJcbmNvbnN0IHF1ZXVlSXRlbVRleHQgPSAnI2Y1ZjZmYSdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc3RhY2tJdGVtLFxyXG4gICAgc3RhY2tJdGVtVGV4dCxcclxuXHJcbiAgICBxdWV1ZUl0ZW0sXHJcbiAgICBxdWV1ZUl0ZW1UZXh0XHJcbn0iLCJjbGFzcyBRdWV1ZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLml0ZW0gPSBbXTtcclxuICB9XHJcbiAgZW5xdWV1ZShpdGVtKSB7XHJcbiAgICB0aGlzLml0ZW0ucHVzaChpdGVtKTtcclxuICB9XHJcbiAgZGVxdWV1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW0uc2hpZnQoKTtcclxuICB9XHJcblx0ZW1wdHkoKXtcclxuXHRcdGlmKHRoaXMuaXRlbS5sZW5ndGg9PTApe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2xlYXIoKXtcclxuXHRcdHRoaXMuaXRlbSA9IFtdO1xyXG5cdH1cclxuXHRzaXplKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5pdGVtLmxlbmd0aDtcclxuXHR9XHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XHJcbiIsImNsYXNzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICB9XHJcblxyXG4gIHB1c2goaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gIH1cclxuXHJcbiAgcG9wKCkgeyBcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PSAwKSBcclxuICAgICAgcmV0dXJuIFwiRW1wdHlcIjsgXHJcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5wb3AoKTsgXHJcbiAgfVxyXG5cclxuICBwZWVrKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTsgXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID09IDA7XHJcbiAgfVxyXG5cclxuICBnZXRTaXplKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xyXG5cclxuXHJcblxyXG4iLCJjb25zdCBTdGFjayA9IHJlcXVpcmUoXCIuL1N0YWNrXCIpO1xyXG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoXCIuL1F1ZXVlXCIpO1xyXG5cclxuY29uc3QgQ29sb3IgPSByZXF1aXJlKCcuL0NvbG9yJyk7XHJcblxyXG5jb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFjay1pdGVtcycpO1xyXG5jb25zdCBwdXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gnKTtcclxuY29uc3QgcHVzaGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoLWJ0bicpO1xyXG5jb25zdCBwb3BidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wLWJ0bicpO1xyXG5jb25zdCBjbGVhcmJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKTtcclxuY29uc3QgZW5xdWV1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlJyk7XHJcbmNvbnN0IGVucXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZS1idG4nKTtcclxuY29uc3QgZGVxdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXF1ZXVlLWJ0bicpO1xyXG5jb25zdCBzdGFja192aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFjay1jb250YWluZXInKTtcclxuY29uc3QgcXVldWVfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVldWUtY29udGFpbmVyJyk7XHJcblxyXG5sZXQgc3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHJcbmNvbnN0IHN0YWNrcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTdGFjay1yYWRpb1wiKTtcclxuY29uc3QgcXVldWVyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlF1ZXVlLXJhZGlvXCIpO1xyXG5cclxuXHJcblxyXG5cclxucXVldWVyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XHJcblx0c3RhY2suY2xlYXIoKTtcclxuXHRkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG5cdHN0YWNrID0gbmV3IFF1ZXVlKCk7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcclxuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxufTtcclxuXHJcblxyXG5zdGFja3JhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcclxuXHRzdGFjay5jbGVhcigpO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcblx0c3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XHJcbiAgICAgICAgc3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cclxufTtcclxuXHJcblxyXG5cclxucHVzaGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgc3RhY2tfbWFueSA9ICQoJy5zdGFjay1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHN0YWNrX21hbnkhPTE2KXtcclxuICBjb25zdCBpdGVtTmFtZSA9IE51bWJlcihwdXNoLnZhbHVlKTtcclxuXHRzdGFjay5wdXNoKGl0ZW1OYW1lKTtcclxuXHJcbiAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgLy8gQ3JlYXRlIEhUTUwgZWxlbWVudCBhbmQgcHVzaCBpdCB0byBpdGVtc1xyXG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBpdGVtLnN0eWxlLmNvbG9yID0gQ29sb3Iuc3RhY2tJdGVtVGV4dDtcclxuICBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IENvbG9yLnN0YWNrSXRlbTtcclxuICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW0nKTtcclxuICBpdGVtLmlubmVySFRNTCA9IGl0ZW1OYW1lO1xyXG4gIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtLCBpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbiAgfVxyXG59XHJcblxyXG5cclxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcclxuICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgcXVldWVfbWFueSA9ICQoJy5xdWV1ZS1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHF1ZXVlX21hbnkhPTE2KXtcclxuICAgICAgICBjb25zdCBhcnJOYW1lID0gTnVtYmVyKGVucXVldWUudmFsdWUpO1xyXG4gICAgICAgIHN0YWNrLmVucXVldWUoYXJyTmFtZSk7XHJcblx0dmFyIGwgPSBzdGFjay5zaXplKCk7XHJcblxyXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcclxuICBjb25zdCBhcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBhcnIuc3R5bGUuY29sb3IgPSBDb2xvci5xdWV1ZUl0ZW1UZXh0O1xyXG4gIGFyci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5xdWV1ZUl0ZW07XHJcbiAgYXJyLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW0nKTtcclxuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcclxuICBpdGVtcy5pbnNlcnRCZWZvcmUoYXJyLCBpdGVtcy5jaGlsZE5vZGVzW2xdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbn1cclxuXHJcbmRlcXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0aWYoIXN0YWNrLmVtcHR5KCkpe1xyXG5cdFx0c3RhY2suZGVxdWV1ZSgpO1xyXG5cdFx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcblx0XHRpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cdFx0XHRkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG59XHJcblxyXG5cclxuXHRcdFxyXG5cclxuY2xlYXJidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGFjay5jbGVhcigpOyAgXHJcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XHJcbn1cclxuIl19
