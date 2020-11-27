const p5 = require("p5");
const Color = require('./Color');

class Hashtable {

    constructor(tableSize = 5) {
        this.tableSize = tableSize;
        this.hashTable = new Array(tableSize);
        this.searchedIndex = null;
        this.insertedIndex = null;
        this.searchStep = null;
        this.insertStep = null;

        const setting = (p) => {
            const hashtable = this;

            function clearAndRedraw() {
                p.clear();
                p.redraw();
            }

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

                    if (this.searchedIndex === i) p.stroke(Color.searchedNodeBorder); 
                    else if (this.searchStep === i) p.stroke(Color.searchStepNodeBorder);
                    else if (this.insertedIndex === i) p.stroke(Color.insertedNodeBorder); 
                    else if (this.insertStep === i) p.stroke(Color.insertStepNodeBorder);
                 
                    const c = getCirclePosition(i);
                    p.circle(c.x, c.y, 60);

                    if (key !== undefined && key !== "DELETED") {
                        if (this.searchedIndex === i) p.fill(Color.searchedNodeText); 
                        else if (this.searchStep === i) p.fill(Color.searchStepNodeText);
                        else if (this.insertedIndex === i) p.fill(Color.insertedNodeText);
                        else if (this.insertStep === i) p.fill(Color.insertStepNodeText); 
                        else p.fill(Color.defaultText); 
                        p.text(key, c.x, c.y);
                        p.fill(255);
                        p.stroke(Color.defaultBorder);
                    }

                    if (this.description !== undefined && this.description.i === i) {
                        p.fill(Color.descriptionText);    // 변경 
                        p.stroke(Color.descriptionTextBorder);  // 해주세용 ^^!!!! 
                        p.text(this.description.text, c.x + 200, c.y);
                    }
                    p.fill(255);
                    p.stroke(Color.defaultBorder);

                }
                this.searchedIndex = null;
                this.searchStep = null;
                this.insertedIndex = null;
                this.insertStep = null;
                this.description = undefined;
            };

            p.setup = setup;
            p.draw = draw;

            this.remove = () => p.remove();
            this.draw = clearAndRedraw;
        };
        new p5(setting, document.getElementById("container"));
    }

    setDescription(i, text) {
        this.description = {i : i, text : text};
    }
    
    async insert(key) {

        key = parseInt(key);

        if (isNaN(key)) throw new Error("Invalid Key!");

        let tableItem;
        for (tableItem = 0; tableItem <this.tableSize; tableItem++) {
            if (this.hashTable[tableItem] == null) break;
            if (this.hashTable[tableItem] == undefined) break;
            if (this.hashTable[tableItem] == "DELETED") break;
        }
        if (tableItem == this.tableSize) throw new Error("Overflow!"); //linear probing overflow  

        for (let i = 0; i < this.tableSize; i++) {

            let hashedKey = this.hashFunction(key, i);
                
            this.insertStep = hashedKey;

            switch (this.hashTable[hashedKey]) {
                case undefined:
                case null:
                case "DELETED":
                    this.hashTable[hashedKey] = key;
                    this.insertedIndex = hashedKey;
                    this.setDescription(hashedKey, "삽입 성공");
                    await this.sleep(500);
                    this.draw();
                    return;
                case key:
                    this.insertStep = hashedKey;
                    await this.sleep(500);
                    this.draw();
                    throw new Error("Duplicate Key!");
                default:
                    this.setDescription(hashedKey, "충돌!!!");
                    await this.sleep(500);
                    this.draw();
            }
        }
        throw new Error("Hash function Overflow!"); // quadratic function overflow
    }

    async search(key) {

        key = parseInt(key);

        if (isNaN(key)) throw new Error("Invalid Key!");

        let found = 0;

        for (let i = 0; i < this.tableSize; i++) {
            let hashedKey = this.hashFunction(key, i);

            if (this.hashTable[hashedKey] == key) {
                found = 1;
                break ;
            }
        }

        if (!found) throw new Error("Key Not Found!");

        for (let i = 0; i < this.tableSize; i++) {

            let hashedKey = this.hashFunction(key, i);

            this.searchStep = hashedKey;

            if (this.hashTable[hashedKey] == key) {
                this.searchedIndex = hashedKey;
                this.setDescription(hashedKey, "검색 성공");
                await this.sleep(500);
                this.draw();
                return;
            }
            this.setDescription(hashedKey, "아직.. 아니에요.."); // 문구 수정해주삼 뇌절왔읍니다
            await this.sleep(500);
            this.draw();
        }
        throw new Error("Key Not Found!");
    } 

    delete(key) {

        key = parseInt(key);

        if (isNaN(key)) throw "Invalid Key!"

        for (let i = 0; i < this.tableSize; i++) {

            let hashedKey = this.hashFunction(key, i);

            if (this.hashTable[hashedKey] == key) {
                this.hashTable[hashedKey] = "DELETED";
                this.deletedIndex = hashedKey;
                this.setDescription(hashedKey, "삭제 성공");
                this.draw();
                return ;
            }
        }
	    throw "Key Not Found!"        
    }

    sleep (delay) {
        return new Promise(resolve=>setTimeout(resolve, delay));
    }

    clear () {
        for (let i = 0; i < this.tableSize; i++) {
            if (this.hashTable[i] != null) this.delete(this.hashTable[i]);
        }
        this.draw();
    }
}

module.exports = Hashtable;