(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// 스택 아이템의 노드 색상
const stackItem = 'rosybrown';

// 스택 아이템의 텍스트 색상
const stackItemText = 'black';

// 큐 아이템의 노드 색상
const queueItem = 'rosybrown';

// 큐 아이템의 텍스트 색상
const queueItemText = 'black';

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
    this.drawDescription(
`
큐(queue)는 먼저 집어 넣은 데이터가 먼저 나오는 FIFO(First In First Out, 선입선출)구조로 저장하는 자료구조입니다.
나중에 집어 넣은 데이터가 먼저 나오는 스택과는 반대되는 개념입니다.
프린터의 출력 처리나 윈도 시스템의 메시지 처리기, 프로세스 관리 등 데이터가 입력된 시간 순서대로 처리해야 할 필요가 있는 상황에 이용됩니다.
큐의 맨 앞을 front, 맨 뒤를 rare라고 합니다.
큐에서 데이터를 추가하는 것은 Enqueue, 큐에서 데이터를 꺼내는 것을 Dequeue라고 합니다.
`
    );
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

  drawDescription(description) {
    const descriptionContainer = document.querySelector(".description-container");
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach(child => child.remove());
    descriptionContainer.innerHTML = "";

    // 줄별로
    description.split('\n').map(line => {
        descriptionContainer.innerHTML += `<div>${line}</div>${'\n'}`
    })
  }
}
module.exports = Queue;

},{}],3:[function(require,module,exports){
class Stack {
  constructor() {
    this.items = [];
    this.drawDescription(
`
스택(stack)은 나중에 집어 넣은 데이터가 먼저 나오는 LIFO(Last In First Out, 후입선출)구조로 저장하는 자료구조입니다.
스택은 재귀 알고리즘, 실행 취소, 괄호 검사 등에 활용됩니다.
스택에서 데이터를 추가하는 것은 Push, 큐에서 데이터를 꺼내는 것을 Pop이라고 합니다.
`
    );
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

  drawDescription(description) {
    const descriptionContainer = document.querySelector(".description-container");
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach(child => child.remove());
    descriptionContainer.innerHTML = "";

    // 줄별로
    description.split('\n').map(line => {
        descriptionContainer.innerHTML += `<div>${line}</div>${'\n'}`
    })
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
   // 그림자 강조 효과 설정
  item.style.boxShadow = 'inset 2px 2px 5px rosybrown, 2px 2px 10px rosybrown';
  items.insertBefore(item, items.childNodes[0]);

  setTimeout(() => {
    disableButtons(false);
     // 그림자 강조 효과 삭제
    item.style.boxShadow = '';
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
  // 그림자 강조 효과 설정
  arr.style.boxShadow = 'inset 2px 2px 5px rosybrown, 2px 2px 10px rosybrown';
  items.insertBefore(arr, items.childNodes[l]);

  setTimeout(() => {
    disableButtons(false);
    // 그림자 강조 효과 삭제
    arr.style.boxShadow = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9Db2xvci5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbi8vIOyKpO2DnSDslYTsnbTthZzsnZgg64W465OcIOyDieyDgVxyXG5jb25zdCBzdGFja0l0ZW0gPSAncm9zeWJyb3duJztcclxuXHJcbi8vIOyKpO2DnSDslYTsnbTthZzsnZgg7YWN7Iqk7Yq4IOyDieyDgVxyXG5jb25zdCBzdGFja0l0ZW1UZXh0ID0gJ2JsYWNrJztcclxuXHJcbi8vIO2BkCDslYTsnbTthZzsnZgg64W465OcIOyDieyDgVxyXG5jb25zdCBxdWV1ZUl0ZW0gPSAncm9zeWJyb3duJztcclxuXHJcbi8vIO2BkCDslYTsnbTthZzsnZgg7YWN7Iqk7Yq4IOyDieyDgVxyXG5jb25zdCBxdWV1ZUl0ZW1UZXh0ID0gJ2JsYWNrJztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc3RhY2tJdGVtLFxyXG4gICAgc3RhY2tJdGVtVGV4dCxcclxuXHJcbiAgICBxdWV1ZUl0ZW0sXHJcbiAgICBxdWV1ZUl0ZW1UZXh0XHJcbn0iLCJjbGFzcyBRdWV1ZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLml0ZW0gPSBbXTtcclxuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxyXG5gXHJcbu2BkChxdWV1ZSnripQg66i87KCAIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQgRklGTyhGaXJzdCBJbiBGaXJzdCBPdXQsIOyEoOyeheyEoOy2nCnqtazsobDroZwg7KCA7J6l7ZWY64qUIOyekOujjOq1rOyhsOyeheuLiOuLpC5cclxu64KY7KSR7JeQIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQg7Iqk7YOd6rO864qUIOuwmOuMgOuQmOuKlCDqsJzrhZDsnoXri4jri6QuXHJcbu2UhOumsO2EsOydmCDstpzroKUg7LKY66as64KYIOyciOuPhCDsi5zsiqTthZzsnZgg66mU7Iuc7KeAIOyymOumrOq4sCwg7ZSE66Gc7IS47IqkIOq0gOumrCDrk7Eg642w7J207YSw6rCAIOyeheugpeuQnCDsi5zqsIQg7Iic7ISc64yA66GcIOyymOumrO2VtOyVvCDtlaAg7ZWE7JqU6rCAIOyeiOuKlCDsg4Htmansl5Ag7J207Jqp65Cp64uI64ukLlxyXG7tgZDsnZgg66eoIOyVnuydhCBmcm9udCwg66eoIOuSpOulvCByYXJl65286rOgIO2VqeuLiOuLpC5cclxu7YGQ7JeQ7IScIOuNsOydtO2EsOulvCDstpTqsIDtlZjripQg6rKD7J2AIEVucXVldWUsIO2BkOyXkOyEnCDrjbDsnbTthLDrpbwg6rq864K064qUIOqyg+ydhCBEZXF1ZXVl65286rOgIO2VqeuLiOuLpC5cclxuYFxyXG4gICAgKTtcclxuICB9XHJcbiAgZW5xdWV1ZShpdGVtKSB7XHJcbiAgICB0aGlzLml0ZW0ucHVzaChpdGVtKTtcclxuICB9XHJcbiAgZGVxdWV1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW0uc2hpZnQoKTtcclxuICB9XHJcblx0ZW1wdHkoKXtcclxuXHRcdGlmKHRoaXMuaXRlbS5sZW5ndGg9PTApe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2xlYXIoKXtcclxuXHRcdHRoaXMuaXRlbSA9IFtdO1xyXG5cdH1cclxuXHRzaXplKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5pdGVtLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGRyYXdEZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLWNvbnRhaW5lclwiKTtcclxuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7ISk66qFIOyCreygnFxyXG4gICAgQXJyYXkuZnJvbShkZXNjcmlwdGlvbkNvbnRhaW5lci5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiBjaGlsZC5yZW1vdmUoKSk7XHJcbiAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIC8vIOykhOuzhOuhnFxyXG4gICAgZGVzY3JpcHRpb24uc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcclxuICAgICAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxkaXY+JHtsaW5lfTwvZGl2PiR7J1xcbid9YFxyXG4gICAgfSlcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcclxuIiwiY2xhc3MgU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXHJcbmBcclxu7Iqk7YOdKHN0YWNrKeydgCDrgpjspJHsl5Ag7KeR7Ja0IOuEo+ydgCDrjbDsnbTthLDqsIAg66i87KCAIOuCmOyYpOuKlCBMSUZPKExhc3QgSW4gRmlyc3QgT3V0LCDtm4TsnoXshKDstpwp6rWs7KGw66GcIOyggOyepe2VmOuKlCDsnpDro4zqtazsobDsnoXri4jri6QuXHJcbuyKpO2DneydgCDsnqzqt4Ag7JWM6rOg66as7KaYLCDsi6Ttlokg7Leo7IaMLCDqtITtmLgg6rKA7IKsIOuTseyXkCDtmZzsmqnrkKnri4jri6QuXHJcbuyKpO2DneyXkOyEnCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIOqyg+ydgCBQdXNoLCDtgZDsl5DshJwg642w7J207YSw66W8IOq6vOuCtOuKlCDqsoPsnYQgUG9w7J2065286rOgIO2VqeuLiOuLpC5cclxuYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1c2goaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gIH1cclxuXHJcbiAgcG9wKCkgeyBcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PSAwKSBcclxuICAgICAgcmV0dXJuIFwiRW1wdHlcIjsgXHJcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5wb3AoKTsgXHJcbiAgfVxyXG5cclxuICBwZWVrKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTsgXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID09IDA7XHJcbiAgfVxyXG5cclxuICBnZXRTaXplKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgfVxyXG5cclxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbi1jb250YWluZXJcIik7XHJcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyEpOuqhSDsgq3soJxcclxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAvLyDspITrs4TroZxcclxuICAgIGRlc2NyaXB0aW9uLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MICs9IGA8ZGl2PiR7bGluZX08L2Rpdj4keydcXG4nfWBcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XHJcblxyXG5cclxuXHJcbiIsImNvbnN0IFN0YWNrID0gcmVxdWlyZShcIi4vU3RhY2tcIik7XHJcbmNvbnN0IFF1ZXVlID0gcmVxdWlyZShcIi4vUXVldWVcIik7XHJcblxyXG5jb25zdCBDb2xvciA9IHJlcXVpcmUoJy4vQ29sb3InKTtcclxuXHJcbmNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YWNrLWl0ZW1zJyk7XHJcbmNvbnN0IHB1c2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaCcpO1xyXG5jb25zdCBwdXNoYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gtYnRuJyk7XHJcbmNvbnN0IHBvcGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3AtYnRuJyk7XHJcbmNvbnN0IGNsZWFyYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyLWJ0bicpO1xyXG5jb25zdCBlbnF1ZXVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVldWUnKTtcclxuY29uc3QgZW5xdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlLWJ0bicpO1xyXG5jb25zdCBkZXF1ZXVlYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlcXVldWUtYnRuJyk7XHJcbmNvbnN0IHN0YWNrX3Zpc2libGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YWNrLWNvbnRhaW5lcicpO1xyXG5jb25zdCBxdWV1ZV92aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWV1ZS1jb250YWluZXInKTtcclxuXHJcbmxldCBzdGFjayA9IG5ldyBTdGFjaygpO1xyXG5cclxuY29uc3Qgc3RhY2tyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlN0YWNrLXJhZGlvXCIpO1xyXG5jb25zdCBxdWV1ZXJhZGlvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiUXVldWUtcmFkaW9cIik7XHJcblxyXG5cclxuXHJcblxyXG5xdWV1ZXJhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcclxuXHRzdGFjay5jbGVhcigpO1xyXG5cdGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcblx0c3RhY2sgPSBuZXcgUXVldWUoKTtcclxuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJibG9ja1wiKTtcclxuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJkLW5vbmVcIik7XHJcblx0cXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiZC1ub25lXCIpO1xyXG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG59O1xyXG5cclxuXHJcbnN0YWNrcmFkaW8ub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG5cdHN0YWNrLmNsZWFyKCk7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuXHRzdGFjayA9IG5ldyBTdGFjaygpO1xyXG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcclxuICAgICAgICBzdGFja192aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgICAgICBxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJibG9ja1wiKTtcclxuICAgICAgICBxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJkLW5vbmVcIik7XHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5wdXNoYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICBzdGFja19tYW55ID0gJCgnLnN0YWNrLWl0ZW0nKS5sZW5ndGg7XHJcbiAgaWYoc3RhY2tfbWFueSE9MTYpe1xyXG4gIGNvbnN0IGl0ZW1OYW1lID0gTnVtYmVyKHB1c2gudmFsdWUpO1xyXG5cdHN0YWNrLnB1c2goaXRlbU5hbWUpO1xyXG5cclxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXHJcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGl0ZW0uc3R5bGUuY29sb3IgPSBDb2xvci5zdGFja0l0ZW1UZXh0O1xyXG4gIGl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gQ29sb3Iuc3RhY2tJdGVtO1xyXG4gIGl0ZW0uY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbScpO1xyXG4gIGl0ZW0uaW5uZXJIVE1MID0gaXRlbU5hbWU7XHJcbiAgIC8vIOq3uOumvOyekCDqsJXsobAg7Zqo6rO8IOyEpOyglVxyXG4gIGl0ZW0uc3R5bGUuYm94U2hhZG93ID0gJ2luc2V0IDJweCAycHggNXB4IHJvc3licm93biwgMnB4IDJweCAxMHB4IHJvc3licm93bic7XHJcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGl0ZW0sIGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgICAvLyDqt7jrprzsnpAg6rCV7KGwIO2aqOqzvCDsgq3soJxcclxuICAgIGl0ZW0uc3R5bGUuYm94U2hhZG93ID0gJyc7XHJcbiAgfSw1MDApXHJcbiAgfVxyXG59XHJcblxyXG5cclxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcclxuICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgcXVldWVfbWFueSA9ICQoJy5xdWV1ZS1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHF1ZXVlX21hbnkhPTE2KXtcclxuICAgICAgICBjb25zdCBhcnJOYW1lID0gTnVtYmVyKGVucXVldWUudmFsdWUpO1xyXG4gICAgICAgIHN0YWNrLmVucXVldWUoYXJyTmFtZSk7XHJcblx0dmFyIGwgPSBzdGFjay5zaXplKCk7XHJcblxyXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcclxuICBjb25zdCBhcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBhcnIuc3R5bGUuY29sb3IgPSBDb2xvci5xdWV1ZUl0ZW1UZXh0O1xyXG4gIGFyci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5xdWV1ZUl0ZW07XHJcbiAgYXJyLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW0nKTtcclxuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcclxuICAvLyDqt7jrprzsnpAg6rCV7KGwIO2aqOqzvCDshKTsoJVcclxuICBhcnIuc3R5bGUuYm94U2hhZG93ID0gJ2luc2V0IDJweCAycHggNXB4IHJvc3licm93biwgMnB4IDJweCAxMHB4IHJvc3licm93bic7XHJcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGFyciwgaXRlbXMuY2hpbGROb2Rlc1tsXSk7XHJcblxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgLy8g6re466a87J6QIOqwleyhsCDtmqjqs7wg7IKt7KCcXHJcbiAgICBhcnIuc3R5bGUuYm94U2hhZG93ID0gJyc7XHJcbiAgfSw1MDApXHJcbn1cclxuXHJcbmRlcXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0aWYoIXN0YWNrLmVtcHR5KCkpe1xyXG5cdFx0c3RhY2suZGVxdWV1ZSgpO1xyXG5cdFx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcblx0XHRpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cdFx0XHRkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG59XHJcblxyXG5cclxuXHRcdFxyXG5cclxuY2xlYXJidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGFjay5jbGVhcigpOyAgXHJcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XHJcbn1cclxuIl19
