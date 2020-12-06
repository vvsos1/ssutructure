rm -r output  # 기존의 output 폴더 삭제
browserify src/tree/index.js -do output/js/tree/index.js # tree 페이지에 들어갈 js를 번들링
browserify src/sort/index.js -do output/js/sort/index.js # sort 페이지에 들어갈 js를 번들링
browserify src/hashtable/index.js -do output/js/hashtable/index.js  # hash 페이지에 들어갈 js 번들링
browserify src/stack/index.js -do output/js/stack/index.js # stack 페이지에 들어갈 js 번들링
mkdir output/js/static
cp src/static/* output/js/static # static js파일 (jquery, bootstrap) 복사
cp src/view/*.html output # view 파일들 복사
mkdir output/css
cp src/css/* output/css # css 파일들 복사
mkdir output/img
cp src/img/* output/img # img 파일들 복사
mkdir output/font
cp src/font/* output/font # font 파일들 복사

