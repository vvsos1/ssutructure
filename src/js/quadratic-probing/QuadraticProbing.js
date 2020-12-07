const Hashtable = require("../hashtable/Hashtable");

const inputA = document.getElementById("quadratic-a-input");
const inputB = document.getElementById("quadratic-b-input");

class QuadraticProbing extends Hashtable {
    constructor(...args) {
        super(...args);
        this.drawDescription(
`
개방주소법 중 하나인 QuadraticProbing은 hash collision 발생 시 충돌이 발생한 hash의 제곱을 한 비어있는 저장소에 데이터를 저장합니다.
개방주소법의 장점인 다른 저장공간 없이 해시테이블 내에서 저장 및 처리를 할 수 있습니다.
하지만 해시 함수의 성능에 의해 전체 해시테이블의 성능이 좌우되는 단점이 있습니다.
또한, 여러 개의 서로 다른 키들이 동일한 초기 해시값을 가지는 secondary clustring에 취약합니다.
`
        );
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