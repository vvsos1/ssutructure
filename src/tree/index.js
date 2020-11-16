// import * as Treeviz from 'treeviz';
const Treeviz = require("../static/treeviz");

const AVLTree = require("../avl-tree/AVLTree");
const RedBlackTree = require("../red-black-tree/RedBlackTree");

const durationObject = {
  duration: 500,
};

const config = {
  htmlId: "tree",
  idKey: "id",
  hasFlatData: true,
  relationnalField: "father",
  //hasPanAndZoom: false,
  hasPan: true,
  hasZoom: true,
  nodeWidth: 80,
  nodeHeight: 45,
  mainAxisNodeSpacing: 2,
  duration: () => durationObject.duration,
  isHorizontal: false,
  renderNode: function (node) {
    return (
      "<div class='box' style='cursor:pointer;height:" +
      node.settings.nodeHeight +
      "px; width:" +
      node.settings.nodeWidth +
      "px;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:" +
      node.data.color +
      ";border-radius:5px;'><div><strong style='color:"+
      node.data.textColor+
      "'>" +
      node.data.text_1 +
      "</strong></div></div>"
    );
  },
  linkWidth: (nodeData) => 5,
  linkShape: "quadraticBeziers",
  linkColor: (nodeData) => "#54432A",
  onNodeClick: (nodeData) => console.log(nodeData),
};

let treeviz = Treeviz.create(config);

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
    color: root.getColor(),
    textColor: root.getColor()=='red'?'black' : root.getColor()=='black'?'red':'black'
  };

  return [data]
    .concat(traversal(root.left, id))
    .concat(traversal(root.right, id));
}

// // AVL트리의 회전 과정에서 트리 시각화를 하는데 사용되는 함수인 vizCallBack을 만들어주는 함수.
// const vizCallbackMaker = (tree, vizRefreshFunction,vizClearFunction) => () => {
//   const datas = traversal(tree.root, null);
//   if (datas.length === 0)
//     vizClearFunction();
//   else
//     vizRefreshFunction(datas);
// };

let tree = new AVLTree();

const clearTree = () => {
  tree.clear();
  treeviz.clean();
  treeviz = Treeviz.create(config);
}

let vizCallback = () => {
  const datas = traversal(tree.root, null);
  if (datas.length === 0)
    clearTree()
  else
   treeviz.refresh(datas);
};;

const RedBlackTreeRadio = document.getElementById("red-black-tree-radio");
const AVLTreeRadio = document.getElementById("avl-tree-radio");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById("new-data-input");

// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");

// 기존 데이터를 삭제하는 Button
const newDataRemoveBtn = document.getElementById("new-data-remove-btn");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

const dataClearBtn = document.getElementById('data-clear-btn');

RedBlackTreeRadio.onchange = (e) => {
  console.log(`red black tree checked`);
  clearTree();
  tree = new RedBlackTree();

  // RedBlackTree 삭제 기능 미완성이므로 삭제 버튼 비활성화
  newDataRemoveBtn.disabled = true;
};

AVLTreeRadio.onchange = (e) => {
  console.log(`avl tree checked`);
  clearTree();
  tree = new AVLTree();

  // AVLTree 삭제 버튼 활성화
  newDataRemoveBtn.disabled = false;
};

delayRange.oninput = (e) => {
  const delay = Number(e.target.value);
  durationObject.duration = delay;
};

newDataAddBtn.onclick = (e) => {
  // 아무것도 입력하지 않은 경우 바로 리턴
  if (newDataInput.value.trim() == "") return;

  const newData = Number(newDataInput.value);
  
  tree.add(newData, vizCallback);

  // data clear
  newDataInput.value = "";
};

newDataRemoveBtn.onclick = (e) => {
  // 아무것도 입력하지 않은 경우
  if (newDataInput.value.trim() == "") return;

  const newData = Number(newDataInput.value);

  // 트리에 없는 데이터인경우
  if (!tree.contain(newData)) return;

  tree.remove(newData, vizCallback);

  // data clear
  newDataInput.value = "";
};

dataClearBtn.onclick = e => {
  clearTree();
}