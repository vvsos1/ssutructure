// import * as Treeviz from 'treeviz';
const Treeviz = require("../static/treeviz");

const AVLTree = require("./AVLTree");

const durationObject = {
  duration:500
};

const myTree = Treeviz.create({
  htmlId: "tree",
  idKey: "id",
  hasFlatData: true,
  relationnalField: "father",
  hasPanAndZoom: false,
  nodeWidth: 80,
  nodeHeight: 45,
  mainAxisNodeSpacing: 2,
  duration: ()=>durationObject.duration,
  isHorizontal: false,
  renderNode: function(node) {
    return (
      "<div class='box' style='cursor:pointer;height:" +
      node.settings.nodeHeight +
      "px; width:" +
      node.settings.nodeWidth +
      "px;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:" +
      node.data.color +
      ";border-radius:5px;'><div><strong>" +
      node.data.text_1 +
      "</strong></div></div>"
    );
  },
  linkWidth: nodeData => 5,
  linkShape: "quadraticBeziers",
  linkColor: nodeData => "#B0BEC5",
  onNodeClick: nodeData => console.log(nodeData)
});

// 해시 함수; AVL 트리 노드의 data 값으로 자신의 Color를 만들기 위해
function hashFunction(str) {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
// 숫자를 16진수 color 코드로 변환
function toColor(num) {
  num >>>= 0;
  const b = num & 0xff,
    g = (num & 0xff00) >>> 8,
    r = (num & 0xff0000) >>> 16,
    a = ((num & 0xff000000) >>> 24) / 255;

  let hexColor = "#";
  for (let color of [a, r, g, b]) {
    let hex = color.toString(16);
    if (hex.length == 1) {
      hex = "0" + hex;
    }
    hexColor += hex;
  }
  return hexColor;
}

// (AVLTreeNode,Integer) -> Array
// AVLTree를 Treeviz로 시각화 할 수 있는 포맷으로 만들어 반환
function traversal(root, parentId) {
  // console.log("traversal() : root = " + root);
  if (root.isEnd()) return [];

  const id = Number.parseInt(root.data);

  const data = {
    id,
    text_1: root.data,
    father: parentId,
    color: "skyblue"
  };

  return [data]
    .concat(traversal(root.left, id))
    .concat(traversal(root.right, id));
}

// AVL트리의 회전 과정에서 트리 시각화를 하는데 사용되는 함수인 vizCallBack을 만들어주는 함수.
const vizCallbackMaker = (tree, vizRefreshFunction) => () => {
  const datas = traversal(tree.root, null);
  vizRefreshFunction(datas);
};

const tree = new AVLTree();

const vizCallback = vizCallbackMaker(tree, myTree.refresh);

// millis만큼 기다린 후 resolve되는 Promise 반환
const wait = millis => new Promise(res => setTimeout(res, millis));

// // 0~500까지의 범위의 겹치지 않는 15개의 수를 뽑아 배열로 만든 뒤 이를 AVL Tree에 1초 간격으로 넣어가며 시각화
// const arr = new Array(10).fill(1).map(_=>(Math.random()*500).toFixed(0)).filter((elem,idx,arr) => arr.indexOf(elem) == -1 || arr.indexOf(elem) == idx);

// arr.reduce(
//   (acc,val) => acc.then(_=>tree.add(val,vizCallback)).then(wait(200))
//   ,Promise.resolve())
//   .then(_=>arr.reduce(
//     (acc,val) => acc.then(_=>tree.remove(val,vizCallback)).then(wait(200))
//     ,Promise.resolve()))

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById("new-data-input");

// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");

// 기존 데이터를 삭제하는 Button
const newDataRemoveBtn = document.getElementById("new-data-remove-btn");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

delayRange.oninput = e => {
  const delay = Number(e.target.value);
  durationObject.duration = delay;
  console.log(`delay : ${delay}ms`);
};


newDataAddBtn.onclick = e => {
  // 아무것도 입력하지 않은 경우 바로 리턴
  if (newDataInput.value.trim() == "") return;

  const newData = Number(newDataInput.value);

  tree.add(newData, vizCallback);

  // data clear
  newDataInput.value = "";
};

newDataRemoveBtn.onclick = e => {
  // 아무것도 입력하지 않은 경우
  if (newDataInput.value.trim() == "") return;

  const newData = Number(newDataInput.value);

  // 트리에 없는 데이터인경우
  if (!tree.contain(newData)) return;

  tree.remove(newData, vizCallback);

  // data clear
  newDataInput.value = "";
};
