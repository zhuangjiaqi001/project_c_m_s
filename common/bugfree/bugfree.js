var fs = require('fs');
var path = require('path');
var bugfree = {};

bugfree.log = function(newfilename) {
  var data = fs.readFileSync(path.join(__dirname, newfilename || './code.txt'), 'utf-8');
  console.log(data)
}
module.exports = bugfree;
