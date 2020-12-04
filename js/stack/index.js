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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9Db2xvci5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuLy8g7Iqk7YOdIOyVhOydtO2FnOydmCDrhbjrk5wg7IOJ7IOBXHJcbmNvbnN0IHN0YWNrSXRlbSA9ICcjZmY3ZjAwJztcclxuXHJcbi8vIOyKpO2DnSDslYTsnbTthZzsnZgg7YWN7Iqk7Yq4IOyDieyDgVxyXG5jb25zdCBzdGFja0l0ZW1UZXh0ID0gJyNmNWY2ZmEnO1xyXG5cclxuLy8g7YGQIOyVhOydtO2FnOydmCDrhbjrk5wg7IOJ7IOBXHJcbmNvbnN0IHF1ZXVlSXRlbSA9ICcjZmY3ZjAwJztcclxuXHJcbi8vIO2BkCDslYTsnbTthZzsnZgg7YWN7Iqk7Yq4IOyDieyDgVxyXG5jb25zdCBxdWV1ZUl0ZW1UZXh0ID0gJyNmNWY2ZmEnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHN0YWNrSXRlbSxcclxuICAgIHN0YWNrSXRlbVRleHQsXHJcblxyXG4gICAgcXVldWVJdGVtLFxyXG4gICAgcXVldWVJdGVtVGV4dFxyXG59IiwiY2xhc3MgUXVldWUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtID0gW107XHJcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcclxuYFxyXG7tgZAocXVldWUp64qUIOuovOyggCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIEZJRk8oRmlyc3QgSW4gRmlyc3QgT3V0LCDshKDsnoXshKDstpwp6rWs7KGw66GcIOyggOyepe2VmOuKlCDsnpDro4zqtazsobDsnoXri4jri6QuXHJcbuuCmOykkeyXkCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIOyKpO2DneqzvOuKlCDrsJjrjIDrkJjripQg6rCc64WQ7J6F64uI64ukLlxyXG7tlITrprDthLDsnZgg7Lac66ClIOyymOumrOuCmCDsnIjrj4Qg7Iuc7Iqk7YWc7J2YIOuplOyLnOyngCDsspjrpqzquLAsIO2UhOuhnOyEuOyKpCDqtIDrpqwg65OxIOuNsOydtO2EsOqwgCDsnoXroKXrkJwg7Iuc6rCEIOyInOyEnOuMgOuhnCDsspjrpqztlbTslbwg7ZWgIO2VhOyalOqwgCDsnojripQg7IOB7Zmp7JeQIOydtOyaqeuQqeuLiOuLpC5cclxu7YGQ7J2YIOunqCDslZ7snYQgZnJvbnQsIOunqCDrkqTrpbwgcmFyZeudvOqzoCDtlanri4jri6QuXHJcbu2BkOyXkOyEnCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIOqyg+ydgCBFbnF1ZXVlLCDtgZDsl5DshJwg642w7J207YSw66W8IOq6vOuCtOuKlCDqsoPsnYQgRGVxdWV1ZeudvOqzoCDtlanri4jri6QuXHJcbmBcclxuICAgICk7XHJcbiAgfVxyXG4gIGVucXVldWUoaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtLnB1c2goaXRlbSk7XHJcbiAgfVxyXG4gIGRlcXVldWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLnNoaWZ0KCk7XHJcbiAgfVxyXG5cdGVtcHR5KCl7XHJcblx0XHRpZih0aGlzLml0ZW0ubGVuZ3RoPT0wKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyKCl7XHJcblx0XHR0aGlzLml0ZW0gPSBbXTtcclxuXHR9XHJcblx0c2l6ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbi1jb250YWluZXJcIik7XHJcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyEpOuqhSDsgq3soJxcclxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAvLyDspITrs4TroZxcclxuICAgIGRlc2NyaXB0aW9uLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MICs9IGA8ZGl2PiR7bGluZX08L2Rpdj4keydcXG4nfWBcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XHJcbiIsImNsYXNzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxyXG5gXHJcbuyKpO2DnShzdGFjaynsnYAg64KY7KSR7JeQIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQgTElGTyhMYXN0IEluIEZpcnN0IE91dCwg7ZuE7J6F7ISg7LacKeq1rOyhsOuhnCDsoIDsnqXtlZjripQg7J6Q66OM6rWs7KGw7J6F64uI64ukLlxyXG7siqTtg53snYAg7J6s6reAIOyVjOqzoOumrOymmCwg7Iuk7ZaJIOy3qOyGjCwg6rSE7Zi4IOqygOyCrCDrk7Hsl5Ag7Zmc7Jqp65Cp64uI64ukLlxyXG7siqTtg53sl5DshJwg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCDqsoPsnYAgUHVzaCwg7YGQ7JeQ7IScIOuNsOydtO2EsOulvCDqurzrgrTripQg6rKD7J2EIFBvcOydtOudvOqzoCDtlanri4jri6QuXHJcbmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdXNoKGl0ZW0pIHtcclxuICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICB9XHJcblxyXG4gIHBvcCgpIHsgXHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT0gMCkgXHJcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMucG9wKCk7IFxyXG4gIH1cclxuXHJcbiAgcGVlaygpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV07IFxyXG4gIH1cclxuXHJcbiAgaXNFbXB0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgZHJhd0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb24tY29udGFpbmVyXCIpO1xyXG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDshKTrqoUg7IKt7KCcXHJcbiAgICBBcnJheS5mcm9tKGRlc2NyaXB0aW9uQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnJlbW92ZSgpKTtcclxuICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgLy8g7KSE67OE66GcXHJcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCArPSBgPGRpdj4ke2xpbmV9PC9kaXY+JHsnXFxuJ31gXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xyXG5cclxuXHJcblxyXG4iLCJjb25zdCBTdGFjayA9IHJlcXVpcmUoXCIuL1N0YWNrXCIpO1xyXG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoXCIuL1F1ZXVlXCIpO1xyXG5cclxuY29uc3QgQ29sb3IgPSByZXF1aXJlKCcuL0NvbG9yJyk7XHJcblxyXG5jb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFjay1pdGVtcycpO1xyXG5jb25zdCBwdXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gnKTtcclxuY29uc3QgcHVzaGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoLWJ0bicpO1xyXG5jb25zdCBwb3BidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wLWJ0bicpO1xyXG5jb25zdCBjbGVhcmJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKTtcclxuY29uc3QgZW5xdWV1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlJyk7XHJcbmNvbnN0IGVucXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZS1idG4nKTtcclxuY29uc3QgZGVxdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXF1ZXVlLWJ0bicpO1xyXG5jb25zdCBzdGFja192aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFjay1jb250YWluZXInKTtcclxuY29uc3QgcXVldWVfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVldWUtY29udGFpbmVyJyk7XHJcblxyXG5sZXQgc3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHJcbmNvbnN0IHN0YWNrcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTdGFjay1yYWRpb1wiKTtcclxuY29uc3QgcXVldWVyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlF1ZXVlLXJhZGlvXCIpO1xyXG5cclxuXHJcblxyXG5cclxucXVldWVyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XHJcblx0c3RhY2suY2xlYXIoKTtcclxuXHRkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG5cdHN0YWNrID0gbmV3IFF1ZXVlKCk7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcclxuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxufTtcclxuXHJcblxyXG5zdGFja3JhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcclxuXHRzdGFjay5jbGVhcigpO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcblx0c3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XHJcbiAgICAgICAgc3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cclxufTtcclxuXHJcblxyXG5cclxucHVzaGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgc3RhY2tfbWFueSA9ICQoJy5zdGFjay1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHN0YWNrX21hbnkhPTE2KXtcclxuICBjb25zdCBpdGVtTmFtZSA9IE51bWJlcihwdXNoLnZhbHVlKTtcclxuXHRzdGFjay5wdXNoKGl0ZW1OYW1lKTtcclxuXHJcbiAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgLy8gQ3JlYXRlIEhUTUwgZWxlbWVudCBhbmQgcHVzaCBpdCB0byBpdGVtc1xyXG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBpdGVtLnN0eWxlLmNvbG9yID0gQ29sb3Iuc3RhY2tJdGVtVGV4dDtcclxuICBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IENvbG9yLnN0YWNrSXRlbTtcclxuICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW0nKTtcclxuICBpdGVtLmlubmVySFRNTCA9IGl0ZW1OYW1lO1xyXG4gIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtLCBpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbiAgfVxyXG59XHJcblxyXG5cclxucG9wYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gIGlmKCFzdGFjay5pc0VtcHR5KCkpIHtcclxuICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZW5xdWV1ZWJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgcXVldWVfbWFueSA9ICQoJy5xdWV1ZS1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHF1ZXVlX21hbnkhPTE2KXtcclxuICAgICAgICBjb25zdCBhcnJOYW1lID0gTnVtYmVyKGVucXVldWUudmFsdWUpO1xyXG4gICAgICAgIHN0YWNrLmVucXVldWUoYXJyTmFtZSk7XHJcblx0dmFyIGwgPSBzdGFjay5zaXplKCk7XHJcblxyXG4gIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcclxuICBjb25zdCBhcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBhcnIuc3R5bGUuY29sb3IgPSBDb2xvci5xdWV1ZUl0ZW1UZXh0O1xyXG4gIGFyci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5xdWV1ZUl0ZW07XHJcbiAgYXJyLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW0nKTtcclxuICBhcnIuaW5uZXJIVE1MID0gYXJyTmFtZTtcclxuICBpdGVtcy5pbnNlcnRCZWZvcmUoYXJyLCBpdGVtcy5jaGlsZE5vZGVzW2xdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgfSw1MDApXHJcbn1cclxuXHJcbmRlcXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0aWYoIXN0YWNrLmVtcHR5KCkpe1xyXG5cdFx0c3RhY2suZGVxdWV1ZSgpO1xyXG5cdFx0ZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcblx0XHRpdGVtcy5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoJ3BvcEFuaW1hdGlvbicpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGl0ZW1zLnJlbW92ZUNoaWxkKGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cdFx0XHRkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcblx0XHR9LCA1MDApO1xyXG5cdH1cclxufVxyXG59XHJcblxyXG5cclxuXHRcdFxyXG5cclxuY2xlYXJidG4ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGFjay5jbGVhcigpOyAgXHJcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcblx0c3RhY2tyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHF1ZXVlcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xyXG5cdHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRlbnF1ZXVlLmRpc2FibGVkID0gdmFsdWU7XHJcbn1cclxuIl19
