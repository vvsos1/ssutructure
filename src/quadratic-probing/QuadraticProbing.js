const Hashtable = require("../hashtable/Hashtable");

const inputA = document.getElementById("quadratic-a-input");
const inputB = document.getElementById("quadratic-b-input");

class QuadraticProbing extends Hashtable {
    constructor(...args) {
        super(...args);
    }

    // quadratic probing hash 함수
    hashFunction(key, order) {	
        const A = Number(inputA.value.trim() || 1) || 1;
        const B = Number(inputB.value.trim() || 0);
        return (key + B * order + A * order* order) % this.tableSize;
    } 
}

module.exports = QuadraticProbing;