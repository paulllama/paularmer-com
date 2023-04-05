# reset
rm -rf build
mkdir build
touch build/index.html

# build
sass src/styles/index.scss:src/styles.css
npm run build

# Move to build
cp src/CNAME build/
cp src/*.css build/
cp src/*.html build/
cp src/*.js build/
cp -R src/media/ build/media/
cp src/styles/pixel-sans.* build/

# Deploy to git
git checkout build
git pull
rm -rf `ls | grep -v build`
mv build/* .
rm -rf build/
git add .
git commit -am "Deploying to 'build' on `date`"
git push
git checkout main