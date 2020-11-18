class BTree {

}

class TreeNode {
    static MINIMUN = 2;
    static MAXIMUM = 2 * this.MINIMUN;
    static END = new class extends TreeNode {
        constructor() {
            super(null);
            this.subsets = Array(TreeNode.MAXIMUM).fill(0).map(_=>this);
        }
        add(data) {
            
        }
    }
    constructor(datas = [],subsets) {
        this.datas = datas;
        this.subsets = subsets || Array(TreeNode.MINIMUN).fill(0).map(_=>TreeNode.END)
    }
    firstGE(data) {
        for (let i = 0 ; i < this.datas.length; i++)
            if(datas[i] >= data)
                return i;
        return data.length;
    }
    add(data,vizCallback) {
        const i = this.firstGE(data);
        if(data[i] === data)
            return this;
        else if (this.isLeaf()) {
            this.datas = shiftAndAdd(this.datas,i,data);
        }
        else{
            this.subsets[i] = this.subsets[i].add(data,vizCallback);
            
        }

        const fixed = this.fixExcess(i);
        return fixed;
    }

    // 자신이 넘치면 트리를 분할하고, 분할한 트리의 루트를 반환 
    fixExcess(i) {
        if (this.subsets[i].datas.length !== TreeNode.MAXIMUM+1)
            return this;
    

        // 분할될 왼쪽 트리
        const leftDatas = this.subsets[i].datas.slice(0,MINIMUN);
        const leftSubsets = this.subsets[i].subsets.slice(0,MINIMUN+1);
        const leftNode = new TreeNode(leftDatas,leftSubsets);
        
        // 분할될 오른쪽 트리
        const rightDatas = this.subsets[i].datas.slice(MINIMUN+1);        
        const rightSubsets = this.subsets[i].subsets.slice(MINIMUN+1);
        const rightNode = new TreeNode(rightDatas,rightSubsets);
        
        // 분할될 트리의 루트
        let rootDatas = [datas[MINIMUN]];
        let rootSubsets = [leftNode,rightNode];

        const rootNode = new TreeNode(rootDatas,rootSubsets);

        return rootNode;
    }
    
    isEnd() {
        return this === TreeNode.END;
    }

    isLeaf() {
        return !this.isEnd()&&this.subsets.length === this.subsets.length;
    }
}

// i번 인덱스를 data로 채우고 나머지를 한 칸 뒤로
function shiftAndAdd(arr, index, data) {
    const frontPart = arr.slice(0,index);
    
    const backPart = arr.slice(index+1);
    return frontPart
    .concat([data])
    .concat(backPart);
} 