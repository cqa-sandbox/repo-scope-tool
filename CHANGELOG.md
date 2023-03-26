# 3.2.0

* packaged to single .js file with ncc: /package/index.js
* packaged to single .json file at /scope/repos.json

# 3.1.0

* query params
    * sort
    * sortdir
    * top

# 3.0.0

* process.error(1) if timeout from GitHub GraphQL. This is a stop-gap for retry logic which needs to be added. 
* turned off ESLint errors while working through some issues - leave off until figured out