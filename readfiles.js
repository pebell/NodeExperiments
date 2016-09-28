var fs = require('fs');

function readfiles(files, callback) {

  var content = {}
  var errOccurred = null;
  var filesLeft = files.length;

  function processContent (file) { 
    return function (err,data) {
      if (err) {
        errOccurred = err; 
        callback(err,null);
      }
      else {
        content[file]=data;
        console.log(`adding contents of file ${file}`);
        if (!--filesLeft && !errOccurred)
          callback(null,content);
      }
    }
  }

  var processFile = function (file) {
     fs.readFile(file, processContent(file))
  }



  files.forEach(processFile)

  
}

exports.rf = readfiles;