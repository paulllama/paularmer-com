# Want this to stop if something fails

rm -rf build
mkdir build
cp src/CNAME build/
cp src/*.css build/
cp src/*.html build/
cp -R src/media/ build/media/
cp src/styles/pixel-sans.* build/

git checkout build
mv build/* .
# git add .
# git commit -am "Deploying to production on `date`"
# git push
# git checkout main