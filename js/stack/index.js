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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvc3RhY2svQ29sb3IuanMiLCJzcmMvanMvc3RhY2svUXVldWUuanMiLCJzcmMvanMvc3RhY2svU3RhY2suanMiLCJzcmMvanMvc3RhY2svaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcclxuY29uc3Qgc3RhY2tJdGVtID0gJ3Jvc3licm93bic7XHJcblxyXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcclxuY29uc3Qgc3RhY2tJdGVtVGV4dCA9ICdibGFjayc7XHJcblxyXG4vLyDtgZAg7JWE7J207YWc7J2YIOuFuOuTnCDsg4nsg4FcclxuY29uc3QgcXVldWVJdGVtID0gJ3Jvc3licm93bic7XHJcblxyXG4vLyDtgZAg7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcclxuY29uc3QgcXVldWVJdGVtVGV4dCA9ICdibGFjayc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHN0YWNrSXRlbSxcclxuICAgIHN0YWNrSXRlbVRleHQsXHJcblxyXG4gICAgcXVldWVJdGVtLFxyXG4gICAgcXVldWVJdGVtVGV4dFxyXG59IiwiY2xhc3MgUXVldWUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pdGVtID0gW107XHJcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcclxuYFxyXG7tgZAocXVldWUp64qUIOuovOyggCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIEZJRk8oRmlyc3QgSW4gRmlyc3QgT3V0LCDshKDsnoXshKDstpwp6rWs7KGw66GcIOyggOyepe2VmOuKlCDsnpDro4zqtazsobDsnoXri4jri6QuXHJcbuuCmOykkeyXkCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIOyKpO2DneqzvOuKlCDrsJjrjIDrkJjripQg6rCc64WQ7J6F64uI64ukLlxyXG7tlITrprDthLDsnZgg7Lac66ClIOyymOumrOuCmCDsnIjrj4Qg7Iuc7Iqk7YWc7J2YIOuplOyLnOyngCDsspjrpqzquLAsIO2UhOuhnOyEuOyKpCDqtIDrpqwg65OxIOuNsOydtO2EsOqwgCDsnoXroKXrkJwg7Iuc6rCEIOyInOyEnOuMgOuhnCDsspjrpqztlbTslbwg7ZWgIO2VhOyalOqwgCDsnojripQg7IOB7Zmp7JeQIOydtOyaqeuQqeuLiOuLpC5cclxu7YGQ7J2YIOunqCDslZ7snYQgZnJvbnQsIOunqCDrkqTrpbwgcmFyZeudvOqzoCDtlanri4jri6QuXHJcbu2BkOyXkOyEnCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIOqyg+ydgCBFbnF1ZXVlLCDtgZDsl5DshJwg642w7J207YSw66W8IOq6vOuCtOuKlCDqsoPsnYQgRGVxdWV1ZeudvOqzoCDtlanri4jri6QuXHJcbmBcclxuICAgICk7XHJcbiAgfVxyXG4gIGVucXVldWUoaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtLnB1c2goaXRlbSk7XHJcbiAgfVxyXG4gIGRlcXVldWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLnNoaWZ0KCk7XHJcbiAgfVxyXG5cdGVtcHR5KCl7XHJcblx0XHRpZih0aGlzLml0ZW0ubGVuZ3RoPT0wKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyKCl7XHJcblx0XHR0aGlzLml0ZW0gPSBbXTtcclxuXHR9XHJcblx0c2l6ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbi1jb250YWluZXJcIik7XHJcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyEpOuqhSDsgq3soJxcclxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xyXG4gICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAvLyDspITrs4TroZxcclxuICAgIGRlc2NyaXB0aW9uLnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XHJcbiAgICAgICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MICs9IGA8ZGl2PiR7bGluZX08L2Rpdj4keydcXG4nfWBcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XHJcbiIsImNsYXNzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxyXG5gXHJcbuyKpO2DnShzdGFjaynsnYAg64KY7KSR7JeQIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQgTElGTyhMYXN0IEluIEZpcnN0IE91dCwg7ZuE7J6F7ISg7LacKeq1rOyhsOuhnCDsoIDsnqXtlZjripQg7J6Q66OM6rWs7KGw7J6F64uI64ukLlxyXG7siqTtg53snYAg7J6s6reAIOyVjOqzoOumrOymmCwg7Iuk7ZaJIOy3qOyGjCwg6rSE7Zi4IOqygOyCrCDrk7Hsl5Ag7Zmc7Jqp65Cp64uI64ukLlxyXG7siqTtg53sl5DshJwg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCDqsoPsnYAgUHVzaCwg7YGQ7JeQ7IScIOuNsOydtO2EsOulvCDqurzrgrTripQg6rKD7J2EIFBvcOydtOudvOqzoCDtlanri4jri6QuXHJcbmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdXNoKGl0ZW0pIHtcclxuICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICB9XHJcblxyXG4gIHBvcCgpIHsgXHJcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT0gMCkgXHJcbiAgICAgIHJldHVybiBcIkVtcHR5XCI7IFxyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMucG9wKCk7IFxyXG4gIH1cclxuXHJcbiAgcGVlaygpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV07IFxyXG4gIH1cclxuXHJcbiAgaXNFbXB0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PSAwO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgZHJhd0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb24tY29udGFpbmVyXCIpO1xyXG4gICAgLy8g6riw7KG07JeQIOyeiOuNmCDshKTrqoUg7IKt7KCcXHJcbiAgICBBcnJheS5mcm9tKGRlc2NyaXB0aW9uQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnJlbW92ZSgpKTtcclxuICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgLy8g7KSE67OE66GcXHJcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCArPSBgPGRpdj4ke2xpbmV9PC9kaXY+JHsnXFxuJ31gXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xyXG5cclxuXHJcblxyXG4iLCJjb25zdCBTdGFjayA9IHJlcXVpcmUoXCIuL1N0YWNrXCIpO1xyXG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoXCIuL1F1ZXVlXCIpO1xyXG5cclxuY29uc3QgQ29sb3IgPSByZXF1aXJlKCcuL0NvbG9yJyk7XHJcblxyXG5jb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFjay1pdGVtcycpO1xyXG5jb25zdCBwdXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gnKTtcclxuY29uc3QgcHVzaGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoLWJ0bicpO1xyXG5jb25zdCBwb3BidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wLWJ0bicpO1xyXG5jb25zdCBjbGVhcmJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKTtcclxuY29uc3QgZW5xdWV1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbnF1ZXVlJyk7XHJcbmNvbnN0IGVucXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZS1idG4nKTtcclxuY29uc3QgZGVxdWV1ZWJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXF1ZXVlLWJ0bicpO1xyXG5jb25zdCBzdGFja192aXNpYmxlPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFjay1jb250YWluZXInKTtcclxuY29uc3QgcXVldWVfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVldWUtY29udGFpbmVyJyk7XHJcblxyXG5sZXQgc3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHJcbmNvbnN0IHN0YWNrcmFkaW89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTdGFjay1yYWRpb1wiKTtcclxuY29uc3QgcXVldWVyYWRpbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlF1ZXVlLXJhZGlvXCIpO1xyXG5cclxuXHJcblxyXG5cclxucXVldWVyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XHJcblx0c3RhY2suY2xlYXIoKTtcclxuXHRkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG5cdHN0YWNrID0gbmV3IFF1ZXVlKCk7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cdHF1ZXVlX3Zpc2libGUuY2xhc3NMaXN0LnJlbW92ZShcImQtbm9uZVwiKTtcclxuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxufTtcclxuXHJcblxyXG5zdGFja3JhZGlvLm9uY2hhbmdlID0gKGUpID0+IHtcclxuXHRzdGFjay5jbGVhcigpO1xyXG4gICAgICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgICAgaXRlbXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcblx0c3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XHJcbiAgICAgICAgc3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XHJcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xyXG5cclxufTtcclxuXHJcblxyXG5cclxucHVzaGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgc3RhY2tfbWFueSA9ICQoJy5zdGFjay1pdGVtJykubGVuZ3RoO1xyXG4gIGlmKHN0YWNrX21hbnkhPTE2KXtcclxuICBjb25zdCBpdGVtTmFtZSA9IE51bWJlcihwdXNoLnZhbHVlKTtcclxuXHRzdGFjay5wdXNoKGl0ZW1OYW1lKTtcclxuXHJcbiAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgLy8gQ3JlYXRlIEhUTUwgZWxlbWVudCBhbmQgcHVzaCBpdCB0byBpdGVtc1xyXG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBpdGVtLnN0eWxlLmNvbG9yID0gQ29sb3Iuc3RhY2tJdGVtVGV4dDtcclxuICBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IENvbG9yLnN0YWNrSXRlbTtcclxuICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3N0YWNrLWl0ZW0nKTtcclxuICBpdGVtLmlubmVySFRNTCA9IGl0ZW1OYW1lO1xyXG4gICAvLyDqt7jrprzsnpAg6rCV7KGwIO2aqOqzvCDshKTsoJVcclxuICBpdGVtLnN0eWxlLmJveFNoYWRvdyA9ICdpbnNldCAycHggMnB4IDVweCByb3N5YnJvd24sIDJweCAycHggMTBweCByb3N5YnJvd24nO1xyXG4gIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtLCBpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XHJcbiAgICAgLy8g6re466a87J6QIOqwleyhsCDtmqjqs7wg7IKt7KCcXHJcbiAgICBpdGVtLnN0eWxlLmJveFNoYWRvdyA9ICcnO1xyXG4gIH0sNTAwKVxyXG4gIH1cclxufVxyXG5cclxuXHJcbnBvcGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICBpZighc3RhY2suaXNFbXB0eSgpKSB7XHJcbiAgICBzdGFjay5wb3AoKTtcclxuICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG4gICAgaXRlbXMuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKCdwb3BBbmltYXRpb24nKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5yZW1vdmVDaGlsZChpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG4gICAgfSwgNTAwKTtcclxuICB9XHJcbn1cclxuXHJcbmVucXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gIHF1ZXVlX21hbnkgPSAkKCcucXVldWUtaXRlbScpLmxlbmd0aDtcclxuICBpZihxdWV1ZV9tYW55IT0xNil7XHJcbiAgICAgICAgY29uc3QgYXJyTmFtZSA9IE51bWJlcihlbnF1ZXVlLnZhbHVlKTtcclxuICAgICAgICBzdGFjay5lbnF1ZXVlKGFyck5hbWUpO1xyXG5cdHZhciBsID0gc3RhY2suc2l6ZSgpO1xyXG5cclxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXHJcbiAgY29uc3QgYXJyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgYXJyLnN0eWxlLmNvbG9yID0gQ29sb3IucXVldWVJdGVtVGV4dDtcclxuICBhcnIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gQ29sb3IucXVldWVJdGVtO1xyXG4gIGFyci5jbGFzc0xpc3QuYWRkKCdxdWV1ZS1pdGVtJyk7XHJcbiAgYXJyLmlubmVySFRNTCA9IGFyck5hbWU7XHJcbiAgLy8g6re466a87J6QIOqwleyhsCDtmqjqs7wg7ISk7KCVXHJcbiAgYXJyLnN0eWxlLmJveFNoYWRvdyA9ICdpbnNldCAycHggMnB4IDVweCByb3N5YnJvd24sIDJweCAycHggMTBweCByb3N5YnJvd24nO1xyXG4gIGl0ZW1zLmluc2VydEJlZm9yZShhcnIsIGl0ZW1zLmNoaWxkTm9kZXNbbF0pO1xyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgIC8vIOq3uOumvOyekCDqsJXsobAg7Zqo6rO8IOyCreygnFxyXG4gICAgYXJyLnN0eWxlLmJveFNoYWRvdyA9ICcnO1xyXG4gIH0sNTAwKVxyXG59XHJcblxyXG5kZXF1ZXVlYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG5cdGlmKCFzdGFjay5lbXB0eSgpKXtcclxuXHRcdHN0YWNrLmRlcXVldWUoKTtcclxuXHRcdGRpc2FibGVCdXR0b25zKHRydWUpO1xyXG5cdFx0aXRlbXMuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKCdwb3BBbmltYXRpb24nKTtcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRpdGVtcy5yZW1vdmVDaGlsZChpdGVtcy5jaGlsZE5vZGVzWzBdKTtcclxuXHRcdFx0ZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xyXG5cdFx0fSwgNTAwKTtcclxuXHR9XHJcbn1cclxufVxyXG5cclxuXHJcblx0XHRcclxuXHJcbmNsZWFyYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhY2suY2xlYXIoKTsgIFxyXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XHJcbiAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdxdWV1ZS1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xyXG4gICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdxdWV1ZS1pdGVtcy0tcmVtb3ZlJyk7XHJcbiAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgIH0sIDUwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gRnVuY3Rpb25zXHJcbmZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKHZhbHVlID0gdHJ1ZSkge1xyXG5cdHN0YWNrcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRxdWV1ZXJhZGlvLmRpc2FibGVkID0gdmFsdWU7XHJcblx0Y2xlYXJidG4uZGlzYWJsZWQgPSB2YWx1ZTtcclxuXHRwdXNoLmRpc2FibGVkID0gdmFsdWU7XHJcblx0ZW5xdWV1ZS5kaXNhYmxlZCA9IHZhbHVlO1xyXG59XHJcbiJdfQ==
