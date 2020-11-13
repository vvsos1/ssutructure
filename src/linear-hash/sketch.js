const LinearHash = require("./LinearHash");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const DataInput = document.getElementById("new-data-input");
// 새로운 데이터를 추가하는 Button
const DataAddBtn = document.getElementById("new-data-add-btn");

// 사용자로부터 삭제할 데이터를 입력받는 Delete Text
const DataDelete = document.getElementById("data-delete");
// 데이터를 삭제하는 Button
const DataDeleteBtn = document.getElementById("data-delete-btn");

// 사용자로부터 검색할 데이터를 입력받는 Search Text
const DataSearch = document.getElementById("data-delete");
// 데이터를 검색하는 Button
const DataSearchBtn = document.getElementById("data-search-btn");

let searchedIndex = null

function clearAndRedraw() {
    clear()
    redraw()
}

function setup() {
    linear = new LinearHash();

    DataAddBtn.onClick = function() {
	searchedIndex = null;
	const key = DataInput.value();
	if (key) {
		linear.insert(key);
    	}
	clearAndRedraw();
    };

    DataDeleteBtn.onClick = function() {
	searchedIndex = null;
	const key = DataDelete.value();
	if (key) {
		linear.delete(key);
	}
	clearAndRedraw();
    };

    DataSearchBtn.onClick = function() {
	searchedIndex = null;
	const key = DataSearch.value();
	if (key) {
		linear.search(key);
	}
	clearAndRedraw();
    };

    textAlign(CENTER, CENTER)
    textSize(30)
    ellipseMode(CENTER)
    strokeWeight(3)
    noLoop()
}




function draw() {
    for (let i = 0; i < linear.tableSize; ++i) {
        let key = linear.hashTable[i]
        if (key === null) {
            key = "DEL"
            fill('orange')
        }
        c = getCirclePosition(i)
        if (key !== undefined)
            stroke('orange')
        if (searchedIndex === i)
            stroke('#bbdeed')
        circle(c.x, c.y, 70)
        if (key !== undefined) {
            if (key == "DEL")
                fill(255)
            else if (i === searchedIndex)
                fill('#bbdeed')
            else
                fill('orange')
            text(key, c.x, c.y)
            fill(255)
            stroke('black')
        }
    }
}

function getCirclePosition(index) {
    return Object.freeze({
        x: DataDelete.x + 30 + (displayWidth / linear.tableSize) * index,
        // y: DataDelete.y + DataDelete.height + 50
        y: windowHeight / 2.25
    })
}
