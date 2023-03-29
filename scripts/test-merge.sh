# Merge data files into single file
# { "staticwebdev": ["nextjs-starter", "vanilla-basic"], "azure-samples": ["js-e2e", "py-e2e"] }
# { "reponame": [repos], "reponame": [repos] }"}
staticwebdev=`cat ./staticwebdev.json`
echo "$staticwebdev"
echo "{ \"staticwebdev\": $staticwebdev, }" > ./config.json
echo `cat ./config.json`