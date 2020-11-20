./build.sh
git fetch origin gh-pages
git checkout gh-pages
cp -rp output/* ./
git add *
git rm --cached deploy.sh
git rm -r --cached output/
git rm -r --cached node_modules/
git commit -a -m "배포"
git push origin gh-pages