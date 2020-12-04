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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9Db2xvci5qcyIsInNyYy9zdGFjay9RdWV1ZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbi8vIOyKpO2DnSDslYTsnbTthZzsnZgg64W465OcIOyDieyDgVxuY29uc3Qgc3RhY2tJdGVtID0gJyNmZjdmMDAnO1xuXG4vLyDsiqTtg50g7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcbmNvbnN0IHN0YWNrSXRlbVRleHQgPSAnI2Y1ZjZmYSc7XG5cbi8vIO2BkCDslYTsnbTthZzsnZgg64W465OcIOyDieyDgVxuY29uc3QgcXVldWVJdGVtID0gJyNmZjdmMDAnO1xuXG4vLyDtgZAg7JWE7J207YWc7J2YIO2FjeyKpO2KuCDsg4nsg4FcbmNvbnN0IHF1ZXVlSXRlbVRleHQgPSAnI2Y1ZjZmYSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgc3RhY2tJdGVtLFxuICAgIHN0YWNrSXRlbVRleHQsXG5cbiAgICBxdWV1ZUl0ZW0sXG4gICAgcXVldWVJdGVtVGV4dFxufSIsImNsYXNzIFF1ZXVlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pdGVtID0gW107XG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXG5gXG7tgZAocXVldWUp64qUIOuovOyggCDsp5HslrQg64Sj7J2AIOuNsOydtO2EsOqwgCDrqLzsoIAg64KY7Jik64qUIEZJRk8oRmlyc3QgSW4gRmlyc3QgT3V0LCDshKDsnoXshKDstpwp6rWs7KGw66GcIOyggOyepe2VmOuKlCDsnpDro4zqtazsobDsnoXri4jri6QuXG7rgpjspJHsl5Ag7KeR7Ja0IOuEo+ydgCDrjbDsnbTthLDqsIAg66i87KCAIOuCmOyYpOuKlCDsiqTtg53qs7zripQg67CY64yA65CY64qUIOqwnOuFkOyeheuLiOuLpC5cbu2UhOumsO2EsOydmCDstpzroKUg7LKY66as64KYIOyciOuPhCDsi5zsiqTthZzsnZgg66mU7Iuc7KeAIOyymOumrOq4sCwg7ZSE66Gc7IS47IqkIOq0gOumrCDrk7Eg642w7J207YSw6rCAIOyeheugpeuQnCDsi5zqsIQg7Iic7ISc64yA66GcIOyymOumrO2VtOyVvCDtlaAg7ZWE7JqU6rCAIOyeiOuKlCDsg4Htmansl5Ag7J207Jqp65Cp64uI64ukLlxu7YGQ7J2YIOunqCDslZ7snYQgZnJvbnQsIOunqCDrkqTrpbwgcmFyZeudvOqzoCDtlanri4jri6QuXG7tgZDsl5DshJwg642w7J207YSw66W8IOy2lOqwgO2VmOuKlCDqsoPsnYAgRW5xdWV1ZSwg7YGQ7JeQ7IScIOuNsOydtO2EsOulvCDqurzrgrTripQg6rKD7J2EIERlcXVldWXrnbzqs6Ag7ZWp64uI64ukLlxuYFxuICAgICk7XG4gIH1cbiAgZW5xdWV1ZShpdGVtKSB7XG4gICAgdGhpcy5pdGVtLnB1c2goaXRlbSk7XG4gIH1cbiAgZGVxdWV1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtLnNoaWZ0KCk7XG4gIH1cblx0ZW1wdHkoKXtcblx0XHRpZih0aGlzLml0ZW0ubGVuZ3RoPT0wKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0fVxuXHR9XG5cblx0Y2xlYXIoKXtcblx0XHR0aGlzLml0ZW0gPSBbXTtcblx0fVxuXHRzaXplKCl7XG5cdFx0cmV0dXJuIHRoaXMuaXRlbS5sZW5ndGg7XG4gIH1cblxuICBkcmF3RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb24tY29udGFpbmVyXCIpO1xuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7ISk66qFIOyCreygnFxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucmVtb3ZlKCkpO1xuICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyDspITrs4TroZxcbiAgICBkZXNjcmlwdGlvbi5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxkaXY+JHtsaW5lfTwvZGl2PiR7J1xcbid9YFxuICAgIH0pXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG4iLCJjbGFzcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcbmBcbuyKpO2DnShzdGFjaynsnYAg64KY7KSR7JeQIOynkeyWtCDrhKPsnYAg642w7J207YSw6rCAIOuovOyggCDrgpjsmKTripQgTElGTyhMYXN0IEluIEZpcnN0IE91dCwg7ZuE7J6F7ISg7LacKeq1rOyhsOuhnCDsoIDsnqXtlZjripQg7J6Q66OM6rWs7KGw7J6F64uI64ukLlxu7Iqk7YOd7J2AIOyerOq3gCDslYzqs6DrpqzsppgsIOyLpO2WiSDst6jshowsIOq0hO2YuCDqsoDsgqwg65Ox7JeQIO2ZnOyaqeuQqeuLiOuLpC5cbuyKpO2DneyXkOyEnCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIOqyg+ydgCBQdXNoLCDtgZDsl5DshJwg642w7J207YSw66W8IOq6vOuCtOuKlCDqsoPsnYQgUG9w7J2065286rOgIO2VqeuLiOuLpC5cbmBcbiAgICApO1xuICB9XG5cbiAgcHVzaChpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgcG9wKCkgeyBcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT0gMCkgXG4gICAgICByZXR1cm4gXCJFbXB0eVwiOyBcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5wb3AoKTsgXG4gIH1cblxuICBwZWVrKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV07IFxuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPT0gMDtcbiAgfVxuXG4gIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICB9XG5cbiAgZHJhd0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLWNvbnRhaW5lclwiKTtcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyEpOuqhSDsgq3soJxcbiAgICBBcnJheS5mcm9tKGRlc2NyaXB0aW9uQ29udGFpbmVyLmNoaWxkcmVuKS5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnJlbW92ZSgpKTtcbiAgICBkZXNjcmlwdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLy8g7KSE67OE66GcXG4gICAgZGVzY3JpcHRpb24uc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgICAgZGVzY3JpcHRpb25Db250YWluZXIuaW5uZXJIVE1MICs9IGA8ZGl2PiR7bGluZX08L2Rpdj4keydcXG4nfWBcbiAgICB9KVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuXG5cblxuIiwiY29uc3QgU3RhY2sgPSByZXF1aXJlKFwiLi9TdGFja1wiKTtcbmNvbnN0IFF1ZXVlID0gcmVxdWlyZShcIi4vUXVldWVcIik7XG5cbmNvbnN0IENvbG9yID0gcmVxdWlyZSgnLi9Db2xvcicpO1xuXG5jb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFjay1pdGVtcycpO1xuY29uc3QgcHVzaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXNoJyk7XG5jb25zdCBwdXNoYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gtYnRuJyk7XG5jb25zdCBwb3BidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wLWJ0bicpO1xuY29uc3QgY2xlYXJidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXItYnRuJyk7XG5jb25zdCBlbnF1ZXVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VucXVldWUnKTtcbmNvbnN0IGVucXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZS1idG4nKTtcbmNvbnN0IGRlcXVldWVidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVxdWV1ZS1idG4nKTtcbmNvbnN0IHN0YWNrX3Zpc2libGU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YWNrLWNvbnRhaW5lcicpO1xuY29uc3QgcXVldWVfdmlzaWJsZT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVldWUtY29udGFpbmVyJyk7XG5cbmxldCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG5jb25zdCBzdGFja3JhZGlvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiU3RhY2stcmFkaW9cIik7XG5jb25zdCBxdWV1ZXJhZGlvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiUXVldWUtcmFkaW9cIik7XG5cblxuXG5cbnF1ZXVlcmFkaW8ub25jaGFuZ2UgPSAoZSkgPT4ge1xuXHRzdGFjay5jbGVhcigpO1xuXHRkaXNhYmxlQnV0dG9ucyh0cnVlKTtcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgICAgICBpdGVtcy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gICAgICAgIH0sIDUwMCk7XG5cblx0c3RhY2sgPSBuZXcgUXVldWUoKTtcblx0c3RhY2tfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmxvY2tcIik7XG5cdHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImQtbm9uZVwiKTtcblx0cXVldWVfdmlzaWJsZS5jbGFzc0xpc3QucmVtb3ZlKFwiZC1ub25lXCIpO1xuXHRxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcbn07XG5cblxuc3RhY2tyYWRpby5vbmNoYW5nZSA9IChlKSA9PiB7XG5cdHN0YWNrLmNsZWFyKCk7XG4gICAgICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAgICAgICBpdGVtcy5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGFjay1pdGVtcy0tcmVtb3ZlJyk7XG4gICAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcbiAgICAgICAgfSwgNTAwKTtcblxuXHRzdGFjayA9IG5ldyBTdGFjaygpO1xuXHRzdGFja192aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJkLW5vbmVcIik7XG4gICAgICAgIHN0YWNrX3Zpc2libGUuY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xuICAgICAgICBxdWV1ZV92aXNpYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJibG9ja1wiKTtcbiAgICAgICAgcXVldWVfdmlzaWJsZS5jbGFzc0xpc3QuYWRkKFwiZC1ub25lXCIpO1xuXG59O1xuXG5cblxucHVzaGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIHN0YWNrX21hbnkgPSAkKCcuc3RhY2staXRlbScpLmxlbmd0aDtcbiAgaWYoc3RhY2tfbWFueSE9MTYpe1xuICBjb25zdCBpdGVtTmFtZSA9IE51bWJlcihwdXNoLnZhbHVlKTtcblx0c3RhY2sucHVzaChpdGVtTmFtZSk7XG5cbiAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBpdGVtLnN0eWxlLmNvbG9yID0gQ29sb3Iuc3RhY2tJdGVtVGV4dDtcbiAgaXRlbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5zdGFja0l0ZW07XG4gIGl0ZW0uY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbScpO1xuICBpdGVtLmlubmVySFRNTCA9IGl0ZW1OYW1lO1xuICBpdGVtcy5pbnNlcnRCZWZvcmUoaXRlbSwgaXRlbXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGlzYWJsZUJ1dHRvbnMoZmFsc2UpO1xuICB9LDUwMClcbiAgfVxufVxuXG5cbnBvcGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbiAgaWYoIXN0YWNrLmlzRW1wdHkoKSkge1xuICAgIHN0YWNrLnBvcCgpO1xuICAgIGRpc2FibGVCdXR0b25zKHRydWUpO1xuICAgIGl0ZW1zLmNoaWxkTm9kZXNbMF0uY2xhc3NMaXN0LmFkZCgncG9wQW5pbWF0aW9uJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpdGVtcy5yZW1vdmVDaGlsZChpdGVtcy5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcbiAgICB9LCA1MDApO1xuICB9XG59XG5cbmVucXVldWVidG4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBxdWV1ZV9tYW55ID0gJCgnLnF1ZXVlLWl0ZW0nKS5sZW5ndGg7XG4gIGlmKHF1ZXVlX21hbnkhPTE2KXtcbiAgICAgICAgY29uc3QgYXJyTmFtZSA9IE51bWJlcihlbnF1ZXVlLnZhbHVlKTtcbiAgICAgICAgc3RhY2suZW5xdWV1ZShhcnJOYW1lKTtcblx0dmFyIGwgPSBzdGFjay5zaXplKCk7XG5cbiAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gIC8vIENyZWF0ZSBIVE1MIGVsZW1lbnQgYW5kIHB1c2ggaXQgdG8gaXRlbXNcbiAgY29uc3QgYXJyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGFyci5zdHlsZS5jb2xvciA9IENvbG9yLnF1ZXVlSXRlbVRleHQ7XG4gIGFyci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5xdWV1ZUl0ZW07XG4gIGFyci5jbGFzc0xpc3QuYWRkKCdxdWV1ZS1pdGVtJyk7XG4gIGFyci5pbm5lckhUTUwgPSBhcnJOYW1lO1xuICBpdGVtcy5pbnNlcnRCZWZvcmUoYXJyLCBpdGVtcy5jaGlsZE5vZGVzW2xdKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gIH0sNTAwKVxufVxuXG5kZXF1ZXVlYnRuLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xuXHRpZighc3RhY2suZW1wdHkoKSl7XG5cdFx0c3RhY2suZGVxdWV1ZSgpO1xuXHRcdGRpc2FibGVCdXR0b25zKHRydWUpO1xuXHRcdGl0ZW1zLmNoaWxkTm9kZXNbMF0uY2xhc3NMaXN0LmFkZCgncG9wQW5pbWF0aW9uJyk7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpdGVtcy5yZW1vdmVDaGlsZChpdGVtcy5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdGRpc2FibGVCdXR0b25zKGZhbHNlKTtcblx0XHR9LCA1MDApO1xuXHR9XG59XG59XG5cblxuXHRcdFxuXG5jbGVhcmJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbiAgICBzdGFjay5jbGVhcigpOyAgXG4gICAgZGlzYWJsZUJ1dHRvbnModHJ1ZSk7XG4gICAgaXRlbXMuY2xhc3NMaXN0LmFkZCgnc3RhY2staXRlbXMtLXJlbW92ZScpO1xuICAgIGl0ZW1zLmNsYXNzTGlzdC5hZGQoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWNrLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgIGl0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3F1ZXVlLWl0ZW1zLS1yZW1vdmUnKTtcbiAgICAgIGl0ZW1zLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBkaXNhYmxlQnV0dG9ucyhmYWxzZSk7XG4gICAgfSwgNTAwKTtcbn1cblxuXG5cbi8vIEZ1bmN0aW9uc1xuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XG5cdHN0YWNrcmFkaW8uZGlzYWJsZWQgPSB2YWx1ZTtcblx0cXVldWVyYWRpby5kaXNhYmxlZCA9IHZhbHVlO1xuXHRjbGVhcmJ0bi5kaXNhYmxlZCA9IHZhbHVlO1xuXHRwdXNoLmRpc2FibGVkID0gdmFsdWU7XG5cdGVucXVldWUuZGlzYWJsZWQgPSB2YWx1ZTtcbn1cbiJdfQ==
