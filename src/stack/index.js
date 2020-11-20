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

