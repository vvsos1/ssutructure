const p5 = require("p5");

// h(key, order) = h(key) + b * order + a * order * order 에서 a, b 값을 받아 옴 
const inputA = document.getElementById("quadratic-a-input");
const inputB = document.getElementById("quadratic-b-input");

const DataSearch = document.getElementById("data-search");
const DataSearchBtn = document.getElementById("data-search-btn");

class QuadraticProbing {

    // 해시 테이블 생성자 함수
    constructor(tableSize = 5) {
        this.tableSize = tableSize;
        this.hashTable = new Array(tableSize);
        this.searchedIndex = null;

        const setting = (p) => {
            const hashtable = this;

            function clearAndRedraw() {
                p.clear();
                p.redraw();
            }

            // 해시테이블의 위치 지정 함수
            function getCirclePosition(index) {
                return Object.freeze({
                x: 
                    p.displayWidth / 10,
                y: 
                    50 + p.windowHeight / (hashtable.tableSize * 1.2) * index,
                });
            }

            function setup() {
                p.createCanvas(p.displayWidth / 2, p.windowHeight);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(30);
                p.ellipseMode(p.CENTER);
                p.strokeWeight(3);
                p.noLoop();
            }

            const draw = () => {
                for (let i = 0; i < hashtable.tableSize; ++i) {
                    let key = hashtable.hashTable[i];

                    if (key === null) {
                        key = "DEL";
                        p.fill("orange");
                    }

                    if (key !== undefined) {
                        p.stroke("orange");
                    }

                    if (this.searchedIndex  === i) {
                        p.stroke("#bbdeed");
                    }

                    const c = getCirclePosition(i);

                    p.circle(c.x, c.y, 60);
                 
                    if (key !== undefined) {
                        if (key == "DEL") p.fill(255);
                        else if (i === this.searchedIndex) p.fill("#bbdeed");
                        else p.fill("orange");
                        p.text(key, c.x, c.y);
                        p.fill(255);
                        p.stroke("black");
                    }
                }
                clearAndRedraw;
            };

            p.setup = setup;
            p.draw = draw;

            this.remove = () => p.remove();
            this.draw = clearAndRedraw;
        };
        new p5(setting, document.getElementById("container"));
    }
    
    // quadratic probing hash 함수
    hashFunction(key, order) {

        // 음수 key 값에 대한 처리
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

    // 삽입 함수
    insert(key) {

        key = parseInt(key);
        
        // 잘못된 입력인 경우 입력 오류 메세지 출력
        if (isNaN(key))
            throw "Invalid Key!"

        // 해시 함수값의 인덱스에 있는 값이 undefined나 null일 경우 해당 인덱스에 키값 삽입
        // 이미 키값이 있으면 중복 메세지 반환
        for (let i = 0; i < this.tableSize; i++) {
                let hashedKey = this.hashFunction(key, i);
                switch (this.hashTable[hashedKey]) {
                    case undefined:
                    case null:
                        this.hashTable[hashedKey] = key;
                        this.draw();
                        return hashedKey;
                    case key:
                        throw "Duplicate Key!"
                }
        }
        // 삽입 실패 또는 중복 탐지 실패 시
        // 테이블이 다 찼음으로 판단하여 오버 플로우 메세지 출력
        throw "Overflow!"
    }

    // 검색 함수
    search(key) {

        key = parseInt(key)

	    // 잘못된 입력일 경우 오류 메세지 출력
        if (isNaN(key))
           throw "Invalid Key!"

	    // 해시함수 값과 키값이 같으면 해당 인덱스 반환 
        for (let i = 0; i < this.tableSize; ++i) {

            let hashedKey = this.hashFunction(key, i);

	    if (this.hashTable[hashedKey] == key) {
            //this.draw();
            this.searchedIndex = key;
            this.draw();
            return ;
        }
		    
        }
	    // 검색 실패시 해당 키 값이 없음으로 판단하여 검색 오류 메세지 출력
	    throw "Key Not Found!"
    } 


    // 삭제 함수
    // 검색 함수를 이용하여 키의 위치를 찾아내어 해당 위치의 값을 null로 변
    delete(key) {

        let hashedKey = this.search(key);
        this.hashTable[hashedKey] = null;
        this.draw();
        return hashedKey;
    }
}

module.exports = QuadraticProbing;