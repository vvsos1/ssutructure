// h(key) = (key + a * order) mod 5 에서 a 값을 받아 옴
const inputA = document.getElementById("linear-a-input");

class LinearProbing { 

    // 해시 테이블 생성자 함수
    constructor(tableSize = 5) {
        this.tableSize = tableSize;
        this.hashTable = new Array(tableSize);
    }

    // linear probing hash 함수
    hashFunction(key, order) {

	// 입력값이 음수인 경우에 대한 처리 
	if (key < 0) 
	    key += this.tableSize;

	const A = (Number(inputA.value.trim() || 1) || 1);
        return (key + A * order) % this.tableSize
    }

    // 삽입 함수
    insert(key) {

        key = parseInt(key)

	// 잘못된 입력일 경우 입력 오류 메세지 출력
        if (isNaN(key))
            throw "Invalid Key!"

	// 해시 함수값의 인덱스에 있는 값이 undefined나 null일 경우 해당 인덱스에 키값 삽입
	// 이미 키값이 있으면 중복 메세지 반환
        for (let i = 0; i < this.tableSize; ++i) {

            let hashedKey = this.hashFunction(key, i);

            switch (this.hashTable[hashedKey]) {
                case undefined:
                case null:
                    this.hashTable[hashedKey] = key;
                    return hashedKey;
                case key:
                    throw "Duplicate Key!"
            }
        }
	// 삽입 실패 또는 중복 탐지 실패 시 
	// 테이블이 다 찼음으로 판단하여 오버플로우 메세지 출력
        throw "Overflow!"
    }

    // 검색 함수
    search(key) {

        key = parseInt(key);

	// 잘못된 입력일 경우 오류 메세지 출력
        if (isNaN(key))
            throw "Invalid Key!"

	// 해시함수값과 키값이 같으면 해당 인덱스 반환
        for (let i = 0; i < this.tableSize; ++i) {

            let hashedKey = this.hashFunction(key, i);

	    if (this.hashTable[hashedKey] == key)
		    return hashedKey;
        }
	// 검색 실패시 해당 키 값이 없음으로 판단하여 검색 오류 메세지 출력
	throw "Key Not Found!"
    }

    // 삭제 함수
    // 검색 함수를 이용하여 키의 위치를 찾아내어 해당 위치의 값을 null로 변경
    delete(key) {

        let hashedKey = this.search(key);

        this.hashTable[hashedKey] = null;

        return hashedKey
    }
}

module.exports = LinearProbing;
