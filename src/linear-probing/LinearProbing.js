const Hashtable = require("../hashtable/Hashtable");

const inputA = document.getElementById("linear-a-input");

class LinearProbing extends Hashtable {
    constructor(...args) {
        super(...args);
    }
    
    // linear probing hash 함수
    hashFunction(key, order) {
        if (key < 0) {
            key = key * -1;
            let i;
            for (i = 0; i < 5; i++) {
           if ((key + i) % 5 == 0)
               break ;
            }
            key = i;
        }
        const A = (Number(inputA.value.trim() || 1) || 1);
        return (key + A * order) % this.tableSize;	
    }
}

module.exports = LinearProbing;

