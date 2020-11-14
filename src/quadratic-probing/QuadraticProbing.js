// h(k, i) = h(k) + bi + ai ^ 2
const inputA = document.getElementById("a-input");
const inputB = document.getElementById("b-input");

class QuadraticProbing {
    // 해시 테이블 생성자 함수
    constructor(tableSize = 5) {
        this.tableSize = tableSize
        this.hashTable = new Array(tableSize)
    }

    hashFunction(k,i) {
        const A = Number(inputA.value.trim() || 1) || 1;
        const B = Number(inputB.value.trim() || 0);
        return (k + B * i + A * i* i) % this.tableSize;
    }    

    // 삽입 함수
    insert(key) {
        key = parseInt(key);
	if (isNaN(key))
	    throw "Invalid Key!"
	for (let i = 0; i < this.tableSize; ++i) {
            let hashedKey = this.hashFunction(key, i)
            switch (this.hashTable[hashedKey]) {
                case undefined:
                case null:
                    this.hashTable[hashedKey] = key
                    return hashedKey
                case key:
                    throw "Duplicate Key!"
            }
	}
	throw "Overflow!"
    }

    // 검색 함수
    search(key) {
        key = parseInt(key)
        if (isNaN(key))
            throw "Invalid Key!"
        for (let i = 0; i < this.tableSize; ++i) {
            let hashedKey = this.hashFunction(key, i);

	    if (this.hashTable[hashedKey] == key)
		    return hashedKey;
        }
	throw "Key Not Found!"
    } 


    // 삭제 함수
    delete(key) {
        let hashedKey = this.search(key)
        this.hashTable[hashedKey] = null
        return hashedKey
    }
}

module.exports = QuadraticProbing;
