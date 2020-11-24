const Hashtable = require("../hashtable/Hashtable");

const inputA = document.getElementById("linear-a-input");

class LinearProbing extends Hashtable {
    constructor(...args) {
        super(...args);
    }
    
    // linear probing hash 함수
    hashFunction(key, order) {
        const A = (Number(inputA.value.trim() || 1) || 1);
        return (key + A * order) % this.tableSize;	
    }
}

module.exports = LinearProbing;

