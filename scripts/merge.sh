# Merge data files into single file
# { "staticwebdev": ["nextjs-starter", "vanilla-basic"], "azure-samples": ["js-e2e", "py-e2e"] }
# { "reponame": [repos], "reponame": [repos] }"}
staticwebdev=`cat ./scope/staticwebdev.json`
echo "$staticwebdev"
azuresamples=`cat ./scope/azuresamples.json`
echo "$azuresamples"
echo "{ \"staticwebdev\": $staticwebdev, \"azure-samples\": $azuresamples }" > ./scope/repos.json
