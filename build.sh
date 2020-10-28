 npm install -g browserify # browserify 설치

browserify src/avl-tree/index.js -o output/js/avl-tree/index.js # avl tree 페이지에 들어갈 js를 번들링

cp src/view/avlTree.html output/avlTree.html    # avl tree html 파일을 복사 

rm -rf node_modules # travis가 설치한 node_moduels를 삭제