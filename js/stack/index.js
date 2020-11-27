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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgUXVldWUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtID0gW107XHJcbiAgfVxyXG4gIGVucXVldWUoaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtLnB1c2goaXRlbSk7XHJcbiAgfVxyXG4gIGRlcXVldWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLnNoaWZ0KCk7XHJcbiAgfVxyXG5cdGVtcHR5KCl7XHJcblx0XHRpZih0aGlzLml0ZW0ubGVuZ3RoPT0wKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyKCl7XHJcblx0XHR0aGlzLml0ZW0gPSBbXTtcclxuXHR9XHJcblx0c2l6ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbS5sZW5ndGg7XHJcblx0fVxyXG5cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xyXG4iLCJjbGFzcyBTdGFjayB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgfVxyXG5cclxuICBwdXNoKGl0ZW0pIHtcclxuICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICB9XHJcblxyXG4gIHBvcCgpIHsgXHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT0gMCkgXHJcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMucG9wKCk7IFxyXG4gIH1cclxuXHJcbiAgcGVlaygpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV07IFxyXG4gIH1cclxuXHJcbiAgaXNFbXB0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcclxuXHJcblxyXG5cclxuIiwiY29uc3QgU3RhY2sgPSByZXF1aXJlKFwiLi9TdGFja1wiKTtcclxuY29uc3QgUXVldWUgPSByZXF1aXJlKFwiLi9RdWV1ZVwiKTtcclxuY29uc3QgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhY2staXRlbXMnKTtcclxuY29uc3QgcHVzaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoJyk7XHJcbmNvbnN0IHB1c2hidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaC1idG4nKTtcclxuY29uc3QgcG9wYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcC1idG4nKTtcclxuY29uc3QgY2xlYXJidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXItYnRuJyk7XHJcbmNvbnN0IGVucXVldWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZScpO1xyXG5jb25zdCBlbnF1ZXVlYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVldWUtYnRuJyk7XHJcbmNvbnN0IGRlcXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVxdWV1ZS1idG4nKTtcclxuY29uc3Qgc3RhY2tfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhY2stY29udGFpbmVyJyk7XHJcbmNvbnN0IHF1ZXVlX3Zpc2libGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXVlLWNvbnRhaW5lcicpO1xyXG5cclxubGV0IHN0YWNrID0gbmV3IFN0YWNrKCk7XHJcblxyXG5jb25zdCBzdGFja3JhZGlvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiU3RhY2stcmFkaW9cIik7XHJcbmNvbnN0IHF1ZXVlcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJRdWV1ZS1yYWRpb1wiKTtcclxuXHJcblxyXG5cclxuXHJcbnF1ZXVlcmFkaW8ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG5cdHN0YWNrLmNsZWFyKCk7XHJcblx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuXHRzdGFjayA9IG5ldyBRdWV1ZSgpO1xyXG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xyXG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcclxuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XHJcblx0cXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbn07XHJcblxyXG5cclxuc3RhY2tyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XHJcblx0c3RhY2suY2xlYXIoKTtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG5cdHN0YWNrID0gbmV3IFN0YWNrKCk7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiZC1ub25lXCIpO1xyXG4gICAgICAgIHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xyXG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcclxuXHJcbn07XHJcblxyXG5cclxuXHJcbnB1c2hidG4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gIHN0YWNrX21hbnkgPSAkKCcuc3RhY2staXRlbScpLmxlbmd0aDtcclxuICBpZihzdGFja19tYW55IT0xNil7XHJcbiAgY29uc3QgaXRlbU5hbWUgPSBOdW1iZXIocHVzaC52YWx1ZSk7XHJcblx0c3RhY2sucHVzaChpdGVtTmFtZSk7XHJcblxyXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcclxuICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiBcclxuICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW0nKTtcclxuICBpdGVtLmlubmVySFRNTCA9IGl0ZW1OYW1lO1xyXG4gIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtLCBpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbiAgfVxyXG59XHJcblxyXG5cclxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcclxuICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgcXVldWVfbWFueSA9ICQoJy5xdWV1ZS1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHF1ZXVlX21hbnkhPTE2KXtcclxuICAgICAgICBjb25zdCBhcnJOYW1lID0gTnVtYmVyKGVucXVldWUudmFsdWUpO1xyXG4gICAgICAgIHN0YWNrLmVucXVldWUoYXJyTmFtZSk7XHJcblx0dmFyIGwgPSBzdGFjay5zaXplKCk7XHJcblxyXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcclxuICBjb25zdCBhcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgYXJyLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW0nKTtcclxuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcclxuICBpdGVtcy5pbnNlcnRCZWZvcmUoYXJyLCBpdGVtcy5jaGlsZE5vZGVzW2xdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbn1cclxuXHJcbmRlcXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0aWYoIXN0YWNrLmVtcHR5KCkpe1xyXG5cdFx0c3RhY2suZGVxdWV1ZSgpO1xyXG5cdFx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcblx0XHRpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cdFx0XHRkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG59XHJcblxyXG5cclxuXHRcdFxyXG5cclxuY2xlYXJidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGFjay5jbGVhcigpOyAgXHJcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XHJcbn1cclxuIl19
