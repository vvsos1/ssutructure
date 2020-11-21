const p5 = require("p5");

class Hashtable {

    constructor(tableSize = 5) {
        this.tableSize = tableSize;
        this.hashTable = new Array(tableSize);
        this.searchedIndex = null;
        this.searchStep = null;
        this.insertedIndex = null;
        this.insertStep = null;
        this.error = null;

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

                    if (key === "DELETED") {
                        if (this.searchedIndex === i)
                            this.searchedIndex = null;
                        if (this.insertedIndex === i)
                            this.insertedIndex = null;
                    }
                    else if (this.searchedIndex === i) p.stroke("#bbdeed"); 
                    else if (this.searchStep === i) p.stroke("blue");
                    else if (this.insertedIndex === i) p.stroke("orange"); 
                    else if (this.insertStep === i) p.stroke("yellow");

                    const c = getCirclePosition(i);

                    p.circle(c.x, c.y, 60);
                 
                    if (key !== undefined && key !== "DELETED") {
                        if (this.searchedIndex === i) p.fill("#bbdeed"); 
                        else if (this.searchStep === i) p.fill("blue");
                        else if (this.insertedIndex === i) p.fill("orange");
                        else if (this.insertStep === i) p.fill("yellow"); 
                        else p.fill("black"); 
                        p.text(key, c.x, c.y);
                        p.fill(255);
                        p.stroke("black");
                    }
                }
                clearAndRedraw;
                this.searchedIndex = null;
                this.insertedIndex = null;
            };

            p.setup = setup;
            p.draw = draw;

            this.remove = () => p.remove();
            this.draw = clearAndRedraw;
        };
        new p5(setting, document.getElementById("container"));
    }
    
    async insert(key) {

        key = parseInt(key);

        if (isNaN(key)) {
            this.error = "Invalid Key!";
            return;
        }

        for (let i = 0; i < this.tableSize; i++) {

                let hashedKey = this.hashFunction(key, i);
                
                this.insertStep = hashedKey;

                switch (this.hashTable[hashedKey]) {
                    case undefined:
                    case null:
                    case "DELETED":
                        this.hashTable[hashedKey] = key;
                        this.insertedIndex = hashedKey;
                        await this.sleep(500);
                        this.draw();
                        return ;
                    case key:
                        this.error = "Duplicate Key!";
                        return;
                    default:
                        await this.sleep(500);
                        this.draw();
                }
        }
        this.error = "Duplicate Key!"
    }

    async search(key) {

        key = parseInt(key);

        if (isNaN(key)) {
           this.error = "Invalid Key!"
           return;
        }

        for (let i = 0; i < this.tableSize; ++i) {

            let hashedKey = this.hashFunction(key, i);

            this.searchStep = hashedKey;

            if (this.hashTable[hashedKey] == key) {
                this.searchedIndex = hashedKey;
                await this.sleep(500);
                this.draw();
                return ;
            }
            await this.sleep(500);
            this.draw();
        }
        this.error = "Key Not Found!"
        return;
    } 

    delete(key) {

        key = parseInt(key);

        if (isNaN(key)) {
           this.error = "Invalid Key!"
           return;
        }
         
         for (let i = 0; i < this.tableSize; ++i) {

            let hashedKey = this.hashFunction(key, i);

            if (this.hashTable[hashedKey] == key) {
                this.hashTable[hashedKey] = "DELETED";
                this.deletedIndex = hashedKey;
                this.draw();
                return ;
            }
        }
	    this.error = "Key Not Found!"        
    }

    sleep (delay) {
        return new Promise(resolve=>setTimeout(resolve, delay));
    }

    insertError () {
        if (this.error == null) return;
        else throw this.error;
    }

    searchError () {
        if (this.error == null) return;
        else throw this.error;
    }

    deleteError () {
        if (this.error == null) return;
        else throw this.error;
    }
}

module.exports = Hashtable;