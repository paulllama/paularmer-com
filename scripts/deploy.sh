# reset
rm -rf build
mkdir build
npm install

# build
npm run build

# Deploy to git
git checkout build --
git pull
rm -rf `ls | grep -v build | grep -v node_modules`
mv build/* .
rm -rf build/
git add .
git commit -am "Deploying to 'build' on `date`"
git push
git checkout main