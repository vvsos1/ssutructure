const Chaning = require('./Chaining');

const DataAdd = document.getElementById("data-add");
const DataAddBtn = document.getElementById("data-add-btn");

const hashTable = new Chaning();

DataAddBtn.onclick = e => {
    const key = DataAdd.value;

    hashTable.insert(key);

    hashTable.draw();
}

