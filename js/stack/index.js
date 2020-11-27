(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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




},{}],3:[function(require,module,exports){
const Stack = require("./Stack");
const Queue = require("./Queue");
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

},{"./Queue":1,"./Stack":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgUXVldWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW0gPSBbXTtcbiAgfVxuICBlbnF1ZXVlKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW0ucHVzaChpdGVtKTtcbiAgfVxuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW0uc2hpZnQoKTtcbiAgfVxuXHRlbXB0eSgpe1xuXHRcdGlmKHRoaXMuaXRlbS5sZW5ndGg9PTApe1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR9XG5cdH1cblxuXHRjbGVhcigpe1xuXHRcdHRoaXMuaXRlbSA9IFtdO1xuXHR9XG5cdHNpemUoKXtcblx0XHRyZXR1cm4gdGhpcy5pdGVtLmxlbmd0aDtcblx0fVxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuIiwiY2xhc3MgU3RhY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH1cblxuICBwdXNoKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gIH1cblxuICBwb3AoKSB7IFxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PSAwKSBcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxuICAgIHJldHVybiB0aGlzLml0ZW1zLnBvcCgpOyBcbiAgfVxuXG4gIHBlZWsoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTsgXG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xuICB9XG5cbiAgZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gIH1cblxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcblxuXG5cbiIsImNvbnN0IFN0YWNrID0gcmVxdWlyZShcIi4vU3RhY2tcIik7XG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoXCIuL1F1ZXVlXCIpO1xuY29uc3QgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhY2staXRlbXMnKTtcbmNvbnN0IHB1c2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaCcpO1xuY29uc3QgcHVzaGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoLWJ0bicpO1xuY29uc3QgcG9wYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcC1idG4nKTtcbmNvbnN0IGNsZWFyYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyLWJ0bicpO1xuY29uc3QgZW5xdWV1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlJyk7XG5jb25zdCBlbnF1ZXVlYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVldWUtYnRuJyk7XG5jb25zdCBkZXF1ZXVlYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlcXVldWUtYnRuJyk7XG5jb25zdCBzdGFja192aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFjay1jb250YWluZXInKTtcbmNvbnN0IHF1ZXVlX3Zpc2libGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXVlLWNvbnRhaW5lcicpO1xuXG5sZXQgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuY29uc3Qgc3RhY2tyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlN0YWNrLXJhZGlvXCIpO1xuY29uc3QgcXVldWVyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlF1ZXVlLXJhZGlvXCIpO1xuXG5cblxuXG5xdWV1ZXJhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcblx0c3RhY2suY2xlYXIoKTtcblx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICAgICAgICB9LCA1MDApO1xuXG5cdHN0YWNrID0gbmV3IFF1ZXVlKCk7XG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJkLW5vbmVcIik7XG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcblx0cXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG59O1xuXG5cbnN0YWNrcmFkaW8ub25jaGFuZ2UgPSAoZSkgPT4ge1xuXHRzdGFjay5jbGVhcigpO1xuICAgICAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gICAgICAgIH0sIDUwMCk7XG5cblx0c3RhY2sgPSBuZXcgU3RhY2soKTtcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiZC1ub25lXCIpO1xuICAgICAgICBzdGFja192aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcblxufTtcblxuXG5cbnB1c2hidG4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBzdGFja19tYW55ID0gJCgnLnN0YWNrLWl0ZW0nKS5sZW5ndGg7XG4gIGlmKHN0YWNrX21hbnkhPTE2KXtcbiAgY29uc3QgaXRlbU5hbWUgPSBOdW1iZXIocHVzaC52YWx1ZSk7XG5cdHN0YWNrLnB1c2goaXRlbU5hbWUpO1xuXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiBcbiAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtJyk7XG4gIGl0ZW0uaW5uZXJIVE1MID0gaXRlbU5hbWU7XG4gIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtLCBpdGVtcy5jaGlsZE5vZGVzWzBdKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gIH0sNTAwKVxuICB9XG59XG5cblxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuICBpZighc3RhY2suaXNFbXB0eSgpKSB7XG4gICAgc3RhY2sucG9wKCk7XG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gICAgaXRlbXMuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKCdwb3BBbmltYXRpb24nKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICAgIH0sIDUwMCk7XG4gIH1cbn1cblxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIHF1ZXVlX21hbnkgPSAkKCcucXVldWUtaXRlbScpLmxlbmd0aDtcbiAgaWYocXVldWVfbWFueSE9MTYpe1xuICAgICAgICBjb25zdCBhcnJOYW1lID0gTnVtYmVyKGVucXVldWUudmFsdWUpO1xuICAgICAgICBzdGFjay5lbnF1ZXVlKGFyck5hbWUpO1xuXHR2YXIgbCA9IHN0YWNrLnNpemUoKTtcblxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgLy8gQ3JlYXRlIEhUTUwgZWxlbWVudCBhbmQgcHVzaCBpdCB0byBpdGVtc1xuICBjb25zdCBhcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICBhcnIuY2xhc3NMaXN0LmFkZCgncXVldWUtaXRlbScpO1xuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGFyciwgaXRlbXMuY2hpbGROb2Rlc1tsXSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICB9LDUwMClcbn1cblxuZGVxdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcblx0aWYoIXN0YWNrLmVtcHR5KCkpe1xuXHRcdHN0YWNrLmRlcXVldWUoKTtcblx0XHRkaXNhYmxlQnV0dG9ucyh0cnVlKTtcblx0XHRpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aXRlbXMucmVtb3ZlQ2hpbGQoaXRlbXMuY2hpbGROb2Rlc1swXSk7XG5cdFx0XHRkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG5cdFx0fSwgNTAwKTtcblx0fVxufVxufVxuXG5cblx0XHRcblxuY2xlYXJidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XG4gICAgc3RhY2suY2xlYXIoKTsgIFxuICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdxdWV1ZS1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdxdWV1ZS1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICAgIH0sIDUwMCk7XG59XG5cblxuXG4vLyBGdW5jdGlvbnNcbmZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKHZhbHVlID0gdHJ1ZSkge1xuXHRzdGFja3JhZGlvLmRpc2FibGVkID0gdmFsdWU7XG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcblx0Y2xlYXJidG4uZGlzYWJsZWQgPSB2YWx1ZTtcblx0cHVzaC5kaXNhYmxlZCA9IHZhbHVlO1xuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XG59XG4iXX0=
