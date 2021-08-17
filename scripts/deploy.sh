# build
sass src/styles/index.scss:src/styles.css

# Move to build
rm -rf build
mkdir build
cp src/CNAME build/
cp src/*.css build/
cp src/*.html build/
cp src/*.js build/
cp -R src/media/ build/media/
cp src/styles/pixel-sans.* build/

# Deploy to git
git checkout build
rm -rf `ls | grep -v build`
mv build/* .
rm -rf build/
git add .
git commit -am "Deploying to 'build' on `date`"
git push
git checkout main