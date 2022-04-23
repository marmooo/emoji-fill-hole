mkdir -p docs
cp -r src/* docs
drop-inline-css -r src -o docs
minify -r src -o docs

