export $(cat .env | grep -v ^# | xargs) >/dev/null
node ./package/index.js --org staticwebdev --page 100 --verbose true --delay 2000 --max -1 --prop repositoryName --file scope/staticwebdev.json --pat $PAT --top 5 --sort weight --sortdir desc