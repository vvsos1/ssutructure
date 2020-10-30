const Sort = require('../sort/Sort');

class InsertSort extends Sort {

    // container:DOM, delay:Number, animationDelay:Number
    constructor(container, blocks, delay, animationDelay) {
        super(container, blocks, delay, animationDelay);
    }

    async sort() {

        // block들 가져오기
        let blocks = this.getBlocks();
        // block들의 총 개수
        const n = blocks.length;

	blocks[0].setColorGreen();

	for (let i = 1; i < n; i += 1) {
		
		blocks[i].setColorRed();

		let destIndex = i;
		
		const target = blocks[i].getValue();

		for (let j = 0; j < i; j++) {
			
			//blocks[j].setColorRed();

			await new Promise(resolve => setTimeout(resolve, this.delay));

			const value = blocks[j].getValue();

			//blocks[j].setColorDefault();
			if (value > target) {
				destIndex = j;
				break ;
			} 		
		}
		if (i != destIndex) {
			blocks[destIndex].setColorRed();
			
			await this.insertAt(blocks[i], destIndex);

			blocks[destIndex].setColorGreen();
		}
		blocks[i].setColorGreen();
		blocks = this.getBlocks();
	}
    }

}

module.exports = InsertSort;



       
