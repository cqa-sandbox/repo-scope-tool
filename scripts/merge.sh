# Merge data files into single file
# { "staticwebdev": ["nextjs-starter", "vanilla-basic"], "azure-samples": ["js-e2e", "py-e2e"] }
# { "reponame": [repos], "reponame": [repos] }"}
staticwebdev=`cat ./staticwebdev.json`
echo "$staticwebdev"
azuresamples=`cat ./azuresamples.json`
echo "$azuresamples"
echo "{ \"staticwebdev\": $staticwebdev, \"azure-samples\": $azuresamples }" > ./config.json
echo `cat ./config.json`