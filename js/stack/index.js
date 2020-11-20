(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

  swap() {
    if(this.items.length > 1) {
      let temp = this.items[this.items.length - 1];
      this.items[this.items.length - 1] = this.items[this.items.length - 2];
      this.items[this.items.length - 2] = temp;
    }
  }

  clear() {
    this.items = [];
  }
}
module.exports = Stack;




},{}],2:[function(require,module,exports){
const Stack = require("./Stack");
const items = document.querySelector('.stack-items');
const push = document.getElementById('push');
const pushbtn = document.getElementById('push-btn');
const popbtn = document.getElementById('pop-btn');

const stack = new Stack();

pushbtn.onclick = function() {
	const itemName = push.value;
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

// Functions
function disableButtons(value = true) {
  // clearStack.disabled = value;
  push.disabled = value;
}


},{"./Stack":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zdGFjay9TdGFjay5qcyIsInNyYy9zdGFjay9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICB9XHJcblxyXG4gIHB1c2goaXRlbSkge1xyXG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gIH1cclxuXHJcbiAgcG9wKCkgeyBcclxuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PSAwKSBcclxuICAgICAgcmV0dXJuIFwiRW1wdHlcIjsgXHJcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5wb3AoKTsgXHJcbiAgfVxyXG5cclxuICBwZWVrKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTsgXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID09IDA7XHJcbiAgfVxyXG5cclxuICBnZXRTaXplKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgc3dhcCgpIHtcclxuICAgIGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMSkge1xyXG4gICAgICBsZXQgdGVtcCA9IHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXTtcclxuICAgICAgdGhpcy5pdGVtc1t0aGlzLml0ZW1zLmxlbmd0aCAtIDFdID0gdGhpcy5pdGVtc1t0aGlzLml0ZW1zLmxlbmd0aCAtIDJdO1xyXG4gICAgICB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMl0gPSB0ZW1wO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XHJcblxyXG5cclxuXHJcbiIsImNvbnN0IFN0YWNrID0gcmVxdWlyZShcIi4vU3RhY2tcIik7XHJcbmNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YWNrLWl0ZW1zJyk7XHJcbmNvbnN0IHB1c2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVzaCcpO1xyXG5jb25zdCBwdXNoYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B1c2gtYnRuJyk7XHJcbmNvbnN0IHBvcGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3AtYnRuJyk7XHJcblxyXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xyXG5cclxucHVzaGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcblx0Y29uc3QgaXRlbU5hbWUgPSBwdXNoLnZhbHVlO1xyXG5cdHN0YWNrLnB1c2goaXRlbU5hbWUpO1xyXG5cclxuICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAvLyBDcmVhdGUgSFRNTCBlbGVtZW50IGFuZCBwdXNoIGl0IHRvIGl0ZW1zXHJcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gXHJcbiAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzdGFjay1pdGVtJyk7XHJcbiAgaXRlbS5pbm5lckhUTUwgPSBpdGVtTmFtZTtcclxuICBcclxuXHJcbiAgaXRlbXMuaW5zZXJ0QmVmb3JlKGl0ZW0sIGl0ZW1zLmNoaWxkTm9kZXNbMF0pO1xyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICB9LDUwMClcclxufVxyXG5cclxuXHJcbnBvcGJ0bi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICBpZighc3RhY2suaXNFbXB0eSgpKSB7XHJcbiAgICBzdGFjay5wb3AoKTtcclxuXHJcbiAgICBkaXNhYmxlQnV0dG9ucyh0cnVlKTtcclxuICAgIGl0ZW1zLmNoaWxkTm9kZXNbMF0uY2xhc3NMaXN0LmFkZCgncG9wQW5pbWF0aW9uJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaXRlbXMucmVtb3ZlQ2hpbGQoaXRlbXMuY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgIGRpc2FibGVCdXR0b25zKGZhbHNlKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBGdW5jdGlvbnNcclxuZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnModmFsdWUgPSB0cnVlKSB7XHJcbiAgLy8gY2xlYXJTdGFjay5kaXNhYmxlZCA9IHZhbHVlO1xyXG4gIHB1c2guZGlzYWJsZWQgPSB2YWx1ZTtcclxufVxyXG5cclxuIl19
