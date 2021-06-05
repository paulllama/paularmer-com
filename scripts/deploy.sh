# Want this to stop if something fails
rm -rf build \
	&& mkdir build \
	&& cp src/CNAME build/ \
	&& cp src/*.css build/ \
	&& cp src/*.html build/ \
	&& cp -R src/media/ build/media/ \
	&& gh-pages -d build