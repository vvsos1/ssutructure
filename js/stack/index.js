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
        const arrName = Number(enqueue.value);
        stack.enqueue(arrName);
	var l = stack.size();

  disableButtons(true);
  // Create HTML element and push it to items
  const arr = document.createElement('div');

  arr.classList.add('stack-item');
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


		

clearbtn.onclick = function(){
    stack.clear();  
    disableButtons(true);
    items.classList.add('stack-items--remove');
    setTimeout(() => {
      items.classList.remove('stack-items--remove');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbSA9IFtdO1xuICB9XG4gIGVucXVldWUoaXRlbSkge1xuICAgIHRoaXMuaXRlbS5wdXNoKGl0ZW0pO1xuICB9XG4gIGRlcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbS5zaGlmdCgpO1xuICB9XG5cdGVtcHR5KCl7XG5cdFx0aWYodGhpcy5pdGVtLmxlbmd0aD09MCl7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblx0fVxuXG5cdGNsZWFyKCl7XG5cdFx0dGhpcy5pdGVtID0gW107XG5cdH1cblx0c2l6ZSgpe1xuXHRcdHJldHVybiB0aGlzLml0ZW0ubGVuZ3RoO1xuXHR9XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG4iLCJjbGFzcyBTdGFjayB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgfVxyXG5cclxuICBwdXNoKGl0ZW0pIHtcclxuICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICB9XHJcblxyXG4gIHBvcCgpIHsgXHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT0gMCkgXHJcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMucG9wKCk7IFxyXG4gIH1cclxuXHJcbiAgcGVlaygpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV07IFxyXG4gIH1cclxuXHJcbiAgaXNFbXB0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG5cclxuICBjbGVhcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcclxuXHJcblxyXG5cclxuIiwiY29uc3QgU3RhY2sgPSByZXF1aXJlKFwiLi9TdGFja1wiKTtcclxuY29uc3QgUXVldWUgPSByZXF1aXJlKFwiLi9RdWV1ZVwiKTtcclxuY29uc3QgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhY2staXRlbXMnKTtcclxuY29uc3QgcHVzaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoJyk7XHJcbmNvbnN0IHB1c2hidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaC1idG4nKTtcclxuY29uc3QgcG9wYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcC1idG4nKTtcclxuY29uc3QgY2xlYXJidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXItYnRuJyk7XHJcbmNvbnN0IGVucXVldWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZScpO1xyXG5jb25zdCBlbnF1ZXVlYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVldWUtYnRuJyk7XHJcbmNvbnN0IGRlcXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVxdWV1ZS1idG4nKTtcclxuY29uc3Qgc3RhY2tfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhY2stY29udGFpbmVyJyk7XHJcbmNvbnN0IHF1ZXVlX3Zpc2libGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXVlLWNvbnRhaW5lcicpO1xyXG5cclxubGV0IHN0YWNrID0gbmV3IFN0YWNrKCk7XHJcblxyXG5jb25zdCBzdGFja3JhZGlvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiU3RhY2stcmFkaW9cIik7XHJcbmNvbnN0IHF1ZXVlcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJRdWV1ZS1yYWRpb1wiKTtcclxuXHJcblxyXG5cclxuXHJcbnF1ZXVlcmFkaW8ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG5cdHN0YWNrLmNsZWFyKCk7XHJcblx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuXHRzdGFjayA9IG5ldyBRdWV1ZSgpO1xyXG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xyXG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcclxuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XHJcblx0cXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbn07XHJcblxyXG5cclxuc3RhY2tyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XHJcblx0c3RhY2suY2xlYXIoKTtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG5cdHN0YWNrID0gbmV3IFN0YWNrKCk7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiZC1ub25lXCIpO1xyXG4gICAgICAgIHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xyXG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcclxuXHJcbn07XHJcblxyXG5cclxuXHJcbnB1c2hidG4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cdGNvbnN0IGl0ZW1OYW1lID0gTnVtYmVyKHB1c2gudmFsdWUpO1xyXG5cdHN0YWNrLnB1c2goaXRlbU5hbWUpO1xyXG5cclxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXHJcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gXHJcbiAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtJyk7XHJcbiAgaXRlbS5pbm5lckhUTUwgPSBpdGVtTmFtZTtcclxuICBpdGVtcy5pbnNlcnRCZWZvcmUoaXRlbSwgaXRlbXMuY2hpbGROb2Rlc1swXSk7XHJcblxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gIH0sNTAwKVxyXG59XHJcblxyXG5cclxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcclxuICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgYXJyTmFtZSA9IE51bWJlcihlbnF1ZXVlLnZhbHVlKTtcclxuICAgICAgICBzdGFjay5lbnF1ZXVlKGFyck5hbWUpO1xyXG5cdHZhciBsID0gc3RhY2suc2l6ZSgpO1xyXG5cclxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXHJcbiAgY29uc3QgYXJyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIGFyci5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtJyk7XHJcbiAgYXJyLmlubmVySFRNTCA9IGFyck5hbWU7XHJcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGFyciwgaXRlbXMuY2hpbGROb2Rlc1tsXSk7XHJcblxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gIH0sNTAwKVxyXG59XHJcblxyXG5kZXF1ZXVlYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG5cdGlmKCFzdGFjay5lbXB0eSgpKXtcclxuXHRcdHN0YWNrLmRlcXVldWUoKTtcclxuXHRcdGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG5cdFx0aXRlbXMuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKCdwb3BBbmltYXRpb24nKTtcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRpdGVtcy5yZW1vdmVDaGlsZChpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHRcdFx0ZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG5cdFx0fSwgNTAwKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cdFx0XHJcblxyXG5jbGVhcmJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YWNrLmNsZWFyKCk7ICBcclxuICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XHJcbn1cclxuIl19
