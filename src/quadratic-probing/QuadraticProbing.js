class QuadraticProbing {
    // 해시 테이블 생성자 함수
    constructor(tableSize = 5) {
        this.tableSize = tableSize
        this.hashTable = new Array(tableSize)
    }
    // quadratic hash 함수
    hashFunction(key, order) {
        return (key + order * order) % this.tableSize
    }
    // 삽입 함수
    insert(key) {
        key = parseInt(key);
	if (isNaN(key))
	    throw "Invalid Key!"
	let flag = 1;
	let order = 0;
	while (flag) {
	    let hashedKey = this.hashFunction(key, order++);

	    if (this.hashTable[hashedKey] == undefined || 
				this.hashTable[hashedKey] == null) {
		this.hashTable[hashedKey] = key;
		return hashedKey;
	    }

            if (this.hashTable[hashedKey] == key)
		throw "Duplicate Key!"	

	    for (let i = 0; i < this.tableSize; i++) {
		if (this.hashTable[i] == undefined || this.hashTable[i] == null)
			break ;
		if (i == this.tableSize - 1)
			flag = 0;
	    }
	
	}
	throw "Overflow!"
    }

    // 검색 함수
    search(key) {
        key = parseInt(key)
        if (isNaN(key))
            throw "Invalid Key!"
	let flag = 1;
	let order = 0;
	while (flag) {
	     let hashedKey = this.hashFunction(key, order++);
	
	     if (this.hashTable[hashedKey] == undefined)
		throw "Key Not Found!"
	     if (this.hashTable[hashedKey] == key)
		return hashedKey;

	     for (let i = 0; i < this.tableSize; i++) {
		if (this.hashTable[i] == undefined || this.hashTable[i] == null)
			break ;
		if (i == this.tableSize - 1)
			flag = 0;
	    }
	}
    } 


    // 삭제 함수
    delete(key) {
        let hashedKey = this.search(key)
        this.hashTable[hashedKey] = null
        return hashedKey
    }
}

module.exports = QuadraticProbing;
