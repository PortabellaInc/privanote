yarn next build;
yarn next export;

cp manifest.json ./out;

mv ./out/_next ./out/next
cd ./out && grep -rli '_next' * | xargs -I@ sed -i '' 's/_next/_next/g' @;
