const path = require('path');
var formidable = require('formidable');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.static(__dirname));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

const root = __dirname; // __dirname
const uploadedFolderFullPath = [root, path.sep, "uploaded"].join('');
if (!fs.existsSync(uploadedFolderFullPath)) {
  fs.mkdirSync(uploadedFolderFullPath);
}

app.post('/upload', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
   
      if(!fields || !files || !files.RemoteFile || files.RemoteFile.length==0) {
   
        if(!fields)
          res.write('no fields');
   
        if(!files)
          res.write('no files');
        else if(!files.RemoteFile || files.RemoteFile.length==0)
          res.write('no files.RemoteFile');
   
        res.statusCode = 200;
        res.end();
      }
   
      fs.readFile(files.RemoteFile[0].filepath, function (err, data) {
   
        // save file from temp dir to new dir     
        let fullName = [uploadedFolderFullPath, path.sep, files.RemoteFile[0].originalFilename].join('');
        fs.writeFile(fullName, data, function (err) {
          if (err) throw err;
          console.log('file saved');
          res.end();
        });
      });
    });
  })

var server = app.listen(2020, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
})