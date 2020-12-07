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
