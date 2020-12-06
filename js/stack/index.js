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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9Db2xvci5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcbmNvbnN0IHN0YWNrSXRlbSA9ICdyb3N5YnJvd24nO1xuXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcbmNvbnN0IHN0YWNrSXRlbVRleHQgPSAnYmxhY2snO1xuXG4vLyDtgZAg7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcbmNvbnN0IHF1ZXVlSXRlbSA9ICdyb3N5YnJvd24nO1xuXG4vLyDtgZAg7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcbmNvbnN0IHF1ZXVlSXRlbVRleHQgPSAnYmxhY2snO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdGFja0l0ZW0sXG4gICAgc3RhY2tJdGVtVGV4dCxcblxuICAgIHF1ZXVlSXRlbSxcbiAgICBxdWV1ZUl0ZW1UZXh0XG59IiwiY2xhc3MgUXVldWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW0gPSBbXTtcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcbmBcbu2BkChxdWV1ZSnripQg66i87KCAIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQgRklGTyhGaXJzdCBJbiBGaXJzdCBPdXQsIOyEoOyeheyEoOy2nCnqtazsobDroZwg7KCA7J6l7ZWY64qUIOyekOujjOq1rOyhsOyeheuLiOuLpC5cbuuCmOykkeyXkCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIOyKpO2DneqzvOuKlCDrsJjrjIDrkJjripQg6rCc64WQ7J6F64uI64ukLlxu7ZSE66aw7YSw7J2YIOy2nOugpSDsspjrpqzrgpgg7JyI64+EIOyLnOyKpO2FnOydmCDrqZTsi5zsp4Ag7LKY66as6riwLCDtlITroZzshLjsiqQg6rSA66asIOuTsSDrjbDsnbTthLDqsIAg7J6F66Cl65CcIOyLnOqwhCDsiJzshJzrjIDroZwg7LKY66as7ZW07JW8IO2VoCDtlYTsmpTqsIAg7J6I64qUIOyDge2ZqeyXkCDsnbTsmqnrkKnri4jri6QuXG7tgZDsnZgg66eoIOyVnuydhCBmcm9udCwg66eoIOuSpOulvCByYXJl65286rOgIO2VqeuLiOuLpC5cbu2BkOyXkOyEnCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIOqyg+ydgCBFbnF1ZXVlLCDtgZDsl5DshJwg642w7J207YSw66W8IOq6vOuCtOuKlCDqsoPsnYQgRGVxdWV1ZeudvOqzoCDtlanri4jri6QuXG5gXG4gICAgKTtcbiAgfVxuICBlbnF1ZXVlKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW0ucHVzaChpdGVtKTtcbiAgfVxuICBkZXF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW0uc2hpZnQoKTtcbiAgfVxuXHRlbXB0eSgpe1xuXHRcdGlmKHRoaXMuaXRlbS5sZW5ndGg9PTApe1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR9XG5cdH1cblxuXHRjbGVhcigpe1xuXHRcdHRoaXMuaXRlbSA9IFtdO1xuXHR9XG5cdHNpemUoKXtcblx0XHRyZXR1cm4gdGhpcy5pdGVtLmxlbmd0aDtcbiAgfVxuXG4gIGRyYXdEZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbi1jb250YWluZXJcIik7XG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDshKTrqoUg7IKt7KCcXG4gICAgQXJyYXkuZnJvbShkZXNjcmlwdGlvbkNvbnRhaW5lci5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiBjaGlsZC5yZW1vdmUoKSk7XG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIC8vIOykhOuzhOuhnFxuICAgIGRlc2NyaXB0aW9uLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XG4gICAgICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCArPSBgPGRpdj4ke2xpbmV9PC9kaXY+JHsnXFxuJ31gXG4gICAgfSlcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcbiIsImNsYXNzIFN0YWNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxuYFxu7Iqk7YOdKHN0YWNrKeydgCDrgpjspJHsl5Ag7KeR7Ja0IOuEo+ydgCDrjbDsnbTthLDqsIAg66i87KCAIOuCmOyYpOuKlCBMSUZPKExhc3QgSW4gRmlyc3QgT3V0LCDtm4TsnoXshKDstpwp6rWs7KGw66GcIOyggOyepe2VmOuKlCDsnpDro4zqtazsobDsnoXri4jri6QuXG7siqTtg53snYAg7J6s6reAIOyVjOqzoOumrOymmCwg7Iuk7ZaJIOy3qOyGjCwg6rSE7Zi4IOqygOyCrCDrk7Hsl5Ag7Zmc7Jqp65Cp64uI64ukLlxu7Iqk7YOd7JeQ7IScIOuNsOydtO2EsOulvCDstpTqsIDtlZjripQg6rKD7J2AIFB1c2gsIO2BkOyXkOyEnCDrjbDsnbTthLDrpbwg6rq864K064qUIOqyg+ydhCBQb3DsnbTrnbzqs6Ag7ZWp64uI64ukLlxuYFxuICAgICk7XG4gIH1cblxuICBwdXNoKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gIH1cblxuICBwb3AoKSB7IFxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PSAwKSBcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxuICAgIHJldHVybiB0aGlzLml0ZW1zLnBvcCgpOyBcbiAgfVxuXG4gIHBlZWsoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTsgXG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xuICB9XG5cbiAgZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH1cblxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb24tY29udGFpbmVyXCIpO1xuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7ISk66qFIOyCreygnFxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xuICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyDspITrs4TroZxcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxkaXY+JHtsaW5lfTwvZGl2PiR7J1xcbid9YFxuICAgIH0pXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG5cblxuXG4iLCJjb25zdCBTdGFjayA9IHJlcXVpcmUoXCIuL1N0YWNrXCIpO1xuY29uc3QgUXVldWUgPSByZXF1aXJlKFwiLi9RdWV1ZVwiKTtcblxuY29uc3QgQ29sb3IgPSByZXF1aXJlKCcuL0NvbG9yJyk7XG5cbmNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YWNrLWl0ZW1zJyk7XG5jb25zdCBwdXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gnKTtcbmNvbnN0IHB1c2hidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaC1idG4nKTtcbmNvbnN0IHBvcGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3AtYnRuJyk7XG5jb25zdCBjbGVhcmJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKTtcbmNvbnN0IGVucXVldWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZScpO1xuY29uc3QgZW5xdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlLWJ0bicpO1xuY29uc3QgZGVxdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXF1ZXVlLWJ0bicpO1xuY29uc3Qgc3RhY2tfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhY2stY29udGFpbmVyJyk7XG5jb25zdCBxdWV1ZV92aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWV1ZS1jb250YWluZXInKTtcblxubGV0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbmNvbnN0IHN0YWNrcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTdGFjay1yYWRpb1wiKTtcbmNvbnN0IHF1ZXVlcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJRdWV1ZS1yYWRpb1wiKTtcblxuXG5cblxucXVldWVyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XG5cdHN0YWNrLmNsZWFyKCk7XG5cdGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcbiAgICAgICAgfSwgNTAwKTtcblxuXHRzdGFjayA9IG5ldyBRdWV1ZSgpO1xuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJibG9ja1wiKTtcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xufTtcblxuXG5zdGFja3JhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcblx0c3RhY2suY2xlYXIoKTtcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICAgICAgICB9LCA1MDApO1xuXG5cdHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcbiAgICAgICAgc3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG4gICAgICAgIHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImJsb2NrXCIpO1xuICAgICAgICBxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJkLW5vbmVcIik7XG5cbn07XG5cblxuXG5wdXNoYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgc3RhY2tfbWFueSA9ICQoJy5zdGFjay1pdGVtJykubGVuZ3RoO1xuICBpZihzdGFja19tYW55IT0xNil7XG4gIGNvbnN0IGl0ZW1OYW1lID0gTnVtYmVyKHB1c2gudmFsdWUpO1xuXHRzdGFjay5wdXNoKGl0ZW1OYW1lKTtcblxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgLy8gQ3JlYXRlIEhUTUwgZWxlbWVudCBhbmQgcHVzaCBpdCB0byBpdGVtc1xuICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGl0ZW0uc3R5bGUuY29sb3IgPSBDb2xvci5zdGFja0l0ZW1UZXh0O1xuICBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IENvbG9yLnN0YWNrSXRlbTtcbiAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtJyk7XG4gIGl0ZW0uaW5uZXJIVE1MID0gaXRlbU5hbWU7XG4gICAvLyDqt7jrprzsnpAg6rCV7KGwIO2aqOqzvCDshKTsoJVcbiAgaXRlbS5zdHlsZS5ib3hTaGFkb3cgPSAnaW5zZXQgMnB4IDJweCA1cHggcm9zeWJyb3duLCAycHggMnB4IDEwcHggcm9zeWJyb3duJztcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGl0ZW0sIGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcbiAgICAgLy8g6re466a87J6QIOqwleyhsCDtmqjqs7wg7IKt7KCcXG4gICAgaXRlbS5zdHlsZS5ib3hTaGFkb3cgPSAnJztcbiAgfSw1MDApXG4gIH1cbn1cblxuXG5wb3BidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaXRlbXMucmVtb3ZlQ2hpbGQoaXRlbXMuY2hpbGROb2Rlc1swXSk7XG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gICAgfSwgNTAwKTtcbiAgfVxufVxuXG5lbnF1ZXVlYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgcXVldWVfbWFueSA9ICQoJy5xdWV1ZS1pdGVtJykubGVuZ3RoO1xuICBpZihxdWV1ZV9tYW55IT0xNil7XG4gICAgICAgIGNvbnN0IGFyck5hbWUgPSBOdW1iZXIoZW5xdWV1ZS52YWx1ZSk7XG4gICAgICAgIHN0YWNrLmVucXVldWUoYXJyTmFtZSk7XG5cdHZhciBsID0gc3RhY2suc2l6ZSgpO1xuXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXG4gIGNvbnN0IGFyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBhcnIuc3R5bGUuY29sb3IgPSBDb2xvci5xdWV1ZUl0ZW1UZXh0O1xuICBhcnIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gQ29sb3IucXVldWVJdGVtO1xuICBhcnIuY2xhc3NMaXN0LmFkZCgncXVldWUtaXRlbScpO1xuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcbiAgLy8g6re466a87J6QIOqwleyhsCDtmqjqs7wg7ISk7KCVXG4gIGFyci5zdHlsZS5ib3hTaGFkb3cgPSAnaW5zZXQgMnB4IDJweCA1cHggcm9zeWJyb3duLCAycHggMnB4IDEwcHggcm9zeWJyb3duJztcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGFyciwgaXRlbXMuY2hpbGROb2Rlc1tsXSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICAgIC8vIOq3uOumvOyekCDqsJXsobAg7Zqo6rO8IOyCreygnFxuICAgIGFyci5zdHlsZS5ib3hTaGFkb3cgPSAnJztcbiAgfSw1MDApXG59XG5cbmRlcXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XG5cdGlmKCFzdGFjay5lbXB0eSgpKXtcblx0XHRzdGFjay5kZXF1ZXVlKCk7XG5cdFx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG5cdFx0aXRlbXMuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKCdwb3BBbmltYXRpb24nKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xuXHRcdFx0ZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuXHRcdH0sIDUwMCk7XG5cdH1cbn1cbn1cblxuXG5cdFx0XG5cbmNsZWFyYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuICAgIHN0YWNrLmNsZWFyKCk7ICBcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgncXVldWUtaXRlbXMtLXJlbW92ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgncXVldWUtaXRlbXMtLXJlbW92ZScpO1xuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcbiAgICB9LCA1MDApO1xufVxuXG5cblxuLy8gRnVuY3Rpb25zXG5mdW5jdGlvbiBkaXNhYmxlQnV0dG9ucyh2YWx1ZSA9IHRydWUpIHtcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xuXHRxdWV1ZXJhZGlvLmRpc2FibGVkID0gdmFsdWU7XG5cdGNsZWFyYnRuLmRpc2FibGVkID0gdmFsdWU7XG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcblx0ZW5xdWV1ZS5kaXNhYmxlZCA9IHZhbHVlO1xufVxuIl19
