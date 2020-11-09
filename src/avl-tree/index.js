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
  //hasPanAndZoom: false,
  hasPan: true,
  hasZoom: true,
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
