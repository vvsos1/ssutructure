npm install # 라이브러리 설치
npm install -g browserify # browserify 글로벌로 설치
rm -r output  # 기존의 output 폴더 삭제
browserify src/avl-tree/index.js -do output/js/avl-tree/index.js # avl tree 페이지에 들어갈 js를 번들링
browserify src/bubble-sort/index.js -do output/js/bubble-sort/index.js # bubble sort 페이지에 들어갈 js를 번들링
browserify src/insertion-sort/index.js -do output/js/insertion-sort/index.js # insertion sort 페이지에 들어갈 js를 번들링
browserify src/selection-sort/index.js -do output/js/selection-sort/index.js # selection sort 페이지에 들어갈 js를 번들링
cp src/view/*.html output # view 파일들 복사
mkdir output/css
cp src/css/* output/css # css 파일들 복사
