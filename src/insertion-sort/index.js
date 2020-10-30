const InsertionSort = require('./InsertionSort');
const Block = require('../sort/Block');

const container = document.querySelector('.data-container');

// 0~100 사이 랜덤 값을 가지는 블록 num개 생성 
function generateBlocks(num = 20,container) {
    const blocks = [];
    for (let i = 0; i < num; i += 1) {
        const value = Math.floor(Math.random() * 100);
        const block = Block.createNewBlock(value,container);
        blocks.push(block);
    }
    return blocks;
}

const blocks = generateBlocks(20,container);
const insertionSort = new InsertionSort(container,blocks,200,250);

insertionSort.sort();
