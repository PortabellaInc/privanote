rm source.zip;
zip -r -FS source.zip * -x ".git" -x "out/*" -x "./.next/*" -x "*.zip" -x "node_modules/*";