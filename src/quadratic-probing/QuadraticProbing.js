const Hashtable = require("../hashtable/Hashtable");

const inputA = document.getElementById("quadratic-a-input");
const inputB = document.getElementById("quadratic-b-input");

class QuadraticProbing extends Hashtable {
    constructor(...args) {
        super(...args);
    }

    // quadratic probing hash 함수
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
        const A = Number(inputA.value.trim() || 1) || 1;
        const B = Number(inputB.value.trim() || 0);
        return (key + B * order + A * order* order) % this.tableSize;
    } 
}

module.exports = QuadraticProbing;