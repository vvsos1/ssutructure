const Block = require('../sort/Block')
const BubbleSort = require('../bubble-sort/BubbleSort');
const InsertionSort = require('../insertion-sort/InsertionSort');
const SelectionSort = require('../selection-sort/SelectionSort');

// 정렬이 시각화 될 container
const container = document.querySelector('.data-container');

// radio.checked 의 값을 읽어와서 사용
const bubbleSortRadio = document.getElementById('bubble-sort-radio');
const insertionSortRadio = document.getElementById('insertion-sort-radio');
const selectionSortRadio = document.getElementById('selection-sort-radio');

// 애니메이션 딜레이 Range
const delayRange = document.getElementById('animation-delay-range');

// 시각화 블록 크기 Range
const sizeRange = document.getElementById('size-range');

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById('new-data-input');
// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById('new-data-add-btn');

// 정렬 시작 Button
const sortStartBtn = document.getElementById('sort-start-btn');


function generateUniqueBlocks(num = 20, container) {
    const values = [];
    while (values.length < num) {
        const value = Math.floor(Math.random() * 100);
        if (!values.includes(value)) {
            values.push(value);
        }
    }
    return values.map(value => Block.createNewBlock(value, container));
}



// sort type radio로 부터 값을 읽어서 Sort Algorithm을 결정
function getSortAlgorithm() {
    let SortAlgorithm;
    if (insertionSortRadio.checked) {
        SortAlgorithm = InsertionSort
    } else if (selectionSortRadio.checked) {
        SortAlgorithm = SelectionSort;
    }
    else {
        SortAlgorithm = BubbleSort
    }
    return SortAlgorithm;
}




const blocks = generateUniqueBlocks(20, container);

let sort = new (getSortAlgorithm())(container, blocks, 250, 250);


delayRange.oninput = e => {
    const delay = e.target.value;
    sort.setAnimationDelay(delay);
    sort.setDelay(delay);
}

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = e => {
    const size = e.target.value;
    console.log('size: ' + size);
    sort.setBlockWidth(size);
}


newDataAddBtn.onclick = e => {
    // 아무것도 입력하지 않았다면
    if (newDataInput.value == '')
    return;

    const value = Number(newDataInput.value);

    const newBlock = Block.createNewBlock(value,container);
    sort.addBlock(newBlock);
}

// isSortRunning은 현재 정렬이 진행중인지 표시하는 변수. true이면 sortStartBtn이 동작하지 않는다.
let isSortRunning = false;
sortStartBtn.onclick = e => {
    if (isSortRunning) {
        return;
    }
    isSortRunning = true;
    const SortAlgorithm = getSortAlgorithm();

    sort = new SortAlgorithm(container, sort.getBlocks(), sort.delay, sort.animationDelay);

    sort.getBlocks().forEach(block => block.setColorDefault());
    sort.sort()
        .then(_ => isSortRunning = false);
};
